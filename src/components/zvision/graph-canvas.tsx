'use client';

import React, { forwardRef, DragEvent } from 'react';
import { cn } from '@/lib/utils';
import type { ZVisionNode as NodeType, ZVisionEdge as EdgeType } from '@/lib/zvision/types';
import { ZVisionNode } from './node';
import { components as componentDefs } from '@/lib/zvision/initial-data';

interface GraphCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  nodes: NodeType[];
  edges: EdgeType[];
  onNodeClick: (id: string) => void;
  onCanvasClick: () => void;
  updateNodePosition: (id: string, pos: { x: number, y: number }) => void;
  onDrop: (event: DragEvent) => void;
  selectedNodeId: string | null;
}

const NODE_WIDTH = 200;
const NODE_DEFAULT_HEIGHT = 80;

const getPortOffset = (node: NodeType, handle: string): { x: number, y: number } | null => {
  const component = componentDefs.find(c => c.type === node.type);
  if (!component) return null;

  const events = component.events || [];
  const actions = component.actions || [];
  const bindings = component.bindings || [];

  const eventIndex = events.findIndex(e => e.name === handle);
  if (eventIndex !== -1) {
    const yOffset = 60 + eventIndex * 24;
    return { x: NODE_WIDTH, y: yOffset };
  }

  const allInputs = [...actions, ...bindings];
  const inputIndex = allInputs.findIndex(i => i.name === handle);
  if (inputIndex !== -1) {
    const yOffset = 60 + inputIndex * 24;
    return { x: 0, y: yOffset };
  }
  
  // fallback for router dynamic outputs
  if(node.type === 'Router' && handle.startsWith('to')){
     const yOffset = 60 + 1 * 24;
     return { x: NODE_WIDTH, y: yOffset };
  }

  // Fallback for empty targetHandle
  if (handle === '') {
    const yOffset = NODE_DEFAULT_HEIGHT / 2;
    return { x: 0, y: yOffset };
  }


  return null;
}


export const GraphCanvas = forwardRef<HTMLDivElement, GraphCanvasProps>(
  ({ nodes, edges, onNodeClick, onCanvasClick, updateNodePosition, onDrop, selectedNodeId, className, ...props }, ref) => {
    
    const onDragOver = (event: DragEvent) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    };

    return (
      <div
        ref={ref}
        className={cn("relative flex-1 bg-background", className)}
        onClick={onCanvasClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        {...props}
      >
        <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        {nodes.map((node) => (
          <ZVisionNode
            key={node.id}
            node={node}
            onClick={onNodeClick}
            updatePosition={updateNodePosition}
            isSelected={node.id === selectedNodeId}
          />
        ))}

        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--primary))" />
            </marker>
          </defs>
          {edges.map((edge) => {
            const sourceNode = nodes.find((n) => n.id === edge.source);
            const targetNode = nodes.find((n) => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            const sourcePort = getPortOffset(sourceNode, edge.sourceHandle);
            const targetPort = getPortOffset(targetNode, edge.targetHandle);
            
            if(!sourcePort || !targetPort) return null;

            const x1 = sourceNode.position.x + sourcePort.x;
            const y1 = sourceNode.position.y + sourcePort.y;
            const x2 = targetNode.position.x + targetPort.x;
            const y2 = targetNode.position.y + targetPort.y;

            const dx = x2 - x1;
            const dy = y2 - y1;

            const path = `M ${x1} ${y1} C ${x1 + dx * 0.5} ${y1}, ${x1 + dx * 0.5} ${y2}, ${x2} ${y2}`;

            return (
              <g key={edge.id}>
                <path
                  d={path}
                  stroke="hsl(var(--primary) / 0.5)"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d={path}
                  stroke="transparent"
                  strokeWidth="10"
                  fill="none"
                  className="cursor-pointer"
                />
              </g>
            );
          })}
        </svg>
      </div>
    );
  }
);

GraphCanvas.displayName = 'GraphCanvas';
