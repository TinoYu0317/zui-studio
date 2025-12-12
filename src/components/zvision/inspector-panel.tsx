'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Code, Settings, Workflow, Link } from 'lucide-react';
import type { ZVisionNode, ZVisionEdge, ZVisionComponent, ZVisionNodeProperty } from '@/lib/zvision/types';

interface InspectorPanelProps {
  node?: ZVisionNode;
  edge?: ZVisionEdge;
  component?: ZVisionComponent;
  onUpdateEdge?: (edgeId: string, newMapping: Partial<ZVisionEdge>) => void;
}

const PropertyItem = ({ prop, value }: { prop: ZVisionNodeProperty; value: any }) => (
  <div className="grid gap-2">
    <Label htmlFor={`prop-${prop.name}`}>{prop.name}</Label>
    <Input id={`prop-${prop.name}`} defaultValue={value} type={prop.type === 'number' ? 'number' : 'text'} />
    {prop.description && <p className="text-xs text-muted-foreground">{prop.description}</p>}
  </div>
);


const NodeInspector = ({ node, component }: { node: ZVisionNode; component: ZVisionComponent; }) => (
  <>
    <CardHeader className="p-0">
      <CardTitle className="flex items-center gap-2">
        <component.icon className="h-6 w-6 text-primary" />
        {component.name}
      </CardTitle>
      <CardDescription>{node.type} (ID: {node.id})</CardDescription>
    </CardHeader>
  
    <Tabs defaultValue="props" className="mt-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="props"><Settings className="mr-1 h-4 w-4" />Props</TabsTrigger>
        <TabsTrigger value="data"><Code className="mr-1 h-4 w-4" />Data</TabsTrigger>
        <TabsTrigger value="flow"><Workflow className="mr-1 h-4 w-4" />Flow</TabsTrigger>
      </TabsList>
      <TabsContent value="props" className="mt-4 grid gap-4">
        <h3 className="font-semibold">Properties</h3>
        {component.props.length > 0 ? (
          component.props.map((prop) => (
            <PropertyItem key={prop.name} prop={prop} value={node.data[prop.name]} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No properties to configure.</p>
        )}
      </TabsContent>
      <TabsContent value="data" className="mt-4 grid gap-4">
          <h3 className="font-semibold">Current Data</h3>
          <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto">
              {JSON.stringify(node.data, null, 2)}
          </pre>
      </TabsContent>
      <TabsContent value="flow" className="mt-4 grid gap-4">
          <h3 className="font-semibold">Inputs (Actions/Bindings)</h3>
          {[...(component.actions || []), ...(component.bindings || [])].length > 0 ? (
              [...(component.actions || []), ...(component.bindings || [])].map(input => (
                  <div key={input.name} className="text-sm">
                      <p className="font-medium">{input.name}</p>
                      <p className="text-xs text-muted-foreground">{input.description}</p>
                  </div>
              ))
          ) : <p className="text-sm text-muted-foreground">No inputs.</p>}
          <Separator />
          <h3 className="font-semibold">Outputs (Events)</h3>
          {(component.events || []).length > 0 ? (
              component.events.map(event => (
                  <div key={event.name} className="text-sm">
                      <p className="font-medium">{event.name}</p>
                      <p className="text-xs text-muted-foreground">{event.description}</p>
                  </div>
              ))
          ) : <p className="text-sm text-muted-foreground">No outputs.</p>}
      </TabsContent>
    </Tabs>
  </>
);

const EdgeInspector = ({ edge, onUpdateEdge }: { edge: ZVisionEdge; onUpdateEdge?: (edgeId: string, newMapping: Partial<ZVisionEdge>) => void; }) => {
    const [mappingJson, setMappingJson] = useState(JSON.stringify(edge.mapping || {}, null, 2));
    const [error, setError] = useState<string | null>(null);

    const handleApply = () => {
        try {
            const newMapping = JSON.parse(mappingJson);
            setError(null);
            onUpdateEdge?.(edge.id, { mapping: newMapping });
        } catch (e) {
            setError('Invalid JSON format.');
        }
    };
    
    return (
    <>
      <CardHeader className="p-0">
        <CardTitle className="flex items-center gap-2">
          <Link className="h-6 w-6 text-primary" />
          Edge
        </CardTitle>
        <CardDescription>
          {edge.sourceHandle} → {edge.targetHandle} (ID: {edge.id})
        </CardDescription>
      </CardHeader>
      <div className="mt-4 grid gap-4">
        <h3 className="font-semibold">Edge Mapping</h3>
         <div className="grid gap-2">
            <Label htmlFor="edge-mapping-editor">JSON Mapping</Label>
            <Textarea
                id="edge-mapping-editor"
                value={mappingJson}
                onChange={(e) => setMappingJson(e.target.value)}
                rows={8}
                className="font-mono text-xs"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={handleApply} size="sm">Apply</Button>
        </div>
      </div>
    </>
  );
}

export function InspectorPanel({ node, edge, component, onUpdateEdge }: InspectorPanelProps) {
    const hasSelection = node || edge;

    return (
        <aside className="w-80 flex-shrink-0 border-l bg-card">
        <ScrollArea className="h-full">
            <div className="p-4">
            {!hasSelection ? (
                <div className="flex h-full items-center justify-center pt-20">
                <div className="text-center">
                    <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Inspector</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Select a node or edge to see its properties.</p>
                </div>
                </div>
            ) : (
                <>
                {node && component && <NodeInspector node={node} component={component} />}
                {edge && <EdgeInspector edge={edge} onUpdateEdge={onUpdateEdge} />}
                </>
            )}
            </div>
        </ScrollArea>
        </aside>
    );
}
