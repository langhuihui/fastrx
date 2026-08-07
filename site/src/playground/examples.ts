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

export const PRESETS: readonly PresetGraph[] = [
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
