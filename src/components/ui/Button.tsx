import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const base = "inline-flex items-center justify-center gap-2 font-medium tracking-tight rounded-lg transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer select-none";
  
  const sizeStyles = {
    sm: "text-xs px-2.5 py-1.5 h-8",
    md: "text-sm px-3.5 py-2 h-9",
    lg: "text-base px-5 py-2.5 h-11"
  };

  const variantStyles = {
    primary: "bg-[#FFFFFF] text-[#000000] hover:bg-[#EDEDED] font-semibold border border-white/40 shadow-[rgba(0,0,0,0.3)_0px_1px_2px_0px]",
    secondary: "bg-[#161616] text-[#FFFFFF] border border-white/15 hover:border-white/30 hover:bg-[#202020] shadow-[rgba(255,255,255,0.05)_0px_-1px_2px_0px_inset,rgba(255,255,255,0.15)_0px_1px_1px_0px_inset]",
    ghost: "bg-transparent text-[#A0A0A0] hover:text-[#FFFFFF] hover:bg-white/5",
    outline: "bg-transparent border border-white/20 text-[#FFFFFF] hover:border-white/40 hover:bg-white/5 shadow-[rgba(255,255,255,0.05)_0px_1px_1px_0px_inset]",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
  };

  return (
    <button
      className={`${base} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  );
};
