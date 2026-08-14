import { useMemo, useState } from "react";
import type { Envelope } from "fastrx";

import { causeChainSet } from "./envelope-chain.js";

export interface EventFlowPanelProps {
  readonly events: Envelope[];
  readonly lifecycle: string;
  readonly emptyMessage?: string;
  readonly title?: string;
  readonly selectedSeq?: number | null;
  readonly onSelectSeq?: (seq: number | null) => void;
  /** When set, marbles after this sequence are dimmed (time-travel replay). */
  readonly maxVisibleSeq?: number | null;
  readonly nodeLabels?: Readonly<Record<string, string>>;
}

// Kinds shown in the marble timeline: data flow only (next + terminal complete).
// Build events (create, pipe, subscribe, defer, addSource) are filtered out
// because they only describe the build phase and would crowd the timeline
// when running in slow motion.
const DATA_KINDS = new Set(["next", "complete", "error"]);

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

export default function EventFlowPanel({
  events,
  lifecycle,
  emptyMessage = "No events yet. Click Run to execute the pipeline.",
  title = "Event flow",
  selectedSeq: selectedSeqProp,
  onSelectSeq,
  maxVisibleSeq = null,
  nodeLabels,
}: EventFlowPanelProps) {
  const [internalSeq, setInternalSeq] = useState<number | null>(null);
  const selectedSeq = selectedSeqProp !== undefined ? selectedSeqProp : internalSeq;
  const setSelectedSeq = onSelectSeq ?? setInternalSeq;

  const nodeOrder = useMemo(() => {
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

  const lanes = useMemo(() => {
    // Build a global display-sequence for all data events (across all lanes).
    // This ensures marbles from different lanes are time-aligned: if take#2's
    // first value arrives after interval#1's second value, its displaySeq will
    // be later, preserving the true temporal ordering.
    const dataEvents = events.filter((e) => DATA_KINDS.has(e.kind));
    const globalDisplay = new Map<number, number>();
    dataEvents.forEach((e, i) => globalDisplay.set(e.sequence, i));

    return nodeOrder.map((nodeId, i) => ({
      nodeId,
      y: i * LANE_H,
      color: NODE_COLORS[i % NODE_COLORS.length],
      events: events
        .filter((e) => e.nodeId === nodeId && DATA_KINDS.has(e.kind))
        .map((e) => ({ ...e, displaySeq: globalDisplay.get(e.sequence)! })),
    }));
  }, [events, nodeOrder]);

  const maxDisplaySeq = useMemo(
    () => events.filter((e) => DATA_KINDS.has(e.kind)).length - 1,
    [events],
  );
  // Extra half-column on the left so the first marble (which uses
  // translate(-50%)) is fully visible instead of clipped by the lane edge.
  const LEAD_PAD = COL_W / 2;
  const totalWidth = (maxDisplaySeq + 1) * COL_W + LEAD_PAD * 2;
  const totalHeight = nodeOrder.length * LANE_H;

  const causalSet = useMemo(
    () => causeChainSet(events, selectedSeq),
    [events, selectedSeq],
  );

  const causalLines = useMemo(() => {
    if (selectedSeq == null) return [] as Array<{ x1: number; y1: number; x2: number; y2: number }>;
    const laneIndexOf = new Map(nodeOrder.map((id, i) => [id, i] as const));
    // Build a (sequence → displaySeq) lookup so causal lines follow the
    // compact per-lane timeline instead of the global sequence number.
    const displaySeqOf = new Map<number, number>();
    for (const lane of lanes) {
      for (const e of lane.events) displaySeqOf.set(e.sequence, e.displaySeq);
    }
    const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
    for (const e of events) {
      if (!e.cause) continue;
      if (!causalSet.has(e.sequence) || !causalSet.has(e.cause.sequence)) continue;
      if (maxVisibleSeq != null && e.sequence > maxVisibleSeq) continue;
      const ci = laneIndexOf.get(e.cause.nodeId);
      const ei = laneIndexOf.get(e.nodeId);
      if (ci == null || ei == null) continue;
      const cds = displaySeqOf.get(e.cause.sequence);
      const eds = displaySeqOf.get(e.sequence);
      if (cds == null || eds == null) continue;
      lines.push({
        x1: cds * COL_W + LEAD_PAD + COL_W / 2,
        y1: ci * LANE_H + LANE_H / 2,
        x2: eds * COL_W + LEAD_PAD + COL_W / 2,
        y2: ei * LANE_H + LANE_H / 2,
      });
    }
    return lines;
  }, [events, lanes, causalSet, selectedSeq, nodeOrder, maxVisibleSeq]);

  const laneLabel = (nodeId: string) => nodeLabels?.[nodeId] ?? nodeId;

  return (
    <section className="pg-monitor" aria-labelledby="monitor-title">
      <header className="pg-monitor-header">
        <h2 id="monitor-title">{title}</h2>
        <span className={`pg-monitor-status pg-monitor-status-${lifecycle}`}>{lifecycle}</span>
      </header>

      {events.length === 0 ? (
        <p className="pg-monitor-empty">{emptyMessage}</p>
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
                <span>{laneLabel(lane.nodeId)}</span>
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
                      }${selectedSeq === e.sequence ? " pg-monitor-marble-selected" : ""}${
                        maxVisibleSeq != null && e.sequence > maxVisibleSeq
                          ? " pg-monitor-marble-future"
                          : ""
                      }`}
                      style={{
                        left: e.displaySeq * COL_W + LEAD_PAD + "px",
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
            <h3>Outputs</h3>
            <ol className="pg-monitor-output-list">
              {events
                .filter((e) => DATA_KINDS.has(e.kind))
                .slice(-50)
                .reverse()
                .map((e) => (
                <li
                  key={e.sequence}
                  className={`pg-monitor-output-row pg-monitor-output-${e.kind}${
                    causalSet.has(e.sequence) ? " pg-monitor-output-cause" : ""
                  }${selectedSeq === e.sequence ? " pg-monitor-output-selected" : ""}${
                    maxVisibleSeq != null && e.sequence > maxVisibleSeq
                      ? " pg-monitor-output-future"
                      : ""
                  }`}
                  onClick={() => setSelectedSeq(e.sequence)}
                >
                  <span className="pg-monitor-output-seq">#{e.sequence}</span>
                  <span className="pg-monitor-output-node">{laneLabel(e.nodeId)}</span>
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
