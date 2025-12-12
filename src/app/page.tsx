'use client';

import React, { useState, useCallback, useRef, DragEvent } from 'react';
import { ComponentLibrary } from '@/components/zvision/component-library';
import { GraphCanvas } from '@/components/zvision/graph-canvas';
import { InspectorPanel } from '@/components/zvision/inspector-panel';
import { PreviewPanel } from '@/components/zvision/preview-panel';
import { AppHeader } from '@/components/zvision/header';
import { initialNodes, initialEdges, components as componentDefs } from '@/lib/zvision/initial-data';
import type { ZVisionNode, ZVisionEdge, ZVisionComponent } from '@/lib/zvision/types';

export default function ZVisionStudioPage() {
  const [nodes, setNodes] = useState<ZVisionNode[]>(initialNodes);
  const [edges, setEdges] = useState<ZVisionEdge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('1');
  const [isPanelVisible, setIsPanelVisible] = useState(true);

  const graphCanvasRef = useRef<HTMLDivElement>(null);

  const addNode = useCallback((componentType: string, position: { x: number; y: number }) => {
    const component = componentDefs.find(c => c.type === componentType);
    if (!component) return;

    const newNode: ZVisionNode = {
      id: `node_${Date.now()}`,
      type: componentType,
      position,
      data: Object.fromEntries(component.props.map(p => [p.name, p.defaultValue])),
    };
    setNodes((nds) => nds.concat(newNode));
  }, []);

  const onNodeDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    if (!graphCanvasRef.current) return;

    const reactFlowBounds = graphCanvasRef.current.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/zvision-node');

    if (typeof type === 'undefined' || !type) {
      return;
    }

    const position = {
      x: event.clientX - reactFlowBounds.left - 75, // Adjust for node width
      y: event.clientY - reactFlowBounds.top - 20, // Adjust for node height
    };
    
    addNode(type, position);
  }, [addNode]);

  const updateNodePosition = useCallback((nodeId: string, newPosition: { x: number, y: number }) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, position: newPosition }
          : node
      )
    );
  }, []);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const selectedComponent = selectedNode ? componentDefs.find(c => c.type === selectedNode.type) : null;

  return (
    <div className="flex flex-col h-screen bg-muted/40 text-foreground">
      <AppHeader onTogglePreview={() => setIsPanelVisible(!isPanelVisible)} />
      <div className="flex flex-1 overflow-hidden">
        <ComponentLibrary components={componentDefs} />
        <main className="flex-1 flex flex-col relative overflow-hidden">
          <GraphCanvas
            ref={graphCanvasRef}
            nodes={nodes}
            edges={edges}
            onNodeClick={setSelectedNodeId}
            onCanvasClick={() => setSelectedNodeId(null)}
            updateNodePosition={updateNodePosition}
            onDrop={onNodeDrop}
            selectedNodeId={selectedNodeId}
          />
          {isPanelVisible && <PreviewPanel />}
        </main>
        <InspectorPanel
          key={selectedNodeId}
          node={selectedNode}
          component={selectedComponent as ZVisionComponent}
        />
      </div>
    </div>
  );
}
