// Shared devtools protocol types for fastrx.
// Consumed by the library (emit side) and the devtools panel (decode side).

export interface Envelope {
  version: 1;
  /** Global monotonic per-session event counter. */
  sequence: number;
  /** Stable node identity: `${opName}#${counter}`. */
  nodeId: string;
  /** User-provided display label via `.label(name)`. */
  nodeLabel?: string;
  kind:
    | 'create'
    | 'next'
    | 'complete'
    | 'error'
    | 'defer'
    | 'subscribe'
    | 'pipe'
    | 'addSource';
  /** Per-node subscription counter (Inspect.subscribe increments). */
  streamId: number;
  /** Causal predecessor event. Set for next/complete/error; undefined for structural events. */
  cause?: { nodeId: string; sequence: number };
  /** Bounded stringified value (see summarize). Also used for source/parent nodeId in structural events. */
  data?: string;
  /** Bounded stringified error (see summarize). */
  err?: string;
  ts: number;
}

/**
 * Bounded serialization of a runtime value for the devtools panel.
 * Returns undefined for null/undefined so the Envelope field can be omitted.
 * Objects attempted via JSON.stringify, fallback to String(); truncated to `max`.
 */
export function summarize(v: unknown, max = 256): string | undefined {
  if (v === undefined || v === null) return undefined;
  let s: string;
  try {
    if (typeof v === 'object') s = JSON.stringify(v);
    else s = String(v);
  } catch {
    try {
      s = String(v);
    } catch {
      return 'unserializable';
    }
  }
  if (s.length > max) return s.slice(0, Math.max(0, max - 3)) + '...';
  return s;
}
