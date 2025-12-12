'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Terminal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

export function PreviewPanel() {
  const [height, setHeight] = useState(256);
  const isResizing = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const startResizing = useCallback(() => {
    isResizing.current = true;
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
  }, []);

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing.current) {
      const newHeight = window.innerHeight - mouseMoveEvent.clientY;
      if (newHeight >= 100 && newHeight <= window.innerHeight * 0.8) {
        setHeight(newHeight);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div
      ref={panelRef}
      className="flex flex-col flex-shrink-0 bg-card border-t"
      style={{ height: `${height}px` }}
    >
      <div
        className="w-full h-2 cursor-row-resize bg-muted hover:bg-primary/20 transition-colors"
        onMouseDown={startResizing}
      ></div>
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Preview & Simulation</h3>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <pre className="text-sm text-muted-foreground">
          <code>&gt; Simulation started...</code><br/>
          <code>&gt; Node 'InputDoor' (1) sent: "Show me my notes for today"</code><br/>
          <code>&gt; Node 'Router' (2) received data. Routing to 'toNotes'.</code><br/>
          <code>&gt; Node 'NotesFrame' (3) received binding update...</code><br/>
          <code className="text-foreground">&gt; Simulating results... Please wait.</code>
        </pre>
      </ScrollArea>
    </div>
  );
}
