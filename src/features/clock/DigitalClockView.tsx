import React from 'react';
import { useTimeStore } from '../../store/useTimeStore';
import { useClock } from '../../hooks/useClock';
import { Sunrise, Sunset, Clock as ClockIcon, Calendar as CalendarIcon, MapPin, Compass } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const DigitalClockView: React.FC = () => {
  const { settings, events, setActiveTab } = useTimeStore();
  const { time, date, progress, solar, now } = useClock(settings.clock);

  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Find next upcoming event for today
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const upcomingEvent = events.find(e => {
    const [h, m] = e.startTime.split(':').map(Number);
    return (h * 60 + m) >= currentMinutes;
  });

  const fontClass = settings.clock.typography === 'mono' 
    ? 'font-mono-time' 
    : settings.clock.typography === 'display' 
    ? 'font-display-title' 
    : 'font-sans';

  const sizeClasses = {
    compact: 'text-5xl sm:text-7xl md:text-8xl',
    standard: 'text-6xl sm:text-8xl md:text-9xl',
    large: 'text-7xl sm:text-9xl md:text-[11rem]',
    massive: 'text-8xl sm:text-[11rem] md:text-[13rem]'
  };

  const alignClasses = {
    center: 'items-center text-center',
    left: 'items-start text-left',
    right: 'items-end text-right'
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      {/* Primary Display Area */}
      <div className={`flex flex-col justify-center py-6 sm:py-10 ${alignClasses[settings.clock.alignment]}`}>
        {/* Date and Day Row */}
        {settings.clock.showDate && (
          <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-[#A0A0A0] uppercase tracking-widest mb-3">
            <span className="text-white font-semibold">{date.dayOfWeek}</span>
            <span className="text-white/20">•</span>
            <span>{date.monthName} {date.dayOfMonth}, {date.year}</span>
          </div>
        )}

        {/* Master Time Readout */}
        <div className="flex items-baseline gap-2 sm:gap-4 tracking-tighter">
          <div className={`${sizeClasses[settings.clock.size]} ${fontClass} font-bold text-white leading-none select-text`}>
            <span>{time.hours}</span>
            <span className="animate-pulse-subtle text-white/50">:</span>
            <span>{time.minutes}</span>
            {settings.clock.showSeconds && (
              <>
                <span className="animate-pulse-subtle text-white/40">:</span>
                <span className="text-white/75">{time.seconds}</span>
              </>
            )}
          </div>

          {/* Optional Milliseconds or AM/PM */}
          <div className="flex flex-col items-start gap-1 pb-2">
            {time.ampm && (
              <span className="text-base sm:text-2xl font-mono text-[#A0A0A0] font-semibold">
                {time.ampm}
              </span>
            )}
            {settings.clock.showMilliseconds && (
              <span className="text-xs sm:text-sm font-mono text-[#666666] tabular-nums">
                .{time.milliseconds}
              </span>
            )}
          </div>
        </div>

        {/* Timezone and Solar Summary Tagline */}
        {settings.clock.showTimezone && (
          <div className="flex items-center gap-2 mt-4 text-xs font-mono text-[#A0A0A0]">
            <MapPin size={13} className="text-white/50" />
            <span>{localTz}</span>
            <span className="text-white/20">•</span>
            <span className="text-[#666666]">UTC {-(new Date().getTimezoneOffset() / 60) >= 0 ? `+${-(new Date().getTimezoneOffset() / 60)}` : -(new Date().getTimezoneOffset() / 60)}:00</span>
          </div>
        )}
      </div>

      {/* Auxiliary Information Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {/* Day Progression Card */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#A0A0A0] mb-2 font-mono">
              <span className="uppercase tracking-wider">Day Progress</span>
              <span className="text-white font-semibold">{progress.percent}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden my-3">
              <div 
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-[11px] text-[#666666] font-mono mt-1">
            <span>{progress.hoursPassed}h elapsed</span>
            <span>{Math.round(progress.minutesRemaining / 60)}h remaining</span>
          </div>
        </Card>

        {/* Astronomical Solar Times Card */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#A0A0A0] mb-2 font-mono">
            <span className="uppercase tracking-wider">Solar Cycle</span>
            <Badge variant={solar.isDaytime ? 'warning' : 'neutral'}>
              {solar.isDaytime ? 'Daylight' : 'Night'}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 my-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-white">
              <Sunrise size={15} className="text-amber-400" />
              <span>{solar.sunrise}</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Sunset size={15} className="text-indigo-400" />
              <span>{solar.sunset}</span>
            </div>
          </div>
          <div className="text-[11px] text-[#666666] font-mono mt-1">
            Daylight duration: {solar.dayLength}
          </div>
        </Card>

        {/* Next Scheduled Timeline Block */}
        <Card 
          interactive 
          onClick={() => setActiveTab('timeline')}
          className="flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-xs text-[#A0A0A0] mb-2 font-mono">
            <span className="uppercase tracking-wider">Next On Timeline</span>
            <span className="text-[10px] text-white/50 underline">View all</span>
          </div>
          {upcomingEvent ? (
            <div className="my-1">
              <div className="text-sm font-semibold text-white truncate">{upcomingEvent.title}</div>
              <div className="text-xs font-mono text-[#A0A0A0] mt-1">
                {upcomingEvent.startTime} – {upcomingEvent.endTime}
              </div>
            </div>
          ) : (
            <div className="my-1 text-xs text-[#666666]">
              No further scheduled events for today
            </div>
          )}
          <div className="text-[11px] text-[#666666] font-mono mt-1">
            {events.length} total blocks planned
          </div>
        </Card>
      </div>
    </div>
  );
};
