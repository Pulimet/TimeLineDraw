import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';
import type { Flow, TimelineEvent } from '../types/timeline';
import { useTimelineStore } from '../store/timelineStore';

interface FlowRowProps {
  flow: Flow;
  events: TimelineEvent[];
  maxEndTime: number;
}

export const FlowRow: React.FC<FlowRowProps> = ({ flow, events, maxEndTime }) => {
  const { removeFlow, removeEvent } = useTimelineStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: flow.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getEventStyle = (event: TimelineEvent) => {
    const leftPercent = (event.startMs / maxEndTime) * 100;
    const widthPercent = ((event.endMs - event.startMs) / maxEndTime) * 100;
    
    return {
      left: `${leftPercent}%`,
      width: `${Math.max(widthPercent, 0.5)}%`, // At least some width
      backgroundColor: event.color || '#3b82f6',
    };
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="flex border-b border-gray-200 relative bg-white group hover:bg-gray-50 transition-colors h-14"
    >
      {/* Sidebar / Row Label */}
      <div className="w-48 shrink-0 bg-gray-100 border-r border-gray-200 flex items-center px-2 py-1 relative z-10 shadow-[1px_0_0_rgba(0,0,0,0.1)] justify-between">
        <div className="flex items-center gap-1 overflow-hidden">
          <div {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600">
            <GripVertical size={16} />
          </div>
          <span className="font-medium text-sm text-gray-800 truncate" title={flow.title}>
            {flow.title}
          </span>
        </div>
        <button 
          onClick={() => removeFlow(flow.id)}
          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
          title="Delete Flow"
        >
          <X size={14} />
        </button>
      </div>

      {/* Timeline Track */}
      <div className="flex-grow relative h-full">
        {/* Helper dots background */}
        <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CgogIDxjaXJjbGUgY3g9IjEiIGN5PSIxIiByPSIxIiBmaWxsPSIjY2NjIi8+Cjwvc3ZnPg==')]" />
        
        {events.map((evt) => (
          <div
            key={evt.id}
            className="absolute top-1 bottom-1 flex items-center justify-center px-2 rounded-sm text-black text-xs font-medium overflow-hidden shadow-sm border border-black/10 group/event"
            style={getEventStyle(evt)}
            title={`${evt.title} (${evt.startMs} - ${evt.endMs})`}
          >
            <span className="truncate">{evt.title}</span>
            <button
              onClick={() => removeEvent(evt.id)}
              className="absolute top-0 right-0 p-0.5 bg-black/20 text-white rounded-bl-md opacity-0 group-hover/event:opacity-100 flex items-center justify-center"
              title="Delete Event"
            >
              <X size={10} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};