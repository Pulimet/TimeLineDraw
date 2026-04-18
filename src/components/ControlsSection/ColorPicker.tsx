import React, { useState } from 'react';
import { PREDEFINED_COLORS } from '../../constants/colors';

interface ColorPickerProps {
  eventColor: string;
  setEventColor: (color: string) => void;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ eventColor, setEventColor, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative block ${className || ''}`}>
      <button
        type="button"
        className="w-full h-full min-w-[28px] min-h-[28px] rounded border border-black/10 cursor-pointer hover:border-black/30 transition-colors shadow-sm block"
        style={{ backgroundColor: eventColor }}
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
      />
      
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
          />
          <div className="absolute right-0 bottom-full mb-2 bg-white shadow-xl border border-gray-200 p-2 rounded-md z-50 w-48 max-w-[200px]">
            <div className="flex flex-wrap gap-1.5 items-center justify-center">
              {PREDEFINED_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`w-5 h-5 rounded-[3px] cursor-pointer border ${
                    eventColor === color
                      ? 'border-gray-800 scale-110 shadow-sm'
                      : 'border-black/10 hover:scale-110'
                  } transition-transform`}
                  style={{ backgroundColor: color }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEventColor(color);
                    setIsOpen(false);
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
