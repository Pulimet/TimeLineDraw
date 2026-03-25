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
  addEvent: (event: Omit<TimelineEvent, 'id'>) => void;
  updateEvent: (id: string, event: Partial<TimelineEvent>) => void;
  removeEvent: (id: string) => void;
}

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

      addEvent: (event) =>
        set((state) => ({
          events: [...state.events, { ...event, id: uuidv4() }],
        })),

      updateEvent: (id, updatedFields) =>
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...updatedFields } : e)),
        })),

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
