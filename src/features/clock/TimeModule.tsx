import React, { useEffect, useRef, useState, useMemo } from 'react';

export interface TimeModuleProps {
  accentColor?: string;
  className?: string;
  dateOverride?: Date;
}

export const TimeModule: React.FC<TimeModuleProps> = ({
  accentColor = '#ffffff',
  className = '',
  dateOverride
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timeDisplayRef = useRef<HTMLDivElement>(null);

  // Initial formatted date and time for SSR/first paint
  const [initialTime, setInitialTime] = useState(() => {
    const d = dateOverride || new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  });

  const [initialDate, setInitialDate] = useState(() => {
    const d = dateOverride || new Date();
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).toUpperCase();
  });

  // Pre-calculate tick geometry for strict radii: r = 200px, r = 150px, r = 100px
  const secondsTicks = useMemo(() => {
    const radius = 200;
    return Array.from({ length: 60 }, (_, i) => {
      const angle = i * 6; // 0 to 354 deg
      const rad = (angle * Math.PI) / 180;
      const x = Math.sin(rad) * radius;
      const y = -Math.cos(rad) * radius;
      const isMajor = i % 5 === 0;
      const label = String(i).padStart(2, '0');
      return { i, angle, x, y, isMajor, label };
    });
  }, []);

  const minutesTicks = useMemo(() => {
    const radius = 150;
    return Array.from({ length: 60 }, (_, i) => {
      const angle = i * 6;
      const rad = (angle * Math.PI) / 180;
      const x = Math.sin(rad) * radius;
      const y = -Math.cos(rad) * radius;
      const isMajor = i % 5 === 0;
      const label = String(i).padStart(2, '0');
      return { i, angle, x, y, isMajor, label };
    });
  }, []);

  const hoursTicks = useMemo(() => {
    const radius = 100;
    const hourLabels = ['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];
    
    // 12 Major Hour ticks + 12 intermediate half-hour ticks
    const items = [];
    for (let i = 0; i < 12; i++) {
      const angle = i * 30;
      const rad = (angle * Math.PI) / 180;
      const x = Math.sin(rad) * radius;
      const y = -Math.cos(rad) * radius;
      items.push({
        i,
        angle,
        x,
        y,
        isMajor: true,
        label: hourLabels[i]
      });

      // Half hour tick
      const halfAngle = angle + 15;
      const halfRad = (halfAngle * Math.PI) / 180;
      items.push({
        i: i + 0.5,
        angle: halfAngle,
        x: Math.sin(halfRad) * radius,
        y: -Math.cos(halfRad) * radius,
        isMajor: false,
        label: ''
      });
    }
    return items;
  }, []);

  // 60 FPS Real-Time Synchronization via requestAnimationFrame
  useEffect(() => {
    let animId: number;
    let lastDateCheck = 0;

    const updateTime = () => {
      const now = dateOverride || new Date();
      const ms = now.getMilliseconds();
      const s = now.getSeconds();
      const m = now.getMinutes();
      const h = now.getHours();

      // Continuous fractional values
      const sec = s + ms / 1000;
      const min = m + sec / 60;
      const hr = (h % 12) + min / 60;

      // Rotation angles injected directly into DOM CSS Custom Properties
      if (containerRef.current) {
        // Negative rotation sweeps counter-clockwise so that current time aligns under apex at 12 o'clock
        containerRef.current.style.setProperty('--sec-rot', `${-(sec / 60) * 360}deg`);
        containerRef.current.style.setProperty('--min-rot', `${-(min / 60) * 360}deg`);
        containerRef.current.style.setProperty('--hr-rot', `${-(hr / 12) * 360}deg`);
      }

      // Update digital readout directly without triggering React re-renders
      if (timeDisplayRef.current) {
        const hh = String(h).padStart(2, '0');
        const mm = String(m).padStart(2, '0');
        const ss = String(s).padStart(2, '0');
        timeDisplayRef.current.textContent = `${hh}:${mm}:${ss}`;
      }

      // Update date periodically
      const currentSeconds = Math.floor(now.getTime() / 1000);
      if (currentSeconds !== lastDateCheck) {
        lastDateCheck = currentSeconds;
        setInitialDate(
          now.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }).toUpperCase()
        );
      }

      animId = requestAnimationFrame(updateTime);
    };

    animId = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(animId);
  }, [dateOverride]);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center scale-90 sm:scale-105 md:scale-120 lg:scale-130 xl:scale-140 transform origin-center transition-transform select-none my-6 sm:my-8 lg:my-12 ${className}`}
      style={{
        width: '460px',
        height: '460px',
        '--sec-rot': '0deg',
        '--min-rot': '0deg',
        '--hr-rot': '0deg'
      } as React.CSSProperties}
    >
      {/* Visual Surface Base: #0A0A0A with subtle backdrop filter & ultra-fine border */}
      <div className="absolute inset-0 rounded-full bg-[#0A0A0A]/95 backdrop-blur-[1px] border border-white/[0.06] pointer-events-none" />

      {/* Top Anchor Marker: Apex (12 o'clock) vertical temporal reference line */}
      <div 
        className="absolute top-[14px] left-1/2 -translate-x-1/2 w-1.5 h-8 rounded-full z-30 pointer-events-none transition-colors"
        style={{ backgroundColor: accentColor || '#ffffff' }}
        title="Apex Reference Line (12:00)"
      />

      {/* ============================================================== */}
      {/* 1. SECONDS RING (r = 200px, diameter = 400px)                  */}
      {/* ============================================================== */}
      <div className="absolute w-[400px] h-[400px] rounded-full border border-white/[0.06] pointer-events-none" />
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ transform: 'rotate(var(--sec-rot))' }}
      >
        {secondsTicks.map((t) => (
          <div
            key={`sec-${t.i}`}
            className="absolute flex items-center justify-center pointer-events-none"
            style={{
              left: `calc(50% + ${t.x}px)`,
              top: `calc(50% + ${t.y}px)`
            }}
          >
            {t.isMajor ? (
              <span
                className="text-[11px] font-medium font-mono text-[#888888] leading-none select-none"
                style={{
                  transform: 'translate(-50%, -50%) rotate(calc(-1 * var(--sec-rot)))'
                }}
              >
                {t.label}
              </span>
            ) : (
              <span
                className="w-[1px] h-[5px] bg-white/20 rounded-full block"
                style={{
                  transform: `translate(-50%, -50%) rotate(${t.angle}deg)`
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* ============================================================== */}
      {/* 2. MINUTES RING (r = 150px, diameter = 300px)                  */}
      {/* ============================================================== */}
      <div className="absolute w-[300px] h-[300px] rounded-full border border-white/[0.06] pointer-events-none" />
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ transform: 'rotate(var(--min-rot))' }}
      >
        {minutesTicks.map((t) => (
          <div
            key={`min-${t.i}`}
            className="absolute flex items-center justify-center pointer-events-none"
            style={{
              left: `calc(50% + ${t.x}px)`,
              top: `calc(50% + ${t.y}px)`
            }}
          >
            {t.isMajor ? (
              <span
                className="text-[11px] font-medium font-mono text-[#888888] leading-none select-none"
                style={{
                  transform: 'translate(-50%, -50%) rotate(calc(-1 * var(--min-rot)))'
                }}
              >
                {t.label}
              </span>
            ) : (
              <span
                className="w-[1px] h-[5px] bg-white/20 rounded-full block"
                style={{
                  transform: `translate(-50%, -50%) rotate(${t.angle}deg)`
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* ============================================================== */}
      {/* 3. HOURS RING (r = 100px, diameter = 200px)                    */}
      {/* ============================================================== */}
      <div className="absolute w-[200px] h-[200px] rounded-full border border-white/[0.06] pointer-events-none" />
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ transform: 'rotate(var(--hr-rot))' }}
      >
        {hoursTicks.map((t) => (
          <div
            key={`hr-${t.i}`}
            className="absolute flex items-center justify-center pointer-events-none"
            style={{
              left: `calc(50% + ${t.x}px)`,
              top: `calc(50% + ${t.y}px)`
            }}
          >
            {t.isMajor ? (
              <span
                className="text-[11px] font-medium font-mono text-[#888888] leading-none select-none"
                style={{
                  transform: 'translate(-50%, -50%) rotate(calc(-1 * var(--hr-rot)))'
                }}
              >
                {t.label}
              </span>
            ) : (
              <span
                className="w-[1px] h-[5px] bg-white/20 rounded-full block"
                style={{
                  transform: `translate(-50%, -50%) rotate(${t.angle}deg)`
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* ============================================================== */}
      {/* 4. CENTER TYPOGRAPHY & NUMERICAL DISPLAY                       */}
      {/* ============================================================== */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
        {/* Main Time: Refined reduced scale, clean tracking */}
        <div
          ref={timeDisplayRef}
          className="font-mono font-light text-2xl sm:text-3xl text-[#FFFFFF] tracking-widest leading-none drop-shadow-none"
        >
          {initialTime}
        </div>

        {/* Date Subtitle: Uppercase with wide letter-spacing (tracking-[0.25em]), muted technical gray (#888888), font size 10px */}
        <div className="mt-2 font-sans text-[10px] uppercase tracking-[0.25em] text-[#888888] font-normal select-none">
          {initialDate}
        </div>
      </div>
    </div>
  );
};

export default TimeModule;
