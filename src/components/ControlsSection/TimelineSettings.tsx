import React from 'react';
import { useTimelineStore } from '../../store/timelineStore';

export const TimelineSettings: React.FC = () => {
  const { maxDuration, setMaxDuration, zoom, setZoom } = useTimelineStore();

  return (
    <div className="bg-white p-4 rounded shadow border border-gray-200 flex-1 flex flex-col justify-end">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Max Time (ms)</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            value={maxDuration}
            step={100}
            min={1000}
            onChange={(e) => setMaxDuration(Math.max(1000, Number(e.target.value)))}
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Scale (x{zoom.toFixed(1)})</label>
          <div className="flex items-center h-[30px]">
            <input
              type="range"
              min={1}
              max={5}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full cursor-pointer h-1 bg-gray-200 rounded-lg appearance-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};