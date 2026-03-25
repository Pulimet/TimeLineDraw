import React, { useState } from 'react';
import { useTimelineStore } from '../store/timelineStore';

export const Controls: React.FC = () => {
  const { flows, addFlow, addEvent } = useTimelineStore();
  
  const [newFlowTitle, setNewFlowTitle] = useState('');
  
  const [eventFlowId, setEventFlowId] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventStartMs, setEventStartMs] = useState(0);
  const [eventEndMs, setEventEndMs] = useState(1000);
  const [eventColor, setEventColor] = useState('#38bdf8');

  // Derive the effectively selected flow ID to avoid syncing state in an effect
  const isValidFlowId = flows.some(f => f.id === eventFlowId);
  const effectiveFlowId = isValidFlowId ? eventFlowId : (flows.length > 0 ? flows[0].id : '');

  const handleAddFlow = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFlowTitle.trim()) {
      addFlow(newFlowTitle.trim());
      setNewFlowTitle('');
    }
  };

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
        // Reset somewhat
        setEventTitle('');
        setEventStartMs(eventEndMs);
        setEventEndMs(eventEndMs + 1000);
      } else {
        alert("Cannot add event: overlaps with an existing event in this flow.");
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Add Flow Form */}
      <form onSubmit={handleAddFlow} className="bg-white p-4 rounded shadow border border-gray-200 flex-1">
        <h3 className="font-semibold text-gray-700 mb-3">Add Row (Flow)</h3>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder="Flow Name..."
            value={newFlowTitle}
            onChange={(e) => setNewFlowTitle(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium"
          >
            Add
          </button>
        </div>
      </form>

      {/* Add Event Form */}
      <form onSubmit={handleAddEvent} className="bg-white p-4 rounded shadow border border-gray-200 flex-[2]">
        <h3 className="font-semibold text-gray-700 mb-3">Add Event</h3>
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
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              placeholder="Event Name"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs text-gray-500 mb-1">Start (ms)</label>
            <input
              type="number"
              required
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              value={eventStartMs}
              onChange={(e) => setEventStartMs(Number(e.target.value))}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs text-gray-500 mb-1">End (ms)</label>
            <input
              type="number"
              required
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              value={eventEndMs}
              onChange={(e) => setEventEndMs(Number(e.target.value))}
            />
          </div>
          <div className="col-span-1 flex items-center justify-between">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Color</label>
              <input
                type="color"
                className="w-8 h-8 rounded border-none cursor-pointer p-0 m-0 box-border"
                value={eventColor}
                onChange={(e) => setEventColor(e.target.value)}
              />
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

        {/* Predefined Colors */}
        <div className="mt-3 border-t border-gray-100 pt-3">
          <div className="flex flex-wrap gap-2 items-center">
            {[
              '#ef4444', '#f97316', '#f59e0b', '#eab308',
              '#84cc16', '#22c55e', '#10b981', '#14b8a6',
              '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
              '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'
            ].map(color => (
              <button
                key={color}
                type="button"
                className={`w-5 h-5 rounded cursor-pointer border ${eventColor === color ? 'border-gray-800 scale-110 shadow-sm' : 'border-black/10 hover:scale-110'} transition-transform`}
                style={{ backgroundColor: color }}
                onClick={() => setEventColor(color)}
                title={color}
              />
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};