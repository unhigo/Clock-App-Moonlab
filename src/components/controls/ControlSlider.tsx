import React, { useRef, useState, useCallback, useEffect } from 'react';

export interface ControlSliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  valueFormatter?: (val: number) => string;
  onChange: (value: number) => void;
  className?: string;
  disabled?: boolean;
}

export const ControlSlider: React.FC<ControlSliderProps> = ({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  valueFormatter,
  onChange,
  className = '',
  disabled = false,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Clamped percentage
  const safeMin = min;
  const safeMax = max > min ? max : min + 1;
  const clampedValue = Math.min(safeMax, Math.max(safeMin, value));
  const percentage = Math.min(100, Math.max(0, ((clampedValue - safeMin) / (safeMax - safeMin)) * 100));

  const updateFromPointer = useCallback(
    (clientX: number) => {
      if (!trackRef.current || disabled) return;
      const rect = trackRef.current.getBoundingClientRect();
      const rawPct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const rawVal = safeMin + rawPct * (safeMax - safeMin);

      // Quantize to step
      const stepVal = step > 0 ? Math.round((rawVal - safeMin) / step) * step + safeMin : rawVal;
      // Precision handling
      const precision = step.toString().split('.')[1]?.length || 0;
      const finalVal = parseFloat(Math.min(safeMax, Math.max(safeMin, stepVal)).toFixed(precision));

      onChange(finalVal);
    },
    [safeMin, safeMax, step, disabled, onChange]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      updateFromPointer(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {}
    }
  };

  const formattedValue = valueFormatter
    ? valueFormatter(clampedValue)
    : `${clampedValue}${unit ? `${unit}` : ''}`;

  // 7 subtle vertical ticks on the track
  const tickCount = 7;
  const ticks = Array.from({ length: tickCount }, (_, i) => (i / (tickCount - 1)) * 100);

  return (
    <div
      className={`relative h-[32px] bg-[#171717] hover:bg-[#1E1E1E] transition-colors rounded-[8px] px-3 flex items-center gap-3 select-none ${
        disabled ? 'opacity-40 pointer-events-none' : 'cursor-pointer'
      } ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      tabIndex={disabled ? -1 : 0}
      role="slider"
      aria-valuemin={safeMin}
      aria-valuemax={safeMax}
      aria-valuenow={clampedValue}
      aria-label={label}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          onChange(Math.min(safeMax, clampedValue + step));
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          onChange(Math.max(safeMin, clampedValue - step));
        } else if (e.key === 'Home') {
          e.preventDefault();
          onChange(safeMin);
        } else if (e.key === 'End') {
          e.preventDefault();
          onChange(safeMax);
        }
      }}
    >
      {/* Label (Left) */}
      <span className="text-[13px] font-[600] text-[#FFFFFF] tracking-tight shrink-0 pointer-events-none">
        {label}
      </span>

      {/* Integrated Track (Middle) */}
      <div 
        ref={trackRef}
        className="relative flex-1 h-[14px] flex items-center justify-center my-auto overflow-hidden pointer-events-none"
      >
        {/* Track Line */}
        <div className="absolute inset-x-0 h-[4px] bg-[#2E2E2E] rounded-full" />

        {/* Small vertical ticks #3D3D3D with low opacity */}
        <div className="absolute inset-x-0 h-full flex items-center justify-between px-1 pointer-events-none">
          {ticks.map((pct, i) => (
            <div
              key={i}
              className="w-[1px] h-[6px] bg-[#3D3D3D] opacity-60"
              style={{ position: 'absolute', left: `${pct}%`, transform: 'translateX(-50%)' }}
            />
          ))}
        </div>

        {/* Active Fill (Subtle) */}
        <div
          className="absolute left-0 h-[4px] bg-[#4A4A4A] rounded-full pointer-events-none"
          style={{ width: `${percentage}%` }}
        />

        {/* Narrow 4px Handle without circular knob */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-[4px] h-[12px] bg-[#E5E5E5] rounded-[1px] pointer-events-none transition-transform"
          style={{
            left: `calc(${percentage}% - 2px)`,
          }}
        />
      </div>

      {/* Numerical Value (Right) */}
      <span className="text-[12px] font-[500] text-[#E5E5E5] font-mono shrink-0 tabular-nums text-right min-w-[36px] pointer-events-none">
        {formattedValue}
      </span>
    </div>
  );
};
