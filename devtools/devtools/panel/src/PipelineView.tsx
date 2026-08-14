import { useEffect, useMemo, useState } from "react";
import type { Edge, Node } from "@xyflow/react";

import NodeCanvas from "../../../../site/src/playground/NodeCanvas.js";
import type { CanvasNodeData } from "../../../../site/src/playground/node-catalogue.js";

import { flowFromGraph, type FlowLayout, type PipelineGraph } from "./pipeline-graph.js";

interface PipelineViewProps {
  readonly graph: PipelineGraph;
  readonly selectedNodeId: string | null;
  readonly onSelectNode: (nodeId: string) => void;
  readonly running?: boolean;
}

function topologyKey(layout: FlowLayout): string {
  return (
    layout.nodes.map((n) => n.id).join(",") +
    "|" +
    layout.edges.map((e) => e.id).join(",")
  );
}

function toRfNodes(
  layout: FlowLayout,
  selectedNodeId: string | null,
): Node<CanvasNodeData>[] {
  return layout.nodes.map((n) => ({
    ...n,
    selected: n.id === selectedNodeId,
  })) as Node<CanvasNodeData>[];
}

export default function PipelineView({
  graph,
  selectedNodeId,
  onSelectNode,
  running = false,
}: PipelineViewProps) {
  const layout = useMemo(() => flowFromGraph(graph), [graph]);
  const key = topologyKey(layout);

  if (graph.roots.length === 0 && graph.nodes.size === 0) {
    return (
      <p className="pg-monitor-empty">
        Waiting for a page that imports fastrx. Open a tab, then subscribe to a stream.
      </p>
    );
  }

  return (
    <PipelineCanvas
      key={key}
      layout={layout}
      selectedNodeId={selectedNodeId}
      onSelectNode={onSelectNode}
      running={running}
    />
  );
}

function PipelineCanvas({
  layout,
  selectedNodeId,
  onSelectNode,
  running,
}: {
  layout: FlowLayout;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  running: boolean;
}) {
  const [nodes, setNodes] = useState(() => toRfNodes(layout, selectedNodeId));
  const [edges, setEdges] = useState<Edge[]>(() => layout.edges as Edge[]);

  useEffect(() => {
    setNodes((cur) =>
      cur.map((n) => ({ ...n, selected: n.id === selectedNodeId })),
    );
  }, [selectedNodeId]);

  return (
    <NodeCanvas
      nodes={nodes}
      edges={edges}
      setNodes={setNodes}
      setEdges={setEdges}
      onSelectNode={(id) => {
        if (id) onSelectNode(id);
      }}
      nodeValues={layout.values}
      running={running}
      editable={false}
    />
  );
}
