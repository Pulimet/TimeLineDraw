import React from 'react';

interface ColorPickerProps {
  eventColor: string;
  setEventColor: (color: string) => void;
}

const PREDEFINED_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ eventColor, setEventColor }) => {
  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      <div className="flex flex-wrap gap-2 items-center">
        {PREDEFINED_COLORS.map(color => (
          <button
            key={color}
            type="button"
            className={`w-5 h-5 rounded cursor-pointer border ${
              eventColor === color
                ? 'border-gray-800 scale-110 shadow-sm'
                : 'border-black/10 hover:scale-110'
            } transition-transform`}
            style={{ backgroundColor: color }}
            onClick={() => setEventColor(color)}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};
