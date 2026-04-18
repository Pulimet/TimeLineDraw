import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTimelineStore } from '../../store/timelineStore';
import { ColorPicker } from './ColorPicker';

export const AddEventForm: React.FC = () => {
  const { flows, events, addEvent } = useTimelineStore();
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [eventFlowId, setEventFlowId] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventStartMs, setEventStartMs] = useState(0);
  const [eventEndMs, setEventEndMs] = useState(1000);
  const [eventColor, setEventColor] = useState('#7dd3fc');

  const isValidFlowId = flows.some((f) => f.id === eventFlowId);
  const effectiveFlowId = isValidFlowId
    ? eventFlowId
    : flows.length > 0 ? flows[0].id : '';

  const computeTimesForFlow = useCallback((flowId: string) => {
    const flowEvents = events.filter((e) => e.flowId === flowId);
    if (flowEvents.length === 0) return { start: 0, end: 1000 };
    const lastEnd = Math.max(...flowEvents.map((e) => e.endMs));
    return { start: lastEnd, end: lastEnd + 1000 };
  }, [events]);

  // Sync times when effective flow changes
  useEffect(() => {
    if (!effectiveFlowId) return;
    const { start, end } = computeTimesForFlow(effectiveFlowId);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEventStartMs(start);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEventEndMs(end);
  }, [effectiveFlowId, computeTimesForFlow]);

  const handleFlowChange = (flowId: string) => {
    setEventFlowId(flowId);
    const { start, end } = computeTimesForFlow(flowId);
    setEventStartMs(start);
    setEventEndMs(end);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveFlowId || !eventTitle.trim()) return;
    if (eventEndMs <= eventStartMs) return;
    const added = addEvent({
      flowId: effectiveFlowId,
      title: eventTitle.trim(),
      startMs: Number(eventStartMs),
      endMs: Number(eventEndMs),
      color: eventColor,
    });
    if (added) {
      setEventTitle('');
      setEventStartMs(eventEndMs);
      setEventEndMs(eventEndMs + 1000);
      titleInputRef.current?.focus();
    } else {
      alert('Cannot add: overlaps with an existing event.');
    }
  };

  return (
    <form onSubmit={handleAddEvent}
      className="bg-white p-4 rounded shadow border
        border-gray-200 flex-[2]">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2
        items-end">
        <div className="col-span-2">
          <label className="block text-xs text-gray-500 mb-1">
            Flow
          </label>
          <select className="w-full border border-gray-300 rounded
            px-2 py-1 flex-1 text-sm" value={effectiveFlowId}
            onChange={(e) => handleFlowChange(e.target.value)}>
            {flows.length === 0 && (
              <option value="" disabled>No flows</option>
            )}
            {flows.map((f) => (
              <option key={f.id} value={f.id}>{f.title}</option>
            ))}
          </select>
        </div>
        <div className="col-span-1">
          <label className="block text-xs text-gray-500 mb-1">
            Title
          </label>
          <input ref={titleInputRef} type="text" required
            className="w-full border border-gray-300 rounded px-2
              py-1 text-sm" placeholder="Event Name"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)} />
        </div>
        <div className="col-span-1">
          <label className="block text-xs text-gray-500 mb-1">
            Start (ms)
          </label>
          <input type="text" inputMode="numeric" pattern="\d*"
            required className="w-full border border-gray-300
              rounded px-2 py-1 text-sm"
            value={eventStartMs}
            onChange={(e) =>
              setEventStartMs(Number(e.target.value.replace(/\D/g, '')))
            } />
        </div>
        <div className="col-span-1">
          <label className="block text-xs text-gray-500 mb-1">
            End (ms)
          </label>
          <input type="text" inputMode="numeric" pattern="\d*"
            required className="w-full border border-gray-300
              rounded px-2 py-1 text-sm"
            value={eventEndMs}
            onChange={(e) =>
              setEventEndMs(Number(e.target.value.replace(/\D/g, '')))
            } />
        </div>
        <div className="col-span-1 flex items-end justify-between gap-2">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">
              Color
            </label>
            <ColorPicker eventColor={eventColor} setEventColor={setEventColor} className="h-[30px] w-full" />
          </div>
          <button type="submit"
            disabled={!eventTitle || eventEndMs <= eventStartMs}
            className="bg-green-600 hover:bg-green-700 text-white
              px-3 h-[30px] flex items-center justify-center rounded text-sm font-medium
              disabled:opacity-50">
            Add
          </button>
        </div>
      </div>
    </form>
  );
};
