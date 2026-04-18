import React, { useRef, useState } from 'react';
import { X, Edit2, Copy } from 'lucide-react';
import type { TimelineEvent } from '../types/timeline';
import { useTimelineStore } from '../store/timelineStore';
import { useDraggableEvent } from '../hooks/useDraggableEvent';
import { EventEditOverlay } from './EventEditOverlay';

interface DraggableEventProps {
  evt: TimelineEvent;
  maxEndTime: number;
  events: TimelineEvent[];
}

export const DraggableEvent: React.FC<DraggableEventProps> = (
  { evt, maxEndTime, events }
) => {
  const { addEvent, removeEvent, updateEvent } = useTimelineStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { dragMode, dragOffsetY, currentStart, currentEnd, handlePointerDown } =
    useDraggableEvent({ evt, maxEndTime, events, containerRef });

  const leftPct = (currentStart / maxEndTime) * 100;
  const widthPct = ((currentEnd - currentStart) / maxEndTime) * 100;
  const style: React.CSSProperties = {
    left: `${leftPct}%`,
    width: `${Math.max(widthPct, 0.5)}%`,
    backgroundColor: evt.color || '#3b82f6',
    cursor: dragMode === 'move' ? 'grabbing' : 'grab',
    zIndex: dragMode || isEditing ? 10 : 1,
    containerType: 'inline-size' as const,
    transform: dragOffsetY ? `translateY(${dragOffsetY}px)` : undefined,
  };

  const handleSave = (fields: Partial<TimelineEvent>) => {
    const ok = updateEvent(evt.id, fields);
    if (!ok) {
      alert('Cannot save: overlaps with another event.');
      return;
    }
    setIsEditing(false);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const duration = evt.endMs - evt.startMs;
    const flowEvents = events
      .filter((e) => e.flowId === evt.flowId)
      .sort((a, b) => a.startMs - b.startMs);
    
    let currentStart = 0;
    for (const fe of flowEvents) {
      if (fe.startMs - currentStart >= duration) break;
      currentStart = Math.max(currentStart, fe.endMs);
    }
    
    addEvent({
      flowId: evt.flowId,
      title: `${evt.title} (Copy)`,
      startMs: currentStart,
      endMs: currentStart + duration,
      color: evt.color,
    });
  };

  return (
    <div ref={containerRef}
      onPointerDown={(e) => { if (!isEditing) handlePointerDown(e, 'move'); }}
      className={`absolute top-1 bottom-1 flex flex-col items-center
        justify-center px-1 rounded-sm text-black text-xs font-medium
        shadow-sm border border-black/10 group/event transition-shadow
        ${dragMode ? 'shadow-md opacity-90 touch-none' : ''}`}
      style={style}
      title={`${evt.title} (${Math.round(currentStart)}ms - ${Math.round(currentEnd)}ms)`}
    >
      <style>{`
        @container (max-width: 34px) { .duration-label { display:none } }
        @container (max-width: 70px) { .time-range-label { display:none } }
      `}</style>

      {isEditing && (
        <EventEditOverlay evt={evt}
          currentStart={currentStart} currentEnd={currentEnd}
          onSave={handleSave} onCancel={() => setIsEditing(false)} />
      )}

      {!isEditing && (
        <>
          <span className="duration-label absolute top-0 left-0 text-[9px] text-black/60 bg-black/5 px-1 rounded-br-sm z-10 pointer-events-none">
            {Math.round(currentEnd - currentStart)}ms
          </span>
          <div className="absolute top-0 right-0 flex z-30 opacity-0 group-hover/event:opacity-100 transition-opacity bg-black/5 rounded-bl-sm">
            <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
              className="p-[3px] text-black/50 hover:text-blue-600 cursor-pointer" title="Edit">
              <Edit2 size={12} />
            </button>
            <button onClick={handleDuplicate}
              className="p-[3px] text-black/50 hover:text-green-600 cursor-pointer" title="Duplicate">
              <Copy size={12} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); if (confirm('Delete this event?')) removeEvent(evt.id); }}
              className="delete-btn p-[3px] text-black/50 hover:text-red-600 cursor-pointer" title="Delete">
              <X size={12} />
            </button>
          </div>
          <div className="absolute left-0 bottom-0 w-4 h-4 cursor-ew-resize hover:bg-black/10 z-20 flex items-end justify-start opacity-0 group-hover/event:opacity-100 rounded-bl-sm"
            onPointerDown={(e) => handlePointerDown(e, 'resize-left')}>
            <div className="w-1.5 h-1.5 border-l-2 border-b-2 border-black/40 mb-[3px] ml-[3px]" />
          </div>
          <span className="truncate select-none pointer-events-none overflow-hidden text-center z-10 w-full px-1 leading-tight">
            {evt.title}
          </span>
          <span className="time-range-label absolute bottom-0 select-none pointer-events-none text-center z-10 w-full px-1 text-[7px] opacity-75 pb-[2px] whitespace-nowrap overflow-hidden text-ellipsis">
            {Math.round(currentStart)}ms &lt;-&gt; {Math.round(currentEnd)}ms
          </span>
          <div className="absolute right-0 bottom-0 w-4 h-4 cursor-ew-resize hover:bg-black/10 z-20 flex items-end justify-end opacity-0 group-hover/event:opacity-100 rounded-br-sm"
            onPointerDown={(e) => handlePointerDown(e, 'resize-right')}>
            <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-black/40 mb-[3px] mr-[3px]" />
          </div>
        </>
      )}

      {dragMode && (
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap z-50 pointer-events-none">
          {Math.round(currentStart)} - {Math.round(currentEnd)}
        </span>
      )}
    </div>
  );
};
