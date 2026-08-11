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
  /** Create events in pipeline-construction order (needed for canvas→runtime
   *  node lookup even when display-state is throttled). */
  readonly creates: readonly Envelope[];
}

const MAX_EVENTS = 1000;

export function useEnvelopeMonitor(): EnvelopeMonitorApi {
  const [events, setEvents] = useState<Envelope[]>([]);
  const [creates, setCreates] = useState<Envelope[]>([]);
  const [outputs, setOutputs] = useState<unknown[]>([]);
  const [lifecycle, setLifecycle] = useState<Lifecycle>("idle");
  const [error, setError] = useState<string | null>(null);
  const disposeRef = useRef<(() => void) | null>(null);
  const terminalCountRef = useRef(0);

  const stop = useCallback(() => {
    disposeRef.current?.();
    disposeRef.current = null;
    setLifecycle((cur) => (cur === "running" ? "idle" : cur));
  }, []);

  const reset = useCallback(() => {
    stop();
    setEvents([]);
    setCreates([]);
    setOutputs([]);
    setLifecycle("idle");
    setError(null);
    terminalCountRef.current = 0;
  }, [stop]);

  const run = useCallback(
    (graph: CanvasGraph, options?: RunOptions) => {
      const speedMs = options?.speedMs ?? 0;
      disposeRef.current?.();
      disposeRef.current = null;
      setEvents([]);
      setCreates([]);
      setOutputs([]);
      setError(null);
      setLifecycle("running");
      terminalCountRef.current = 0;

      /** Direct-record helpers. Each envelope is added to events state and its
       *  terminal count is updated as soon as it arrives — no waiting on the
       *  throttler. The throttler is only responsible for pacing *display* of
       *  the data events via the marble diagram and the outputs list. */
      const recordEnv = (env: Envelope) => {
        setEvents((cur) => {
          const next = cur.length >= MAX_EVENTS ? cur.slice(cur.length - MAX_EVENTS + 1) : cur;
          return [...next, env];
        });
        if (env.kind === "subscribe" && !env.data) terminalCountRef.current += 1;
        if (env.kind === "complete" || env.kind === "error") {
          if (env.kind === "error") setLifecycle("error");
          else if (terminalCountRef.current <= 1) setLifecycle("completed");
        }
      };

      const recordOut = (value: unknown, terminalId: string) => {
        setOutputs((cur) => {
          const next = cur.length >= MAX_EVENTS ? cur.slice(cur.length - MAX_EVENTS + 1) : cur;
          return [...next, { value, terminalId }];
        });
      };

      // For requests with a meaningful speedMs, we queue display items and
      // emit them one per speedMs so the user sees data flowing at human pace.
      const pendingEvents: Envelope[] = [];
      const pendingOutputs: Array<{ value: unknown; terminalId: string }> = [];
      let flushTimer: ReturnType<typeof setTimeout> | null = null;
      const PENDING_CAP = 200;

      const flush = () => {
        if (pendingEvents.length) {
          recordEnv(pendingEvents.shift()!);
          flushTimer = setTimeout(flush, speedMs);
        } else if (pendingOutputs.length) {
          const out = pendingOutputs.shift()!;
          recordOut(out.value, out.terminalId);
          flushTimer = setTimeout(flush, speedMs);
        } else {
          flushTimer = null;
        }
      };

      const onEnv = (env: Envelope) => {
        if (env.kind === "create") {
          setCreates((c) => [...c, env]);
        } else if (env.kind === "subscribe" && !env.data) {
          terminalCountRef.current += 1;
        }
        if (speedMs > 0) {
          // Throttled: data events queue up and flush one per speedMs.
          // The first event is flushed immediately so the timeline starts
          // at t=0; subsequent events are paced by the timer interval.
          if (
            env.kind === "next" ||
            env.kind === "complete" ||
            env.kind === "error"
          ) {
            if (pendingEvents.length >= PENDING_CAP) pendingEvents.shift();
            pendingEvents.push(env);
            if (!flushTimer) flush();
          }
        } else {
          // Realtime: record all events immediately.
          recordEnv(env);
        }
      };

      try {
        const dispose = runGraph(
          graph, onEnv,
          (value, terminalId) => {
            pendingOutputs.push({ value, terminalId });
            if (!flushTimer) flushTimer = setTimeout(flush, speedMs);
          },
          options,
        );
        disposeRef.current = () => { if (flushTimer) clearTimeout(flushTimer); dispose(); };
      } catch (err) {
        if (flushTimer) clearTimeout(flushTimer);
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        setLifecycle("error");
      }
    },
    [],
  );

  useEffect(() => () => disposeRef.current?.(), []);

  return { events, creates, outputs, lifecycle, error, run, stop, reset };
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
