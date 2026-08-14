import {
  of,
  interval,
  timer,
  range,
  merge,
  combineLatest,
  concat,
  zip,
  map,
  filter,
  scan,
  take,
  skip,
  delay,
  debounceTime,
  mapTo,
  distinct,
  bufferCount,
  switchMap,
  subscribe,
  pipe,
  __testInstallBackend,
  type Observable,
  type Envelope,
} from "fastrx";

import {
  lookupSpec,
  SUBGRAPH_INPUT_ID,
  type CanvasGraph,
  type CanvasNodeData,
} from "./node-catalogue.js";
import { safeFn, parseValues, parseValue } from "./param-eval.js";

type AnyObs = Observable<unknown>;

export interface RunOptions {
  /** Slow-motion: minimum display spacing in ms (applied by the monitor). */
  readonly speedMs?: number;
}

/**
 * Run a canvas graph as one or more fastrx pipe chains (one per terminal).
 * Captures all emitted Envelopes via `__testInstallBackend` (Chrome DevTools
 * still receives the same stream if the panel is open).
 * Slow-motion is handled by the envelope-monitor (UI throttling), not by
 * pipeline injection — see envelope-monitor.ts.
 */
export function runGraph(
  graph: CanvasGraph,
  onEnv: (e: Envelope) => void,
  onOut: (v: unknown, terminalId: string) => void,
  _options: RunOptions = {},
): () => void {
  const disconnect = __testInstallBackend(onEnv);
  try {
    const subs = buildPipelines(graph, onOut);
    return () => {
      for (const sub of subs) {
        try { (sub as { dispose?: () => void }).dispose?.(); } catch { /* noop */ }
      }
      disconnect();
    };
  } catch (err) { disconnect(); throw err; }
}

function buildPipelines(
  graph: CanvasGraph,
  onOut: (v: unknown, terminalId: string) => void,
): Array<{ dispose?: () => void }> {
  const sorted = topoSort(graph);
  const memo = new Map<string, AnyObs>();

  for (const node of sorted) {
    const spec = lookupSpec(node.data.op);
    if (!spec) throw new Error(`Unknown operator: ${node.data.op}`);
    if (spec.category === "terminal") continue;

    const inEdges = graph.edges.filter((e) => e.target === node.id);
    const inputs = inEdges.map((e) => {
      const ob = memo.get(e.source);
      if (!ob) throw new Error(`Input not built for node ${e.source} (cycle?)`);
      return ob;
    });

    if (spec.inputs > 0 && inputs.length < spec.inputs) {
      throw new Error(`${node.data.op} needs ${spec.inputs} input(s), got ${inputs.length}`);
    }
    memo.set(node.id, construct(node.data, inputs));
  }

  const terminals = sorted.filter(
    (n) => lookupSpec(n.data.op)?.category === "terminal",
  );
  if (terminals.length === 0) {
    throw new Error("No terminal (subscribe) node in graph");
  }

  return terminals.map((t) => {
    const inEdge = graph.edges.find((e) => e.target === t.id);
    if (!inEdge) throw new Error(`Terminal "${t.data.op}" has no input`);
    const source = memo.get(inEdge.source);
    if (!source) throw new Error("Terminal input not built");
    return pipe(source, subscribe((v) => onOut(v, t.id), () => {}, () => {}));
  });
}

function buildSubgraph(sub: CanvasGraph, x: unknown): AnyObs {
  const memo = new Map<string, AnyObs>();
  memo.set(SUBGRAPH_INPUT_ID, of(x));
  const sorted = topoSort(sub);
  for (const node of sorted) {
    if (node.id === SUBGRAPH_INPUT_ID) continue;
    const spec = lookupSpec(node.data.op);
    if (!spec) throw new Error(`Unknown operator in subgraph: ${node.data.op}`);
    const inEdges = sub.edges.filter((e) => e.target === node.id);
    const inputs = inEdges.map((e) => {
      const ob = memo.get(e.source);
      if (!ob) throw new Error(`Subgraph input not built for ${e.source}`);
      return ob;
    });
    if (spec.inputs > 0 && inputs.length < spec.inputs) {
      throw new Error(`Subgraph "${node.data.op}" needs ${spec.inputs} input(s), got ${inputs.length}`);
    }
    memo.set(node.id, construct(node.data, inputs));
  }
  const output = [...sorted].reverse().find((n) => n.id !== SUBGRAPH_INPUT_ID);
  return output ? memo.get(output.id) ?? of(x) : of(x);
}

function construct(data: CanvasNodeData, inputs: AnyObs[]): AnyObs {
  const p = data.params;
  switch (data.op) {
    case "of": return of(...parseValues(p.values ?? ""));
    case "interval": return interval(Number(p.period ?? 1000));
    case "timer": { const ds = Number(p.delay ?? 500); const pe = p.period ? Number(p.period) : undefined; return pe != null ? timer(ds, pe) : timer(ds); }
    case "range": return range(Number(p.start ?? 1), Number(p.count ?? 5));
    case "merge": return merge(inputs[0], inputs[1]);
    case "combineLatest": return combineLatest(inputs[0], inputs[1]);
    case "concat": return concat(inputs[0], inputs[1]);
    case "zip": return zip(inputs[0], inputs[1]);
    case "map": return pipe(inputs[0], map(safeFn(["x"], p.fn ?? "x => x") as (x: unknown) => unknown));
    case "filter": return pipe(inputs[0], filter(safeFn(["x"], p.predicate ?? "x => true") as (x: unknown) => boolean));
    case "scan": { const s = parseValue(p.seed ?? "0"); return pipe(inputs[0], scan(safeFn(["a","x"], p.acc ?? "(a,x)=>a+x") as (a:unknown,x:unknown)=>unknown, s)); }
    case "take": return pipe(inputs[0], take(Number(p.count ?? 3)));
    case "skip": return pipe(inputs[0], skip(Number(p.count ?? 2)));
    case "delay": return pipe(inputs[0], delay(Number(p.ms ?? 500)));
    case "debounceTime": return pipe(inputs[0], debounceTime(Number(p.ms ?? 300)));
    case "mapTo": return pipe(inputs[0], mapTo(parseValue(p.value ?? '"hi"')));
    case "distinct": return pipe(inputs[0], distinct());
    case "bufferCount": return pipe(inputs[0], bufferCount(Number(p.size ?? 2)));
    case "switchMap": if (data.subgraph) { return pipe(inputs[0], switchMap((x) => buildSubgraph(data.subgraph!, x) as AnyObs)); } return pipe(inputs[0], switchMap(safeFn(["x"], p.fn ?? "x => of(x)") as (x: unknown) => AnyObs));
    case "custom": return pipe(inputs[0], map(safeFn(["x"], p.fn ?? "x => x") as (x: unknown) => unknown));
    case "subscribe": return inputs[0];
    default: throw new Error(`construct: unhandled op ${data.op}`);
  }
}

function topoSort(graph: CanvasGraph): ReadonlyArray<{ id: string; data: CanvasNodeData }> {
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();
  for (const n of graph.nodes) { inDegree.set(n.id, 0); adj.set(n.id, []); }
  for (const e of graph.edges) { inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1); adj.get(e.source)?.push(e.target); }
  const queue: string[] = []; for (const [id, deg] of inDegree) { if (deg === 0) queue.push(id); }
  const sorted: { id: string; data: CanvasNodeData }[] = [];
  while (queue.length) {
    const id = queue.shift()!; const node = graph.nodes.find((n) => n.id === id);
    if (node) sorted.push({ id, data: node.data });
    for (const next of adj.get(id) ?? []) { const nd = (inDegree.get(next) ?? 0) - 1; inDegree.set(next, nd); if (nd === 0) queue.push(next); }
  }
  if (sorted.length !== graph.nodes.length) {
    const cyclic = graph.nodes.filter((n) => !sorted.some((s) => s.id === n.id));
    throw new Error(`Graph has a cycle (nodes not reached: ${cyclic.map((n) => n.id).join(", ")}). Check that every operator feeds forward toward the terminal.`);
  }
  return sorted;
}

export function topoSortNodes(graph: CanvasGraph): string[] {
  return topoSort(graph).map((n) => n.id);
}
