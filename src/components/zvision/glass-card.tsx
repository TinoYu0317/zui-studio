'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { ZVisionNode } from '@/lib/zvision/types';

interface GlassCardProps {
    node: ZVisionNode;
    title: string;
    subtitle: string;
    imageUrl: string;
    imageHint: string;
    onClick: () => void;
    className?: string;
}

export function GlassCard({ node, title, subtitle, imageUrl, imageHint, onClick, className }: GlassCardProps) {
    const cardStyle: React.CSSProperties = {
        position: 'relative',
        height: `${node.size.height}px`,
        width: '100%',
        backgroundColor: 'var(--glass-bg)',
        backdropFilter: `blur(var(--glass-blur))`,
        WebkitBackdropFilter: `blur(var(--glass-blur))`,
        border: '1px solid var(--glass-border-color)',
        borderRadius: 'var(--glass-corner-radius)',
        boxShadow: `0 8px 32px 0 var(--glass-shadow-color)`,
    };

    return (
        <div
            style={cardStyle}
            className={cn('overflow-hidden cursor-pointer group', className)}
            onClick={onClick}
        >
            <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            
            <div className="absolute top-0 left-0 w-full h-full p-5 flex flex-col justify-end">
                <h3 className="text-xl font-bold text-glass-title-color drop-shadow-md">{title}</h3>
                <p className="text-sm text-glass-subtitle-color drop-shadow-sm">{subtitle}</p>
            </div>
            
            {/* Specular highlight */}
            <div 
                className="absolute top-0 left-0 w-full h-full rounded-[var(--glass-corner-radius)] pointer-events-none"
                style={{
                    border: '1.5px solid transparent',
                    background: 'linear-gradient(to bottom right, var(--glass-highlight-color), transparent, transparent) border-box',
                    WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                }}
            />
        </div>
    );
}
