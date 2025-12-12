'use client';

import React, { useRef, MouseEvent as ReactMouseEvent } from 'react';
import type { ZVisionNode } from '@/lib/zvision/types';
import { components as componentDefs } from '@/lib/zvision/initial-data';
import { ResizableBox } from './resizable-box';


interface DesignerCanvasProps {
    nodes: ZVisionNode[];
    selectedNodeId: string | null;
    onNodeSelect: (id: string) => void;
    onCanvasClick: () => void;
    onUpdateNode: (id: string, data: Partial<ZVisionNode>) => void;
    onNodeLongPress: (id: string) => void;
}

const DraggableComponent = ({ node, isSelected, onSelect, onUpdate, onLongPress }: {
    node: ZVisionNode;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onUpdate: (id: string, data: Partial<ZVisionNode>) => void;
    onLongPress: (id: string) => void;
}) => {
    const componentDef = componentDefs.find(c => c.type === node.type);
    const dragRef = useRef({ dx: 0, dy: 0 });
    const longPressTimeout = useRef<NodeJS.Timeout>();

    const handleMouseDown = (e: ReactMouseEvent) => {
        e.stopPropagation();
        
        longPressTimeout.current = setTimeout(() => {
            onLongPress(node.id);
            longPressTimeout.current = undefined; // Prevent click after long press
        }, 500);

        dragRef.current = {
            dx: e.clientX - node.position.x,
            dy: e.clientY - node.position.y,
        };

        const handleMouseMove = (me: MouseEvent) => {
            if (longPressTimeout.current) {
                clearTimeout(longPressTimeout.current);
                longPressTimeout.current = undefined;
            }
            const newPosition = {
                x: me.clientX - dragRef.current.dx,
                y: me.clientY - dragRef.current.dy,
            };
            onUpdate(node.id, { position: newPosition });
        };

        const handleMouseUp = () => {
            if (longPressTimeout.current) {
                clearTimeout(longPressTimeout.current);
                onSelect(node.id); // It's a click
            }
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleResize = (size: { width: number, height: number }) => {
        onUpdate(node.id, { size });
    };

    if (!componentDef) {
        return <div className="p-2 border border-destructive bg-destructive/20 text-destructive-foreground text-xs">Unknown component: {node.type}</div>;
    }

    // A mock renderer for components. In a real app, this would be more sophisticated.
    const renderComponent = () => {
        const { data } = node;
        const style: React.CSSProperties = {
            width: '100%',
            height: '100%',
            backgroundColor: data.fill,
            borderRadius: `${data.radius || 0}px`,
            opacity: data.opacity,
            border: data.strokeWidth ? `${data.strokeWidth || 1}px solid ${data.stroke || '#000'}` : 'none'
        };

        if (data.glass) {
            style.backgroundColor = 'var(--glass-bg)';
            style.backdropFilter = 'blur(var(--glass-blur))';
            style.WebkitBackdropFilter = 'blur(var(--glass-blur))';
            style.border = '1px solid var(--glass-border-color)';
            style.boxShadow = '0 8px 32px 0 var(--glass-shadow-color)';
        }

        switch(node.type) {
            case 'ShapeRectangle':
                return <div style={style}></div>
            case 'ShapeText':
                return (
                    <div style={{color: data.color, fontSize: `${data.fontSize || 16}px`, fontWeight: data.fontWeight || 'normal'}}>
                        {data.text || 'Text'}
                    </div>
                )
            default:
                return (
                    <div className="flex items-center justify-center w-full h-full p-2 border rounded-md bg-muted text-muted-foreground text-xs">
                        <componentDef.icon className="h-4 w-4 mr-2" />
                        <span>{componentDef.name}</span>
                    </div>
                )
        }
    };

    return (
        <ResizableBox
            position={node.position}
            size={node.size}
            isSelected={isSelected}
            onMouseDown={handleMouseDown}
            onClick={() => onSelect(node.id)}
            onResize={handleResize}
        >
            <div className="w-full h-full overflow-hidden pointer-events-none">
                {renderComponent()}
            </div>
        </ResizableBox>
    );
};

export function DesignerCanvas({ nodes, selectedNodeId, onNodeSelect, onCanvasClick, onUpdateNode, onNodeLongPress }: DesignerCanvasProps) {
    return (
        <div 
            className="flex-1 bg-muted/20 flex items-center justify-center overflow-auto"
            onClick={onCanvasClick}
        >
            <div className="w-[414px] h-[736px] bg-background rounded-2xl shadow-2xl overflow-hidden relative border-4 border-foreground flex-shrink-0 my-8">
                <div className="w-full h-full relative">
                    {nodes.map(node => (
                        <DraggableComponent
                            key={node.id}
                            node={node}
                            isSelected={node.id === selectedNodeId}
                            onSelect={onNodeSelect}
                            onUpdate={onUpdateNode}
                            onLongPress={onNodeLongPress}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
