import { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Handle,
  Position,
  MarkerType,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  CATALOGUE,
  CATEGORY_COLORS,
  defaultParams,
  lookupSpec,
  type CanvasNodeData,
  type NodeCategory,
} from "./node-catalogue.js";

interface NodeCanvasProps {
  readonly nodes: Node<CanvasNodeData>[];
  readonly edges: Edge[];
  readonly setNodes: React.Dispatch<React.SetStateAction<Node<CanvasNodeData>[]>>;
  readonly setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  readonly onSelectNode: (id: string | null) => void;
  /** canvas nodeId → latest runtime value string (for live node display). */
  readonly nodeValues?: Record<string, string>;
  /** true while the pipeline is running (nodes get a breathing pulse). */
  readonly running?: boolean;
}

let nodeIdCounter = 1;
function nextId(): string {
  return `n${nodeIdCounter++}`;
}

export function createNode(
  op: string,
  position: { x: number; y: number }
): Node<CanvasNodeData> {
  const spec = lookupSpec(op);
  if (!spec) throw new Error(`Unknown operator: ${op}`);
  return {
    id: nextId(),
    type: "op",
    position,
    data: {
      op,
      category: spec.category,
      params: defaultParams(spec),
    },
  };
}

function OpNode({ id, data, selected }: NodeProps<Node<CanvasNodeData>>) {
  const spec = lookupSpec(data.op);
  if (!spec) return null;
  const color = CATEGORY_COLORS[spec.category as NodeCategory];
  const running = data.running === true;
  const value = typeof data.value === "string" ? data.value : undefined;
  const paramSummary = spec.params.length
    ? spec.params.map((p) => `${p.name}=${data.params[p.name] ?? p.default}`).join(" ")
    : "—";
  return (
    <div
      className={`pg-node${running ? " pg-node-running" : ""}${
        value !== undefined ? " pg-node-has-value" : ""
      }`}
      style={{ borderColor: color }}
      data-selected={selected ? "" : undefined}
    >
      {spec.inputs > 0 && (
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: color, width: "10px", height: "10px" }}
          isConnectable
        />
      )}
      <div className="pg-node-header" style={{ background: color }}>
        <code>{data.op}</code>
      </div>
      <div className="pg-node-params">{paramSummary}</div>
      <div className="pg-node-live" key={value ?? "none"}>
        {value !== undefined ? (
          <span className="pg-node-live-value">{value}</span>
        ) : (
          <span className="pg-node-live-empty">waiting…</span>
        )}
      </div>
      {spec.outputs > 0 && (
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: color, width: "10px", height: "10px" }}
          isConnectable
        />
      )}
    </div>
  );
}

const NODE_TYPES = { op: OpNode as unknown as typeof OpNode };

const DEFAULT_EDGE_OPTIONS = {
  type: "smoothstep",
  animated: true,
  markerEnd: { type: MarkerType.ArrowClosed, color: "#72f5bd" },
  style: { stroke: "#72f5bd", strokeWidth: 2 },
};

export default function NodeCanvas({
  nodes,
  edges,
  setNodes,
  setEdges,
  onSelectNode,
  nodeValues = {},
  running = false,
}: NodeCanvasProps) {
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((cur) => applyNodeChanges(changes, cur) as Node<CanvasNodeData>[]);
      for (const c of changes) {
        if (c.type === "select") {
          onSelectNode(c.selected ? c.id : null);
        }
      }
    },
    [setNodes, onSelectNode]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((cur) => applyEdgeChanges(changes, cur) as Edge[]);
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((cur) =>
        addEdge(
          { ...connection, id: `e${nextId()}`, ...DEFAULT_EDGE_OPTIONS },
          cur,
        ) as Edge[],
      );
    },
    [setEdges]
  );

  const isValidConnection = useCallback(
    (conn: Connection | Edge) => {
      // Reject self-loops and duplicate source→target connections. React Flow's
      // Loose mode would otherwise allow both, producing invalid pipeline graphs.
      if (!conn.source || !conn.target || conn.source === conn.target) return false;
      if (edges.some((e) => e.source === conn.source && e.target === conn.target)) {
        return false;
      }
      return true;
    },
    [edges]
  );

  return (
    <div className="pg-canvas" role="region" aria-label="Pipeline canvas">
      <ReactFlow
        nodes={nodes.map((n) => ({
          ...n,
          data: {
            ...n.data,
            running,
            value: nodeValues[n.id],
          },
        }))}
        edges={edges}
        nodeTypes={NODE_TYPES}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#aaa" gap={20} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

export { CATALOGUE };
