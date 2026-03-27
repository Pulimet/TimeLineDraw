import React, { useEffect } from 'react';
import { useStore } from 'zustand';
import { Undo, Redo } from 'lucide-react';
import { useTimelineStore } from '../../store/timelineStore';

export const UndoRedoControls: React.FC = () => {
  const { undo, redo, pastStates, futureStates } = useStore(useTimelineStore.temporal, (state) => state);

  const handleUndo = () => {
    if (pastStates.length > 0) undo();
  };

  const handleRedo = () => {
    if (futureStates.length > 0) redo();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if (
        ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') ||
        ((e.metaKey || e.ctrlKey) && e.key === 'y')
      ) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pastStates, futureStates, undo, redo]);

  return (
    <div className="flex gap-2 items-center mr-2">
      <button
        onClick={handleUndo}
        disabled={pastStates.length === 0}
        className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 transition-colors flex items-center justify-center"
        title="Undo (Ctrl+Z)"
      >
        <Undo size={16} />
      </button>
      <button
        onClick={handleRedo}
        disabled={futureStates.length === 0}
        className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 transition-colors flex items-center justify-center"
        title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
      >
        <Redo size={16} />
      </button>
    </div>
  );
};
