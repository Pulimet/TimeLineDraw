import React from 'react';
import { useTimelineStore } from '../store/timelineStore';
import { FlowRow } from './FlowRow';
import { useTimelineLayout } from '../hooks/useTimelineLayout';
import { TimelineAxis } from './Timeline/TimelineAxis';
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
  const { flows, events, reorderFlows, zoom } = useTimelineStore();
  const { maxEndTime, ticks } = useTimelineLayout(events, 1000);

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
    <div className="bg-white border text-sm rounded shadow flex flex-col overflow-x-auto" style={{ width: '100%', minWidth: '800px' }}>
      <div style={{ width: `${Math.max(100, zoom * 100)}%`, minWidth: '800px' }} className="flex flex-col relative w-full pt-2">
        <TimelineAxis ticks={ticks} maxEndTime={maxEndTime} />

        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={flows.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col relative w-full pt-2 pb-6">
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
    </div>
  );
};