'use client';

import React, { useState, useEffect } from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Code, Settings, Workflow, Link, Ruler, Wind } from 'lucide-react';
import type { ZVisionNode, ZVisionEdge, ZVisionComponent } from '@/lib/zvision/types';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';

type ViewMode = 'designer' | 'developer';

interface InspectorPanelProps {
  mode: ViewMode;
  node?: ZVisionNode;
  edge?: ZVisionEdge;
  component?: ZVisionComponent;
  onUpdateNode?: (nodeId: string, data: Partial<ZVisionNode>) => void;
  onUpdateEdge?: (edgeId: string, newMapping: Partial<ZVisionEdge>) => void;
}

const DebouncedInput = ({ value, onChange, ...props }: React.ComponentProps<typeof Input> & { value: any, onChange: (value: any) => void }) => {
    const [internalValue, setInternalValue] = useState(value);
  
    useEffect(() => {
      setInternalValue(value);
    }, [value]);
  
    useEffect(() => {
      const handler = setTimeout(() => {
        if (value !== internalValue) {
          onChange(internalValue);
        }
      }, 500);
      return () => clearTimeout(handler);
    }, [internalValue, onChange, value]);
  
    return <Input value={internalValue} onChange={(e) => setInternalValue(e.target.value)} {...props} />;
};


const ShapeInspector = ({ node, onUpdateNode }: { node: ZVisionNode, onUpdateNode?: InspectorPanelProps['onUpdateNode']}) => {
    
    const updateNodeData = (newData: Record<string, any>) => {
        onUpdateNode?.(node.id, { data: { ...node.data, ...newData } });
    }

    return (
        <div className="grid gap-4">
            <h3 className="font-semibold">Transform</h3>
            <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-1">
                    <Label htmlFor="pos-x">X</Label>
                    <DebouncedInput type="number" value={Math.round(node.position.x)} onChange={v => onUpdateNode?.(node.id, { position: {...node.position, x: Number(v)} })} />
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="pos-y">Y</Label>
                    <DebouncedInput type="number" value={Math.round(node.position.y)} onChange={v => onUpdateNode?.(node.id, { position: {...node.position, y: Number(v)} })} />
                </div>
            </div>
             <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-1">
                    <Label htmlFor="size-w">W</Label>
                    <DebouncedInput type="number" value={Math.round(node.size.width)} onChange={v => onUpdateNode?.(node.id, { size: {...node.size, width: Number(v)} })} />
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="size-h">H</Label>
                    <DebouncedInput type="number" value={Math.round(node.size.height)} onChange={v => onUpdateNode?.(node.id, { size: {...node.size, height: Number(v)} })} />
                </div>
            </div>
            
            <Separator />

            {node.type === 'ShapeText' && (
                <>
                    <h3 className="font-semibold">Text</h3>
                    <div className="grid gap-2">
                        <Label htmlFor="text-content">Content</Label>
                        <Textarea id="text-content" value={node.data.text} onChange={e => updateNodeData({ text: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                         <div className="grid gap-1">
                            <Label htmlFor="text-size">Size</Label>
                            <Input id="text-size" type="number" value={node.data.fontSize} onChange={e => updateNodeData({ fontSize: Number(e.target.value) })} />
                        </div>
                         <div className="grid gap-1">
                            <Label htmlFor="text-color">Color</Label>
                            <Input id="text-color" type="color" value={node.data.color} onChange={e => updateNodeData({ color: e.target.value })} className="p-1 h-10" />
                        </div>
                    </div>
                    <Separator />
                </>
            )}

            {node.type === 'ShapeRectangle' && (
                 <>
                    <h3 className="font-semibold">Appearance</h3>
                     <div className="grid gap-2">
                        <Label htmlFor="fill-color">Fill</Label>
                        <Input id="fill-color" type="color" value={node.data.fill} onChange={e => updateNodeData({ fill: e.target.value })} className="p-1 h-10" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Opacity</Label>
                        <Slider value={[node.data.opacity ?? 1]} onValueChange={([v]) => updateNodeData({ opacity: v })} max={1} step={0.01} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Radius</Label>
                        <Slider value={[node.data.radius ?? 0]} onValueChange={([v]) => updateNodeData({ radius: v })} max={100} step={1} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <Label htmlFor="glass-toggle" className="flex items-center gap-2"><Wind className="w-4 h-4" /> Glass Effect</Label>
                        <Switch id="glass-toggle" checked={!!node.data.glass} onCheckedChange={checked => updateNodeData({ glass: checked })} />
                    </div>
                 </>
            )}
            
        </div>
      );
}


const DeveloperNodeInspector = ({ node, component, onUpdateNode }: { node: ZVisionNode; component: ZVisionComponent; onUpdateNode?: InspectorPanelProps['onUpdateNode'] }) => (
  <>
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
             <div className="grid gap-2" key={prop.name}>
                <Label htmlFor={`prop-${prop.name}`}>{prop.name}</Label>
                <DebouncedInput id={`prop-${prop.name}`} value={node.data[prop.name]} onChange={(val) => onUpdateNode?.(node.id, { data: { ...node.data, [prop.name]: val }})} />
                {prop.description && <p className="text-xs text-muted-foreground">{prop.description}</p>}
            </div>
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

const isShape = (type: string) => type.startsWith('Shape');

export function InspectorPanel({ mode, node, edge, component, onUpdateNode, onUpdateEdge }: InspectorPanelProps) {
    const hasSelection = node || edge;

    return (
        <aside className="w-full md:w-80 flex-shrink-0 border-l bg-card h-full">
        <ScrollArea className="h-full">
            <div className="p-4">
            {!hasSelection ? (
                <div className="flex h-full items-center justify-center pt-20">
                <div className="text-center">
                    <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Inspector</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Select an item to see its properties.</p>
                </div>
                </div>
            ) : (
                <>
                {node && component && (
                    <>
                        <CardHeader className="p-0">
                            <CardTitle className="flex items-center gap-2">
                                <component.icon className="h-5 w-5 text-primary" />
                                {component.name}
                            </CardTitle>
                            <CardDescription>{node.type} (ID: {node.id})</CardDescription>
                        </CardHeader>
                        <Separator className="my-4" />

                        {mode === 'designer' && (isShape(component.type) 
                            ? <ShapeInspector node={node} onUpdateNode={onUpdateNode} />
                            : <p className="text-sm text-muted-foreground">Visual properties for components are not editable yet.</p>
                        )}
                        {mode === 'developer' && <DeveloperNodeInspector node={node} component={component} onUpdateNode={onUpdateNode} />}
                    </>
                )}
                {edge && mode === 'developer' && <EdgeInspector edge={edge} onUpdateEdge={onUpdateEdge} />}
                </>
            )}
            </div>
        </ScrollArea>
        </aside>
    );
}
