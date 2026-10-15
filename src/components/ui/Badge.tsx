import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'accent' | 'success' | 'warning' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = ''
}) => {
  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 tracking-wider uppercase font-semibold",
    md: "text-xs px-2.5 py-1 font-medium"
  };

  const variantStyles = {
    neutral: "bg-white/5 text-[#A0A0A0] border border-white/10",
    accent: "bg-white text-black font-semibold",
    success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
    outline: "bg-transparent text-[#A0A0A0] border border-white/15"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full whitespace-nowrap select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
