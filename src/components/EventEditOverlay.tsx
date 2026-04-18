import React, { useState } from 'react';
import { Check } from 'lucide-react';
import type { TimelineEvent } from '../types/timeline';
import { ColorPicker } from './ControlsSection/ColorPicker';

interface EventEditOverlayProps {
  evt: TimelineEvent;
  currentStart: number;
  currentEnd: number;
  onSave: (fields: Partial<TimelineEvent>) => void;
  onCancel: () => void;
}

export const EventEditOverlay: React.FC<EventEditOverlayProps> = ({
  evt, currentStart, currentEnd, onSave, onCancel,
}) => {
  const [title, setTitle] = useState(evt.title);
  const [start, setStart] = useState(Math.round(currentStart));
  const [end, setEnd] = useState(Math.round(currentEnd));
  const [color, setColor] = useState(evt.color);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave({
      title: title.trim() || evt.title,
      startMs: start,
      endMs: end,
      color,
    });
  };

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col
        items-center justify-center p-3 rounded-lg gap-2
        cursor-default shadow-xl border border-gray-300 bg-white"
      style={{ minWidth: 220 }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-xs p-1 border border-gray-300
          rounded text-center focus:outline-none
          focus:border-blue-500"
        placeholder="Title"
      />
      <div className="flex gap-2 w-full justify-center items-center">
        <input
          type="number" value={start}
          onChange={(e) => setStart(Number(e.target.value))}
          className="w-16 text-xs p-1 border border-gray-300
            rounded text-center focus:outline-none
            focus:border-blue-500"
        />
        <span className="text-xs text-gray-500">-</span>
        <input
          type="number" value={end}
          onChange={(e) => setEnd(Number(e.target.value))}
          className="w-16 text-xs p-1 border border-gray-300
            rounded text-center focus:outline-none
            focus:border-blue-500"
        />
      </div>
      <div className="flex gap-2 w-full justify-center items-center">
        <ColorPicker eventColor={color} setEventColor={setColor} />
        <button onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-600 text-white
            py-1 px-3 rounded text-xs flex items-center
            transition-colors">
          <Check size={12} className="mr-1" /> Save
        </button>
        <button onClick={(e) => { e.stopPropagation(); onCancel(); }}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700
            py-1 px-3 rounded text-xs transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
};
