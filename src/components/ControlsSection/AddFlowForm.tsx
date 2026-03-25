import React, { useState } from 'react';
import { useTimelineStore } from '../../store/timelineStore';

export const AddFlowForm: React.FC = () => {
  const { addFlow } = useTimelineStore();
  const [newFlowTitle, setNewFlowTitle] = useState('');

  const handleAddFlow = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFlowTitle.trim()) {
      addFlow(newFlowTitle.trim());
      setNewFlowTitle('');
    }
  };

  return (
    <form onSubmit={handleAddFlow} className="bg-white p-4 rounded shadow border border-gray-200 flex-1 flex flex-col justify-end">
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Add Flow</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder="Flow Name..."
            value={newFlowTitle}
            onChange={(e) => setNewFlowTitle(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium"
          >
            Add
          </button>
        </div>
      </div>
    </form>
  );
};
