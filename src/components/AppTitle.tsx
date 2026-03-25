import React from 'react';

export const AppTitle: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Timeline Diagram Generator</h1>
      <p className="text-gray-500 text-sm mt-1">
        Create, manage, and rearrange horizontal progress flows.
      </p>
    </div>
  );
};