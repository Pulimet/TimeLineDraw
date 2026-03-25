import { useMemo } from 'react';
import type { TimelineEvent } from '../types/timeline';
import { useTimelineStore } from '../store/timelineStore';

export function useTimelineLayout(events: TimelineEvent[], tickInterval: number = 1000) {
  const customMaxDuration = useTimelineStore((state) => state.maxDuration);

  const maxEndTime = useMemo(() => {
    return Math.max(customMaxDuration, ...events.map((e) => e.endMs));
  }, [events, customMaxDuration]);

  const numTicks = Math.ceil(maxEndTime / tickInterval);
  const ticks = Array.from({ length: numTicks + 1 }, (_, i) => i * tickInterval);

  return {
    maxEndTime,
    ticks,
  };
}
