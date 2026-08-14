import type { Envelope } from "fastrx";

import { lookupSpec, type NodeCategory } from "../../../../site/src/playground/node-catalogue.js";

export type NodeStatus = "idle" | "active" | "complete" | "error" | "cancel";

export interface GraphNode {
  id: string;
  label: string;
  source: string | null;
  sources: string[];
  latest?: string;
  status: NodeStatus;
}

export interface PipelineGraph {
  nodes: Map<string, GraphNode>;
  roots: string[];
}

export function graphFromEnvelopes(
  events: Envelope[],
  maxSeq: number | null,
): PipelineGraph {
  const nodes = new Map<string, GraphNode>();
  const roots: string[] = [];

  const ensure = (id: string, label?: string) => {
    let node = nodes.get(id);
    if (!node) {
      node = { id, label: label ?? id, source: null, sources: [], status: "idle" };
      nodes.set(id, node);
    } else if (label) {
      node.label = label;
    }
    return node;
  };

  for (const env of events) {
    if (maxSeq != null && env.sequence > maxSeq) continue;
    switch (env.kind) {
      case "create":
        ensure(env.nodeId, env.nodeLabel);
        break;
      case "pipe":
        ensure(env.nodeId, env.nodeLabel);
        if (env.data) {
          ensure(env.data);
          ensure(env.nodeId).source = env.data;
        }
        break;
      case "addSource":
        ensure(env.nodeId, env.nodeLabel);
        if (env.data) {
          ensure(env.data);
          const node = ensure(env.nodeId);
          if (!node.sources.includes(env.data)) node.sources.push(env.data);
        }
        break;
      case "subscribe":
        ensure(env.nodeId, env.nodeLabel);
        if (!env.data && !roots.includes(env.nodeId)) roots.unshift(env.nodeId);
        break;
      case "next":
        ensure(env.nodeId, env.nodeLabel).latest = env.data;
        ensure(env.nodeId).status = "active";
        break;
      case "complete":
        ensure(env.nodeId, env.nodeLabel).status = "complete";
        break;
      case "error":
        ensure(env.nodeId, env.nodeLabel).status = "error";
        if (env.err) ensure(env.nodeId).latest = env.err;
        break;
      case "defer":
        ensure(env.nodeId, env.nodeLabel).status = "cancel";
        break;
      default:
        break;
    }
  }

  return { nodes, roots };
}

export function nodeLabelsFromGraph(graph: PipelineGraph): Record<string, string> {
  const labels: Record<string, string> = {};
  for (const node of graph.nodes.values()) {
    if (node.label !== node.id) labels[node.id] = node.label;
  }
  return labels;
}

const COL_W = 200;
const ROW_H = 120;

function opName(id: string): string {
  const i = id.lastIndexOf("#");
  return i > 0 ? id.slice(0, i) : id;
}

function predecessors(node: GraphNode): string[] {
  const out: string[] = [];
  if (node.source) out.push(node.source);
  for (const id of node.sources) {
    if (!out.includes(id)) out.push(id);
  }
  return out;
}

function categoryOf(node: GraphNode, isRoot: boolean): NodeCategory {
  if (isRoot) return "terminal";
  if (node.sources.length > 0) return "combiner";
  if (!node.source) return "source";
  return lookupSpec(opName(node.id))?.category ?? "operator";
}

function rankOf(
  id: string,
  nodes: Map<string, GraphNode>,
  memo: Map<string, number>,
  visiting: Set<string>,
): number {
  const cached = memo.get(id);
  if (cached !== undefined) return cached;
  if (visiting.has(id)) return 0;
  visiting.add(id);
  const node = nodes.get(id);
  const preds = node ? predecessors(node) : [];
  const rank =
    preds.length === 0
      ? 0
      : 1 + Math.max(...preds.map((p) => rankOf(p, nodes, memo, visiting)));
  visiting.delete(id);
  memo.set(id, rank);
  return rank;
}

function collectUpstream(rootId: string, nodes: Map<string, GraphNode>): string[] {
  const seen = new Set<string>();
  const walk = (id: string) => {
    if (seen.has(id)) return;
    seen.add(id);
    const node = nodes.get(id);
    if (!node) return;
    for (const pred of predecessors(node)) walk(pred);
  };
  walk(rootId);
  return [...seen];
}

export interface FlowNode {
  id: string;
  type: "op";
  position: { x: number; y: number };
  data: {
    op: string;
    category: NodeCategory;
    params: Record<string, string>;
    label: string;
  };
}

export interface FlowLayout {
  readonly nodes: FlowNode[];
  readonly edges: Array<{ id: string; source: string; target: string }>;
  readonly values: Record<string, string>;
}

export function flowFromGraph(graph: PipelineGraph): FlowLayout {
  const rootSet = new Set(graph.roots);
  const placed = new Set<string>();
  const rfNodes: FlowNode[] = [];
  const rfEdges: Array<{ id: string; source: string; target: string }> = [];
  let yOffset = 0;

  const layoutIds = (ids: string[]) => {
    const memo = new Map<string, number>();
    const visiting = new Set<string>();
    const cols = new Map<number, string[]>();
    for (const id of ids) {
      const rank = rankOf(id, graph.nodes, memo, visiting);
      const col = cols.get(rank) ?? [];
      col.push(id);
      cols.set(rank, col);
    }
    let maxY = 0;
    for (const [rank, col] of [...cols.entries()].sort((a, b) => a[0] - b[0])) {
      col.forEach((id, i) => {
        if (placed.has(id)) return;
        placed.add(id);
        const node = graph.nodes.get(id);
        if (!node) return;
        rfNodes.push({
          id,
          type: "op",
          position: { x: rank * COL_W, y: yOffset + i * ROW_H },
          data: {
            op: opName(id),
            category: categoryOf(node, rootSet.has(id)),
            params: {},
            label: node.label,
          },
        });
        maxY = Math.max(maxY, i * ROW_H);
      });
    }
    yOffset += maxY + ROW_H + 40;
  };

  for (const root of graph.roots) {
    layoutIds(collectUpstream(root, graph.nodes));
  }
  const rest = [...graph.nodes.keys()].filter((id) => !placed.has(id));
  if (rest.length) layoutIds(rest);

  for (const node of graph.nodes.values()) {
    if (node.source) {
      rfEdges.push({ id: `${node.source}->${node.id}`, source: node.source, target: node.id });
    }
    for (const src of node.sources) {
      rfEdges.push({ id: `${src}->${node.id}`, source: src, target: node.id });
    }
  }

  const values: Record<string, string> = {};
  for (const node of graph.nodes.values()) {
    if (node.latest !== undefined) values[node.id] = node.latest;
  }
  return { nodes: rfNodes, edges: rfEdges, values };
}
