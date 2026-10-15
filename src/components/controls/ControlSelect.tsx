import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface ControlSelectOption<T extends string | number = string> {
  value: T;
  label: string;
}

export interface ControlSelectProps<T extends string | number = string> {
  label: string;
  value: T;
  options: ControlSelectOption<T>[] | readonly { value: T; label: string }[];
  onChange: (value: T) => void;
  className?: string;
  disabled?: boolean;
}

export function ControlSelect<T extends string | number = string>({
  label,
  value,
  options,
  onChange,
  className = '',
  disabled = false,
}: ControlSelectProps<T>) {
  const currentOption = options.find((opt) => opt.value === value);
  const displayLabel = currentOption ? currentOption.label : String(value);

  return (
    <div
      className={`relative h-[32px] bg-[#171717] hover:bg-[#1E1E1E] transition-colors rounded-[8px] px-3 flex items-center justify-between select-none focus-within:ring-1 focus-within:ring-[#444444] ${
        disabled ? 'opacity-40 pointer-events-none' : 'cursor-pointer'
      } ${className}`}
    >
      {/* Invisible full-coverage native select for perfect accessibility & platform keyboard/touch handling */}
      <select
        value={String(value)}
        disabled={disabled}
        onChange={(e) => {
          const raw = e.target.value;
          const matched = options.find((opt) => String(opt.value) === raw);
          if (matched) {
            onChange(matched.value);
          }
        }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 appearance-none bg-transparent"
        aria-label={label}
      >
        {options.map((opt) => (
          <option key={String(opt.value)} value={String(opt.value)} className="bg-[#171717] text-[#E5E5E5]">
            {opt.label}
          </option>
        ))}
      </select>

      {/* Label (Left) */}
      <span className="text-[13px] font-[600] text-[#FFFFFF] tracking-tight truncate mr-2 pointer-events-none">
        {label}
      </span>

      {/* Value (Right) + Chevron */}
      <div className="flex items-center gap-1.5 shrink-0 pointer-events-none">
        <span className="text-[12px] font-[500] text-[#E5E5E5] truncate max-w-[120px]">
          {displayLabel}
        </span>
        <ChevronDown size={13} className="text-[#888888] shrink-0" />
      </div>
    </div>
  );
}
