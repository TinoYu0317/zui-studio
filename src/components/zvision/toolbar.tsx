'use client';

import { Square, Type, Image as ImageIcon, RectangleHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ToolbarProps {
  onAddShape: (shapeType: string) => void;
}

const tools = [
    { type: 'ShapeRectangle', icon: Square, label: 'Rectangle' },
    { type: 'ShapeText', icon: Type, label: 'Text' },
    // { type: 'ShapeImage', icon: ImageIcon, label: 'Image' },
    // { type: 'ShapeFrame', icon: RectangleHorizontal, label: 'Frame' },
];

export function Toolbar({ onAddShape }: ToolbarProps) {
  return (
    <div className="absolute top-4 left-4 z-10 bg-card p-2 rounded-lg border shadow-lg">
      <TooltipProvider>
        <div className="flex flex-col gap-2">
          {tools.map(tool => (
            <Tooltip key={tool.type}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => onAddShape(tool.type)}>
                  <tool.icon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}
