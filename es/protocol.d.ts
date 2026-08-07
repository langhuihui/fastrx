export interface Envelope {
    version: 1;
    /** Global monotonic per-session event counter. */
    sequence: number;
    /** Stable node identity: `${opName}#${counter}`. */
    nodeId: string;
    /** User-provided display label via `.label(name)`. */
    nodeLabel?: string;
    kind: 'create' | 'next' | 'complete' | 'error' | 'defer' | 'subscribe' | 'pipe' | 'addSource';
    /** Per-node subscription counter (Inspect.subscribe increments). */
    streamId: number;
    /** Causal predecessor event. Set for next/complete/error; undefined for structural events. */
    cause?: {
        nodeId: string;
        sequence: number;
    };
    /** Bounded stringified value (see summarize). Also used for source/parent nodeId in structural events. */
    data?: string;
    /** Bounded stringified error (see summarize). */
    err?: string;
    /** Set when the node had a devtools breakpoint armed at emit time. */
    breakpoint?: boolean;
    ts: number;
}
/** Panel → library commands (reverse channel over the same port). */
export type PanelCommand = {
    type: 'inspect';
    nodeId: string;
} | {
    type: 'breakpoint';
    nodeId: string;
    on: boolean;
};
/** Library → panel replies to PanelCommands. */
export type BackendReply = {
    type: 'inspect-result';
    nodeId: string;
    /** Most recent value stringified, if the node has emitted one. */
    latest?: string;
    /** Number of active subscriptions on this node. */
    subscriptionCount: number;
    ts: number;
} | {
    type: 'breakpoint-ack';
    nodeId: string;
    on: boolean;
    ts: number;
};
/**
 * Bounded serialization of a runtime value for the devtools panel.
 * Returns undefined for null/undefined so the Envelope field can be omitted.
 * Objects attempted via JSON.stringify, fallback to String(); truncated to `max`.
 */
export declare function summarize(v: unknown, max?: number): string | undefined;
//# sourceMappingURL=protocol.d.ts.map