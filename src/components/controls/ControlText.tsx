import React, { useState, useEffect } from 'react';

export interface ControlTextProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export const ControlText: React.FC<ControlTextProps> = ({
  label,
  value,
  placeholder = '',
  onChange,
  className = '',
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);

  useEffect(() => {
    setText(value);
  }, [value]);

  const commitValue = () => {
    onChange(text);
    setIsEditing(false);
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

      {/* Value (Right) */}
      <div className="flex-1 flex justify-end min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={text}
            placeholder={placeholder}
            autoFocus
            onChange={(e) => setText(e.target.value)}
            onBlur={commitValue}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitValue();
              if (e.key === 'Escape') {
                setText(value);
                setIsEditing(false);
              }
            }}
            className="w-full max-w-[140px] bg-transparent text-[12px] font-[500] text-[#E5E5E5] text-right outline-none p-0"
          />
        ) : (
          <span className="text-[12px] font-[500] text-[#E5E5E5] truncate max-w-[140px]">
            {value || <span className="text-[#888888]">{placeholder}</span>}
          </span>
        )}
      </div>
    </div>
  );
};
