import React from 'react';
import { PREDEFINED_COLORS } from '../../constants/colors';

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
