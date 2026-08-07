import { lookupSpec, type CanvasGraph } from "./node-catalogue.js";
import { safeFn } from "./param-eval.js";

export interface PlaygroundDiagnostic {
  readonly code: string;
  readonly severity: "error" | "warning";
  readonly message: string;
  readonly nodeId?: string;
}

/**
 * Static checks over the canvas graph, run before/while executing. Mirrors the
 * RILL-style capability diagnostics: problems are reported with a stable code
 * and (where applicable) the offending node id, instead of failing at runtime.
 */
export function diagnoseGraph(graph: CanvasGraph): PlaygroundDiagnostic[] {
  const diags: PlaygroundDiagnostic[] = [];
  const nodeById = new Map(graph.nodes.map((n) => [n.id, n]));

  const terminals = graph.nodes.filter((n) => lookupSpec(n.data.op)?.category === "terminal");

  // 1. At least one terminal (subscribe).
  if (terminals.length === 0) {
    diags.push({
      code: "RILL-1001",
      severity: "error",
      message: "No terminal (subscribe) node in the graph.",
    });
  }

  // 2. Terminal must have an incoming edge.
  for (const t of terminals) {
    const hasInput = graph.edges.some((e) => e.target === t.id);
    if (!hasInput) {
      diags.push({
        code: "RILL-1002",
        severity: "error",
        message: `Terminal "${t.data.op}" has no input connected.`,
        nodeId: t.id,
      });
    }
  }

  // 3. Orphan nodes: neither sources nor targets of any edge.
  for (const n of graph.nodes) {
    const connected =
      graph.edges.some((e) => e.source === n.id) || graph.edges.some((e) => e.target === n.id);
    if (!connected) {
      diags.push({
        code: "RILL-1003",
        severity: "warning",
        message: `Node "${n.data.op}" is not connected to anything.`,
        nodeId: n.id,
      });
    }
  }

  // 4. Input arity: missing inputs on operators/combiners; excess on single-input ops.
  for (const n of graph.nodes) {
    const spec = lookupSpec(n.data.op);
    if (!spec) continue;
    const inCount = graph.edges.filter((e) => e.target === n.id).length;
    if (spec.inputs > 0 && inCount < spec.inputs) {
      diags.push({
        code: "RILL-1004",
        severity: "error",
        message: `"${n.data.op}" needs ${spec.inputs} input(s), got ${inCount}.`,
        nodeId: n.id,
      });
    } else if (spec.inputs === 1 && inCount > 1) {
      diags.push({
        code: "RILL-1005",
        severity: "warning",
        message: `"${n.data.op}" takes a single input; ${inCount} are connected (extra ignored).`,
        nodeId: n.id,
      });
    }
  }

  // 5. Parameter validity per node spec.
  for (const n of graph.nodes) {
    const spec = lookupSpec(n.data.op);
    if (!spec) continue;
    for (const p of spec.params) {
      const raw = n.data.params[p.name] ?? p.default;
      if (p.type === "number") {
        const num = Number(raw);
        if (raw.trim() !== "" && Number.isNaN(num)) {
          diags.push({
            code: "RILL-1006",
            severity: "error",
            message: `"${n.data.op}" param ${p.name}: "${raw}" is not a number.`,
            nodeId: n.id,
          });
        }
      } else if (p.type === "expr") {
        const paramNames = p.name === "acc" ? ["a", "x"] : ["x"];
        try {
          safeFn(paramNames, raw);
        } catch (err) {
          diags.push({
            code: "RILL-1007",
            severity: "error",
            message: `"${n.data.op}" param ${p.name}: ${err instanceof Error ? err.message : String(err)}`,
            nodeId: n.id,
          });
        }
      }
    }
  }

  return diags;
}
