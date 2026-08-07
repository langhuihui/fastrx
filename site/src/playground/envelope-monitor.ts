import { useCallback, useEffect, useRef, useState } from "react";
import type { Envelope } from "fastrx";

import { runGraph, type RunOptions } from "./graph-runtime.js";
import type { CanvasGraph } from "./node-catalogue.js";

export type Lifecycle = "idle" | "running" | "completed" | "error";

export interface EnvelopeMonitorState {
  readonly events: Envelope[];
  readonly outputs: unknown[];
  readonly lifecycle: Lifecycle;
  readonly error: string | null;
}

export interface EnvelopeMonitorApi extends EnvelopeMonitorState {
  readonly run: (graph: CanvasGraph, options?: RunOptions) => void;
  readonly stop: () => void;
  readonly reset: () => void;
}

const MAX_EVENTS = 1000;

export function useEnvelopeMonitor(): EnvelopeMonitorApi {
  const [events, setEvents] = useState<Envelope[]>([]);
  const [outputs, setOutputs] = useState<unknown[]>([]);
  const [lifecycle, setLifecycle] = useState<Lifecycle>("idle");
  const [error, setError] = useState<string | null>(null);
  const disposeRef = useRef<(() => void) | null>(null);

  const stop = useCallback(() => {
    disposeRef.current?.();
    disposeRef.current = null;
    setLifecycle((cur) => (cur === "running" ? "idle" : cur));
  }, []);

  const reset = useCallback(() => {
    stop();
    setEvents([]);
    setOutputs([]);
    setLifecycle("idle");
    setError(null);
  }, [stop]);

  const run = useCallback(
    (graph: CanvasGraph, options?: RunOptions) => {
      // Stop any prior run.
      disposeRef.current?.();
      disposeRef.current = null;
      setEvents([]);
      setOutputs([]);
      setError(null);
      setLifecycle("running");

      try {
        const dispose = runGraph(
          graph,
          (env) => {
            setEvents((cur) => {
              const next = cur.length >= MAX_EVENTS ? cur.slice(cur.length - MAX_EVENTS + 1) : cur;
              return [...next, env];
            });
            if (env.kind === "complete" || env.kind === "error") {
              setLifecycle(env.kind === "error" ? "error" : "completed");
            }
          },
          (value) => {
            setOutputs((cur) => {
              const next = cur.length >= MAX_EVENTS ? cur.slice(cur.length - MAX_EVENTS + 1) : cur;
              return [...next, value];
            });
          },
          options,
        );
        disposeRef.current = dispose;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        setLifecycle("error");
      }
    },
    [],
  );

  useEffect(() => () => disposeRef.current?.(), []);

  return { events, outputs, lifecycle, error, run, stop, reset };
}

/**
 * Compute the set of sequence numbers in the causal chain ending at `selectedSeq`.
 * Ported from devtools App.vue causeChainSet.
 */
export function causeChainSet(events: Envelope[], selectedSeq: number | null): Set<number> {
  if (selectedSeq == null) return new Set();
  const set = new Set<number>([selectedSeq]);
  let cur = events.find((e) => e.sequence === selectedSeq);
  while (cur?.cause && !set.has(cur.cause.sequence)) {
    set.add(cur.cause.sequence);
    cur = events.find((e) => e.sequence === cur!.cause!.sequence);
  }
  return set;
}
