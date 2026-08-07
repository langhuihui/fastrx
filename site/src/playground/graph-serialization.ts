import type { CanvasGraph } from "./node-catalogue.js";

const STORAGE_KEY = "fastrx-playground-graph-v1";
const HASH_PREFIX = "#/g/";

/**
 * Serialize a graph to a URL-safe string (JSON + encodeURIComponent).
 * Node data only includes the fields needed to reconstruct a pipeline:
 * op, params, position — not reactflow internals.
 */
export function serializeGraph(graph: CanvasGraph): string {
  const slim = {
    nodes: graph.nodes.map((n) => ({
      id: n.id,
      op: n.data.op,
      params: n.data.params,
      position: n.position,
    })),
    edges: graph.edges.map((e) => ({ id: e.id, source: e.source, target: e.target })),
  };
  return encodeURIComponent(JSON.stringify(slim));
}

export function deserializeGraph(encoded: string): CanvasGraph | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(encoded));
    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) return null;
    return {
      nodes: parsed.nodes.map((n: { id: string; op: string; params?: Record<string, string>; position?: { x: number; y: number } }) => ({
        id: String(n.id),
        type: "op" as const,
        position: n.position ?? { x: 100, y: 100 },
        data: {
          op: String(n.op),
          category: "operator" as const,
          params: n.params ?? {},
        },
      })),
      edges: parsed.edges.map((e: { id?: string; source: string; target: string }) => ({
        id: e.id ?? `${e.source}-${e.target}`,
        source: String(e.source),
        target: String(e.target),
      })),
    };
  } catch {
    return null;
  }
}

/** Read a graph from the URL hash, if present. */
export function graphFromHash(): CanvasGraph | null {
  const hash = window.location.hash;
  if (!hash.startsWith(HASH_PREFIX)) return null;
  return deserializeGraph(hash.slice(HASH_PREFIX.length));
}

/** Replace the URL hash with an encoded graph (shareable link). */
export function pushGraphToHash(graph: CanvasGraph): void {
  const url = new URL(window.location.href);
  url.hash = `${HASH_PREFIX}${serializeGraph(graph)}`;
  window.history.replaceState({}, "", url);
}

/** Build a shareable URL for the current page with the graph in the hash. */
export function shareUrl(graph: CanvasGraph): string {
  const url = new URL(window.location.href);
  url.hash = `${HASH_PREFIX}${serializeGraph(graph)}`;
  return url.toString();
}

export function saveGraphToStorage(graph: CanvasGraph): void {
  try {
    localStorage.setItem(STORAGE_KEY, serializeGraph(graph));
  } catch {
    /* storage may be unavailable (private mode) — ignore */
  }
}

export function graphFromStorage(): CanvasGraph | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? deserializeGraph(raw) : null;
  } catch {
    return null;
  }
}

export function clearStoredGraph(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
