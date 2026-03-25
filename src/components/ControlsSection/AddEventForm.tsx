import React, { useState } from 'react';
import { useTimelineStore } from '../../store/timelineStore';
import { PREDEFINED_COLORS } from '../../constants/colors';

export const AddEventForm: React.FC = () => {
  const { flows, addEvent } = useTimelineStore();
  
  const [eventFlowId, setEventFlowId] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventStartMs, setEventStartMs] = useState(0);
  const [eventEndMs, setEventEndMs] = useState(1000);
  const [eventColor, setEventColor] = useState('#7dd3fc');

  const isValidFlowId = flows.some(f => f.id === eventFlowId);
  const effectiveFlowId = isValidFlowId ? eventFlowId : (flows.length > 0 ? flows[0].id : '');

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveFlowId && eventTitle.trim() && eventEndMs > eventStartMs) {
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
      } else {
        alert("Cannot add event: overlaps with an existing event in this flow.");
      }
    }
  };

  return (
    <form onSubmit={handleAddEvent} className="bg-white p-4 rounded shadow border border-gray-200 flex-[2]">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 items-end">
        <div className="col-span-2">
          <label className="block text-xs text-gray-500 mb-1">Flow</label>
          <select
            className="w-full border border-gray-300 rounded px-2 py-1 flex-1 text-sm"
            value={effectiveFlowId}
            onChange={(e) => setEventFlowId(e.target.value)}
          >
            {flows.length === 0 && <option value="" disabled>No flows available</option>}
            {flows.map((f) => (
              <option key={f.id} value={f.id}>{f.title}</option>
            ))}
          </select>
        </div>
        <div className="col-span-1">
          <label className="block text-xs text-gray-500 mb-1">Title</label>
          <input type="text" required className="w-full border border-gray-300 rounded px-2 py-1 text-sm" placeholder="Event Name" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
        </div>
        <div className="col-span-1">
          <label className="block text-xs text-gray-500 mb-1">Start (ms)</label>
          <input type="text" inputMode="numeric" pattern="\d*" required className="w-full border border-gray-300 rounded px-2 py-1 text-sm" value={eventStartMs} onChange={(e) => setEventStartMs(Number(e.target.value.replace(/\D/g, '')))} />
        </div>
        <div className="col-span-1">
          <label className="block text-xs text-gray-500 mb-1">End (ms)</label>
          <input type="text" inputMode="numeric" pattern="\d*" required className="w-full border border-gray-300 rounded px-2 py-1 text-sm" value={eventEndMs} onChange={(e) => setEventEndMs(Number(e.target.value.replace(/\D/g, '')))} />
        </div>
        <div className="col-span-1 flex items-end justify-between">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Color</label>
            <input
              type="color"
              className="w-8 h-8 rounded border-none cursor-pointer p-0 m-0 box-border"
              value={eventColor}
              onChange={(e) => setEventColor(e.target.value)}
              list="presetColors"
            />
            <datalist id="presetColors">
              {PREDEFINED_COLORS.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </datalist>
          </div>
          <button 
            type="submit"
            disabled={!eventTitle || eventEndMs <= eventStartMs}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>
    </form>
  );
};
