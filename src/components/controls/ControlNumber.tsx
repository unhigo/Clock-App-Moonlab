import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface ControlNumberProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  className?: string;
  disabled?: boolean;
}

export const ControlNumber: React.FC<ControlNumberProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  className = '',
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(value));

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const commitValue = (valStr: string) => {
    let parsed = parseFloat(valStr);
    if (isNaN(parsed)) parsed = value;
    if (min !== undefined && parsed < min) parsed = min;
    if (max !== undefined && parsed > max) parsed = max;
    onChange(parsed);
    setInputValue(String(parsed));
    setIsEditing(false);
  };

  const handleStep = (direction: 1 | -1, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    let next = value + direction * step;
    if (min !== undefined && next < min) next = min;
    if (max !== undefined && next > max) next = max;
    const precision = step.toString().split('.')[1]?.length || 0;
    onChange(parseFloat(next.toFixed(precision)));
  };

  return (
    <div
      onClick={() => {
        if (!disabled) setIsEditing(true);
      }}
      className={`h-[32px] bg-[#171717] hover:bg-[#1E1E1E] transition-colors rounded-[8px] px-3 flex items-center justify-between select-none focus-within:ring-1 focus-within:ring-[#444444] ${
        disabled ? 'opacity-40 pointer-events-none' : 'cursor-pointer'
      } ${className}`}
    >
      {/* Label (Left) */}
      <span className="text-[13px] font-[600] text-[#FFFFFF] tracking-tight truncate mr-2 pointer-events-none">
        {label}
      </span>

      {/* Value & Stepper (Right) */}
      <div className="flex items-center gap-1.5 shrink-0">
        {isEditing ? (
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={inputValue}
            autoFocus
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => commitValue(inputValue)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitValue(inputValue);
              if (e.key === 'Escape') {
                setInputValue(String(value));
                setIsEditing(false);
              }
            }}
            className="w-16 bg-transparent text-[12px] font-[500] text-[#E5E5E5] font-mono text-right outline-none p-0"
          />
        ) : (
          <span className="text-[12px] font-[500] text-[#E5E5E5] font-mono tabular-nums">
            {value}{unit ? `${unit}` : ''}
          </span>
        )}

        {/* Subtle Stepper Arrows */}
        <div className="flex flex-col -space-y-1">
          <button
            type="button"
            onClick={(e) => handleStep(1, e)}
            disabled={disabled || (max !== undefined && value >= max)}
            className="text-[#888888] hover:text-[#FFFFFF] transition-colors p-0.5 leading-none disabled:opacity-20"
            aria-label="Increase"
          >
            <ChevronUp size={10} />
          </button>
          <button
            type="button"
            onClick={(e) => handleStep(-1, e)}
            disabled={disabled || (min !== undefined && value <= min)}
            className="text-[#888888] hover:text-[#FFFFFF] transition-colors p-0.5 leading-none disabled:opacity-20"
            aria-label="Decrease"
          >
            <ChevronDown size={10} />
          </button>
        </div>
      </div>
    </div>
  );
};
