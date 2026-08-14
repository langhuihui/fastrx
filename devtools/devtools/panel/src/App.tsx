import { useEffect, useMemo, useRef, useState } from "react";

import EventFlowPanel from "../../../../site/src/playground/EventFlowPanel.js";

import PipelineView from "./PipelineView.js";
import { graphFromEnvelopes, nodeLabelsFromGraph } from "./pipeline-graph.js";
import { usePanelPort } from "./usePanelPort.js";

export default function App() {
  const [paused, setPaused] = useState(false);
  const [replay, setReplay] = useState(false);
  const [selectedSeq, setSelectedSeq] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const { events, connected, inspectResult, breakpointOn, postCommand, clear } =
    usePanelPort(paused);

  const maxSeq = useMemo(
    () => events.reduce((m, e) => Math.max(m, e.sequence || 0), 0),
    [events],
  );
  const maxVisibleSeq = replay ? selectedSeq : null;
  const graph = useMemo(
    () => graphFromEnvelopes(events, maxVisibleSeq),
    [events, maxVisibleSeq],
  );
  const nodeLabels = useMemo(() => nodeLabelsFromGraph(graph), [graph]);

  const selectedNodeId = useMemo(() => {
    if (selectedSeq == null) return null;
    return events.find((e) => e.sequence === selectedSeq)?.nodeId ?? null;
  }, [events, selectedSeq]);

  const lifecycle = !connected ? "disconnected" : paused ? "paused" : "connected";

  const playTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!playing) {
      if (playTimer.current) clearInterval(playTimer.current);
      playTimer.current = null;
      return;
    }
    playTimer.current = setInterval(() => {
      setSelectedSeq((cur) => {
        const next = cur == null ? 1 : cur + 1;
        if (next >= maxSeq) {
          setPlaying(false);
          return maxSeq;
        }
        return next;
      });
    }, 300);
    return () => {
      if (playTimer.current) clearInterval(playTimer.current);
    };
  }, [playing, maxSeq]);

  const selectNode = (nodeId: string) => {
    const limit = maxVisibleSeq;
    let found: { sequence: number } | null = null;
    for (const e of events) {
      if (e.nodeId !== nodeId) continue;
      if (limit != null && e.sequence > limit) continue;
      if (!found || e.sequence > found.sequence) found = e;
    }
    if (found) setSelectedSeq(found.sequence);
  };

  return (
    <div className="pg-layout dt-layout">
      <header className="pg-title dt-title">
        <span className="site-wordmark">
          <span className="site-wordmark-mark" aria-hidden="true">
            f
          </span>
          <span>fastrx</span>
        </span>
        <span className="dt-title-label">DevTools</span>
      </header>

      <div className="pg-toolbar">
        <div className="pg-toolbar-group">
          <button
            type="button"
            className={`pg-toolbar-btn${paused ? " pg-toolbar-btn-stop" : ""}`}
            onClick={() => setPaused((v) => !v)}
          >
            {paused ? "Resume" : "Pause"}
          </button>
          {!replay ? (
            <button
              type="button"
              className="pg-toolbar-btn"
              onClick={() => {
                setReplay(true);
                setSelectedSeq(maxSeq || null);
              }}
              disabled={maxSeq === 0}
            >
              Replay
            </button>
          ) : (
            <>
              <button
                type="button"
                className="pg-toolbar-btn"
                onClick={() => setSelectedSeq((s) => (s == null ? maxSeq : Math.max(1, s - 1)))}
                disabled={!selectedSeq || selectedSeq <= 1}
              >
                ⏮
              </button>
              <button
                type="button"
                className="pg-toolbar-btn"
                onClick={() => setPlaying((v) => !v)}
              >
                {playing ? "⏸" : "▶"}
              </button>
              <button
                type="button"
                className="pg-toolbar-btn"
                onClick={() =>
                  setSelectedSeq((s) => (s == null ? 1 : Math.min(maxSeq, s + 1)))
                }
                disabled={!selectedSeq || selectedSeq >= maxSeq}
              >
                ⏭
              </button>
              <input
                type="range"
                className="pg-toolbar-slider"
                min={1}
                max={Math.max(maxSeq, 1)}
                step={1}
                value={selectedSeq ?? 1}
                onChange={(e) => setSelectedSeq(Number(e.target.value))}
              />
              <span className="pg-toolbar-speed-label">
                {selectedSeq ?? 0} / {maxSeq}
              </span>
              <button
                type="button"
                className="pg-toolbar-btn"
                onClick={() => {
                  setPlaying(false);
                  setReplay(false);
                  setSelectedSeq(null);
                }}
              >
                Exit
              </button>
            </>
          )}
          <button type="button" className="pg-toolbar-btn" onClick={clear}>
            Clear
          </button>
        </div>
      </div>

      <div className="dt-workspace">
        <PipelineView
          graph={graph}
          selectedNodeId={selectedNodeId}
          onSelectNode={selectNode}
          running={connected && !paused}
        />
        <aside className="pg-inspector">
          {selectedNodeId ? (
            <>
              <div className="pg-inspector-header">
                <h2 className="pg-inspector-title">
                  <code>{nodeLabels[selectedNodeId] ?? selectedNodeId}</code>
                </h2>
              </div>
              <p className="pg-inspector-desc">{selectedNodeId}</p>
              <div className="pg-toolbar-group">
                <button
                  type="button"
                  className="pg-toolbar-btn pg-toolbar-btn-primary"
                  onClick={() => postCommand({ type: "inspect", nodeId: selectedNodeId })}
                >
                  Inspect
                </button>
                <button
                  type="button"
                  className={`pg-toolbar-btn${breakpointOn ? " pg-toolbar-btn-stop" : ""}`}
                  onClick={() =>
                    postCommand({
                      type: "breakpoint",
                      nodeId: selectedNodeId,
                      on: !breakpointOn,
                    })
                  }
                >
                  {breakpointOn ? "Breakpoint on" : "Breakpoint"}
                </button>
              </div>
              {inspectResult && inspectResult.nodeId === selectedNodeId && (
                <p className="pg-param-type">
                  latest: {inspectResult.latest ?? "—"} · subs:{" "}
                  {inspectResult.subscriptionCount}
                </p>
              )}
            </>
          ) : (
            <p className="pg-inspector-empty">Select a marble or node to inspect.</p>
          )}
        </aside>
      </div>

      <EventFlowPanel
        events={events}
        lifecycle={lifecycle}
        emptyMessage="No events yet. Open a page that imports fastrx and subscribe to a stream."
        selectedSeq={selectedSeq}
        onSelectSeq={setSelectedSeq}
        maxVisibleSeq={maxVisibleSeq}
        nodeLabels={nodeLabels}
      />
    </div>
  );
}
