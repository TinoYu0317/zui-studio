'use client';

import React, { MouseEvent as ReactMouseEvent, PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

type Position = { x: number; y: number };
type Size = { width: number; height: number };

interface ResizableBoxProps extends PropsWithChildren {
    position: Position;
    size: Size;
    isSelected: boolean;
    onMouseDown: (e: ReactMouseEvent) => void;
    onClick: (e: ReactMouseEvent) => void;
    onResize: (size: Size) => void;
}

export const ResizableBox = ({ 
    children, 
    position, 
    size, 
    isSelected, 
    onMouseDown, 
    onClick,
    onResize
}: ResizableBoxProps) => {

    const handleResize = (e: ReactMouseEvent, corner: 'br' | 'bl' | 'tr' | 'tl') => {
        e.stopPropagation();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = size.width;
        const startHeight = size.height;
        const startLeft = position.x;
        const startTop = position.y;

        const doDrag = (moveEvent: MouseEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;

            let newWidth = startWidth;
            let newHeight = startHeight;
            let newX = startLeft;
            let newY = startTop;

            if (corner.includes('r')) newWidth = startWidth + dx;
            if (corner.includes('l')) {
                newWidth = startWidth - dx;
                newX = startLeft + dx;
            }
            if (corner.includes('b')) newHeight = startHeight + dy;
            if (corner.includes('t')) {
                newHeight = startHeight - dy;
                newY = startTop + dy;
            }
            
            if (newWidth > 20) onResize({ width: newWidth, height: size.height });
            if (newHeight > 20) onResize({ width: size.width, height: newHeight });
        };

        const stopDrag = () => {
            document.removeEventListener('mousemove', doDrag, false);
            document.removeEventListener('mouseup', stopDrag, false);
        };

        document.addEventListener('mousemove', doDrag, false);
        document.addEventListener('mouseup', stopDrag, false);
    };

    return (
        <div
            style={{ 
                transform: `translate(${position.x}px, ${position.y}px)`,
                width: `${size.width}px`,
                height: `${size.height}px`,
            }}
            className={cn(
                "absolute group",
                isSelected && "z-10"
            )}
            onMouseDown={onMouseDown}
            onClick={(e) => {
                e.stopPropagation();
                onClick(e);
            }}
        >
            <div className={cn(
                "w-full h-full outline outline-2 outline-transparent group-hover:outline-blue-500 transition-all",
                 isSelected && "outline-blue-500"
            )}>
                {children}
            </div>

            {isSelected && (
                <>
                    <div onMouseDown={e => handleResize(e, 'tl')} className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-white border-2 border-blue-500 cursor-nwse-resize"></div>
                    <div onMouseDown={e => handleResize(e, 'tr')} className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white border-2 border-blue-500 cursor-nesw-resize"></div>
                    <div onMouseDown={e => handleResize(e, 'bl')} className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-white border-2 border-blue-500 cursor-nesw-resize"></div>
                    <div onMouseDown={e => handleResize(e, 'br')} className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-white border-2 border-blue-500 cursor-nwse-resize"></div>
                </>
            )}
        </div>
    );
};
