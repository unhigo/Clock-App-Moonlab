import React from 'react';
import { useTimeStore } from '../../store/useTimeStore';
import { useClock } from '../../hooks/useClock';

export const MinimalClockView: React.FC = () => {
  const { settings } = useTimeStore();
  const { time, date, progress } = useClock(settings.clock);

  const fontClass = settings.clock.typography === 'mono' 
    ? 'font-mono-time' 
    : settings.clock.typography === 'display' 
    ? 'font-display-title' 
    : 'font-sans';

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center text-center select-none py-12">
      <div className="text-xs sm:text-sm font-medium tracking-[0.25em] text-[#666666] uppercase mb-6">
        {date.dayOfWeek} • {date.monthShort} {date.dayOfMonth}
      </div>

      <div className={`text-7xl sm:text-9xl md:text-[12rem] lg:text-[14rem] font-bold tracking-tighter text-white leading-none ${fontClass}`}>
        <span>{time.hours}</span>
        <span className="text-white/40 animate-pulse-subtle">:</span>
        <span>{time.minutes}</span>
        {settings.clock.showSeconds && (
          <span className="text-3xl sm:text-5xl md:text-6xl text-white/50 ml-3 font-normal">
            {time.seconds}
          </span>
        )}
      </div>

      <div className="mt-8 flex items-center gap-3 text-xs font-mono text-[#666666]">
        <span>{progress.percent}% of day completed</span>
        <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white/60 rounded-full" 
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
