import React, { useState } from 'react';
import { Check } from 'lucide-react';
import type { TimelineEvent } from '../types/timeline';
import { PREDEFINED_COLORS } from '../constants/colors';

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
      className="absolute inset-0 bg-white/95 z-40 flex flex-col
        items-center justify-center p-2 rounded-sm gap-1
        cursor-default min-h-[80px]"
      style={{ minWidth: 200 }}
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
        <input
          type="color" value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-6 h-6 rounded border-none cursor-pointer"
          list="editPresetColors"
        />
        <datalist id="editPresetColors">
          {PREDEFINED_COLORS.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>
      <div className="flex gap-2">
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
