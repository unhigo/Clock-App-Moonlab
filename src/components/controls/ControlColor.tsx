import React, { useRef } from 'react';

export interface ControlColorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export const ControlColor: React.FC<ControlColorProps> = ({
  label,
  value,
  onChange,
  className = '',
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const formattedHex = value.toUpperCase();

  return (
    <div
      onClick={() => {
        if (!disabled) inputRef.current?.click();
      }}
      className={`relative h-[32px] bg-[#171717] hover:bg-[#1E1E1E] transition-colors rounded-[8px] px-3 flex items-center justify-between select-none focus-within:ring-1 focus-within:ring-[#444444] ${
        disabled ? 'opacity-40 pointer-events-none' : 'cursor-pointer'
      } ${className}`}
    >
      {/* Hidden Color Picker Input */}
      <input
        ref={inputRef}
        type="color"
        value={value.startsWith('#') ? value : `#${value}`}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
        aria-label={label}
      />

      {/* Label (Left) */}
      <span className="text-[13px] font-[600] text-[#FFFFFF] tracking-tight truncate mr-2 pointer-events-none">
        {label}
      </span>

      {/* Right: Hex Code + 18px Swatch (Radius 5px, subtle border) */}
      <div className="flex items-center gap-2 shrink-0 pointer-events-none">
        <span className="text-[12px] font-[500] text-[#E5E5E5] font-mono tracking-wider tabular-nums">
          {formattedHex}
        </span>
        <div
          className="w-[18px] h-[18px] rounded-[5px] border border-white/15 shrink-0 shadow-none"
          style={{ backgroundColor: value }}
        />
      </div>
    </div>
  );
};
