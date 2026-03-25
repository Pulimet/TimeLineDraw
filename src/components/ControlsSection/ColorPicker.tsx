import React from 'react';

export const PREDEFINED_COLORS = [
  '#fca5a5', '#fdba74', '#fcd34d', '#fde047',
  '#bef264', '#86efac', '#6ee7b7', '#5eead4',
  '#67e8f9', '#7dd3fc', '#93c5fd', '#a5b4fc',
  '#c4b5fd', '#d8b4fe', '#f0abfc', '#f9a8d4'
];

interface ColorPickerProps {
  eventColor: string;
  setEventColor: (color: string) => void;
}

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
