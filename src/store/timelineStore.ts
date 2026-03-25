import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Flow, TimelineEvent } from '../types/timeline';

interface TimelineState {
  flows: Flow[];
  events: TimelineEvent[];
  addFlow: (title: string) => void;
  removeFlow: (id: string) => void;
  updateFlowTitle: (id: string, title: string) => void;
  reorderFlows: (flows: Flow[]) => void;
  addEvent: (event: Omit<TimelineEvent, 'id'>) => boolean;
  updateEvent: (id: string, event: Partial<TimelineEvent>) => boolean;
  removeEvent: (id: string) => void;
}

const hasOverlap = (
  events: TimelineEvent[],
  flowId: string,
  startMs: number,
  endMs: number,
  excludeEventId?: string
) => {
  return events.some(
    (e) =>
      e.flowId === flowId &&
      e.id !== excludeEventId &&
      startMs < e.endMs &&
      endMs > e.startMs
  );
};

export const useTimelineStore = create<TimelineState>()(
  persist(
    (set) => ({
      flows: [],
      events: [],

      addFlow: (title) =>
        set((state) => ({
          flows: [...state.flows, { id: uuidv4(), title }],
        })),

      removeFlow: (id) =>
        set((state) => ({
          flows: state.flows.filter((f) => f.id !== id),
          events: state.events.filter((e) => e.flowId !== id),
        })),

      updateFlowTitle: (id, title) =>
        set((state) => ({
          flows: state.flows.map((f) => (f.id === id ? { ...f, title } : f)),
        })),

      reorderFlows: (flows) => set({ flows }),

      addEvent: (event) => {
        let added = false;
        set((state) => {
          if (hasOverlap(state.events, event.flowId, event.startMs, event.endMs)) {
            added = false;
            return state; // No change
          }
          added = true;
          return {
            events: [...state.events, { ...event, id: uuidv4() }],
          };
        });
        return added;
      },

      updateEvent: (id, updatedFields) => {
        let updated = false;
        set((state) => {
          const currentEvent = state.events.find(e => e.id === id);
          if (!currentEvent) {
            updated = false;
            return state;
          }
          const merged = { ...currentEvent, ...updatedFields };
          if (hasOverlap(state.events, merged.flowId, merged.startMs, merged.endMs, id)) {
            updated = false;
            return state; // Overlap, do not apply
          }
          updated = true;
          return {
            events: state.events.map((e) => (e.id === id ? merged : e)),
          };
        });
        return updated;
      },

      removeEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),
    }),
    {
      name: 'timeline-storage',
    }
  )
);
