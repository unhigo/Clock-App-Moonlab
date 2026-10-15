import React from 'react';

export interface ControlToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export const ControlToggle: React.FC<ControlToggleProps> = ({
  label,
  checked,
  onChange,
  className = '',
  disabled = false,
}) => {
  return (
    <div
      onClick={() => {
        if (!disabled) onChange(!checked);
      }}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onChange(!checked);
        }
      }}
      className={`h-[32px] bg-[#171717] hover:bg-[#1E1E1E] transition-colors rounded-[8px] px-3 flex items-center justify-between select-none focus:outline-none focus:ring-1 focus:ring-[#444444] ${
        disabled ? 'opacity-40 pointer-events-none' : 'cursor-pointer'
      } ${className}`}
    >
      {/* Label (Left) */}
      <span className="text-[13px] font-[600] text-[#FFFFFF] tracking-tight truncate mr-2 pointer-events-none">
        {label}
      </span>

      {/* Minimalist Switch Track (Right) */}
      <div
        className={`relative inline-flex h-[16px] w-[28px] shrink-0 items-center rounded-full transition-colors duration-150 ${
          checked ? 'bg-[#E5E5E5]' : 'bg-[#2E2E2E]'
        }`}
      >
        {/* Dark Thumb */}
        <span
          className={`pointer-events-none inline-block h-[12px] w-[12px] rounded-full bg-[#121212] transition-transform duration-150 ${
            checked ? 'translate-x-[14px]' : 'translate-x-[2px]'
          }`}
        />
      </div>
    </div>
  );
};
