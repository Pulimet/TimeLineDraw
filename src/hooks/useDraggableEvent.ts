import { useState, useRef, useEffect } from 'react';
import type { RefObject } from 'react';
import type { TimelineEvent } from '../types/timeline';
import { useTimelineStore } from '../store/timelineStore';
import { calculateBestStart, calculateResizeLeft, calculateResizeRight } from '../utils/dragMath';

export type DragMode = 'move' | 'resize-left' | 'resize-right' | null;

interface UseDraggableEventProps {
  evt: TimelineEvent;
  maxEndTime: number;
  events: TimelineEvent[];
  containerRef: RefObject<HTMLDivElement | null>;
}

export function useDraggableEvent({ evt, maxEndTime, events, containerRef }: UseDraggableEventProps) {
  const { updateEvent, events: allEvents } = useTimelineStore();
  const [dragMode, setDragMode] = useState<DragMode>(null);
  const [dragOffsetMs, setDragOffsetMs] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [resizeStartMs, setResizeStartMs] = useState(evt.startMs);
  const [resizeEndMs, setResizeEndMs] = useState(evt.endMs);

  const startDragRef = useRef<{ pageX: number; pageY: number; startMs: number; endMs: number; widthPx: number; pxToMs: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent, mode: DragMode) => {
    if ((e.target as HTMLElement).closest('button.delete-btn')) return;
    e.preventDefault();
    e.stopPropagation();
    
    const parent = containerRef.current?.parentElement;
    if (!parent) return;
    const pxToMs = maxEndTime / parent.clientWidth;

    setDragMode(mode);
    setDragOffsetMs(0);
    setDragOffsetY(0);
    setResizeStartMs(evt.startMs);
    setResizeEndMs(evt.endMs);

    startDragRef.current = {
      pageX: e.pageX,
      pageY: e.pageY,
      startMs: evt.startMs,
      endMs: evt.endMs,
      widthPx: parent.clientWidth,
      pxToMs
    };
  };

  useEffect(() => {
    if (!dragMode) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!startDragRef.current) return;
      const { pageX, pageY, pxToMs, startMs, endMs } = startDragRef.current;
      const deltaMs = (e.pageX - pageX) * pxToMs;

      if (dragMode === 'move') {
        const duration = endMs - startMs;
        const targetStart = startMs + deltaMs;
        
        let targetEvents = events;
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        const flowContainer = elements.find(el => el.hasAttribute('data-flow-id'));
        if (flowContainer) {
          const newFlowId = flowContainer.getAttribute('data-flow-id');
          if (newFlowId) {
            targetEvents = allEvents.filter(ev => ev.flowId === newFlowId);
          }
        }
        
        const bestStart = calculateBestStart(targetStart, duration, targetEvents, evt.id);
        setDragOffsetMs(Math.round(bestStart) - startMs);
        setDragOffsetY(e.pageY - pageY);
      } else if (dragMode === 'resize-left') {
        setResizeStartMs(calculateResizeLeft(startMs, endMs, deltaMs, events, evt.id));
      } else if (dragMode === 'resize-right') {
        setResizeEndMs(calculateResizeRight(startMs, endMs, deltaMs, events, evt.id));
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!startDragRef.current) return;
      if (dragMode === 'move' && (dragOffsetMs !== 0 || dragOffsetY !== 0)) {
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        const flowContainer = elements.find(el => el.hasAttribute('data-flow-id'));
        const newFlowId = flowContainer ? flowContainer.getAttribute('data-flow-id') || evt.flowId : evt.flowId;
        
        updateEvent(evt.id, { 
          flowId: newFlowId,
          startMs: evt.startMs + dragOffsetMs, 
          endMs: evt.endMs + dragOffsetMs 
        });
      } else if (dragMode === 'resize-left' && resizeStartMs !== evt.startMs) {
        updateEvent(evt.id, { startMs: resizeStartMs });
      } else if (dragMode === 'resize-right' && resizeEndMs !== evt.endMs) {
        updateEvent(evt.id, { endMs: resizeEndMs });
      }
      setDragMode(null);
      setDragOffsetMs(0);
      setDragOffsetY(0);
      startDragRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragMode, dragOffsetMs, dragOffsetY, resizeStartMs, resizeEndMs, evt, maxEndTime, events, allEvents, updateEvent]);

  let currentStart = evt.startMs;
  let currentEnd = evt.endMs;

  if (dragMode === 'move') {
    currentStart = evt.startMs + dragOffsetMs;
    currentEnd = evt.endMs + dragOffsetMs;
  } else if (dragMode === 'resize-left') {
    currentStart = resizeStartMs;
  } else if (dragMode === 'resize-right') {
    currentEnd = resizeEndMs;
  }

  return { dragMode, dragOffsetY, currentStart, currentEnd, handlePointerDown };
}
