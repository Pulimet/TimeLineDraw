import { useMemo } from 'react';
import type { TimelineEvent } from '../types/timeline';

export function useTimelineLayout(events: TimelineEvent[], tickInterval: number = 1000) {
  const maxEndTime = useMemo(() => {
    return Math.max(10000, ...events.map((e) => e.endMs));
  }, [events]);

  const numTicks = Math.ceil(maxEndTime / tickInterval);
  const ticks = Array.from({ length: numTicks + 1 }, (_, i) => i * tickInterval);

  return {
    maxEndTime,
    ticks,
  };
}
