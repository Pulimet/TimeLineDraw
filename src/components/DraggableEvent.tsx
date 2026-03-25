import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import type { TimelineEvent } from '../types/timeline';
import { useTimelineStore } from '../store/timelineStore';

interface DraggableEventProps {
  evt: TimelineEvent;
  maxEndTime: number;
  events: TimelineEvent[];
}

type DragMode = 'move' | 'resize-left' | 'resize-right' | null;

export const DraggableEvent: React.FC<DraggableEventProps> = ({ evt, maxEndTime, events }) => {
  const { updateEvent, removeEvent } = useTimelineStore();
  const [dragMode, setDragMode] = useState<DragMode>(null);
  const [dragOffsetMs, setDragOffsetMs] = useState(0); // Offset in ms
  const [resizeStartMs, setResizeStartMs] = useState(evt.startMs);
  const [resizeEndMs, setResizeEndMs] = useState(evt.endMs);

  const startDragRef = useRef<{ pageX: number; startMs: number; endMs: number; widthPx: number; pxToMs: number } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const getEventStyle = (startMs: number, endMs: number) => {
    const leftPercent = (startMs / maxEndTime) * 100;
    const widthPercent = ((endMs - startMs) / maxEndTime) * 100;
    
    return {
      left: `${leftPercent}%`,
      width: `${Math.max(widthPercent, 0.5)}%`, // At least some width
      backgroundColor: evt.color || '#3b82f6',
      cursor: dragMode === 'move' ? 'grabbing' : 'grab',
      zIndex: dragMode ? 10 : 1,
    };
  };

  const handlePointerDown = (e: React.PointerEvent, mode: DragMode) => {
    if ((e.target as HTMLElement).closest('button.delete-btn')) return;
    e.preventDefault();
    e.stopPropagation();
    
    // Calculate px to ms ratio based on parent width
    const parent = containerRef.current?.parentElement;
    if (!parent) return;
    const pxToMs = maxEndTime / parent.clientWidth;

    setDragMode(mode);
    setDragOffsetMs(0);
    setResizeStartMs(evt.startMs);
    setResizeEndMs(evt.endMs);

    startDragRef.current = {
      pageX: e.pageX,
      startMs: evt.startMs,
      endMs: evt.endMs,
      widthPx: parent.clientWidth,
      pxToMs
    };
  };

  useEffect(() => {
    if (!dragMode) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!startDragRef.current) return;
      const { pageX, pxToMs, startMs, endMs } = startDragRef.current;
      
      const deltaPx = e.pageX - pageX;
      const deltaMs = deltaPx * pxToMs;
      
      if (dragMode === 'move') {
        const duration = endMs - startMs;
        const targetStart = startMs + deltaMs;

        // 1. Gather and merge all occupied intervals
        const occupied = events
          .filter(o => o.id !== evt.id)
          .map(o => ({ start: o.startMs, end: o.endMs }))
          .sort((a, b) => a.start - b.start);

        const mergedOccupied: {start: number, end: number}[] = [];
        for (const occ of occupied) {
          if (mergedOccupied.length === 0) mergedOccupied.push({...occ});
          else {
            const last = mergedOccupied[mergedOccupied.length - 1];
            if (occ.start <= last.end) {
              last.end = Math.max(last.end, occ.end);
            } else {
              mergedOccupied.push({...occ});
            }
          }
        }

        // 2. Find all valid gaps between occupied intervals that can fit this event
        const validGaps: {L: number, R: number}[] = [];
        let currentL = 0;
        for (const occ of mergedOccupied) {
          if (occ.start - currentL >= duration) {
            validGaps.push({ L: currentL, R: occ.start });
          }
          currentL = occ.end;
        }
        validGaps.push({ L: currentL, R: Infinity });

        // 3. Find the closest valid start position
        let bestStart = targetStart;
        let minDistance = Infinity;

        for (const gap of validGaps) {
          const minS = gap.L;
          const maxS = gap.R - duration;
          if (minS > maxS) continue;

          let clamped = targetStart;
          if (clamped < minS) clamped = minS;
          if (clamped > maxS) clamped = maxS;

          const dist = Math.abs(targetStart - clamped);
          if (dist < minDistance) {
            minDistance = dist;
            bestStart = clamped;
          }
        }

        if (bestStart < 0) bestStart = 0;
        setDragOffsetMs(Math.round(bestStart) - startMs);

      } else if (dragMode === 'resize-left') {
        let minS = 0;
        events.forEach(other => {
          if (other.id === evt.id) return;
          if (other.endMs <= startMs) {
            minS = Math.max(minS, other.endMs);
          }
        });
        let newStart = startMs + deltaMs;
        if (newStart < minS) newStart = minS;
        if (newStart > endMs - 50) newStart = endMs - 50;
        if (newStart < 0) newStart = 0;
        setResizeStartMs(Math.round(newStart));
      } else if (dragMode === 'resize-right') {
        let maxE = Infinity;
        events.forEach(other => {
          if (other.id === evt.id) return;
          if (other.startMs >= endMs) {
            maxE = Math.min(maxE, other.startMs);
          }
        });
        let newEnd = endMs + deltaMs;
        if (newEnd > maxE) newEnd = maxE;
        if (newEnd < startMs + 50) newEnd = startMs + 50;
        setResizeEndMs(Math.round(newEnd));
      }
    };

    const handlePointerUp = () => {
      if (!startDragRef.current) return;
      
      if (dragMode === 'move' && dragOffsetMs !== 0) {
        updateEvent(evt.id, {
          startMs: evt.startMs + dragOffsetMs,
          endMs: evt.endMs + dragOffsetMs,
        });
      } else if (dragMode === 'resize-left' && resizeStartMs !== evt.startMs) {
        updateEvent(evt.id, { startMs: resizeStartMs });
      } else if (dragMode === 'resize-right' && resizeEndMs !== evt.endMs) {
        updateEvent(evt.id, { endMs: resizeEndMs });
      }
      
      setDragMode(null);
      setDragOffsetMs(0);
      startDragRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragMode, dragOffsetMs, resizeStartMs, resizeEndMs, evt, maxEndTime, events, updateEvent]);

  let currentStart = evt.startMs;
  let currentEnd = evt.endMs;

  if (dragMode === 'move') {
    currentStart = evt.startMs + dragOffsetMs;
    currentEnd = evt.endMs + dragOffsetMs;
  } else if (dragMode === 'resize-left') {
    currentStart = resizeStartMs;
  } else if (dragMode === 'resize-right') {
    currentEnd = resizeEndMs;
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={(e) => handlePointerDown(e, 'move')}
      className={`absolute top-1 bottom-1 flex items-center justify-center px-4 rounded-sm text-black text-xs font-medium shadow-sm border border-black/10 group/event transition-shadow ${dragMode ? 'shadow-md opacity-90 scale-100 touch-none' : ''}`}
      style={getEventStyle(currentStart, currentEnd)}
      title={`${evt.title} (${Math.round(currentStart)} - ${Math.round(currentEnd)})`}
    >
      {/* Duration (Top Left Corner) */}
      <span className="absolute top-0 left-0 text-[9px] text-black/60 bg-black/5 px-1 rounded-br-sm z-10 pointer-events-none">
        {Math.round(currentEnd - currentStart)}ms
      </span>

      {/* Delete Button (Top Right Inside) */}
      <button
        onClick={() => removeEvent(evt.id)}
        className="delete-btn absolute top-0 right-0 text-black/50 hover:text-red-600 opacity-0 group-hover/event:opacity-100 transition-opacity p-[3px] cursor-pointer z-30"
        title="Delete Event"
      >
        <X size={12} />
      </button>

      {/* Left Resize Handle (Bottom Left Corner) */}
      <div 
        className="absolute left-0 bottom-0 w-4 h-4 cursor-ew-resize hover:bg-black/10 z-20 flex items-end justify-start opacity-0 group-hover/event:opacity-100 rounded-bl-sm"
        onPointerDown={(e) => handlePointerDown(e, 'resize-left')}
      >
         <div className="w-1.5 h-1.5 border-l-2 border-b-2 border-black/40 mb-[3px] ml-[3px]" />
      </div>

      <span className="truncate select-none pointer-events-none overflow-hidden text-center z-10 w-full px-1">
        {evt.title}
      </span>
      
      {/* Time display when dragging/resizing */}
      {dragMode && (
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap z-50 pointer-events-none">
          {Math.round(currentStart)} - {Math.round(currentEnd)}
        </span>
      )}

      {/* Right Resize Handle (Bottom Right Corner) */}
      <div 
        className="absolute right-0 bottom-0 w-4 h-4 cursor-ew-resize hover:bg-black/10 z-20 flex items-end justify-end opacity-0 group-hover/event:opacity-100 rounded-br-sm"
        onPointerDown={(e) => handlePointerDown(e, 'resize-right')}
      >
        <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-black/40 mb-[3px] mr-[3px]" />
      </div>
    </div>
  );
};