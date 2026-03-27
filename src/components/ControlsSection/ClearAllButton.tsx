import React from 'react';
import { Trash2 } from 'lucide-react';
import { useTimelineStore } from '../../store/timelineStore';

export const ClearAllButton: React.FC = () => {
  const clearAll = useTimelineStore((state) => state.clearAll);

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all flows and events? This action cannot be undone.')) {
      clearAll();
    }
  };

  return (
    <button
      onClick={handleClearAll}
      className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors flex items-center justify-center ml-2"
      title="Clear All Data"
    >
      <Trash2 size={16} />
    </button>
  );
};

