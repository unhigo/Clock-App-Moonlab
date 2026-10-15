import { useState, useEffect, useRef } from 'react';
import { formatTimeComponents, formatDateFormatted, getDayProgress } from '../utils/date';
import { calculateSolarTimes } from '../utils/solar';
import { ClockSettings } from '../types';

export function useClock(settings: ClockSettings) {
  const [now, setNow] = useState<Date>(() => new Date());
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let timeoutId: number | null = null;
    let intervalId: number | null = null;
    let isCancelled = false;

    if (settings.showMilliseconds) {
      // High frequency loop with RAF for silky 60fps ms tick
      const tick = () => {
        if (isCancelled) return;
        setNow(new Date());
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);

      return () => {
        isCancelled = true;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    } else {
      // Align to exact second boundary for smooth, battery-friendly ticking
      const syncToSecond = () => {
        setNow(new Date());
        const msUntilNextSecond = 1000 - (Date.now() % 1000);
        timeoutId = window.setTimeout(() => {
          if (isCancelled) return;
          setNow(new Date());
          intervalId = window.setInterval(() => {
            if (isCancelled) return;
            setNow(new Date());
          }, 1000);
        }, msUntilNextSecond);
      };

      syncToSecond();

      return () => {
        isCancelled = true;
        if (timeoutId) clearTimeout(timeoutId);
        if (intervalId) clearInterval(intervalId);
      };
    }
  }, [settings.showMilliseconds]);

  const formatted = formatTimeComponents(
    now, 
    settings.format, 
    settings.showSeconds, 
    settings.showMilliseconds
  );

  const dateDetails = formatDateFormatted(now);
  const dayProgress = getDayProgress(now);
  const solar = calculateSolarTimes(now);

  return {
    now,
    time: formatted,
    date: dateDetails,
    progress: dayProgress,
    solar
  };
}
