import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  interactive?: boolean;
  active?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevated = false,
  interactive = false,
  active = false,
  className = '',
  ...props
}) => {
  const base = "rounded-2xl border transition-all duration-200 relative overflow-hidden";
  const bg = elevated ? "bg-[#181818]/90 backdrop-blur-md" : "bg-[#141414]/80 backdrop-blur-md";
  const border = active 
    ? "border-white/40" 
    : "border-white/12";
  const innerShadow = "shadow-[rgba(255,255,255,0.05)_0px_-1px_4px_1px_inset,rgba(255,255,255,0.22)_0px_1px_1px_0px_inset,rgba(0,0,0,0.4)_0px_8px_16px_0px]";
  const hover = interactive 
    ? "hover:border-white/25 hover:bg-[#1c1c1c] cursor-pointer active:scale-[0.99]" 
    : "";

  return (
    <div
      className={`${base} ${bg} ${border} ${innerShadow} ${hover} p-4 sm:p-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
