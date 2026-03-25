import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import type { TimelineEvent } from '../types/timeline';
import { useTimelineStore } from '../store/timelineStore';

interface DraggableEventProps {
  evt: TimelineEvent;
  maxEndTime: number;
  events: TimelineEvent[];
}

export const DraggableEvent: React.FC<DraggableEventProps> = ({ evt, maxEndTime, events }) => {
  const { updateEvent, removeEvent } = useTimelineStore();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffsetMs, setDragOffsetMs] = useState(0); // Offset in ms
  const startDragRef = useRef<{ pageX: number; startMs: number; endMs: number; widthPx: number; pxToMs: number } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const getEventStyle = (startMs: number, endMs: number) => {
    const leftPercent = (startMs / maxEndTime) * 100;
    const widthPercent = ((endMs - startMs) / maxEndTime) * 100;
    
    return {
      left: `${leftPercent}%`,
      width: `${Math.max(widthPercent, 0.5)}%`, // At least some width
      backgroundColor: evt.color || '#3b82f6',
      cursor: isDragging ? 'grabbing' : 'grab',
      zIndex: isDragging ? 10 : 1,
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return; // Ignore delete button
    e.preventDefault();
    
    // Calculate px to ms ratio based on parent width
    const parent = containerRef.current?.parentElement;
    if (!parent) return;
    const pxToMs = maxEndTime / parent.clientWidth;

    setIsDragging(true);
    startDragRef.current = {
      pageX: e.pageX,
      startMs: evt.startMs,
      endMs: evt.endMs,
      widthPx: parent.clientWidth,
      pxToMs
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!startDragRef.current) return;
      const { pageX, pxToMs, startMs, endMs } = startDragRef.current;
      
      const deltaPx = e.pageX - pageX;
      let deltaMs = deltaPx * pxToMs;

      // Bound checks against 0 and maxEndTime
      if (startMs + deltaMs < 0) deltaMs = -startMs;
      // if we want to restrict to maxEndTime:
      // if (endMs + deltaMs > maxEndTime) deltaMs = maxEndTime - endMs;

      // Collision checks with other events in the same flow
      const duration = endMs - startMs;
      let newStartMs = startMs + deltaMs;
      let newEndMs = endMs + deltaMs;

      // Find nearest obstacles mapping to max free space
      let minStart = 0;
      let maxEnd = Infinity; // or maxEndTime

      events.forEach(other => {
        if (other.id === evt.id) return;
        if (other.endMs <= startMs) {
          minStart = Math.max(minStart, other.endMs);
        }
        if (other.startMs >= endMs) {
          maxEnd = Math.min(maxEnd, other.startMs);
        }
      });

      if (newStartMs < minStart) {
        newStartMs = minStart;
        newEndMs = minStart + duration;
      } else if (newEndMs > maxEnd) {
        newEndMs = maxEnd;
        newStartMs = maxEnd - duration;
      }
      
      setDragOffsetMs(newStartMs - startMs);
    };

    const handlePointerUp = () => {
      if (!startDragRef.current) return;
      setIsDragging(false);
      
      const finalOffset = dragOffsetMs;
      if (finalOffset !== 0) {
        // Find collision bounds one last time (using state from ref)
        updateEvent(evt.id, {
          startMs: evt.startMs + finalOffset,
          endMs: evt.endMs + finalOffset,
        });
      }
      
      setDragOffsetMs(0);
      startDragRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    // document pointerup acts as a fallback if the window doesn't catch it
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, dragOffsetMs, evt, maxEndTime, events, updateEvent]);

  // visually adjust currently dragged event
  const currentStart = evt.startMs + (isDragging ? dragOffsetMs : 0);
  const currentEnd = evt.endMs + (isDragging ? dragOffsetMs : 0);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      className={`absolute top-1 bottom-1 flex items-center justify-center px-2 rounded-sm text-black text-xs font-medium overflow-hidden shadow-sm border border-black/10 group/event transition-shadow ${isDragging ? 'shadow-md opacity-90 scale-100 touch-none' : ''}`}
      style={getEventStyle(currentStart, currentEnd)}
      title={`${evt.title} (${Math.round(currentStart)} - ${Math.round(currentEnd)})`}
    >
      <span className="truncate select-none pointer-events-none">{evt.title}</span>
      <button
        onClick={() => removeEvent(evt.id)}
        className="ml-1 text-black/50 hover:text-black/90 opacity-0 group-hover/event:opacity-100 transition-opacity p-0.5"
        title="Delete Event"
      >
        <X size={12} />
      </button>
    </div>
  );
};