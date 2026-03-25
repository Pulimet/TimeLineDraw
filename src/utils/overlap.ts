import type { TimelineEvent } from '../types/timeline';

export const hasOverlap = (
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
