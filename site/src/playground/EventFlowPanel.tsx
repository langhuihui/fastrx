import { useMemo, useState } from "react";
import type { Envelope } from "fastrx";

import { causeChainSet } from "./envelope-monitor.js";

interface EventFlowPanelProps {
  readonly events: Envelope[];
  readonly lifecycle: string;
}

const DATA_KINDS = new Set(["next", "complete", "error", "subscribe", "defer"]);

const NODE_COLORS = [
  "#5e9cff",
  "#3dd68c",
  "#c084fc",
  "#ffb224",
  "#ff7c7c",
  "#45d0e6",
  "#f16ab3",
];

const COL_W = 44;
const LANE_H = 44;

function terminalSymbol(kind: string): string {
  switch (kind) {
    case "complete":
      return "✓";
    case "error":
      return "!";
    case "subscribe":
      return "▶";
    case "defer":
      return "×";
    default:
      return "•";
  }
}

function marbleText(data: string | undefined): string {
  if (data === undefined || data === null || data === "") return "—";
  return data.length > 18 ? data.slice(0, 15) + "…" : data;
}

export default function EventFlowPanel({ events, lifecycle }: EventFlowPanelProps) {
  const [selectedSeq, setSelectedSeq] = useState<number | null>(null);

  const nodeOrder = useMemo(() => {
    // Lane order derives from the Envelope nodeIds (e.g. "of#1", "map#2") by
    // first appearance — NOT from canvas node ids ("n1"), which are unrelated
    // to fastrx's runtime node identities.
    const seen = new Set<string>();
    const order: string[] = [];
    for (const e of events) {
      if (!seen.has(e.nodeId)) {
        seen.add(e.nodeId);
        order.push(e.nodeId);
      }
    }
    return order;
  }, [events]);

  const lanes = useMemo(
    () =>
      nodeOrder.map((nodeId, i) => ({
        nodeId,
        y: i * LANE_H,
        color: NODE_COLORS[i % NODE_COLORS.length],
        events: events.filter((e) => e.nodeId === nodeId && DATA_KINDS.has(e.kind)),
      })),
    [events, nodeOrder],
  );

  const maxSeq = useMemo(
    () => events.reduce((m, e) => Math.max(m, e.sequence || 0), 0),
    [events],
  );
  const totalWidth = (maxSeq + 1) * COL_W;
  const totalHeight = nodeOrder.length * LANE_H;

  const causalSet = useMemo(
    () => causeChainSet(events, selectedSeq),
    [events, selectedSeq],
  );

  const causalLines = useMemo(() => {
    if (selectedSeq == null) return [] as Array<{ x1: number; y1: number; x2: number; y2: number }>;
    const laneIndexOf = new Map(nodeOrder.map((id, i) => [id, i] as const));
    const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
    for (const e of events) {
      if (!e.cause) continue;
      if (!causalSet.has(e.sequence) || !causalSet.has(e.cause.sequence)) continue;
      const ci = laneIndexOf.get(e.cause.nodeId);
      const ei = laneIndexOf.get(e.nodeId);
      if (ci == null || ei == null) continue;
      lines.push({
        x1: e.cause.sequence * COL_W + COL_W / 2,
        y1: ci * LANE_H + LANE_H / 2,
        x2: e.sequence * COL_W + COL_W / 2,
        y2: ei * LANE_H + LANE_H / 2,
      });
    }
    return lines;
  }, [events, causalSet, selectedSeq, nodeOrder]);

  return (
    <section className="pg-monitor" aria-labelledby="monitor-title">
      <header className="pg-monitor-header">
        <h2 id="monitor-title">Event flow</h2>
        <span className={`pg-monitor-status pg-monitor-status-${lifecycle}`}>{lifecycle}</span>
      </header>

      {events.length === 0 ? (
        <p className="pg-monitor-empty">No events yet. Click Run to execute the pipeline.</p>
      ) : (
        <div className="pg-monitor-body">
          <div className="pg-monitor-lanes-labels">
            {lanes.map((lane) => (
              <div
                key={lane.nodeId}
                className="pg-monitor-lane-label"
                style={{
                  height: LANE_H + "px",
                  color: lane.color,
                  borderBottom: `2px solid ${lane.color}33`,
                }}
              >
                <span>{lane.nodeId}</span>
              </div>
            ))}
          </div>

          <div className="pg-monitor-scroll">
            <div
              className="pg-monitor-canvas"
              style={{ width: totalWidth + "px", height: totalHeight + "px" }}
            >
              {lanes.map((lane) => (
                <div
                  key={lane.nodeId}
                  className="pg-monitor-lane"
                  style={{
                    top: lane.y + "px",
                    height: LANE_H + "px",
                    borderBottom: `2px solid ${lane.color}22`,
                  }}
                >
                  {lane.events.map((e) => (
                    <button
                      key={e.sequence}
                      type="button"
                      className={`pg-monitor-marble pg-monitor-marble-${e.kind}${
                        causalSet.has(e.sequence) ? " pg-monitor-marble-cause" : ""
                      }${selectedSeq === e.sequence ? " pg-monitor-marble-selected" : ""}`}
                      style={{
                        left: e.sequence * COL_W + "px",
                        background: e.kind === "next" ? lane.color : undefined,
                      }}
                      onClick={() => setSelectedSeq(e.sequence)}
                      title={`${e.kind} #${e.sequence}${e.data ? " " + e.data : ""}${e.err ? " err=" + e.err : ""}`}
                    >
                      {e.kind === "next" ? marbleText(e.data) : terminalSymbol(e.kind)}
                    </button>
                  ))}
                </div>
              ))}

              {causalLines.length > 0 && (
                <svg
                  className="pg-monitor-causal-overlay"
                  width={totalWidth}
                  height={totalHeight}
                >
                  <defs>
                    <marker
                      id="pg-causal-arrow"
                      markerWidth="8"
                      markerHeight="8"
                      refX="6"
                      refY="4"
                      orient="auto"
                    >
                      <path d="M0,0 L7,4 L0,8 z" fill="#00bfff" />
                    </marker>
                  </defs>
                  {causalLines.map((l, i) => (
                    <line
                      key={i}
                      x1={l.x1}
                      y1={l.y1}
                      x2={l.x2}
                      y2={l.y2}
                      stroke="#00bfff"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      markerEnd="url(#pg-causal-arrow)"
                    />
                  ))}
                </svg>
              )}
            </div>
          </div>

          <div className="pg-monitor-outputs">
            <h3>Outputs ({events.length} events)</h3>
            <ol className="pg-monitor-output-list">
              {events.slice(-50).reverse().map((e) => (
                <li
                  key={e.sequence}
                  className={`pg-monitor-output-row pg-monitor-output-${e.kind}${
                    causalSet.has(e.sequence) ? " pg-monitor-output-cause" : ""
                  }${selectedSeq === e.sequence ? " pg-monitor-output-selected" : ""}`}
                  onClick={() => setSelectedSeq(e.sequence)}
                >
                  <span className="pg-monitor-output-seq">#{e.sequence}</span>
                  <span className="pg-monitor-output-node">{e.nodeId}</span>
                  <span className="pg-monitor-output-kind">{e.kind}</span>
                  <span className="pg-monitor-output-data">
                    {e.data ?? e.err ?? ""}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </section>
  );
}
