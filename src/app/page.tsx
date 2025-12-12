'use client';

import React, { useState, useCallback, useRef, DragEvent } from 'react';
import { ComponentLibrary } from '@/components/zvision/component-library';
import { GraphCanvas } from '@/components/zvision/graph-canvas';
import { DesignerCanvas } from '@/components/zvision/designer-canvas';
import { LayersPanel } from '@/components/zvision/layers-panel';
import { InspectorPanel } from '@/components/zvision/inspector-panel';
import { AppHeader } from '@/components/zvision/header';
import { ComponentVibeChat } from '@/components/zvision/component-vibe-chat';
import { initialNodes, initialEdges, components as componentDefs } from '@/lib/zvision/initial-data';
import type { ZVisionNode, ZVisionEdge, ZVisionComponent, CapabilityPatch } from '@/lib/zvision/types';

type Selection = {
  id: string | null;
  type: 'node' | 'edge' | null;
};

type ViewMode = 'designer' | 'developer';

export default function ZVisionStudioPage() {
  const [nodes, setNodes] = useState<ZVisionNode[]>(initialNodes);
  const [edges, setEdges] = useState<ZVisionEdge[]>(initialEdges);
  const [patches, setPatches] = useState<CapabilityPatch[]>([]);
  const [selection, setSelection] = useState<Selection>({ id: '1', type: 'node' });
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [mode, setMode] = useState<ViewMode>('designer');

  const [chatNode, setChatNode] = useState<ZVisionNode | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

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

  const handleNodeLongPress = (nodeId: string) => {
    const nodeToChat = nodes.find(n => n.id === nodeId);
    if (nodeToChat) {
      setChatNode(nodeToChat);
      setIsChatOpen(true);
    }
  };

  const addNode = useCallback((componentType: string, position: { x: number; y: number }) => {
    const component = componentDefs.find(c => c.type === componentType);
    if (!component) return;

    const newNode: ZVisionNode = {
      id: `node_${Date.now()}`,
      type: componentType,
      position,
      data: Object.fromEntries(component.props.map(p => [p.name, p.defaultValue])),
      // Add default size for designer mode
      size: { width: 200, height: 80 }
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
      x: event.clientX - reactFlowBounds.left - 75,
      y: event.clientY - reactFlowBounds.top - 20,
    };
    
    addNode(type, position);
  }, [addNode]);

  const updateNode = useCallback((nodeId: string, data: Partial<ZVisionNode>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, ...data }
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

  const handleApplyPatch = (patch: CapabilityPatch) => {
    setPatches(prevPatches => {
      const otherPatches = prevPatches.filter(p => p.nodeId !== patch.nodeId || p.status !== 'applied');
      return [...otherPatches, { ...patch, status: 'applied' }];
    });
    setIsChatOpen(false);
  };
  
  const handleDiscardPatch = (patchId: string) => {
    setPatches(prevPatches => prevPatches.filter(p => p.id !== patchId));
  };


  const selectedNode = selection.type === 'node' ? nodes.find(n => n.id === selection.id) : undefined;
  const selectedEdge = selection.type === 'edge' ? edges.find(e => e.id === selection.id) : undefined;
  const selectedComponent = selectedNode ? componentDefs.find(c => c.type === selectedNode.type) : null;
  const chatComponent = chatNode ? componentDefs.find(c => c.type === chatNode.type) : null;
  const nodePatches = (nodeId: string) => patches.filter(p => p.nodeId === nodeId && p.status === 'applied');

  return (
    <div className="flex flex-col h-screen bg-muted/40 text-foreground">
      <AppHeader
        mode={mode}
        onModeChange={setMode}
        onTogglePreview={() => setIsPanelVisible(!isPanelVisible)}
      />
      <div className="flex flex-1 overflow-hidden">
        {mode === 'developer' && <ComponentLibrary components={componentDefs} />}
        {mode === 'designer' && <LayersPanel nodes={nodes} selectedNodeId={selection.id} onSelectNode={handleSelectNode} />}

        <main className="flex-1 flex flex-col relative overflow-hidden">
          {mode === 'developer' && (
            <GraphCanvas
              ref={graphCanvasRef}
              nodes={nodes}
              edges={edges}
              patches={patches}
              onNodeClick={handleSelectNode}
              onEdgeClick={handleSelectEdge}
              onCanvasClick={handleCanvasClick}
              updateNodePosition={(id, pos) => updateNode(id, { position: pos })}
              onDrop={onNodeDrop}
              onNodeLongPress={handleNodeLongPress}
              selectedItemId={selection.id}
              selectedItemType={selection.type}
            />
          )}
          {mode === 'designer' && (
            <DesignerCanvas
              nodes={nodes}
              onNodeSelect={handleSelectNode}
              onCanvasClick={handleCanvasClick}
              onUpdateNode={updateNode}
              onNodeLongPress={handleNodeLongPress}
              selectedNodeId={selection.id}
            />
          )}

          {isPanelVisible && mode === 'developer' && <PreviewPanel edges={edges} selection={selection} />}
        </main>
        
        <InspectorPanel
          key={`${selection.type}:${selection.id ?? 'none'}`}
          mode={mode}
          node={selectedNode}
          edge={selectedEdge}
          component={selectedComponent as ZVisionComponent}
          onUpdateNode={updateNode}
          onUpdateEdge={updateEdge}
        />
      </div>
      {chatNode && chatComponent && (
        <ComponentVibeChat
          open={isChatOpen}
          onOpenChange={setIsChatOpen}
          node={chatNode}
          component={chatComponent}
          onApplyPatch={handleApplyPatch}
          onDiscardPatch={handleDiscardPatch}
        />
      )}
    </div>
  );
}
