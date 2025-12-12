'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { ZVisionNode } from '@/lib/zvision/types';
import { components as componentDefs } from '@/lib/zvision/initial-data';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';

interface LayersPanelProps {
  nodes: ZVisionNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
}

const LayerItem = ({ node, isSelected, onSelect }: { node: ZVisionNode; isSelected: boolean; onSelect: () => void }) => {
  const component = componentDefs.find(c => c.type === node.type);

  return (
    <div
      onClick={onSelect}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm cursor-pointer transition-colors",
        isSelected ? "bg-accent text-accent-foreground" : "hover:bg-muted"
      )}
    >
      {component && <component.icon className="h-4 w-4 text-muted-foreground" />}
      <span className="flex-1 truncate">{component?.name || node.type}</span>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Eye className="h-4 w-4" />
      </Button>
    </div>
  );
};

export function LayersPanel({ nodes, selectedNodeId, onSelectNode }: LayersPanelProps) {
  return (
    <aside className="w-full md:w-64 flex-shrink-0 border-r bg-card h-full">
      <div className="flex h-full flex-col">
        <div className="p-4">
          <h2 className="text-lg font-semibold tracking-tight">Layers</h2>
          <p className="text-sm text-muted-foreground">Components on the canvas</p>
        </div>
        <Separator />
        <ScrollArea className="flex-1">
          <div className="grid gap-1 p-2">
            {nodes.map((node) => (
              <LayerItem
                key={node.id}
                node={node}
                isSelected={node.id === selectedNodeId}
                onSelect={() => onSelectNode(node.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}
