'use client';

import React, { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent, PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

type Position = { x: number; y: number };
type Size = { width: number; height: number };

interface ResizableBoxProps extends PropsWithChildren {
    position: Position;
    size: Size;
    isSelected: boolean;
    onMouseDown: (e: ReactMouseEvent) => void;
    onTouchStart: (e: ReactTouchEvent) => void;
    onClick: (e: ReactMouseEvent) => void;
    onResize: (size: Size) => void;
}

export const ResizableBox = ({ 
    children, 
    position, 
    size, 
    isSelected, 
    onMouseDown, 
    onTouchStart,
    onClick,
    onResize
}: ResizableBoxProps) => {

    const handleResizeStart = (e: ReactMouseEvent | ReactTouchEvent, corner: 'br' | 'bl' | 'tr' | 'tl') => {
        e.stopPropagation();

        const isTouchEvent = 'touches' in e;
        const startX = isTouchEvent ? e.touches[0].clientX : e.clientX;
        const startY = isTouchEvent ? e.touches[0].clientY : e.clientY;

        const startWidth = size.width;
        const startHeight = size.height;

        const doDrag = (moveEvent: MouseEvent | globalThis.TouchEvent) => {
            const moveIsTouchEvent = 'touches' in moveEvent;
            const currentX = moveIsTouchEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
            const currentY = moveIsTouchEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;

            const dx = currentX - startX;
            const dy = currentY - startY;

            let newWidth = startWidth;
            let newHeight = startHeight;
            
            if (corner.includes('r')) newWidth = startWidth + dx;
            if (corner.includes('l')) newWidth = startWidth - dx;
            if (corner.includes('b')) newHeight = startHeight + dy;
            if (corner.includes('t')) newHeight = startHeight - dy;
            
            const newSize = {
                width: newWidth > 20 ? newWidth : 20,
                height: newHeight > 20 ? newHeight : 20,
            };
            onResize(newSize);
        };

        const stopDrag = () => {
            document.removeEventListener('mousemove', doDrag as any, false);
            document.removeEventListener('mouseup', stopDrag, false);
            document.removeEventListener('touchmove', doDrag as any, false);
            document.removeEventListener('touchend', stopDrag, false);
        };

        if (isTouchEvent) {
            document.addEventListener('touchmove', doDrag as any, false);
            document.addEventListener('touchend', stopDrag, false);
        } else {
            document.addEventListener('mousemove', doDrag as any, false);
            document.addEventListener('mouseup', stopDrag, false);
        }
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
            onTouchStart={onTouchStart}
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
                    <div onMouseDown={e => handleResizeStart(e, 'tl')} onTouchStart={e => handleResizeStart(e, 'tl')} className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-white border-2 border-blue-500 cursor-nwse-resize"></div>
                    <div onMouseDown={e => handleResizeStart(e, 'tr')} onTouchStart={e => handleResizeStart(e, 'tr')} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-blue-500 cursor-nesw-resize"></div>
                    <div onMouseDown={e => handleResizeStart(e, 'bl')} onTouchStart={e => handleResizeStart(e, 'bl')} className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-white border-2 border-blue-500 cursor-nesw-resize"></div>
                    <div onMouseDown={e => handleResizeStart(e, 'br')} onTouchStart={e => handleResizeStart(e, 'br')} className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-blue-500 cursor-nwse-resize"></div>
                </>
            )}
        </div>
    );
};
