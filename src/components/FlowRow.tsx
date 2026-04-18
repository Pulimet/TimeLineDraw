import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Eye, EyeOff } from 'lucide-react';
import type { Flow, TimelineEvent } from '../types/timeline';
import { useTimelineStore } from '../store/timelineStore';
import { DraggableEvent } from './DraggableEvent';

interface FlowRowProps {
  flow: Flow;
  events: TimelineEvent[];
  maxEndTime: number;
}

export const FlowRow: React.FC<FlowRowProps> = (
  { flow, events, maxEndTime }
) => {
  const { removeFlow, updateFlowTitle, toggleFlowVisibility } =
    useTimelineStore();
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(flow.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: flow.id });

  useEffect(() => {
    if (isRenaming) inputRef.current?.focus();
  }, [isRenaming]);

  const commitRename = () => {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== flow.title) {
      updateFlowTitle(flow.id, trimmed);
    }
    setIsRenaming(false);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const hidden = flow.hidden ?? false;

  return (
    <div ref={setNodeRef} style={style}
      className={`flex border-b border-gray-200 relative group
        transition-colors ${hidden ? 'h-8' : 'h-14'}
        ${hidden ? 'bg-gray-100/50 opacity-60' : 'hover:bg-gray-50/50'}`}
    >
      <div className="w-48 shrink-0 bg-gray-100 border-r border-gray-200
        flex items-center px-2 py-1 relative z-10
        shadow-[1px_0_0_rgba(0,0,0,0.1)] justify-between">
        <div className="flex items-center gap-1 overflow-hidden">
          <div {...attributes} {...listeners}
            className="cursor-grab text-gray-400 hover:text-gray-600">
            <GripVertical size={16} />
          </div>
          {isRenaming ? (
            <input ref={inputRef} value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitRename();
                if (e.key === 'Escape') setIsRenaming(false);
              }}
              className="flex-1 text-sm border border-blue-400
                rounded px-1 py-0 outline-none min-w-0" />
          ) : (
            <span className="font-medium text-sm text-gray-800
              truncate cursor-pointer"
              title="Double-click to rename"
              onDoubleClick={() => {
                setRenameValue(flow.title);
                setIsRenaming(true);
              }}>
              {flow.title}
            </span>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          <button onClick={() => toggleFlowVisibility(flow.id)}
            className="text-gray-400 hover:text-gray-600
              opacity-0 group-hover:opacity-100 transition-opacity p-1"
            title={hidden ? 'Show Flow' : 'Hide Flow'}>
            {hidden ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button onClick={() => removeFlow(flow.id)}
            className="text-gray-400 hover:text-red-500
              opacity-0 group-hover:opacity-100 transition-opacity p-1"
            title="Delete Flow">
            <X size={14} />
          </button>
        </div>
      </div>

      {!hidden && (
        <div className="flex-grow relative h-full">
          {events.map((evt) => (
            <DraggableEvent key={evt.id} evt={evt}
              maxEndTime={maxEndTime} events={events} />
          ))}
        </div>
      )}
    </div>
  );
};
