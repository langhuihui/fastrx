import type { Observable } from "fastrx";

export type ParamType = "string" | "number" | "expr";

export interface ParamSpec {
  readonly name: string;
  readonly type: ParamType;
  readonly default: string;
  readonly placeholder?: string;
}

export type NodeCategory = "source" | "combiner" | "operator" | "terminal";

export interface NodeSpec {
  readonly op: string;
  readonly category: NodeCategory;
  /** Number of input ports (0 for sources, 1 for most operators, 2 for combiners). */
  readonly inputs: number;
  /** Number of output ports (0 for terminals, 1 otherwise). */
  readonly outputs: number;
  readonly params: readonly ParamSpec[];
  readonly description: string;
}

export interface CanvasNodeData extends Record<string, unknown> {
  readonly op: string;
  readonly category: NodeCategory;
  readonly params: Record<string, string>;
  readonly label?: string;
}

export interface CanvasEdge {
  readonly id: string;
  readonly source: string;
  readonly target: string;
  readonly sourceHandle?: string | null;
  readonly targetHandle?: string | null;
}

export interface CanvasGraph {
  readonly nodes: ReadonlyArray<{ id: string; data: CanvasNodeData; position: { x: number; y: number } }>;
  readonly edges: readonly CanvasEdge[];
}

export const CATALOGUE: readonly NodeSpec[] = [
  // Sources
  { op: "of", category: "source", inputs: 0, outputs: 1, description: "Emit a fixed set of values.",
    params: [{ name: "values", type: "string", default: "1,2,3", placeholder: "1,2,3" }] },
  { op: "interval", category: "source", inputs: 0, outputs: 1, description: "Emit incremental numbers every `period` ms.",
    params: [{ name: "period", type: "number", default: "1000", placeholder: "1000" }] },
  { op: "timer", category: "source", inputs: 0, outputs: 1, description: "After `delay` ms, emit 0 then increment every `period` ms (optional).",
    params: [
      { name: "delay", type: "number", default: "500", placeholder: "500" },
      { name: "period", type: "number", default: "1000", placeholder: "1000" },
    ] },
  { op: "range", category: "source", inputs: 0, outputs: 1, description: "Emit `count` numbers starting from `start`.",
    params: [
      { name: "start", type: "number", default: "1", placeholder: "1" },
      { name: "count", type: "number", default: "5", placeholder: "5" },
    ] },

  // Combiners
  { op: "merge", category: "combiner", inputs: 2, outputs: 1, description: "Merge two streams into one.", params: [] },
  { op: "combineLatest", category: "combiner", inputs: 2, outputs: 1, description: "Emit combined values when any source emits.", params: [] },
  { op: "concat", category: "combiner", inputs: 2, outputs: 1, description: "Run second stream after first completes.", params: [] },
  { op: "zip", category: "combiner", inputs: 2, outputs: 1, description: "Emit when all sources have emitted, pairing by index.", params: [] },

  // Operators
  { op: "map", category: "operator", inputs: 1, outputs: 1, description: "Transform each value with `fn`.",
    params: [{ name: "fn", type: "expr", default: "x => x * 2", placeholder: "x => x * 2" }] },
  { op: "filter", category: "operator", inputs: 1, outputs: 1, description: "Pass values where `predicate` returns truthy.",
    params: [{ name: "predicate", type: "expr", default: "x => x > 1", placeholder: "x => x > 1" }] },
  { op: "scan", category: "operator", inputs: 1, outputs: 1, description: "Accumulate with `acc` (seed optional).",
    params: [
      { name: "acc", type: "expr", default: "(a, x) => a + x", placeholder: "(a, x) => a + x" },
      { name: "seed", type: "string", default: "0", placeholder: "0" },
    ] },
  { op: "take", category: "operator", inputs: 1, outputs: 1, description: "Take first `count` values then complete.",
    params: [{ name: "count", type: "number", default: "3", placeholder: "3" }] },
  { op: "skip", category: "operator", inputs: 1, outputs: 1, description: "Skip first `count` values.",
    params: [{ name: "count", type: "number", default: "2", placeholder: "2" }] },
  { op: "delay", category: "operator", inputs: 1, outputs: 1, description: "Delay each value by `ms` milliseconds.",
    params: [{ name: "ms", type: "number", default: "500", placeholder: "500" }] },
  { op: "debounceTime", category: "operator", inputs: 1, outputs: 1, description: "Drop values emitted too quickly.",
    params: [{ name: "ms", type: "number", default: "300", placeholder: "300" }] },
  { op: "mapTo", category: "operator", inputs: 1, outputs: 1, description: "Replace each value with a constant.",
    params: [{ name: "value", type: "string", default: "\"hi\"", placeholder: "\"hi\"" }] },
  { op: "distinct", category: "operator", inputs: 1, outputs: 1, description: "Drop consecutive duplicate values.", params: [] },
  { op: "bufferCount", category: "operator", inputs: 1, outputs: 1, description: "Collect values into arrays of `size`.",
    params: [{ name: "size", type: "number", default: "2", placeholder: "2" }] },
  { op: "switchMap", category: "operator", inputs: 1, outputs: 1, description: "Map to inner Observable, switch on new.",
    params: [{ name: "fn", type: "expr", default: "x => of(x, x * 2)", placeholder: "x => of(x, x * 2)" }] },

  // Terminals
  { op: "subscribe", category: "terminal", inputs: 1, outputs: 0, description: "Subscribe and log values.", params: [] },
];

const CATALOGUE_BY_OP = new Map(CATALOGUE.map(s => [s.op, s] as const));

export function lookupSpec(op: string): NodeSpec | undefined {
  return CATALOGUE_BY_OP.get(op);
}

export function defaultParams(spec: NodeSpec): Record<string, string> {
  const p: Record<string, string> = {};
  for (const param of spec.params) p[param.name] = param.default;
  return p;
}

export const CATEGORY_LABELS: Record<NodeCategory, string> = {
  source: "Sources",
  combiner: "Combiners",
  operator: "Operators",
  terminal: "Terminals",
};

export const CATEGORY_COLORS: Record<NodeCategory, string> = {
  source: "#72f5bd",
  combiner: "#ff7b6d",
  operator: "#5e9cff",
  terminal: "#c084fc",
};

export type { Observable };
