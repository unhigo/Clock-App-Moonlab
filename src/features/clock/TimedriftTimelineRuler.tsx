import React, { useState, useRef, useMemo } from 'react';
import { useTimeStore } from '../../store/useTimeStore';
import { WatchDialTheme, TimelineRulerSpan, TimedriftMode } from '../../types';
import { LUNAR_STYLE_LIST } from '../../data/lunarStyles';
import { ChevronLeft, ChevronRight, Info, Clock, Sparkles, ShieldCheck, Waves } from 'lucide-react';

interface TimedriftTimelineRulerProps {
  currentHours: number;
  currentMinutes: number;
  currentSeconds: number;
}

export const TimedriftTimelineRuler: React.FC<TimedriftTimelineRulerProps> = ({
  currentHours,
  currentMinutes,
  currentSeconds
}) => {
  const { 
    watchTheme, 
    setWatchTheme, 
    rulerSpan, 
    setRulerSpan, 
    timedriftMode, 
    setTimedriftMode,
    lunarViewMode,
    setLunarViewMode,
    activeLunarStyleId,
    setActiveLunarStyleId,
    timezones,
    activePinnedCityId,
    settings,
    updateSettings,
    activeTab,
    setActiveTab
  } = useTimeStore();

  const [hoverMinute, setHoverMinute] = useState<number | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const rulerRef = useRef<HTMLDivElement>(null);

  // Determine pinned city name (defaults to Madrid as in screenshot)
  const pinnedCity = timezones.find(t => t.id === activePinnedCityId) || timezones[0];
  const cityName = pinnedCity ? pinnedCity.city : 'Madrid';

  // Ruler span: 36h is the default as shown in screenshot (00 to 36)
  const totalHours = rulerSpan === '12h' ? 12 : rulerSpan === '24h' ? 24 : 36;
  
  // Calculate position of the Madrid live needle
  // Current time normalized to totalHours
  const currentTotalMinutes = (currentHours * 60 + currentMinutes + currentSeconds / 60) % (totalHours * 60);
  const livePercent = Math.min(99.5, Math.max(0.5, (currentTotalMinutes / (totalHours * 60)) * 100));

  // Combined Theme list supporting all 10 lunar visual styles
  const THEMES = useMemo(() => {
    return LUNAR_STYLE_LIST.map(style => ({
      id: style.id,
      label: style.name.toUpperCase(),
      dialTheme: (style.id === 'cyber' ? 'cyber' : style.id === 'scientific' ? 'celestial' : style.id === 'modern_dark' ? 'stealth' : 'obsidian') as WatchDialTheme
    }));
  }, []);

  const currentThemeIdx = Math.max(0, THEMES.findIndex(t => t.id === activeLunarStyleId));
  const cycleTheme = (dir: 1 | -1) => {
    const nextIdx = (currentThemeIdx + dir + THEMES.length) % THEMES.length;
    const nextTheme = THEMES[nextIdx];
    setActiveLunarStyleId(nextTheme.id);
    setWatchTheme(nextTheme.dialTheme);
  };

  // Generate tick markers every 2 hours: 00, 02, 04 ... 36
  const markers = useMemo(() => {
    const result = [];
    const step = 2;
    for (let h = 0; h <= totalHours; h += step) {
      const pct = (h / totalHours) * 100;
      const formatted = h < 10 ? `0${h}` : `${h}`;
      result.push({ hour: h, label: formatted, pct });
    }
    return result;
  }, [totalHours]);

  // Sub-ticks every 1 hour and 30 minutes
  const subTicks = useMemo(() => {
    const result = [];
    for (let h = 0; h <= totalHours; h++) {
      result.push({ pct: (h / totalHours) * 100, isMajor: true });
      if (h < totalHours) {
        result.push({ pct: ((h + 0.5) / totalHours) * 100, isMajor: false });
      }
    }
    return result;
  }, [totalHours]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rulerRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const ratio = x / rect.width;
    const minute = Math.round(ratio * totalHours * 60);
    setHoverMinute(minute);
  };

  const handleMouseLeave = () => {
    setHoverMinute(null);
  };

  const formatScrubTime = (mins: number) => {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(h)}:${pad(m)}`;
  };

  return (
    <div className="w-full select-none font-sans z-30 shrink-0">
      {/* ============================================================== */}
      {/* TIMELINE RULER STAGE (Full width edge-to-edge as in screenshot) */}
      {/* ============================================================== */}
      <div 
        ref={rulerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full pt-8 pb-3 cursor-crosshair group px-4 sm:px-8 overflow-hidden bg-black"
      >
        {/* Madrid Live Marker Badge with vertical guide needle (score.motion.dev Lime Needle) */}
        <div 
          className="absolute z-20 flex flex-col items-center pointer-events-none transition-all duration-300"
          style={{ left: `${livePercent}%`, top: '2px', transform: 'translateX(-50%)' }}
        >
          {/* Madrid Badge */}
          <div className="bg-[#0e1213] border border-[var(--accent-rind)] text-[var(--accent-rind)] text-[10px] sm:text-[11px] font-mono font-medium px-2.5 py-0.5 rounded shadow-[0_0_12px_rgba(74,222,128,0.3)] tracking-wider">
            {cityName}
          </div>
          {/* Vertical indicator line dropping to the ruler */}
          <div className="w-[1.5px] h-6 bg-[var(--accent-rind)] shadow-[0_0_8px_var(--accent-rind)]" />
        </div>

        {/* Interactive Hover Scrub Marker */}
        {hoverMinute !== null && (
          <div 
            className="absolute z-20 flex flex-col items-center pointer-events-none top-0"
            style={{ 
              left: `${(hoverMinute / (totalHours * 60)) * 100}%`,
              transform: 'translateX(-50%)' 
            }}
          >
            <div className="bg-[#181f21] border border-[#1e2427] text-[#ededec] text-[10px] font-mono px-1.5 py-0.5 rounded shadow">
              {formatScrubTime(hoverMinute)}
            </div>
            <div className="w-[1px] h-7 bg-[var(--foreground-feint)]" />
          </div>
        )}

        {/* Ruler Axis Line */}
        <div className="relative w-full h-[1px] bg-[#1e2427] mt-1 mb-2">
          {/* Sub-ticks */}
          {subTicks.map((tick, i) => (
            <div
              key={`sub-${i}`}
              className={`absolute bottom-0 w-[1px] ${
                tick.isMajor ? 'h-2 bg-[#7a8180]/60' : 'h-1.2 bg-[#7a8180]/25'
              }`}
              style={{ left: `${tick.pct}%` }}
            />
          ))}
        </div>

        {/* Hour Number Labels: 00, 02, 04 ... 36 */}
        <div className="relative w-full h-4">
          {markers.map((m) => (
            <div
              key={`mark-${m.hour}`}
              className="absolute -top-1 text-[10px] sm:text-[11px] font-mono text-[#7a8180] -translate-x-1/2 transition-colors group-hover:text-[#ededec]"
              style={{ left: `${m.pct}%` }}
            >
              {m.label}
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* BOTTOM CONTROL BAR (score.motion.dev Precision Controls)      */}
      {/* ============================================================== */}
      <div className="w-full flex flex-wrap items-center justify-between px-4 sm:px-8 py-2.5 border-t border-[#1e2427] bg-[#0a0d0e]/95 text-xs text-[#7a8180] gap-y-3 font-mono">
        {/* Left: Mode Selection with radio dots */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              setTimedriftMode('normal');
              setLunarViewMode('clock_dial');
            }}
            className={`btn-caps-stripe py-1 px-2.5 text-[10px] ${
              lunarViewMode === 'clock_dial' && timedriftMode === 'normal'
                ? 'border-[var(--accent-rind)] text-[var(--accent-rind)] bg-black'
                : 'text-[#7a8180]'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${
              lunarViewMode === 'clock_dial' && timedriftMode === 'normal'
                ? 'bg-[var(--accent-rind)] shadow-[0_0_6px_var(--accent-rind)]' 
                : 'bg-[#7a8180]'
            }`} />
            <span>NORMAL</span>
          </button>

          <button
            onClick={() => {
              setTimedriftMode('clock');
              setLunarViewMode('clock_dial');
            }}
            className={`btn-caps-stripe py-1 px-2.5 text-[10px] ${
              timedriftMode === 'clock' && lunarViewMode === 'clock_dial'
                ? 'border-[var(--accent-rind)] text-[var(--accent-rind)] bg-black'
                : 'text-[#7a8180]'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${
              timedriftMode === 'clock' && lunarViewMode === 'clock_dial'
                ? 'bg-[var(--accent-rind)] shadow-[0_0_6px_var(--accent-rind)]' 
                : 'bg-[#7a8180]'
            }`} />
            <span>CLOCK</span>
          </button>

          <button
            onClick={() => {
              setTimedriftMode('normal');
              setLunarViewMode('monthly');
            }}
            className={`btn-caps-stripe py-1 px-2.5 text-[10px] ${
              lunarViewMode === 'monthly'
                ? 'border-[var(--accent-rind)] text-[var(--accent-rind)] bg-black'
                : 'text-[#7a8180]'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${
              lunarViewMode === 'monthly'
                ? 'bg-[var(--accent-rind)] shadow-[0_0_6px_var(--accent-rind)]' 
                : 'bg-[#7a8180]'
            }`} />
            <span>MENSUAL</span>
          </button>

          <button
            onClick={() => {
              setTimedriftMode('normal');
              setLunarViewMode('yearly_grid');
            }}
            className={`btn-caps-stripe py-1 px-2.5 text-[10px] ${
              lunarViewMode === 'yearly_grid'
                ? 'border-[var(--accent-rind)] text-[var(--accent-rind)] bg-black'
                : 'text-[#7a8180]'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${
              lunarViewMode === 'yearly_grid'
                ? 'bg-[var(--accent-rind)] shadow-[0_0_6px_var(--accent-rind)]' 
                : 'bg-[#7a8180]'
            }`} />
            <span>ANUAL</span>
          </button>

          <button
            onClick={() => {
              setTimedriftMode('normal');
              setLunarViewMode('canva_generator');
            }}
            className={`btn-caps-stripe py-1 px-2.5 text-[10px] ${
              lunarViewMode === 'canva_generator'
                ? 'btn-caps-stripe-accent'
                : 'text-[var(--accent-rind)]'
            }`}
          >
            <Sparkles size={10} />
            <span>CANVA</span>
          </button>

          <button
            id="btn-tides-simulator"
            onClick={() => {
              setActiveTab('tides');
            }}
            className={`btn-caps-stripe py-1 px-2.5 text-[10px] flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tides'
                ? 'border-[var(--accent-rind)] text-[var(--accent-rind)] bg-black'
                : 'text-[#7a8180] hover:text-[#ededec]'
            }`}
            title="Simulador de Mareas"
          >
            <Waves size={11} className={activeTab === 'tides' ? 'text-[var(--accent-rind)]' : 'text-[#7a8180]'} />
            <span>Simulador de Mareas</span>
          </button>
        </div>

        {/* Center: Theme Selector with Motion Caps */}
        <div className="flex items-center gap-1 bg-[#0d1111] p-0.5 rounded border border-[#1e2427]">
          <button
            onClick={() => cycleTheme(-1)}
            className="p-1 text-[#7a8180] hover:text-[#ededec] transition-colors cursor-pointer"
            title="Previous dial style"
          >
            <ChevronLeft size={13} />
          </button>

          <span className="text-[10px] font-mono uppercase tracking-widest text-[#ededec] px-2">
            {THEMES[currentThemeIdx]?.label || 'THE OBSIDIAN WATCH'}
          </span>

          <button
            onClick={() => cycleTheme(1)}
            className="p-1 text-[#7a8180] hover:text-[#ededec] transition-colors cursor-pointer"
            title="Next dial style"
          >
            <ChevronRight size={13} />
          </button>
        </div>

        {/* Right: Ruler Span & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3 text-[10px] font-mono">
          {/* 12 Hour toggle */}
          <button
            onClick={() => {
              setRulerSpan('12h');
              updateSettings({ clock: { ...settings.clock, format: '12h' } });
            }}
            className={`btn-caps-stripe py-1 px-2 ${
              rulerSpan === '12h' ? 'text-[#ededec] border-[#ededec]' : 'text-[#7a8180]'
            }`}
          >
            12H
          </button>

          {/* 36 Hour toggle (default from screenshot) */}
          <button
            onClick={() => setRulerSpan('36h')}
            className={`btn-caps-stripe py-1 px-2 ${
              rulerSpan === '36h' ? 'text-[#ededec] border-[#ededec]' : 'text-[#7a8180]'
            }`}
          >
            36H
          </button>

          {/* About Dialog Link */}
          <button
            onClick={() => setIsAboutOpen(true)}
            className="btn-caps-stripe py-1 px-2 text-[#7a8180] hover:text-[#ededec]"
          >
            <Info size={11} />
            <span>ABOUT</span>
          </button>

          {/* Privacy Policy Link */}
          <button
            onClick={() => setIsPrivacyOpen(true)}
            className="text-[#7a8180] hover:text-[#ededec] transition-colors cursor-pointer px-1 uppercase"
          >
            Privacy
          </button>
        </div>
      </div>

      {/* About Modal */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060607]/80 backdrop-blur-sm">
          <div className="bg-[#13181a] rounded-xl w-full max-w-md p-6 flex flex-col gap-4 border border-[#1e2427] shadow-2xl relative ms-corner-bracket">
            <div className="flex items-center justify-between border-b border-[#1e2427] pb-3">
              <span className="ms-kicker text-xs font-mono tracking-wider">
                <span className="ms-kicker-caret">&gt;</span> SYSTEM DOSSIER // TIMEDRIFT
              </span>
              <button
                onClick={() => setIsAboutOpen(false)}
                className="text-[#7a8180] hover:text-[#ededec] p-1 font-mono text-xs"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-[#ededec]/80 space-y-3 leading-relaxed font-mono">
              <p>
                TIMEDRIFT combina cronometría de alta precisión con cálculo lunar astronómico continuo, inspirado en relojería mecánica y el sistema estético técnico de score.motion.dev.
              </p>
              <div className="p-3 rounded bg-[#0d1111] border border-[#1e2427] font-mono text-[11px] text-[#ededec] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#7a8180]">Escala Continua:</span>
                  <span>Regla de 36 Horas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a8180]">Ancla Primaria:</span>
                  <span className="text-[var(--accent-rind)]">{cityName} (Sincronizado)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a8180]">Motor Lunar:</span>
                  <span>Ciclo Sinódico 29.53059d</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#1e2427]">
              <button
                onClick={() => setIsAboutOpen(false)}
                className="btn-caps-stripe btn-caps-stripe-accent py-1.5 px-4 text-[10px]"
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060607]/80 backdrop-blur-sm">
          <div className="bg-[#13181a] rounded-xl w-full max-w-md p-6 flex flex-col gap-4 border border-[#1e2427] shadow-2xl relative ms-corner-bracket">
            <div className="flex items-center justify-between border-b border-[#1e2427] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[var(--accent-rind)]" />
                <span className="ms-kicker text-xs font-mono tracking-wider">
                  <span className="ms-kicker-caret">&gt;</span> PRIVACIDAD &amp; DATOS LOCALES
                </span>
              </div>
              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="text-[#7a8180] hover:text-[#ededec] p-1 font-mono text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#ededec]/80 leading-relaxed font-mono">
              Timedrift opera 100% en local y offline-first dentro de su navegador. Todas las preferencias de zona horaria, notas lunares, estilos visuales y configuraciones se preservan exclusivamente en su dispositivo. Sin telemetría de terceros ni rastreo.
            </p>

            <div className="flex justify-end pt-2 border-t border-[#1e2427]">
              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="btn-caps-stripe btn-caps-stripe-primary py-1.5 px-4 text-[10px]"
              >
                ENTENDIDO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
