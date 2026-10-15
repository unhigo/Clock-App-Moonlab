import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost' | 'secondary' | 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  tooltip?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  variant = 'ghost',
  size = 'md',
  active = false,
  tooltip,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base"
  };

  const variantStyles = {
    ghost: active 
      ? "bg-white/10 text-white" 
      : "bg-transparent text-[#A0A0A0] hover:text-white hover:bg-white/5",
    secondary: active 
      ? "bg-white/15 text-white border-white/25" 
      : "bg-[#111111] border border-white/10 text-[#A0A0A0] hover:text-white hover:border-white/20",
    primary: "bg-white text-[#050505] hover:bg-[#E5E5E5] font-semibold",
    outline: "border border-white/15 text-[#A0A0A0] hover:text-white hover:border-white/30"
  };

  return (
    <button
      title={tooltip}
      className={`inline-flex items-center justify-center rounded-lg transition-all duration-150 active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
