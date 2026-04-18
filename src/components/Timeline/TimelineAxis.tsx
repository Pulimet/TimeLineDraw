import React, { useRef, useEffect } from 'react';
import { useTimelineStore } from '../../store/timelineStore';

interface TimelineAxisProps {
  ticks: number[];
  maxEndTime: number;
}

export const TimelineAxis: React.FC<TimelineAxisProps> = ({ ticks, maxEndTime }) => {
  const { flowColumnWidth, setFlowColumnWidth } = useTimelineStore();
  const draggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      
      const delta = e.pageX - startXRef.current;
      const newWidth = Math.max(100, Math.min(600, startWidthRef.current + delta));
      setFlowColumnWidth(newWidth);
    };

    const handlePointerUp = () => {
      if (draggingRef.current) {
        draggingRef.current = false;
        document.body.style.cursor = '';
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [setFlowColumnWidth]);

  return (
    <div className="flex bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
      <div 
        className="shrink-0 bg-gray-100 border-r border-gray-200 flex items-center p-2 text-gray-700 font-semibold sticky left-0 z-20 shadow-[1px_0_0_rgba(0,0,0,0.1)] relative"
        style={{ width: flowColumnWidth, minWidth: flowColumnWidth, maxWidth: flowColumnWidth }}
      >
        <span>Flows</span>
        <div 
          className="absolute top-0 right-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-400 z-30 opacity-50 transition-colors translate-x-1/2"
          onPointerDown={(e) => {
            e.preventDefault();
            draggingRef.current = true;
            startXRef.current = e.pageX;
            startWidthRef.current = flowColumnWidth;
            document.body.style.cursor = 'col-resize';
          }}
        />
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
