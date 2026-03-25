import React from 'react';

interface TimelineAxisProps {
  ticks: number[];
  maxEndTime: number;
}

export const TimelineAxis: React.FC<TimelineAxisProps> = ({ ticks, maxEndTime }) => {
  return (
    <div className="flex bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
      <div className="w-48 shrink-0 bg-gray-100 border-r border-gray-200 flex items-center p-2 text-gray-700 font-semibold sticky left-0 z-20 shadow-[1px_0_0_rgba(0,0,0,0.1)]">
        Flows
      </div>
      <div className="flex-grow relative h-10 min-w-[600px]">
        {ticks.map((tick) => (
          <div
            key={tick}
            className="absolute top-0 bottom-0 border-l border-gray-300"
            style={{ left: `${(tick / maxEndTime) * 100}%` }}
          >
            <span className="absolute left-1 top-2 text-xs text-gray-500 whitespace-nowrap">
              {tick}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
