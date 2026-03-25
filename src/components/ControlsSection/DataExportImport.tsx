import React, { useRef } from 'react';
import { useTimelineStore } from '../../store/timelineStore';

export const DataExportImport: React.FC = () => {
  const store = useTimelineStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataToExport = {
      flows: store.flows,
      events: store.events,
      maxDuration: store.maxDuration,
      zoom: store.zoom,
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `timeline-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsedData = JSON.parse(content);
        
        // Basic validation
        if (parsedData.flows && parsedData.events) {
          store.importData({
            flows: parsedData.flows,
            events: parsedData.events,
            maxDuration: parsedData.maxDuration || 10000,
            zoom: parsedData.zoom || 1,
          });
        } else {
          alert('Invalid file format. Missing "flows" or "events".');
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        alert('Failed to parse JSON file.');
      }
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={handleExport}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm font-medium border border-gray-300 transition-colors"
        title="Export Data"
      >
        Export
      </button>
      <button
        onClick={handleImportClick}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm font-medium border border-gray-300 transition-colors"
        title="Import Data"
      >
        Import
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
    </div>
  );
};