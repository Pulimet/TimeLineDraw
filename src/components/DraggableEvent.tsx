import React, { useRef } from 'react';
import { X } from 'lucide-react';
import type { TimelineEvent } from '../types/timeline';
import { useTimelineStore } from '../store/timelineStore';
import { useDraggableEvent } from '../hooks/useDraggableEvent';

interface DraggableEventProps {
  evt: TimelineEvent;
  maxEndTime: number;
  events: TimelineEvent[];
}

export const DraggableEvent: React.FC<DraggableEventProps> = ({ evt, maxEndTime, events }) => {
  const { removeEvent } = useTimelineStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    dragMode,
    currentStart,
    currentEnd,
    handlePointerDown
  } = useDraggableEvent({ evt, maxEndTime, events, containerRef });

  const getEventStyle = (startMs: number, endMs: number) => {
    const leftPercent = (startMs / maxEndTime) * 100;
    const widthPercent = ((endMs - startMs) / maxEndTime) * 100;
    return {
      left: `${leftPercent}%`,
      width: `${Math.max(widthPercent, 0.5)}%`,
      backgroundColor: evt.color || '#3b82f6',
      cursor: dragMode === 'move' ? 'grabbing' : 'grab',
      zIndex: dragMode ? 10 : 1,
    };
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={(e) => handlePointerDown(e, 'move')}
      className={`absolute top-1 bottom-1 flex items-center justify-center px-1 rounded-sm text-black text-xs font-medium shadow-sm border border-black/10 group/event transition-shadow ${dragMode ? 'shadow-md opacity-90 scale-100 touch-none' : ''}`}
      style={getEventStyle(currentStart, currentEnd)}
      title={`${evt.title} (${Math.round(currentStart)} - ${Math.round(currentEnd)})`}
    >
      <span className="absolute top-0 left-0 text-[9px] text-black/60 bg-black/5 px-1 rounded-br-sm z-10 pointer-events-none">
        {Math.round(currentEnd - currentStart)}ms
      </span>

      <button
        onClick={() => removeEvent(evt.id)}
        className="delete-btn absolute top-0 right-0 text-black/50 hover:text-red-600 opacity-0 group-hover/event:opacity-100 transition-opacity p-[3px] cursor-pointer z-30"
        title="Delete Event"
      >
        <X size={12} />
      </button>

      <div 
        className="absolute left-0 bottom-0 w-4 h-4 cursor-ew-resize hover:bg-black/10 z-20 flex items-end justify-start opacity-0 group-hover/event:opacity-100 rounded-bl-sm"
        onPointerDown={(e) => handlePointerDown(e, 'resize-left')}
      >
         <div className="w-1.5 h-1.5 border-l-2 border-b-2 border-black/40 mb-[3px] ml-[3px]" />
      </div>

      <span className="truncate select-none pointer-events-none overflow-hidden text-center z-10 w-full px-1">
        {evt.title}
      </span>
      
      {dragMode && (
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap z-50 pointer-events-none">
          {Math.round(currentStart)} - {Math.round(currentEnd)}
        </span>
      )}

      <div 
        className="absolute right-0 bottom-0 w-4 h-4 cursor-ew-resize hover:bg-black/10 z-20 flex items-end justify-end opacity-0 group-hover/event:opacity-100 rounded-br-sm"
        onPointerDown={(e) => handlePointerDown(e, 'resize-right')}
      >
        <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-black/40 mb-[3px] mr-[3px]" />
      </div>
    </div>
  );
};