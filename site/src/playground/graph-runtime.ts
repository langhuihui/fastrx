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
  concatMap,
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
  /**
   * Slow-motion: minimum spacing between consecutive values, in ms.
   * 0 (default) runs at native speed with no injection overhead.
   * Implemented as a concatMap(delay) on every node output, so fast sources
   * (of, interval(200)) unfold one value per speedMs, while slower sources
   * are never sped up.
   */
  readonly speedMs?: number;
}

/** Wrap a source so each value is emitted at least `speedMs` apart. */
function slowDown(speedMs: number) {
  return (src: AnyObs): AnyObs =>
    pipe(src, concatMap((x) => pipe(of(x), delay(speedMs))));
}

function applySpeed(ob: AnyObs, speedMs: number): AnyObs {
  return speedMs > 0 ? slowDown(speedMs)(ob) : ob;
}

/**
 * Run a canvas graph as a fastrx pipe chain. Captures all emitted Envelopes
 * via the library's `__testInstallBackend` test seam (drains ring first).
 *
 * Returns a dispose function. Throws if the graph is invalid (cycle, missing
 * source, bad params).
 */
export function runGraph(
  graph: CanvasGraph,
  onEnv: (e: Envelope) => void,
  onOut: (v: unknown) => void,
  options: RunOptions = {},
): () => void {
  const speedMs = options.speedMs ?? 0;
  const disconnect = __testInstallBackend(onEnv);
  try {
    const source = buildObservable(graph, speedMs);
    const sub = pipe(
      source,
      subscribe(onOut, () => {}, () => {}),
    );
    return () => {
      try {
        (sub as { dispose?: () => void }).dispose?.();
      } catch {
        /* noop */
      }
      disconnect();
    };
  } catch (err) {
    disconnect();
    throw err;
  }
}

/**
 * Topologically sort the graph from sources to terminals, memoize each node's
 * Observable, and return the terminal's source Observable.
 */
function buildObservable(graph: CanvasGraph, speedMs: number): AnyObs {
  const sorted = topoSort(graph);
  const memo = new Map<string, AnyObs>();

  for (const node of sorted) {
    const spec = lookupSpec(node.data.op);
    if (!spec) throw new Error(`Unknown operator: ${node.data.op}`);

    const inEdges = graph.edges.filter((e) => e.target === node.id);
    const inputs = inEdges.map((e) => {
      const ob = memo.get(e.source);
      if (!ob) {
        throw new Error(`Input not built for node ${e.source} (cycle?)`);
      }
      return ob;
    });

    if (spec.inputs > 0 && inputs.length < spec.inputs) {
      throw new Error(`${node.data.op} needs ${spec.inputs} input(s), got ${inputs.length}`);
    }
    const ob = applySpeed(construct(node.data, inputs), speedMs);
    memo.set(node.id, ob);
  }

  // The terminal's input is the chain's source Observable.
  const terminal = sorted.find((n) => lookupSpec(n.data.op)?.category === "terminal");
  if (!terminal) throw new Error("No terminal (subscribe) node in graph");
  const terminalInEdge = graph.edges.find((e) => e.target === terminal.id);
  if (!terminalInEdge) throw new Error("Terminal has no input");
  const source = memo.get(terminalInEdge.source);
  if (!source) throw new Error("Terminal input not built");
  return source;
}

/**
 * Compile a *Map subgraph into an inner Observable given the outer value `x`.
 * The subgraph starts at the reserved `__input` node (fed `of(x)`), threads
 * operators in topological order, and returns the last operator's output.
 */
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
    // Subgraphs never re-apply slow-motion; the outer pipe's speedMs handles it.
    memo.set(node.id, applySpeed(construct(node.data, inputs), 0));
  }

  const output = [...sorted].reverse().find((n) => n.id !== SUBGRAPH_INPUT_ID);
  return output ? memo.get(output.id) ?? of(x) : of(x);
}

function construct(data: CanvasNodeData, inputs: AnyObs[]): AnyObs {
  const p = data.params;
  switch (data.op) {
    // Sources
    case "of":
      return of(...parseValues(p.values ?? ""));
    case "interval":
      return interval(Number(p.period ?? 1000));
    case "timer": {
      const delayMs = Number(p.delay ?? 500);
      const period = p.period ? Number(p.period) : undefined;
      return period != null ? timer(delayMs, period) : timer(delayMs);
    }
    case "range":
      return range(Number(p.start ?? 1), Number(p.count ?? 5));

    // Combiners (2 inputs)
    case "merge":
      return merge(inputs[0], inputs[1]);
    case "combineLatest":
      return combineLatest(inputs[0], inputs[1]);
    case "concat":
      return concat(inputs[0], inputs[1]);
    case "zip":
      return zip(inputs[0], inputs[1]);

    // Operators (1 input)
    case "map":
      return pipe(inputs[0], map(safeFn(["x"], p.fn ?? "x => x") as (x: unknown) => unknown));
    case "filter":
      return pipe(
        inputs[0],
        filter(safeFn(["x"], p.predicate ?? "x => true") as (x: unknown) => boolean),
      );
    case "scan": {
      const seed = parseValue(p.seed ?? "0");
      return pipe(
        inputs[0],
        scan(
          safeFn(["a", "x"], p.acc ?? "(a, x) => a + x") as (acc: unknown, x: unknown) => unknown,
          seed,
        ),
      );
    }
    case "take":
      return pipe(inputs[0], take(Number(p.count ?? 3)));
    case "skip":
      return pipe(inputs[0], skip(Number(p.count ?? 2)));
    case "delay":
      return pipe(inputs[0], delay(Number(p.ms ?? 500)));
    case "debounceTime":
      return pipe(inputs[0], debounceTime(Number(p.ms ?? 300)));
    case "mapTo":
      return pipe(inputs[0], mapTo(parseValue(p.value ?? '"hi"')));
    case "distinct":
      return pipe(inputs[0], distinct());
    case "bufferCount":
      return pipe(inputs[0], bufferCount(Number(p.size ?? 2)));
    case "switchMap":
      if (data.subgraph) {
        const sub = data.subgraph;
        return pipe(
          inputs[0],
          switchMap((x) => buildSubgraph(sub, x) as AnyObs),
        );
      }
      return pipe(
        inputs[0],
        switchMap(safeFn(["x"], p.fn ?? "x => of(x)") as (x: unknown) => AnyObs),
      );

    // Terminal — subscribe is called by runGraph; return the input as-is.
    case "subscribe":
      return inputs[0];

    default:
      throw new Error(`construct: unhandled op ${data.op}`);
  }
}

/**
 * Kahn's algorithm. Nodes with no incoming edges are sources. Throws on cycle.
 */
function topoSort(graph: CanvasGraph): ReadonlyArray<{ id: string; data: CanvasNodeData }> {  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();
  for (const n of graph.nodes) {
    inDegree.set(n.id, 0);
    adj.set(n.id, []);
  }
  for (const e of graph.edges) {
    inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1);
    adj.get(e.source)?.push(e.target);
  }
  const queue: string[] = [];
  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id);
  }
  const sorted: { id: string; data: CanvasNodeData }[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    const node = graph.nodes.find((n) => n.id === id);
    if (node) sorted.push({ id, data: node.data });
    for (const next of adj.get(id) ?? []) {
      const nd = (inDegree.get(next) ?? 0) - 1;
      inDegree.set(next, nd);
      if (nd === 0) queue.push(next);
    }
  }
  if (sorted.length !== graph.nodes.length) {
    const cyclic = graph.nodes.filter((n) => !sorted.some((s) => s.id === n.id));
    throw new Error(
      `Graph has a cycle (nodes not reached: ${cyclic.map((n) => n.id).join(", ")}). ` +
        `Check that every operator feeds forward toward the terminal.`,
    );
  }
  return sorted;
}

/**
 * Topological order of canvas node ids (sources first). The playground maps
 * each canvas node to its runtime Envelope nodeId by aligning this order with
 * the `create` events emitted while the graph is constructed.
 */
export function topoSortNodes(graph: CanvasGraph): string[] {
  return topoSort(graph).map((n) => n.id);
}
