import { useCallback, useEffect, useMemo, useState } from "react";
import type { Node, Edge } from "@xyflow/react";

import NodeCanvas, { createNode } from "./NodeCanvas.js";
import NodePalette from "./NodePalette.js";
import NodeInspector from "./NodeInspector.js";
import SubgraphEditor from "./SubgraphEditor.js";
import EventFlowPanel from "./EventFlowPanel.js";
import RuntimeToolbar from "./RuntimeToolbar.js";
import { useEnvelopeMonitor } from "./envelope-monitor.js";
import { topoSortNodes } from "./graph-runtime.js";
import { diagnoseGraph } from "./diagnose.js";
import {
  graphFromHash,
  graphFromStorage,
  pushGraphToHash,
  saveGraphToStorage,
  shareUrl,
} from "./graph-serialization.js";
import { PRESETS } from "./examples.js";
import {
  isSubgraphable,
  type CanvasNodeData,
  type CanvasGraph,
} from "./node-catalogue.js";

export default function PlaygroundPage() {
  const [nodes, setNodes] = useState<Node<CanvasNodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [speedMs, setSpeedMs] = useState(0); // 0 = realtime
  const [shareCopied, setShareCopied] = useState(false);
  const [subgraphNodeId, setSubgraphNodeId] = useState<string | null>(null);

  const monitor = useEnvelopeMonitor();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;
  const selectedOp = selectedNode?.data.op ?? null;
  const selectedParams = selectedNode?.data.params ?? {};
  const subgraphNode = nodes.find((n) => n.id === subgraphNodeId) ?? null;

  const onSaveSubgraph = useCallback(
    (g: CanvasGraph) => {
      if (!subgraphNodeId) return;
      setNodes((cur) =>
        cur.map((n) =>
          n.id === subgraphNodeId
            ? { ...n, data: { ...n.data, subgraph: g } }
            : n,
        ),
      );
      setSubgraphNodeId(null);
    },
    [subgraphNodeId],
  );

  const onAddNode = useCallback(
    (op: string) => {
      const offset = nodes.length * 40;
      const node = createNode(op, { x: 100 + offset, y: 100 + offset });
      setNodes((cur) => [...cur, node]);
      setSelectedNodeId(node.id);
    },
    [nodes.length],
  );

  const onParamChange = useCallback(
    (name: string, value: string) => {
      if (!selectedNodeId) return;
      setNodes((cur) =>
        cur.map((n) =>
          n.id === selectedNodeId
            ? { ...n, data: { ...n.data, params: { ...n.data.params, [name]: value } } }
            : n,
        ),
      );
    },
    [selectedNodeId],
  );

  const onDelete = useCallback(() => {
    if (!selectedNodeId) return;
    setNodes((cur) => cur.filter((n) => n.id !== selectedNodeId));
    setEdges((cur) => cur.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
    setSelectedNodeId(null);
  }, [selectedNodeId]);

  const graph: CanvasGraph = {
    nodes: nodes.map((n) => ({ id: n.id, data: n.data, position: n.position })),
    edges,
  };

  const applyGraph = useCallback(
    (g: CanvasGraph) => {
      monitor.reset();
      setEdges(g.edges as Edge[]);
      setNodes(
        g.nodes.map((n) => ({
          id: n.id,
          type: "op",
          position: n.position,
          data: n.data,
        })) as Node<CanvasNodeData>[],
      );
      setSelectedNodeId(null);
      setShareCopied(false);
    },
    [monitor],
  );

  // Load a saved/shared graph on mount (URL hash wins over localStorage).
  useEffect(() => {
    const fromHash = graphFromHash();
    const g = fromHash ?? graphFromStorage();
    if (g) applyGraph(g);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload when the user navigates to a shared link (hash change).
  useEffect(() => {
    const onHash = () => {
      const g = graphFromHash();
      if (g) applyGraph(g);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [applyGraph]);

  // Auto-save the graph to localStorage and keep the hash shareable.
  // Debounced so drags/typing don't thrash storage.
  useEffect(() => {
    if (!nodes.length && !edges.length) return; // empty canvas — don't overwrite
    const timer = setTimeout(() => {
      saveGraphToStorage(graph);
      pushGraphToHash(graph);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges]);

  const onShare = useCallback(async () => {
    if (!nodes.length) return;
    const url = shareUrl(graph);
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      window.prompt("Copy share link", url);
    }
  }, [graph, nodes.length]);

  // Map each canvas node to its latest runtime value. The runtime assigns
  // Envelope nodeIds (`opName#N`) in the order the graph is constructed, which
  // matches the topological order — so `topo[i]` corresponds to `create[i]`.
  const nodeValues = useMemo(() => {
    const map: Record<string, string> = {};
    if (!nodes.length || !monitor.events.length) return map;
    const topo = topoSortNodes(graph);
    const creates = monitor.events.filter((e) => e.kind === "create");
    const latest: Record<string, string> = {};
    for (const e of monitor.events) {
      if (e.kind === "next") latest[e.nodeId] = e.data ?? "";
    }
    topo.forEach((canvasId, i) => {
      const runtimeId = creates[i]?.nodeId;
      if (runtimeId && latest[runtimeId] !== undefined) {
        map[canvasId] = latest[runtimeId];
      }
    });
    return map;
  }, [nodes, graph, monitor.events]);

  // Full output history per canvas node (all `next` values in sequence order).
  // Derived from monitor.events, so it is cleared automatically on every run.
  const nodeHistory = useMemo(() => {
    const map: Record<string, string[]> = {};
    if (!nodes.length || !monitor.events.length) return map;
    const topo = topoSortNodes(graph);
    const creates = monitor.events.filter((e) => e.kind === "create");
    topo.forEach((canvasId, i) => {
      const runtimeId = creates[i]?.nodeId;
      if (!runtimeId) return;
      const values: string[] = [];
      for (const e of monitor.events) {
        if (e.nodeId === runtimeId && e.kind === "next") {
          values.push(e.data ?? "");
        }
      }
      if (values.length) map[canvasId] = values;
    });
    return map;
  }, [nodes, graph, monitor.events]);

  const onRun = useCallback(() => {
    monitor.run(graph, { speedMs });
  }, [graph, monitor, speedMs]);

  const onPreset = useCallback(
    (presetId: string) => {
      const preset = PRESETS.find((p) => p.id === presetId);
      if (!preset) return;
      monitor.reset();
      setEdges(preset.graph.edges as Edge[]);
      setNodes(
        preset.graph.nodes.map((n) => ({
          id: n.id,
          type: "op",
          position: n.position,
          data: n.data,
        })) as Node<CanvasNodeData>[],
      );
      setSelectedNodeId(null);
    },
    [monitor],
  );

  const hasTerminal = nodes.some((n) => n.data.op === "subscribe");
  const canRun = nodes.length > 0 && hasTerminal;

  // Static capability diagnostics (run errors surface before clicking Run).
  const diagnostics = useMemo(() => diagnoseGraph(graph), [graph]);

  return (
    <section className="pg-layout" aria-labelledby="playground-title">
      <h1 id="playground-title" className="pg-title">
        fastrx Playground
      </h1>
      <RuntimeToolbar
        lifecycle={monitor.lifecycle}
        error={monitor.error}
        canRun={canRun}
        onRun={onRun}
        onStop={monitor.stop}
        onReset={monitor.reset}
        onPreset={onPreset}
        presets={PRESETS}
        speedMs={speedMs}
        onSpeedChange={setSpeedMs}
        onShare={onShare}
        shareCopied={shareCopied}
        canShare={nodes.length > 0}
      />
      {diagnostics.length > 0 && (
        <div className="pg-diagnostics" role="status" aria-label="Diagnostics">
          <ul className="pg-diagnostics-list">
            {diagnostics.map((d, i) => (
              <li
                key={i}
                className={`pg-diagnostic pg-diagnostic-${d.severity}`}
              >
                <span className="pg-diagnostic-code">{d.code}</span>
                <span className="pg-diagnostic-msg">{d.message}</span>
                {d.nodeId && (
                  <code className="pg-diagnostic-node">{d.nodeId}</code>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="pg-workspace">
        <NodePalette onAddNode={onAddNode} />
        <NodeCanvas
          nodes={nodes}
          edges={edges}
          setNodes={setNodes}
          setEdges={setEdges}
          onSelectNode={setSelectedNodeId}
          nodeValues={nodeValues}
          running={monitor.lifecycle === "running"}
        />
        <NodeInspector
          nodeId={selectedNodeId}
          op={selectedOp}
          params={selectedParams}
          onParamChange={onParamChange}
          onDelete={onDelete}
          history={selectedNodeId ? nodeHistory[selectedNodeId] : undefined}
          onEditSubgraph={
            selectedNodeId && selectedOp && isSubgraphable(selectedOp)
              ? () => setSubgraphNodeId(selectedNodeId)
              : undefined
          }
        />
      </div>
      <EventFlowPanel
        events={monitor.events}
        lifecycle={monitor.lifecycle}
      />
      {subgraphNode && (
        <SubgraphEditor
          initialGraph={subgraphNode.data.subgraph}
          onSave={onSaveSubgraph}
          onClose={() => setSubgraphNodeId(null)}
        />
      )}
    </section>
  );
}
