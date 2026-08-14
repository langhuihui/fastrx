import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Handle,
  Position,
  MarkerType,
  useNodes,
  useStore,
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
  SUBGRAPH_INPUT_ID,
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
  /** When false, the graph is inspect-only (no connect / delete). */
  readonly editable?: boolean;
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
  // Reserved subgraph input source ("x" from the outer stream).
  if (data.op === SUBGRAPH_INPUT_ID) {
    return (
      <div
        className="pg-node pg-node-input"
        data-selected={selected ? "" : undefined}
      >
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: "#72f5bd", width: "10px", height: "10px" }}
          isConnectable
        />
        <div className="pg-node-header" style={{ background: "#72f5bd" }}>
          <code>input x</code>
        </div>
        <div className="pg-node-params">outer value</div>
      </div>
    );
  }
  const spec = lookupSpec(data.op);
  const category = (spec?.category ?? data.category) as NodeCategory;
  const color = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.operator;
  const running = data.running === true;
  const value = typeof data.value === "string" ? data.value : undefined;
  const inputs = spec ? spec.inputs : category === "source" ? 0 : 1;
  const outputs = spec ? spec.outputs : category === "terminal" ? 0 : 1;
  const title =
    data.label ??
    (data.op === "custom" && data.params.name ? data.params.name : data.op);
  const paramSummary = spec?.params.length
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
      {inputs > 0 && (
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: color, width: "10px", height: "10px" }}
          isConnectable
        />
      )}
      <div className="pg-node-header" style={{ background: color }}>
        <code>{title}</code>
      </div>
      <div className="pg-node-params">{paramSummary}</div>
      <div className="pg-node-live" key={value ?? "none"}>
        {value !== undefined ? (
          <span className="pg-node-live-value">{value}</span>
        ) : (
          <span className="pg-node-live-empty">waiting…</span>
        )}
      </div>
      {outputs > 0 && (
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

/** MiniMap that auto-hides when all nodes fit within the current viewport. */
function AutoMiniMap() {
  const flowNodes = useNodes();
  const transform = useStore((s) => s.transform);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = document.querySelector(".pg-canvas .react-flow");
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const show = useMemo(() => {
    if (flowNodes.length === 0) return false;
    if (size.width === 0) return true; // haven't measured container yet
    const [tx, ty, zoom] = transform;
    const vpMinX = -tx / zoom;
    const vpMinY = -ty / zoom;
    const vpMaxX = (-tx + size.width) / zoom;
    const vpMaxY = (-ty + size.height) / zoom;
    for (const node of flowNodes) {
      const nw = node.measured?.width ?? 150;
      const nh = node.measured?.height ?? 60;
      if (
        node.position.x + nw < vpMinX ||
        node.position.x > vpMaxX ||
        node.position.y + nh < vpMinY ||
        node.position.y > vpMaxY
      ) {
        return true;
      }
    }
    return false;
  }, [flowNodes, transform, size]);

  if (!show) return null;
  return (
    <MiniMap
      nodeColor={(n) =>
        (n.data as { category?: string }).category === "source"
          ? "#3dd68c"
          : "#5e9cff"
      }
      nodeStrokeWidth={2}
      maskColor="rgba(0, 0, 0, 0.6)"
    />
  );
}

export default function NodeCanvas({
  nodes,
  edges,
  setNodes,
  setEdges,
  onSelectNode,
  nodeValues = {},
  running = false,
  editable = true,
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
        onConnect={editable ? onConnect : undefined}
        isValidConnection={editable ? isValidConnection : undefined}
        nodesConnectable={editable}
        edgesReconnectable={editable}
        deleteKeyCode={editable ? "Backspace" : null}
        defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#aaa" gap={20} size={1} />
        <Controls showInteractive={false} />
        <AutoMiniMap />
      </ReactFlow>
    </div>
  );
}

export { CATALOGUE };
