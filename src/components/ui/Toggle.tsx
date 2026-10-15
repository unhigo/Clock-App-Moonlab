import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false
}) => {
  return (
    <label className={`flex items-center justify-between gap-4 cursor-pointer select-none ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-sm font-medium text-white">{label}</span>}
          {description && <span className="text-xs text-[#A0A0A0]">{description}</span>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-[16px] w-[28px] shrink-0 items-center rounded-full transition-colors duration-150 ease-in-out border-0 ${
          checked ? 'bg-[#E5E5E5]' : 'bg-[#2E2E2E]'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-[12px] w-[12px] transform rounded-full bg-[#121212] transition-transform duration-150 ease-in-out ${
            checked 
              ? 'translate-x-[14px]' 
              : 'translate-x-[2px]'
          }`}
        />
      </button>
    </label>
  );
};
