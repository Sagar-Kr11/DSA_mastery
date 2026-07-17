import { useMemo } from "react";
import ReactFlow, { Background, Controls, MarkerType, Position, type Edge, type Node } from "reactflow";
import dagre from "dagre";
import type { FlowStep } from "@/data/topics";

const NODE_W = 240;
const NODE_H = 64;

function layout(steps: FlowStep[]): { nodes: Node[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "TB", nodesep: 32, ranksep: 48 });
  g.setDefaultEdgeLabel(() => ({}));

  steps.forEach((s) => g.setNode(s.id, { width: NODE_W, height: NODE_H }));
  const edges: Edge[] = [];
  steps.forEach((s) => {
    (s.next ?? []).forEach((n) => {
      g.setEdge(s.id, n);
      edges.push({
        id: `${s.id}->${n}`,
        source: s.id,
        target: n,
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed, color: "oklch(0.78 0.16 200)" },
        animated: true,
      });
    });
  });

  dagre.layout(g);

  const nodes: Node[] = steps.map((s) => {
    const pos = g.node(s.id);
    return {
      id: s.id,
      position: { x: pos.x - NODE_W / 2, y: pos.y - NODE_H / 2 },
      data: { label: s.label },
      style: {
        width: NODE_W,
        minHeight: NODE_H,
        background: "linear-gradient(180deg, oklch(0.24 0.03 265 / 0.85), oklch(0.19 0.03 265 / 0.85))",
        border: "1px solid oklch(1 0 0 / 0.1)",
        color: "oklch(0.97 0.005 250)",
        fontSize: 13,
        padding: "10px 14px",
        borderRadius: 12,
        boxShadow: "0 0 32px -12px oklch(0.78 0.16 200 / 0.4)",
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    };
  });

  return { nodes, edges };
}

export function PatternFlow({ steps }: { steps: FlowStep[] }) {
  const { nodes, edges } = useMemo(() => layout(steps), [steps]);
  return (
    <div className="h-[420px] w-full overflow-hidden rounded-xl border border-white/10 bg-black/20">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag
        zoomOnScroll={false}
      >
        <Background gap={20} size={1} color="oklch(1 0 0 / 0.06)" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
