'use client';

import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Bot } from 'lucide-react';
import { updateComponent } from '@/ai/flows/update-component-flow';
import type { ZVisionNode, ZVisionComponent, CapabilityPatch } from '@/lib/zvision/types';

interface ComponentVibeChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: ZVisionNode;
  component: ZVisionComponent;
  onApplyPatch: (patch: CapabilityPatch) => void;
  onDiscardPatch: (patchId: string) => void;
}

type Plan = CapabilityPatch['plan'];

export function ComponentVibeChat({ 
    open, 
    onOpenChange, 
    node, 
    component, 
    onApplyPatch,
    onDiscardPatch
}: ComponentVibeChatProps) {
  const [request, setRequest] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [draftPatch, setDraftPatch] = useState<CapabilityPatch | null>(null);

  const handleClose = () => {
    if (draftPatch) {
        onDiscardPatch(draftPatch.id);
    }
    setDraftPatch(null);
    setRequest('');
    onOpenChange(false);
  }

  const handleSubmit = async () => {
    if (!request) return;
    setIsLoading(true);
    setDraftPatch(null);
    try {
      const result = await updateComponent({
        componentType: component.type,
        componentSchema: JSON.stringify(component, null, 2),
        request: request,
      });

      const newPatch: CapabilityPatch = {
          id: `patch_${Date.now()}`,
          nodeId: node.id,
          createdAt: new Date().toISOString(),
          summary: {
            trigger: result.trigger.split(' ')[0], // e.g., onSend
            action: result.action.split(' ')[0].toLowerCase() // e.g., classify
          },
          status: 'draft',
          plan: result
      };
      setDraftPatch(newPatch);

    } catch (error) {
      console.error('Error updating component:', error);
      // You could show an error toast here
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (draftPatch) {
        onApplyPatch(draftPatch);
        setDraftPatch(null);
        setRequest('');
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="sm:max-w-xl w-full flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Component Vibe Chat
          </SheetTitle>
          <SheetDescription>
            Editing <span className="font-bold text-foreground">{component.name}</span>. Tell me what you want it to do.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 flex flex-col gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="request">Your request</Label>
            <Textarea
              id="request"
              placeholder="e.g., 'When submitted, classify the text and send to notes.'"
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              rows={3}
            />
          </div>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Thinking...' : 'Generate Plan'}
          </Button>
          
          {draftPatch && (
            <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                <h3 className="font-semibold flex items-center gap-2 mb-2"><Bot className="h-5 w-5"/> I will add:</h3>
                <div className="grid gap-2 text-sm">
                    <p><strong>Trigger:</strong> {draftPatch.plan.trigger}</p>
                    <p><strong>Action:</strong> {draftPatch.plan.action}</p>
                    <p><strong>Data:</strong> {draftPatch.plan.data}</p>
                    <p><strong>Side effects:</strong> {draftPatch.plan.sideEffects}</p>
                    <p><strong>Files touched:</strong> {draftPatch.plan.filesTouched.join(', ')}</p>
                </div>
            </div>
          )}
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleApply} disabled={!draftPatch || isLoading}>Apply Patch</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
