import React from 'react';

interface TimelineGridProps {
  maxEndTime: number;
}

export const TimelineGrid: React.FC<TimelineGridProps> = ({ maxEndTime }) => {
  const numMajorTicks = Math.ceil(maxEndTime / 1000);
  const majorTicks = Array.from({ length: numMajorTicks + 1 }, (_, i) => i * 1000);
  
  const numMinorTicks = Math.ceil(maxEndTime / 100);
  const minorTicks = Array.from({ length: numMinorTicks + 1 }, (_, i) => i * 100);

  return (
    <div className="absolute top-0 bottom-0 left-48 right-0 pointer-events-none z-0 overflow-hidden">
      {minorTicks.map((tick) => (
        <div
          key={`minor-${tick}`}
          className="absolute top-0 bottom-0 border-l border-gray-100"
          style={{ left: `${(tick / maxEndTime) * 100}%` }}
        />
      ))}
      {majorTicks.map((tick) => (
        <div
          key={`major-${tick}`}
          className="absolute top-0 bottom-0 border-l border-gray-300"
          style={{ left: `${(tick / maxEndTime) * 100}%` }}
        />
      ))}
    </div>
  );
};