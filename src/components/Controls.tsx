import React, { useState, useEffect } from 'react';
import { useTimelineStore } from '../store/timelineStore';

export const Controls: React.FC = () => {
  const { flows, addFlow, addEvent } = useTimelineStore();
  
  const [newFlowTitle, setNewFlowTitle] = useState('');
  
  const [eventFlowId, setEventFlowId] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventStartMs, setEventStartMs] = useState(0);
  const [eventEndMs, setEventEndMs] = useState(1000);
  const [eventColor, setEventColor] = useState('#38bdf8');

  useEffect(() => {
    // If no flow is selected but there are flows available, select the first one
    if (!eventFlowId && flows.length > 0) {
      setEventFlowId(flows[0].id);
    } 
    // If the currently selected flow was deleted, fallback to the first available flow
    else if (eventFlowId && flows.length > 0 && !flows.find(f => f.id === eventFlowId)) {
      setEventFlowId(flows[0].id);
    }
  }, [flows, eventFlowId]);

  const handleAddFlow = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFlowTitle.trim()) {
      addFlow(newFlowTitle.trim());
      setNewFlowTitle('');
    }
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (eventFlowId && eventTitle.trim() && eventEndMs > eventStartMs) {
      addEvent({
        flowId: eventFlowId,
        title: eventTitle.trim(),
        startMs: Number(eventStartMs),
        endMs: Number(eventEndMs),
        color: eventColor,
      });
      // Reset somewhat
      setEventTitle('');
      setEventStartMs(eventEndMs);
      setEventEndMs(eventEndMs + 1000);
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
              value={eventFlowId}
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
      </form>
    </div>
  );
};