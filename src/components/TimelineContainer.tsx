import React, { useMemo } from 'react';
import { useTimelineStore } from '../store/timelineStore';
import { FlowRow } from './FlowRow';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export const TimelineContainer: React.FC = () => {
  const { flows, events, reorderFlows } = useTimelineStore();

  const maxEndTime = useMemo(() => {
    return Math.max(10000, ...events.map((e) => e.endMs));
  }, [events]);

  const tickInterval = 1000;
  const numTicks = Math.ceil(maxEndTime / tickInterval);
  const ticks = Array.from({ length: numTicks + 1 }, (_, i) => i * tickInterval);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = flows.findIndex((f) => f.id === active.id);
      const newIndex = flows.findIndex((f) => f.id === over.id);
      
      reorderFlows(arrayMove(flows, oldIndex, newIndex));
    }
  };

  return (
    <div className="bg-white border text-sm rounded shadow flex flex-col overflow-x-auto min-w-[800px]">
      {/* Header Axis */}
      <div className="flex bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
        <div className="w-48 shrink-0 bg-gray-100 border-r border-gray-200 flex items-center p-2 text-gray-700 font-semibold sticky left-0 z-20 shadow-[1px_0_0_rgba(0,0,0,0.1)]">
          Flows
        </div>
        <div className="flex-grow relative h-10 min-w-[600px] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CgogIDxjaXJjbGUgY3g9IjEiIGN5PSIxIiByPSIxIiBmaWxsPSIjY2NjIi8+Cjwvc3ZnPg==')]">
          {ticks.map((tick) => (
            <div
              key={tick}
              className="absolute top-0 bottom-0 border-l border-gray-300"
              style={{ left: `${(tick / maxEndTime) * 100}%` }}
            >
              <span className="absolute left-1 top-2 text-xs text-gray-500 whitespace-nowrap">
                {tick}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Rows */}
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={flows.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col relative w-full pt-2">
            {flows.map((flow) => (
              <FlowRow
                key={flow.id}
                flow={flow}
                events={events.filter((e) => e.flowId === flow.id)}
                maxEndTime={maxEndTime}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};