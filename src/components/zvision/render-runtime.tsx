'use client';

import React from 'react';
import type { ZVisionNode } from '@/lib/zvision/types';
import { ScrollArea } from '../ui/scroll-area';
import { GlassCard } from './glass-card';
import { Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';

interface RenderRuntimeProps {
    nodes: ZVisionNode[];
}

export function RenderRuntime({ nodes }: RenderRuntimeProps) {
    const { toast } = useToast();

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
                        onClick={() => {
                            console.log(`Tapped card for node: ${node.id}`);
                            toast({
                                title: "Card Tapped",
                                description: `You tapped on "${node.data.title || 'Note'}".`,
                            });
                        }}
                    />
                );
            case 'InputDoor':
                return (
                     <div key={node.id} style={{ position: 'absolute', transform: `translate(${node.position.x}px, ${node.position.y}px)`, width: node.size.width, height: node.size.height }} className="p-2 z-10">
                        <div className="flex w-full items-center space-x-2">
                            <Input type="text" placeholder={node.data.label || 'Enter text...'} className="bg-white/20 border-white/30 placeholder:text-gray-300 text-white shadow-inner" />
                            <Button type="submit" size="icon" className="bg-white/30 hover:bg-white/40 text-white flex-shrink-0">
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )
            default:
                // We add a third card for demonstration purposes if layout is sparse
                 if (node.id === '4') { // Assuming '4' is TodayFrame
                    return (
                         <GlassCard
                            key={'extra-card-1'}
                            node={{...node, size: {width: 300, height: 200}}}
                            title="My Calendar"
                            subtitle="Events and appointments"
                            imageUrl="https://picsum.photos/seed/2/600/400"
                            imageHint="calendar abstract"
                            onClick={() => {
                                toast({
                                    title: "Card Tapped",
                                    description: `You tapped on "My Calendar".`,
                                });
                            }}
                        />
                    )
                 }
                return null;
        }
    }

    const feedNodes = nodes.filter(n => ['NotesFrame', 'TodayFrame'].includes(n.type));
    const staticNodes = nodes.filter(n => !['NotesFrame', 'TodayFrame'].includes(n.type));

    // Ensure there are at least 3 cards for a good visual demo
    if (feedNodes.length < 3) {
        const existingIds = new Set(feedNodes.map(n => n.id));
        const needed = 3 - feedNodes.length;
        for(let i=0; i<needed; i++) {
             feedNodes.push({
                id: `placeholder-${i}`,
                type: 'NotesFrame',
                position: {x: 0, y: 0},
                size: {width: 300, height: 200 + Math.random() * 50},
                data: {title: `Placeholder Card ${i+1}`}
             });
        }
    }


    return (
        <div 
            className="flex-1 flex items-center justify-center p-4"
            style={{ background: 'var(--render-bg-gradient)' }}
        >
            <div className="noise-overlay opacity-50"></div>
            <div className="w-[390px] h-[844px] bg-neutral-100 rounded-[54px] shadow-2xl overflow-hidden relative border-[14px] border-neutral-900 ring-2 ring-neutral-800">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-neutral-900 rounded-b-xl"></div>
                <div className="w-full h-full bg-neutral-800">
                     <ScrollArea className="h-full w-full rounded-[40px] overflow-hidden">
                        <div className="p-6 flex flex-col gap-4">
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
