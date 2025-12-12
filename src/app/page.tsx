'use client';

import React, { useState, useCallback, useRef, DragEvent } from 'react';
import { ComponentLibrary } from '@/components/zvision/component-library';
import { DesignerCanvas } from '@/components/zvision/designer-canvas';
import { LayersPanel } from '@/components/zvision/layers-panel';
import { InspectorPanel } from '@/components/zvision/inspector-panel';
import { AppHeader } from '@/components/zvision/header';
import { ComponentVibeChat } from '@/components/zvision/component-vibe-chat';
import { RenderRuntime } from '@/components/zvision/render-runtime';
import { initialNodes, initialEdges, components as componentDefs } from '@/lib/zvision/initial-data';
import type { ZVisionNode, ZVisionEdge, ZVisionComponent, CapabilityPatch } from '@/lib/zvision/types';
import { Toolbar } from '@/components/zvision/toolbar';

type Selection = {
  id: string | null;
  type: 'node' | 'edge' | null;
};

type ViewMode = 'designer' | 'developer';

export default function ZVisionStudioPage() {
  const [nodes, setNodes] = useState<ZVisionNode[]>(initialNodes);
  const [edges, setEdges] = useState<ZVisionEdge[]>(initialEdges);
  const [patches, setPatches] = useState<CapabilityPatch[]>([]);
  const [selection, setSelection] = useState<Selection>({ id: '3', type: 'node' });
  const [mode, setMode] = useState<ViewMode>('designer');
  const [isPreviewing, setIsPreviewing] = useState(false);

  const [chatNode, setChatNode] = useState<ZVisionNode | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const graphCanvasRef = useRef<HTMLDivElement>(null);

  const handleSelect = (id: string | null, type: 'node' | 'edge' | null) => {
    setSelection({ id, type });
  };

  const handleNodeLongPress = (nodeId: string) => {
    const nodeToChat = nodes.find(n => n.id === nodeId);
    if (nodeToChat) {
      setChatNode(nodeToChat);
      setIsChatOpen(true);
    }
  };

  const addNode = useCallback((componentType: string, position?: { x: number; y: number }) => {
    const component = componentDefs.find(c => c.type === componentType);
    if (!component) return;

    const newNode: ZVisionNode = {
      id: `node_${Date.now()}`,
      type: componentType,
      position: position || { x: 100, y: 100 },
      data: Object.fromEntries(component.props.map(p => [p.name, p.defaultValue])),
      size: { width: component.defaultSize?.width || 200, height: component.defaultSize?.height || 80 }
    };
    setNodes((nds) => nds.concat(newNode));
    handleSelect(newNode.id, 'node');
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
          ? { ...node, ...data, data: data.data ? {...node.data, ...data.data} : node.data }
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

  return (
    <div className="flex flex-col h-screen bg-muted/40 text-foreground">
      <AppHeader
        mode={mode}
        onModeChange={setMode}
        isPreviewing={isPreviewing}
        onToggleIsPreviewing={() => setIsPreviewing(!isPreviewing)}
      />
      <div className="flex flex-1 overflow-hidden">
        {mode === 'developer' && <ComponentLibrary components={componentDefs} />}
        {mode === 'designer' && <LayersPanel nodes={nodes} selectedNodeId={selection.id} onSelectNode={(id) => handleSelect(id, 'node')} />}

        <main className="flex-1 flex flex-col relative overflow-hidden">
          {mode === 'developer' && (
            <GraphCanvas
              ref={graphCanvasRef}
              nodes={nodes}
              edges={edges}
              patches={patches}
              onNodeClick={(id) => handleSelect(id, 'node')}
              onEdgeClick={(id) => handleSelect(id, 'edge')}
              onCanvasClick={() => handleSelect(null, null)}
              updateNodePosition={(id, pos) => updateNode(id, { position: pos })}
              onDrop={onNodeDrop}
              onNodeLongPress={handleNodeLongPress}
              selectedItemId={selection.id}
              selectedItemType={selection.type}
            />
          )}
          {mode === 'designer' && !isPreviewing && (
            <>
              <Toolbar onAddShape={addNode} />
              <DesignerCanvas
                nodes={nodes}
                onNodeSelect={(id) => handleSelect(id, 'node')}
                onCanvasClick={() => handleSelect(null, null)}
                onUpdateNode={updateNode}
                onNodeLongPress={handleNodeLongPress}
                selectedNodeId={selection.id}
              />
            </>
          )}
           {mode === 'designer' && isPreviewing && (
            <RenderRuntime nodes={nodes} />
          )}
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
