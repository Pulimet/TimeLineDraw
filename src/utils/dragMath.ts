import type { TimelineEvent } from '../types/timeline';

export function calculateBestStart(
  targetStart: number,
  duration: number,
  events: TimelineEvent[],
  evtId: string
): number {
  const occupied = events
    .filter((o) => o.id !== evtId)
    .map((o) => ({ start: o.startMs, end: o.endMs }))
    .sort((a, b) => a.start - b.start);

  const mergedOccupied: { start: number; end: number }[] = [];
  for (const occ of occupied) {
    if (mergedOccupied.length === 0) mergedOccupied.push({ ...occ });
    else {
      const last = mergedOccupied[mergedOccupied.length - 1];
      if (occ.start <= last.end) {
        last.end = Math.max(last.end, occ.end);
      } else {
        mergedOccupied.push({ ...occ });
      }
    }
  }

  const validGaps: { L: number; R: number }[] = [];
  let currentL = 0;
  for (const occ of mergedOccupied) {
    if (occ.start - currentL >= duration) validGaps.push({ L: currentL, R: occ.start });
    currentL = occ.end;
  }
  validGaps.push({ L: currentL, R: Infinity });

  let bestStart = targetStart;
  let minDistance = Infinity;

  for (const gap of validGaps) {
    const minS = gap.L;
    const maxS = gap.R - duration;
    if (minS > maxS) continue;

    let clamped = targetStart;
    if (clamped < minS) clamped = minS;
    if (clamped > maxS) clamped = maxS;

    const dist = Math.abs(targetStart - clamped);
    if (dist < minDistance) {
      minDistance = dist;
      bestStart = clamped;
    }
  }

  return bestStart < 0 ? 0 : bestStart;
}

export function calculateResizeLeft(startMs: number, endMs: number, deltaMs: number, events: TimelineEvent[], evtId: string): number {
  let minS = 0;
  events.forEach(other => {
    if (other.id !== evtId && other.endMs <= startMs) minS = Math.max(minS, other.endMs);
  });
  let newStart = startMs + deltaMs;
  if (newStart < minS) newStart = minS;
  if (newStart > endMs - 50) newStart = endMs - 50;
  if (newStart < 0) newStart = 0;
  return Math.round(newStart);
}

export function calculateResizeRight(startMs: number, endMs: number, deltaMs: number, events: TimelineEvent[], evtId: string): number {
  let maxE = Infinity;
  events.forEach(other => {
    if (other.id !== evtId && other.startMs >= endMs) maxE = Math.min(maxE, other.startMs);
  });
  let newEnd = endMs + deltaMs;
  if (newEnd > maxE) newEnd = maxE;
  if (newEnd < startMs + 50) newEnd = startMs + 50;
  return Math.round(newEnd);
}
