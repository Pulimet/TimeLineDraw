import React from 'react';
import { AddFlowForm } from './ControlsSection/AddFlowForm';
import { AddEventForm } from './ControlsSection/AddEventForm';
import { TimelineSettings } from './ControlsSection/TimelineSettings';

export const Controls: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 items-stretch">
      <AddFlowForm />
      <AddEventForm />
      <TimelineSettings />
    </div>
  );
};