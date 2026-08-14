import { useCallback, useEffect, useRef, useState } from "react";
import type { BackendReply, Envelope, PanelCommand } from "fastrx";

const MAX_EVENTS = 1000;

function isEnvelope(msg: unknown): msg is Envelope {
  return (
    typeof msg === "object" &&
    msg !== null &&
    typeof (msg as Envelope).kind === "string" &&
    typeof (msg as Envelope).nodeId === "string"
  );
}

function isBackendReply(msg: unknown): msg is BackendReply {
  return (
    typeof msg === "object" &&
    msg !== null &&
    ((msg as BackendReply).type === "inspect-result" ||
      (msg as BackendReply).type === "breakpoint-ack")
  );
}

export function usePanelPort(paused: boolean) {
  const [events, setEvents] = useState<Envelope[]>([]);
  const [connected, setConnected] = useState(false);
  const [inspectResult, setInspectResult] = useState<Extract<
    BackendReply,
    { type: "inspect-result" }
  > | null>(null);
  const [breakpointOn, setBreakpointOn] = useState(false);
  const portRef = useRef<ChromePort | null>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    if (typeof chrome === "undefined" || !chrome.runtime || !chrome.devtools) {
      return;
    }

    let cancelled = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      if (cancelled) return;
      const port = chrome.runtime!.connect({
        name: "fastrx-panel:" + chrome.devtools!.inspectedWindow.tabId,
      });
      portRef.current = port;
      setConnected(true);

      port.onDisconnect.addListener(() => {
        portRef.current = null;
        setConnected(false);
        setEvents([]);
        setInspectResult(null);
        if (!cancelled) reconnectTimer = setTimeout(connect, 1000);
      });

      port.onMessage.addListener((msg) => {
        if (isBackendReply(msg)) {
          if (msg.type === "inspect-result") setInspectResult(msg);
          else setBreakpointOn(msg.on);
          return;
        }
        if (!isEnvelope(msg) || pausedRef.current) return;
        setEvents((cur) => {
          const next = cur.length >= MAX_EVENTS ? cur.slice(cur.length - MAX_EVENTS + 1) : cur;
          return [...next, msg];
        });
      });
    };

    connect();
    return () => {
      cancelled = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      portRef.current = null;
    };
  }, []);

  const postCommand = useCallback((cmd: PanelCommand) => {
    portRef.current?.postMessage(cmd);
  }, []);

  const clear = useCallback(() => {
    setEvents([]);
    setInspectResult(null);
  }, []);

  return { events, connected, inspectResult, breakpointOn, postCommand, clear };
}
