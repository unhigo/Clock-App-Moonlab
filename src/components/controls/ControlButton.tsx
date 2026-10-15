import React from 'react';

export interface ControlButtonProps {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'danger' | 'accent';
  className?: string;
  disabled?: boolean;
}

export const ControlButton: React.FC<ControlButtonProps> = ({
  label,
  icon,
  onClick,
  variant = 'default',
  className = '',
  disabled = false,
}) => {
  const getTextColor = () => {
    if (variant === 'danger') return 'text-[#FF5555] hover:text-[#FF7777]';
    if (variant === 'accent') return 'text-[#FFFFFF]';
    return 'text-[#FFFFFF]';
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`h-[32px] bg-[#171717] hover:bg-[#1E1E1E] active:bg-[#151515] transition-colors rounded-[8px] px-3 flex items-center justify-center gap-2 select-none focus:outline-none focus:ring-1 focus:ring-[#444444] ${getTextColor()} ${
        disabled ? 'opacity-40 pointer-events-none' : 'cursor-pointer'
      } ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="text-[13px] font-[600] tracking-tight truncate">
        {label}
      </span>
    </button>
  );
};
