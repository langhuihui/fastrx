import type { CanvasGraph } from "./node-catalogue.js";

export interface PresetGraph {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly graph: CanvasGraph;
}

function node(
  id: string,
  op: string,
  x: number,
  y: number,
  params: Record<string, string> = {},
) {
  return { id, type: "op" as const, position: { x, y }, data: { op, category: "operator" as const, params } };
}

function edge(source: string, target: string) {
  return { id: `${source}-${target}`, source, target };
}

// ---------------------------------------------------------------------------
// Example gallery — from basic pipelines to multi-source / combiner patterns
// ---------------------------------------------------------------------------

export const PRESETS: readonly PresetGraph[] = [
  // ── Fundamentals ──────────────────────────────────────────────────────
  {
    id: "map-filter",
    title: "Map & Filter",
    description: "Double numbers, keep those > 2.",
    graph: {
      nodes: [
        node("n1", "of", 0, 0, { values: "1,2,3,4,5" }),
        node("n2", "map", 220, 0, { fn: "x => x * 2" }),
        node("n3", "filter", 440, 0, { predicate: "x => x > 2" }),
        node("n4", "subscribe", 660, 0),
      ],
      edges: [edge("n1", "n2"), edge("n2", "n3"), edge("n3", "n4")],
    },
  },
  {
    id: "skip-take",
    title: "Skip & Take",
    description: "Skip first 3, then take the next 4.",
    graph: {
      nodes: [
        node("n1", "range", 0, 0, { start: "1", count: "12" }),
        node("n2", "skip", 220, 0, { count: "3" }),
        node("n3", "take", 440, 0, { count: "4" }),
        node("n4", "subscribe", 660, 0),
      ],
      edges: [edge("n1", "n2"), edge("n2", "n3"), edge("n3", "n4")],
    },
  },
  {
    id: "distinct-consecutive",
    title: "Distinct (consecutive)",
    description: "Drop consecutive duplicate values.",
    graph: {
      nodes: [
        node("n1", "of", 0, 0, { values: "1,1,2,2,3,1,1" }),
        node("n2", "distinct", 220, 0),
        node("n3", "subscribe", 440, 0),
      ],
      edges: [edge("n1", "n2"), edge("n2", "n3")],
    },
  },
  {
    id: "delay-transform",
    title: "Delay transform",
    description: "Delay each value by 500ms then map.",
    graph: {
      nodes: [
        node("n1", "of", 0, 0, { values: "a, b, c, d" }),
        node("n2", "delay", 220, 0, { ms: "500" }),
        node("n3", "map", 440, 0, { fn: "x => `delayed ${x}`" }),
        node("n4", "subscribe", 660, 0),
      ],
      edges: [edge("n1", "n2"), edge("n2", "n3"), edge("n3", "n4")],
    },
  },

  // ── State & accumulation ──────────────────────────────────────────────
  {
    id: "scan-accumulate",
    title: "Scan (running sum)",
    description: "Accumulate values into a running sum.",
    graph: {
      nodes: [
        node("n1", "interval", 0, 0, { period: "500" }),
        node("n2", "take", 220, 0, { count: "5" }),
        node("n3", "scan", 440, 0, { acc: "(a, x) => a + x", seed: "0" }),
        node("n4", "subscribe", 660, 0),
      ],
      edges: [edge("n1", "n2"), edge("n2", "n3"), edge("n3", "n4")],
    },
  },
  {
    id: "buffer-count",
    title: "Buffer count",
    description: "Collect values into arrays of 3.",
    graph: {
      nodes: [
        node("n1", "range", 0, 0, { start: "1", count: "9" }),
        node("n2", "bufferCount", 220, 0, { size: "3" }),
        node("n3", "subscribe", 440, 0),
      ],
      edges: [edge("n1", "n2"), edge("n2", "n3")],
    },
  },
  {
    id: "scan-map-filter",
    title: "Scan → Map → Filter",
    description: "Accumulate, transform, then keep results ≥ 10.",
    graph: {
      nodes: [
        node("n1", "range", 0, 0, { start: "1", count: "8" }),
        node("n2", "scan", 220, 0, { acc: "(a, x) => a + x", seed: "0" }),
        node("n3", "map", 440, 0, { fn: "x => x * 2" }),
        node("n4", "filter", 660, 0, { predicate: "x => x >= 10" }),
        node("n5", "subscribe", 880, 0),
      ],
      edges: [edge("n1", "n2"), edge("n2", "n3"), edge("n3", "n4"), edge("n4", "n5")],
    },
  },

  // ── Timing & throttling ───────────────────────────────────────────────
  {
    id: "debounce",
    title: "Debounce",
    description: "Only emit after 300ms of quiet.",
    graph: {
      nodes: [
        node("n1", "interval", 0, 0, { period: "200" }),
        node("n2", "take", 220, 0, { count: "8" }),
        node("n3", "debounceTime", 440, 0, { ms: "300" }),
        node("n4", "subscribe", 660, 0),
      ],
      edges: [edge("n1", "n2"), edge("n2", "n3"), edge("n3", "n4")],
    },
  },
  {
    id: "mapTo-filter",
    title: "MapTo & Filter",
    description: "Replace values with a constant, then filter.",
    graph: {
      nodes: [
        node("n1", "interval", 0, 0, { period: "400" }),
        node("n2", "take", 220, 0, { count: "6" }),
        node("n3", "mapTo", 440, 0, { value: '"ping"' }),
        node("n4", "filter", 660, 0, { predicate: "x => x === 'ping'" }),
        node("n5", "subscribe", 880, 0),
      ],
      edges: [edge("n1", "n2"), edge("n2", "n3"), edge("n3", "n4"), edge("n4", "n5")],
    },
  },

  // ── Multi-source combiners ────────────────────────────────────────────
  {
    id: "merge",
    title: "Merge two streams",
    description: "Combine an interval and a timer into one stream.",
    graph: {
      nodes: [
        node("n1", "interval", 0, -80, { period: "600" }),
        node("n2", "timer", 0, 80, { delay: "200", period: "800" }),
        node("n3", "merge", 240, 0),
        node("n4", "take", 460, 0, { count: "6" }),
        node("n5", "subscribe", 680, 0),
      ],
      edges: [edge("n1", "n3"), edge("n2", "n3"), edge("n3", "n4"), edge("n4", "n5")],
    },
  },
  {
    id: "zip",
    title: "Zip two sources",
    description: "Pair values by index from two streams.",
    graph: {
      nodes: [
        node("n1", "of", 0, -80, { values: "A,B,C,D" }),
        node("n2", "of", 0, 80, { values: "1,2,3,4" }),
        node("n3", "zip", 240, 0),
        node("n4", "map", 460, 0, { fn: `([a, b]) => a + b` }),
        node("n5", "subscribe", 680, 0),
      ],
      edges: [edge("n1", "n3"), edge("n2", "n3"), edge("n3", "n4"), edge("n4", "n5")],
    },
  },
  {
    id: "combineLatest",
    title: "CombineLatest",
    description: "Emit latest combo whenever any source emits.",
    graph: {
      nodes: [
        node("n1", "interval", 0, -80, { period: "700" }),
        node("n2", "interval", 0, 80, { period: "400" }),
        node("n3", "combineLatest", 240, 0),
        node("n4", "take", 460, 0, { count: "6" }),
        node("n5", "subscribe", 680, 0),
      ],
      edges: [edge("n1", "n3"), edge("n2", "n3"), edge("n3", "n4"), edge("n4", "n5")],
    },
  },
  {
    id: "concat",
    title: "Concat two streams",
    description: "Run second stream after first completes.",
    graph: {
      nodes: [
        node("n1", "of", 0, -80, { values: "1,2,3" }),
        node("n2", "of", 0, 80, { values: "a, b, c" }),
        node("n3", "concat", 240, 0),
        node("n4", "map", 460, 0, { fn: `x => String(x)` }),
        node("n5", "subscribe", 680, 0),
      ],
      edges: [edge("n1", "n3"), edge("n2", "n3"), edge("n3", "n4"), edge("n4", "n5")],
    },
  },

  // ── SwitchMap (inner stream) ──────────────────────────────────────────
  {
    id: "switchMap",
    title: "SwitchMap (inner stream)",
    description: "Each value spawns an inner of(x, x*2).",
    graph: {
      nodes: [
        node("n1", "range", 0, 0, { start: "1", count: "3" }),
        node("n2", "switchMap", 220, 0, { fn: "x => of(x, x * 2)" }),
        node("n3", "subscribe", 440, 0),
      ],
      edges: [edge("n1", "n2"), edge("n2", "n3")],
    },
  },

  // ── Multi-stream ──────────────────────────────────────────────────────
  {
    id: "multi-stream",
    title: "Two streams",
    description: "Two independent pipelines running in parallel.",
    graph: {
      nodes: [
        node("n1", "interval", 0, -100, { period: "500" }),
        node("n2", "map", 200, -100, { fn: "x => `tick ${x}`" }),
        node("n3", "subscribe", 420, -100),
        node("n4", "of", 0, 100, { values: "a, b, c" }),
        node("n5", "subscribe", 420, 100),
      ],
      edges: [edge("n1", "n2"), edge("n2", "n3"), edge("n4", "n5")],
    },
  },
];
