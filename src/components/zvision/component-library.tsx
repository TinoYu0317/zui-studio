'use client';

import React from 'react';
import { Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { ZVisionComponent } from '@/lib/zvision/types';

interface ComponentLibraryProps {
  components: ZVisionComponent[];
}

const DraggableComponent = ({ component }: { component: ZVisionComponent }) => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/zvision-node', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={(event) => onDragStart(event, component.type)}
      className="cursor-grab rounded-lg border bg-card p-3 text-sm shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <component.icon className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium">{component.name}</span>
      </div>
    </div>
  );
};

export function ComponentLibrary({ components }: ComponentLibraryProps) {
  return (
    <aside className="w-64 flex-shrink-0 border-r bg-card">
      <div className="flex h-full flex-col">
        <div className="p-4">
          <h2 className="text-lg font-semibold tracking-tight">Components</h2>
          <p className="text-sm text-muted-foreground">Drag and drop onto the canvas</p>
        </div>
        <Separator />
        <ScrollArea className="flex-1">
          <div className="grid gap-3 p-4">
            {components.map((component) => (
              <DraggableComponent key={component.type} component={component} />
            ))}
          </div>
        </ScrollArea>
        <Separator />
        <div className="p-4">
          <Button variant="outline" className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            Import GLB
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Upload a *.glb file and a manifest.json to create a new component.
          </p>
        </div>
      </div>
    </aside>
  );
}
