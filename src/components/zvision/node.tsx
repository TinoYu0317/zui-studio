'use client';

import React, { useRef, MouseEvent as ReactMouseEvent } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ZVisionNode as NodeType, CapabilityPatch } from '@/lib/zvision/types';
import { components as componentDefs } from '@/lib/zvision/initial-data';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { ArrowRight } from 'lucide-react';

interface ZVisionNodeProps {
  node: NodeType;
  patches: CapabilityPatch[];
  onClick: (id: string) => void;
  onLongPress: (id: string) => void;
  updatePosition: (id: string, pos: { x: number, y: number }) => void;
  isSelected: boolean;
}

const Port = ({ type, name }: { type: 'in' | 'out', name: string }) => (
  <div className="flex items-center gap-2 h-6 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
    {type === 'in' && <div className="h-2.5 w-2.5 rounded-full bg-border group-hover:bg-primary transition-colors" />}
    <span className="flex-1 truncate" title={name}>{name}</span>
    {type === 'out' && <div className="h-2.5 w-2.5 rounded-full bg-border group-hover:bg-primary transition-colors" />}
  </div>
);

export function ZVisionNode({ node, patches, onClick, onLongPress, updatePosition, isSelected }: ZVisionNodeProps) {
  const dragRef = useRef({ dx: 0, dy: 0 });
  const longPressTimeout = useRef<NodeJS.Timeout>();
  const component = componentDefs.find(c => c.type === node.type);
  if (!component) return null;

  const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
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
      updatePosition(node.id, newPosition);
    };

    const handleMouseUp = () => {
      if (longPressTimeout.current) {
        clearTimeout(longPressTimeout.current);
        onClick(node.id); // It's a click
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const inputs = [...(component.actions || []), ...(component.bindings || [])];
  const outputs = component.events || [];

  return (
    <div
      className={cn(
        "absolute w-[200px] shadow-lg hover:shadow-xl transition-all duration-200 select-none",
        isSelected ? "z-10" : ""
      )}
      style={{ left: node.position.x, top: node.position.y }}
      onMouseDown={handleMouseDown}
      onClick={(e) => e.stopPropagation()}
    >
      <Card
        className={cn(
            "border-2",
            isSelected ? "border-primary shadow-primary/20" : "border-transparent"
        )}
      >
        <CardHeader className="p-3 cursor-grab">
            <div className="flex items-center gap-2">
            <component.icon className="h-5 w-5 text-primary" />
            <CardTitle className="text-base truncate">{component.name}</CardTitle>
            </div>
        </CardHeader>
        <Separator />
        <div className="p-2 grid grid-cols-2 gap-2 group">
            <div className="flex flex-col gap-1 text-left">
            {inputs.map(input => <Port key={input.name} type="in" name={input.name} />)}
            </div>
            <div className="flex flex-col gap-1 text-right">
            {outputs.map(output => <Port key={output.name} type="out" name={output.name} />)}
            </div>
        </div>
      </Card>
      {patches.length > 0 && (
        <div className="mt-1 flex flex-col items-center gap-1">
            {patches.map(patch => (
                <Badge key={patch.id} variant="secondary" className="flex items-center gap-1.5 text-xs font-normal">
                    <span>{patch.summary.trigger}</span>
                    <ArrowRight className="h-3 w-3" />
                    <span>{patch.summary.action}</span>
                </Badge>
            ))}
        </div>
      )}
    </div>
  );
}
