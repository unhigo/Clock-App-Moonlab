import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 text-[#666666] pointer-events-none flex items-center">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={`w-full bg-[#111111] border border-white/10 rounded-lg text-sm text-white placeholder:text-[#555555] px-3.5 py-2 transition-all duration-150 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 disabled:opacity-40 ${icon ? 'pl-9' : ''} ${error ? 'border-red-500/50' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
