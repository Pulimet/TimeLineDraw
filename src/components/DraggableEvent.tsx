import React, { useRef, useState } from 'react';
import { X, Edit2, Check } from 'lucide-react';
import type { TimelineEvent } from '../types/timeline';
import { useTimelineStore } from '../store/timelineStore';
import { useDraggableEvent } from '../hooks/useDraggableEvent';

interface DraggableEventProps {
  evt: TimelineEvent;
  maxEndTime: number;
  events: TimelineEvent[];
}

export const DraggableEvent: React.FC<DraggableEventProps> = ({ evt, maxEndTime, events }) => {
  const { removeEvent, updateEvent } = useTimelineStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editStart, setEditStart] = useState(evt.startMs);
  const [editEnd, setEditEnd] = useState(evt.endMs);

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
      zIndex: dragMode || isEditing ? 10 : 1,
    };
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateEvent(evt.id, { startMs: editStart, endMs: editEnd });
    setIsEditing(false);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={(e) => {
        if (!isEditing) handlePointerDown(e, 'move');
      }}
      className={`absolute top-1 bottom-1 flex flex-col items-center justify-center px-1 rounded-sm text-black text-xs font-medium shadow-sm border border-black/10 group/event transition-shadow ${dragMode ? 'shadow-md opacity-90 scale-100 touch-none' : ''}`}
      style={{ ...getEventStyle(currentStart, currentEnd), containerType: 'inline-size' }}
      title={`${evt.title} (${Math.round(currentStart)}ms - ${Math.round(currentEnd)}ms) | Duration: ${Math.round(currentEnd - currentStart)}ms`}
    >
      <style>{`
        @container (max-width: 34px) {
          .duration-label { display: none; }
        }
      `}</style>

      {isEditing ? (
        <div
          className="absolute inset-0 bg-white/95 z-40 flex flex-col items-center justify-center p-2 rounded-sm gap-2 cursor-default min-h-[60px]"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="flex gap-2 w-full justify-center items-center">
            <input
              type="number"
              value={Math.round(editStart)}
              onChange={e => setEditStart(Number(e.target.value))}
              className="w-16 text-xs p-1 border border-gray-300 rounded text-center focus:outline-none focus:border-blue-500"
            />
            <span className="text-xs text-gray-500">-</span>
            <input
              type="number"
              value={Math.round(editEnd)}
              onChange={e => setEditEnd(Number(e.target.value))}
              className="w-16 text-xs p-1 border border-gray-300 rounded text-center focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-xs flex items-center justify-center transition-colors"
            >
              <Check size={12} className="mr-1"/> Save
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setIsEditing(false); }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-3 rounded text-xs flex items-center justify-center transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {!isEditing && (
        <>
          <span className="duration-label absolute top-0 left-0 text-[9px] text-black/60 bg-black/5 px-1 rounded-br-sm z-10 pointer-events-none">
            {Math.round(currentEnd - currentStart)}ms
          </span>

          <div className="absolute top-0 right-0 flex z-30 opacity-0 group-hover/event:opacity-100 transition-opacity bg-black/5 rounded-bl-sm">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditStart(currentStart);
                setEditEnd(currentEnd);
                setIsEditing(true);
              }}
              className="p-[3px] text-black/50 hover:text-blue-600 cursor-pointer"
              title="Edit Time"
            >
              <Edit2 size={12} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Are you sure you want to delete this event?')) {
                  removeEvent(evt.id);
                }
              }}
              className="delete-btn p-[3px] text-black/50 hover:text-red-600 cursor-pointer"
              title="Delete Event"
            >
              <X size={12} />
            </button>
          </div>
        </>
      )}

      {!isEditing && (
        <div
          className="absolute left-0 bottom-0 w-4 h-4 cursor-ew-resize hover:bg-black/10 z-20 flex items-end justify-start opacity-0 group-hover/event:opacity-100 rounded-bl-sm"
          onPointerDown={(e) => handlePointerDown(e, 'resize-left')}
        >
           <div className="w-1.5 h-1.5 border-l-2 border-b-2 border-black/40 mb-[3px] ml-[3px]" />
        </div>
      )}

      {!isEditing && (
        <span className="truncate select-none pointer-events-none overflow-hidden text-center z-10 w-full px-1 leading-tight">
          {evt.title}
        </span>
      )}
      {!isEditing && (
        <span className="absolute bottom-0 select-none pointer-events-none text-center z-10 w-full px-1 text-[7px] opacity-75 pb-[2px] whitespace-nowrap overflow-hidden text-ellipsis">
          {Math.round(currentStart)}ms &lt;-&gt; {Math.round(currentEnd)}ms
        </span>
      )}

      {dragMode && (
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap z-50 pointer-events-none">
          {Math.round(currentStart)} - {Math.round(currentEnd)}
        </span>
      )}

      {!isEditing && (
        <div
          className="absolute right-0 bottom-0 w-4 h-4 cursor-ew-resize hover:bg-black/10 z-20 flex items-end justify-end opacity-0 group-hover/event:opacity-100 rounded-br-sm"
          onPointerDown={(e) => handlePointerDown(e, 'resize-right')}
        >
          <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-black/40 mb-[3px] mr-[3px]" />
        </div>
      )}
    </div>
  );
};
