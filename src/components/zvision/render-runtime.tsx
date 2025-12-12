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
        const { data, size, position, type, id } = node;
        const style: React.CSSProperties = {
            position: 'absolute',
            transform: `translate(${position.x}px, ${position.y}px)`,
            width: `${size.width}px`,
            height: `${size.height}px`,
        };

        const glassStyle: React.CSSProperties = data.glass ? {
            backgroundColor: 'var(--glass-bg)',
            backdropFilter: 'blur(var(--glass-blur))',
            WebkitBackdropFilter: 'blur(var(--glass-blur))',
            border: '1.5px solid var(--glass-border-color)',
            boxShadow: '0 8px 32px 0 var(--glass-shadow-color)',
            borderRadius: `${data.radius || 0}px`,
        } : {};

        switch (type) {
            case 'ShapeRectangle':
                return (
                    <div key={id} style={{
                        ...style,
                        ...glassStyle,
                        backgroundColor: data.fill,
                        borderRadius: `${data.radius || 0}px`,
                        opacity: data.opacity,
                    }}></div>
                );

            case 'ShapeText':
                 return (
                    <div key={id} style={{
                        ...style,
                        color: data.color, 
                        fontSize: `${data.fontSize || 16}px`, 
                        fontWeight: data.fontWeight || 'normal'
                    }}>
                        {data.text || 'Text'}
                    </div>
                );

            case 'NotesFrame':
                return (
                    <GlassCard
                        key={id}
                        node={node}
                        title={data.title || 'Note'}
                        subtitle="Tap to see details"
                        imageUrl="https://picsum.photos/seed/1/600/400"
                        imageHint="abstract texture"
                        onClick={() => {
                            toast({
                                title: "Card Tapped",
                                description: `You tapped on "${data.title || 'Note'}".`,
                            });
                        }}
                    />
                );
            case 'InputDoor':
                return (
                     <div key={id} style={style} className="p-2 z-10">
                        <div className="flex w-full items-center space-x-2">
                            <Input type="text" placeholder={data.label || 'Enter text...'} className="bg-white/20 border-white/30 placeholder:text-gray-300 text-white shadow-inner" />
                            <Button type="submit" size="icon" className="bg-white/30 hover:bg-white/40 text-white flex-shrink-0">
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                );
            
            case 'TodayFrame': // Render as a GlassCard for demo
                return (
                    <GlassCard
                        key={id}
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
                );
            default:
                return null;
        }
    }

    const feedNodes = nodes.filter(n => ['NotesFrame', 'TodayFrame'].includes(n.type));
    const staticNodes = nodes.filter(n => !['NotesFrame', 'TodayFrame'].includes(n.type));

    return (
        <div 
            className="flex-1 flex items-center justify-center p-4"
            style={{ background: 'var(--render-bg-gradient)' }}
        >
            <div className="noise-overlay opacity-50"></div>
            <div className="w-[390px] h-[844px] bg-neutral-100 rounded-[54px] shadow-2xl overflow-hidden relative border-[14px] border-neutral-900 ring-2 ring-neutral-800">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-neutral-900 rounded-b-xl"></div>
                <div className="w-full h-full bg-neutral-800 relative">
                     <ScrollArea className="h-full w-full rounded-[40px] overflow-hidden">
                        <div className="p-6 flex flex-col gap-4">
                           {feedNodes.map(renderNode)}
                        </div>
                    </ScrollArea>
                    
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        {staticNodes.map(renderNode)}
                    </div>
                </div>
            </div>
        </div>
    );
}
