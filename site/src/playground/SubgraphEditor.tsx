import { useCallback, useState } from "react";
import type { Node, Edge } from "@xyflow/react";

import NodeCanvas, { createNode } from "./NodeCanvas.js";
import NodePalette from "./NodePalette.js";
import NodeInspector from "./NodeInspector.js";
import { SUBGRAPH_INPUT_ID, type CanvasGraph, type CanvasNodeData } from "./node-catalogue.js";

interface SubgraphEditorProps {
  readonly initialGraph: CanvasGraph | undefined;
  readonly onSave: (graph: CanvasGraph) => void;
  readonly onClose: () => void;
}

function makeInputNode(): Node<CanvasNodeData> {
  return {
    id: SUBGRAPH_INPUT_ID,
    type: "op",
    position: { x: 40, y: 120 },
    data: { op: SUBGRAPH_INPUT_ID, category: "source", params: {} },
  };
}

/** One-level inner-stream editor for *Map operators. */
export default function SubgraphEditor({
  initialGraph,
  onSave,
  onClose,
}: SubgraphEditorProps) {
  const [nodes, setNodes] = useState<Node<CanvasNodeData>[]>(() => {
    if (initialGraph && initialGraph.nodes.length) {
      return initialGraph.nodes.map((n) => ({
        id: n.id,
        type: "op",
        position: n.position,
        data: n.data,
      })) as Node<CanvasNodeData>[];
    }
    // Fresh subgraph: seed with the reserved input source.
    return [makeInputNode()];
  });
  const [edges, setEdges] = useState<Edge[]>(() =>
    (initialGraph?.edges ?? []).map((e) => ({ ...e })),
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onAddNode = useCallback((op: string) => {
    const offset = Math.floor(Math.random() * 120);
    const node = createNode(op, { x: 240 + offset, y: 80 + offset });
    setNodes((cur) => [...cur, node]);
    setSelectedNodeId(node.id);
  }, []);

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

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;

  const graph: CanvasGraph = {
    nodes: nodes.map((n) => ({ id: n.id, data: n.data, position: n.position })),
    edges,
  };

  return (
    <div className="pg-subgraph-backdrop" role="dialog" aria-modal="true" aria-label="Edit inner stream">
      <div className="pg-subgraph">
        <header className="pg-subgraph-header">
          <h2 className="pg-subgraph-title">Edit inner stream</h2>
          <p className="pg-subgraph-hint">
            Build the stream fed by the outer value <code>x</code> — start from{" "}
            <code>input x</code>, add operators, connect them.
          </p>
        </header>
        <div className="pg-subgraph-body">
          <NodePalette onAddNode={onAddNode} />
          <NodeCanvas
            nodes={nodes}
            edges={edges}
            setNodes={setNodes}
            setEdges={setEdges}
            onSelectNode={setSelectedNodeId}
          />
          <NodeInspector
            nodeId={selectedNodeId}
            op={selectedNode?.data.op ?? null}
            params={selectedNode?.data.params ?? {}}
            onParamChange={onParamChange}
            onDelete={() => {
              if (!selectedNodeId) return;
              setNodes((cur) => cur.filter((n) => n.id !== selectedNodeId));
              setEdges((cur) =>
                cur.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId),
              );
              setSelectedNodeId(null);
            }}
          />
        </div>
        <footer className="pg-subgraph-footer">
          <button type="button" className="pg-toolbar-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="pg-toolbar-btn pg-toolbar-btn-primary"
            onClick={() => onSave(graph)}
          >
            Save
          </button>
        </footer>
      </div>
    </div>
  );
}
