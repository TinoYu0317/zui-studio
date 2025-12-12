'use client';

import React, { useState, useCallback, useRef, DragEvent } from 'react';
import { ComponentLibrary } from '@/components/zvision/component-library';
import { GraphCanvas } from '@/components/zvision/graph-canvas';
import { InspectorPanel } from '@/components/zvision/inspector-panel';
import { PreviewPanel } from '@/components/zvision/preview-panel';
import { AppHeader } from '@/components/zvision/header';
import { initialNodes, initialEdges, components as componentDefs } from '@/lib/zvision/initial-data';
import type { ZVisionNode, ZVisionEdge, ZVisionComponent } from '@/lib/zvision/types';

type Selection = {
  id: string | null;
  type: 'node' | 'edge' | null;
};

export default function ZVisionStudioPage() {
  const [nodes, setNodes] = useState<ZVisionNode[]>(initialNodes);
  const [edges, setEdges] = useState<ZVisionEdge[]>(initialEdges);
  const [selection, setSelection] = useState<Selection>({ id: '1', type: 'node' });
  const [isPanelVisible, setIsPanelVisible] = useState(true);

  const graphCanvasRef = useRef<HTMLDivElement>(null);

  const handleSelectNode = (nodeId: string) => {
    setSelection({ id: nodeId, type: 'node' });
  };
  
  const handleSelectEdge = (edgeId: string) => {
    setSelection({ id: edgeId, type: 'edge' });
  };
  
  const handleCanvasClick = () => {
    setSelection({ id: null, type: null });
  };

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

  const updateEdge = useCallback((edgeId: string, newEdgeData: Partial<ZVisionEdge>) => {
    setEdges((eds) => 
      eds.map((edge) => 
        edge.id === edgeId ? { ...edge, ...newEdgeData } : edge
      )
    );
  }, []);

  const selectedNode = selection.type === 'node' ? nodes.find(n => n.id === selection.id) : undefined;
  const selectedEdge = selection.type === 'edge' ? edges.find(e => e.id === selection.id) : undefined;
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
            onNodeClick={handleSelectNode}
            onEdgeClick={handleSelectEdge}
            onCanvasClick={handleCanvasClick}
            updateNodePosition={updateNodePosition}
            onDrop={onNodeDrop}
            selectedItemId={selection.id}
            selectedItemType={selection.type}
          />
          {isPanelVisible && <PreviewPanel edges={edges} selection={selection} />}
        </main>
        <InspectorPanel
          key={`${selection.type}:${selection.id ?? 'none'}`}
          node={selectedNode}
          edge={selectedEdge}
          component={selectedComponent as ZVisionComponent}
          onUpdateEdge={updateEdge}
        />
      </div>
    </div>
  );
}
