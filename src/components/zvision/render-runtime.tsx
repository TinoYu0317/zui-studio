'use client';

import React from 'react';
import type { ZVisionNode } from '@/lib/zvision/types';
import { ScrollArea } from '../ui/scroll-area';
import { GlassCard } from './glass-card';
import { Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface RenderRuntimeProps {
    nodes: ZVisionNode[];
}

const renderNode = (node: ZVisionNode) => {
    switch (node.type) {
        case 'NotesFrame': // Re-using NotesFrame as a GlassCard
            return (
                <GlassCard
                    key={node.id}
                    node={node}
                    title={node.data.title || 'Note'}
                    subtitle="Tap to see details"
                    imageUrl="https://picsum.photos/seed/1/600/400"
                    imageHint="abstract texture"
                    onClick={() => console.log(`Tapped card for node: ${node.id}`)}
                />
            );
        case 'InputDoor':
            return (
                 <div key={node.id} style={{ position: 'absolute', transform: `translate(${node.position.x}px, ${node.position.y}px)`, width: node.size.width, height: node.size.height }} className="p-2">
                    <div className="flex w-full items-center space-x-2">
                        <Input type="text" placeholder={node.data.label || 'Enter text...'} className="bg-white/10 border-white/20 placeholder:text-gray-400 text-white" />
                        <Button type="submit" size="icon" className="bg-white/20 hover:bg-white/30 text-white">
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )
        default:
            return null;
    }
}

export function RenderRuntime({ nodes }: RenderRuntimeProps) {
    const feedNodes = nodes.filter(n => ['NotesFrame'].includes(n.type));
    const staticNodes = nodes.filter(n => !['NotesFrame'].includes(n.type));


    return (
        <div 
            className="flex-1 bg-muted/20 flex items-center justify-center p-4"
        >
            <div className="w-[414px] h-[736px] rounded-2xl shadow-2xl overflow-hidden relative border-4 border-black bg-cover bg-center" style={{ backgroundImage: 'var(--render-bg-gradient)' }}>
                <div className="noise-overlay"></div>
                <div className="w-full h-full relative">
                    <ScrollArea className="h-full w-full">
                        <div className="p-4 flex flex-col gap-4">
                           {feedNodes.map(renderNode)}
                        </div>
                    </ScrollArea>
                    
                    {/* Render static nodes on top */}
                    {staticNodes.map(renderNode)}
                </div>
            </div>
        </div>
    );
}
