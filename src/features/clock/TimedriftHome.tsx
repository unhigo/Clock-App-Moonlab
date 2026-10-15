import React, { useState } from 'react';
import { useTimeStore } from '../../store/useTimeStore';
import { useClock } from '../../hooks/useClock';
import { ObsidianWatchDial } from './ObsidianWatchDial';
import { TimeModule } from './TimeModule';
import { TimedriftTimezonesWidget } from './TimedriftTimezonesWidget';
import { TimedriftTasksWidget } from './TimedriftTasksWidget';
import { TimedriftTimelineRuler } from './TimedriftTimelineRuler';
import { LunarMonthCalendar } from '../lunar/LunarMonthCalendar';
import { LunarYearGrid } from '../lunar/LunarYearGrid';
import { LunarSeasonRangeView } from '../lunar/LunarSeasonRangeView';
import { CanvaLunarGenerator } from '../generator/CanvaLunarGenerator';
import { LunarStylesGallery } from '../styles/LunarStylesGallery';
import { SettingsView } from '../settings/SettingsView';
import { MusicPlayerView } from '../music/MusicPlayerView';
import { 
  SlidersHorizontal, 
  Calendar as CalendarIcon, 
  Music, 
  HelpCircle, 
  User, 
  X,
  Sparkles,
  Palette,
  Grid,
  Layers,
  Compass
} from 'lucide-react';

export const TimedriftHome: React.FC = () => {
  const { 
    settings, 
    watchTheme, 
    timedriftMode, 
    lunarViewMode,
    setLunarViewMode,
    selectedLunarDay,
    setSelectedLunarDay,
    activeLunarStyleId,
    setActiveLunarStyleId,
    setShortcutsOpen,
    isPlayingAudio,
    toggleAudio
  } = useTimeStore();

  const { time, date, now } = useClock(settings.clock);
  
  // Modals for the top toolbar buttons
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [horologyMode, setHorologyMode] = useState<'timemodule' | 'astrolabe'>('timemodule');

  // In 'clock' mode, side widgets are hidden for pure clock focus
  const isZenMode = timedriftMode === 'clock';

  // Ensure two-digit hour for digital display
  const formattedHours = time.hours.length === 1 ? `0${time.hours}` : time.hours;

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between bg-black text-[#ededec] select-none overflow-hidden font-sans">
      {/* ============================================================== */}
      {/* TOP HEADER (score.motion.dev Precision Engineering Header)    */}
      {/* ============================================================== */}
      <header className="w-full flex items-center justify-between px-5 sm:px-8 py-3 z-30 shrink-0 border-b border-[#1e2427] bg-[#0a0d0e]/95 backdrop-blur-md">
        {/* Logo and Brand with Motion Kicker */}
        <div 
          onClick={() => setLunarViewMode('clock_dial')}
          className="flex items-center gap-3 cursor-pointer group"
          title="Volver al Dial Central"
        >
          {/* Motion brand emblem */}
          <div className="w-7 h-7 rounded border border-[#1e2427] group-hover:border-[var(--accent-rind)] bg-black flex items-center justify-center relative transition-colors shadow-inner">
            <div className="w-2 h-2 rounded-full bg-[var(--accent-rind)] shadow-[0_0_8px_var(--accent-rind)]" />
            <div className="absolute inset-0 rounded border-t border-[var(--accent-rind)]/40" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-[0.18em] text-[#ededec] uppercase font-display flex items-center gap-2">
              TIMEDRIFT
            </span>
            <span className="ms-kicker text-[9px] tracking-[0.18em]">
              <span className="ms-kicker-caret">&gt;</span> LUNAR CHRONOMETER
            </span>
          </div>
        </div>

        {/* Center Inline View Switcher: score.motion.dev button caps */}
        <div className="hidden md:flex items-center gap-1.5 bg-black p-1 rounded-lg border border-[#1e2427] text-xs">
          <button
            onClick={() => setLunarViewMode('clock_dial')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 font-mono text-[11px] tracking-wider uppercase ${
              lunarViewMode === 'clock_dial'
                ? 'bg-[#ededec] text-black font-bold shadow'
                : 'text-[#7a8180] hover:text-[#ededec] hover:bg-[#181f21]'
            }`}
          >
            <Compass size={12} className={lunarViewMode === 'clock_dial' ? 'text-black' : 'text-[var(--accent-rind)]'} />
            <span>Astrolabio</span>
          </button>

          <button
            onClick={() => setLunarViewMode('monthly')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 font-mono text-[11px] tracking-wider uppercase ${
              lunarViewMode === 'monthly'
                ? 'bg-[#ededec] text-[#0d1111] font-bold shadow'
                : 'text-[#7a8180] hover:text-[#ededec] hover:bg-[#181f21]'
            }`}
          >
            <CalendarIcon size={12} className={lunarViewMode === 'monthly' ? 'text-[#0d1111]' : 'text-[var(--accent-rind)]'} />
            <span>Mensual</span>
          </button>

          <button
            onClick={() => setLunarViewMode('yearly_grid')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 font-mono text-[11px] tracking-wider uppercase ${
              lunarViewMode === 'yearly_grid'
                ? 'bg-[#ededec] text-[#0d1111] font-bold shadow'
                : 'text-[#7a8180] hover:text-[#ededec] hover:bg-[#181f21]'
            }`}
          >
            <Grid size={12} className={lunarViewMode === 'yearly_grid' ? 'text-[#0d1111]' : 'text-[var(--accent-rind)]'} />
            <span>Anual</span>
          </button>

          <button
            onClick={() => setLunarViewMode('season_range')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 font-mono text-[11px] tracking-wider uppercase ${
              lunarViewMode === 'season_range'
                ? 'bg-[#ededec] text-[#0d1111] font-bold shadow'
                : 'text-[#7a8180] hover:text-[#ededec] hover:bg-[#181f21]'
            }`}
          >
            <Layers size={12} className={lunarViewMode === 'season_range' ? 'text-[#0d1111]' : 'text-[var(--accent-rind)]'} />
            <span>Temporadas</span>
          </button>

          <button
            onClick={() => setLunarViewMode('canva_generator')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 font-mono text-[11px] tracking-wider uppercase ${
              lunarViewMode === 'canva_generator'
                ? 'btn-caps-stripe-accent shadow-[0_0_12px_rgba(74,222,128,0.4)]'
                : 'text-[var(--accent-rind)] hover:text-[#ededec] hover:bg-[#181f21]'
            }`}
          >
            <Sparkles size={12} />
            <span>Generador Canva</span>
          </button>

          <button
            onClick={() => setLunarViewMode('styles_gallery')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 font-mono text-[11px] tracking-wider uppercase ${
              lunarViewMode === 'styles_gallery'
                ? 'bg-[#ededec] text-[#0d1111] font-bold shadow'
                : 'text-[#7a8180] hover:text-[#ededec] hover:bg-[#181f21]'
            }`}
          >
            <Palette size={12} className={lunarViewMode === 'styles_gallery' ? 'text-[#0d1111]' : 'text-[var(--accent-rind)]'} />
            <span>10 Estilos</span>
          </button>
        </div>

        {/* Right Toolbar Buttons with MotionScore Badge & Tactile Controls */}
        <div className="flex items-center gap-2">
          {/* Signature MotionScore Tier Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#1e2427] bg-[#0d1111] font-mono text-[10px] tracking-wide" title="MotionScore Animation Compositor Grade">
            <span className="text-[#7a8180]">MotionScore</span>
            <span className="px-1.5 py-0.5 rounded font-bold bg-[var(--tier-s)] text-[#060607]">S</span>
            <span className="text-[9px] text-[#7a8180] font-tabular">60fps</span>
          </div>

          {/* Quick Canva Generator Trigger */}
          <button
            onClick={() => setLunarViewMode(lunarViewMode === 'canva_generator' ? 'clock_dial' : 'canva_generator')}
            className={`btn-caps-stripe ${
              lunarViewMode === 'canva_generator'
                ? 'btn-caps-stripe-accent'
                : 'btn-caps-stripe-primary'
            }`}
            title="Generador de Calendarios tipo Canva"
          >
            <Sparkles size={12} />
            <span className="hidden sm:inline">GENERADOR</span>
          </button>

          {/* 1. Sliders / Settings Icon Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-8 h-8 rounded border border-[#1e2427] bg-[#181f21] hover:bg-[#222b2e] hover:border-[var(--border-focus)] text-[#7a8180] hover:text-[#ededec] flex items-center justify-center transition-all cursor-pointer"
            title="Configuración & Parámetros"
          >
            <SlidersHorizontal size={14} />
          </button>

          {/* 2. Calendar / Lunar Mode Toggle */}
          <button
            onClick={() => setLunarViewMode(lunarViewMode === 'monthly' ? 'clock_dial' : 'monthly')}
            className={`w-8 h-8 rounded border transition-all flex items-center justify-center cursor-pointer ${
              lunarViewMode === 'monthly' || lunarViewMode === 'yearly_grid'
                ? 'bg-[#ededec] text-[#0d1111] border-[#ededec] shadow-[0_0_12px_rgba(237,237,236,0.3)]'
                : 'border-[#1e2427] bg-[#181f21] hover:bg-[#222b2e] text-[#7a8180] hover:text-[#ededec]'
            }`}
            title="Ver Calendario Lunar Mensual"
          >
            <CalendarIcon size={14} />
          </button>

          {/* 3. Music Note Icon Button */}
          <button
            onClick={() => {
              toggleAudio();
              setIsMusicOpen(!isMusicOpen);
            }}
            className={`w-8 h-8 rounded border transition-all flex items-center justify-center cursor-pointer ${
              isPlayingAudio
                ? 'bg-[var(--accent-rind)] text-[#060607] border-[var(--accent-rind)] shadow-[0_0_12px_rgba(74,222,128,0.4)]'
                : 'border-[#1e2427] bg-[#181f21] hover:bg-[#222b2e] text-[#7a8180] hover:text-[#ededec]'
            }`}
            title={isPlayingAudio ? 'Sonido Ambiental Activo' : 'Reproducir Sintetizador Ambiental'}
          >
            <Music size={14} />
          </button>

          {/* 4. Question / Help Icon Button */}
          <button
            onClick={() => setShortcutsOpen(true)}
            className="w-8 h-8 rounded border border-[#1e2427] bg-[#181f21] hover:bg-[#222b2e] hover:border-[var(--border-focus)] text-[#7a8180] hover:text-[#ededec] flex items-center justify-center transition-all cursor-pointer"
            title="Atajos de Teclado & Ayuda"
          >
            <HelpCircle size={14} />
          </button>

          {/* 5. Sign In Pill Button */}
          <button
            onClick={() => setIsSignInOpen(true)}
            className="btn-caps-stripe py-1.5 px-3 text-[10px]"
          >
            <User size={11} className="text-[#7a8180]" />
            <span>SIGN IN</span>
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* CENTER STAGE (Left Timezones, Center Content, Right Tasks)     */}
      {/* ============================================================== */}
      <div className="relative flex-1 flex items-center justify-between px-2 sm:px-6 md:px-8 w-full min-h-0 overflow-y-auto custom-scrollbar">
        {/* Left Floating Widget: Timezones & Station */}
        <div 
          className={`transition-all duration-300 z-20 shrink-0 hidden xl:block ${
            !isZenMode && lunarViewMode !== 'canva_generator'
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-8 pointer-events-none'
          }`}
        >
          <TimedriftTimezonesWidget />
        </div>

        {/* Centerpiece Content Switcher - perfectly centered */}
        <div className="flex-1 flex flex-col items-center justify-center px-1 sm:px-4 w-full h-full my-auto">
          {/* MODE 1: TIME STUDIO — TIME WIDGET & ARCHITECTURE (TimeModule Concentric Rings) */}
          {lunarViewMode === 'clock_dial' && (
            <div className="relative w-full h-full flex flex-col items-center justify-center text-center my-auto">
              {horologyMode === 'timemodule' ? (
                <div className="relative flex flex-col items-center justify-center my-auto">
                  <TimeModule accentColor={settings.accentColor || '#ffffff'} />

                  {/* Horology Style Switcher */}
                  <div className="mt-2 sm:mt-4 flex items-center gap-2 z-20">
                    <div className="flex items-center gap-1 bg-[#111111] p-1 rounded-full border border-white/10 text-[11px] font-mono">
                      <button
                        onClick={() => setHorologyMode('timemodule')}
                        className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                          horologyMode === 'timemodule'
                            ? 'bg-white text-black font-semibold shadow-sm'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        Time Widget
                      </button>
                      <button
                        onClick={() => setHorologyMode('astrolabe')}
                        className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                          horologyMode === 'astrolabe'
                            ? 'bg-white text-black font-semibold shadow-sm'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        Astrolabio
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative flex flex-col items-center justify-center">
                  <ObsidianWatchDial
                    theme={watchTheme}
                    seconds={now.getSeconds()}
                    minutes={now.getMinutes()}
                    hours={now.getHours()}
                    year={date.year}
                  />

                  {/* Master Digital Time centered - reduced size */}
                  <div className="relative z-10 flex flex-col items-center justify-center mt-8 pointer-events-auto">
                    <div className="flex items-baseline gap-1 sm:gap-1.5 font-mono font-bold tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)]">
                      <span className="text-2xl sm:text-3xl md:text-4xl leading-none">
                        {formattedHours}
                      </span>
                      <span className="text-xl sm:text-2xl md:text-3xl text-white/50 leading-none">
                        :
                      </span>
                      <span className="text-2xl sm:text-3xl md:text-4xl leading-none">
                        {time.minutes}
                      </span>
                      <span className="text-xl sm:text-2xl md:text-3xl text-white/50 leading-none">
                        :
                      </span>
                      <span className="text-2xl sm:text-3xl md:text-4xl text-white/95 leading-none">
                        {time.seconds}
                      </span>

                      {time.ampm && (
                        <span className="text-xs sm:text-sm font-mono text-white/70 font-semibold tracking-wider ml-1.5">
                          {time.ampm}
                        </span>
                      )}
                    </div>

                    {/* Subtitle Date */}
                    <div className="mt-1.5 text-xs sm:text-sm font-normal text-[#8E8E93] tracking-wide font-mono">
                      <span>{date.dayOfWeek}, {date.monthName} {date.dayOfMonth}, {date.year}</span>
                    </div>
                  </div>

                  {/* Horology Style Switcher */}
                  <div className="mt-6 flex items-center gap-2 z-20">
                    <div className="flex items-center gap-1 bg-[#111111] p-1 rounded-full border border-white/10 text-[11px] font-mono">
                      <button
                        onClick={() => setHorologyMode('timemodule')}
                        className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                          horologyMode === 'timemodule'
                            ? 'bg-white text-black font-semibold shadow-sm'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        Time Widget
                      </button>
                      <button
                        onClick={() => setHorologyMode('astrolabe')}
                        className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                          horologyMode === 'astrolabe'
                            ? 'bg-white text-black font-semibold shadow-sm'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        Astrolabio
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE 2: MONTHLY LUNAR CALENDAR */}
          {lunarViewMode === 'monthly' && (
            <div className="w-full max-w-4xl py-2">
              <LunarMonthCalendar
                selectedDateStr={selectedLunarDay?.date}
                onSelectDay={(day) => setSelectedLunarDay(day)}
              />
            </div>
          )}

          {/* MODE 3: 12-MONTH MATHEMATICAL GRID */}
          {lunarViewMode === 'yearly_grid' && (
            <div className="w-full max-w-5xl py-2">
              <LunarYearGrid
                selectedDateStr={selectedLunarDay?.date}
                onSelectDay={(day) => setSelectedLunarDay(day)}
              />
            </div>
          )}

          {/* MODE 4: SEASON & VACATION RANGE VIEW */}
          {lunarViewMode === 'season_range' && (
            <div className="w-full max-w-4xl py-2">
              <LunarSeasonRangeView
                selectedDateStr={selectedLunarDay?.date}
                onSelectDay={(day) => setSelectedLunarDay(day)}
              />
            </div>
          )}

          {/* MODE 5: CANVA.COM LUNAR GENERATOR (HD, 2K, 4K, 8K, PDF, PNG, SVG) */}
          {lunarViewMode === 'canva_generator' && (
            <div className="w-full py-2">
              <CanvaLunarGenerator />
            </div>
          )}

          {/* MODE 6: 10 VISUAL STYLES GALLERY */}
          {lunarViewMode === 'styles_gallery' && (
            <div className="w-full py-2">
              <LunarStylesGallery
                currentStyleId={activeLunarStyleId}
                onSelectStyle={(styleId) => setActiveLunarStyleId(styleId)}
                onOpenGenerator={() => setLunarViewMode('canva_generator')}
              />
            </div>
          )}
        </div>

        {/* Right Floating Widget: Tasks & Daily Lunar Detail */}
        <div 
          className={`transition-all duration-300 z-20 shrink-0 hidden xl:block ${
            !isZenMode && lunarViewMode !== 'canva_generator'
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 translate-x-8 pointer-events-none'
          }`}
        >
          <TimedriftTasksWidget />
        </div>
      </div>

      {/* ============================================================== */}
      {/* BOTTOM TIMELINE RULER & MODE CONTROLS                         */}
      {/* ============================================================== */}
      <TimedriftTimelineRuler
        currentHours={now.getHours()}
        currentMinutes={now.getMinutes()}
        currentSeconds={now.getSeconds()}
      />

      {/* ============================================================== */}
      {/* OVERLAY MODALS (score.motion.dev Dossier & Card Aesthetic)     */}
      {/* ============================================================== */}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#060607]/80 backdrop-blur-md">
          <div className="bg-[#13181a] border border-[#1e2427] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative ms-corner-bracket">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#1e2427]">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-[var(--accent-rind)]" />
                <span className="ms-kicker text-xs font-mono tracking-[0.2em]">
                  <span className="ms-kicker-caret">&gt;</span> CONFIGURACIÓN DEL SISTEMA
                </span>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded text-[#7a8180] hover:text-[#ededec] hover:bg-[#181f21] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <SettingsView />
          </div>
        </div>
      )}

      {/* Music Player Modal */}
      {isMusicOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060607]/80 backdrop-blur-md">
          <div className="bg-[#13181a] border border-[#1e2427] rounded-xl w-full max-w-xl p-6 shadow-2xl relative ms-corner-bracket">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#1e2427]">
              <div className="flex items-center gap-2.5">
                <Music size={15} className="text-[var(--accent-rind)]" />
                <span className="ms-kicker text-xs font-mono tracking-[0.2em]">
                  <span className="ms-kicker-caret">&gt;</span> SINTETIZADOR AMBIENTAL
                </span>
              </div>
              <button
                onClick={() => setIsMusicOpen(false)}
                className="p-1 rounded text-[#7a8180] hover:text-[#ededec] hover:bg-[#181f21] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <MusicPlayerView />
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      {isSignInOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060607]/80 backdrop-blur-md">
          <div className="bg-[#13181a] border border-[#1e2427] rounded-xl w-full max-w-sm p-6 shadow-2xl flex flex-col gap-4 relative ms-corner-bracket">
            <div className="flex items-center justify-between border-b border-[#1e2427] pb-3">
              <div className="flex items-center gap-2">
                <User size={14} className="text-[var(--accent-rind)]" />
                <span className="ms-kicker text-xs font-mono tracking-[0.18em]">
                  <span className="ms-kicker-caret">&gt;</span> AUTH PERFIL
                </span>
              </div>
              <button
                onClick={() => setIsSignInOpen(false)}
                className="text-[#7a8180] hover:text-[#ededec]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#7a8180] leading-relaxed font-sans">
              Inicia sesión para sincronizar tus calendarios lunares personalizados, exportaciones y notas astronómicas.
            </p>

            <div className="flex flex-col gap-3">
              <div className="ms-input-wrap">
                <span className="ms-input-caret">&gt;</span>
                <input
                  type="email"
                  placeholder="you@domain.com"
                  className="w-full bg-transparent text-xs text-[#ededec] placeholder:text-[#7a8180] focus:outline-none font-mono"
                />
              </div>
              <button
                onClick={() => setIsSignInOpen(false)}
                className="btn-caps-stripe btn-caps-stripe-accent w-full py-2.5"
              >
                CONTINUAR CON CORREO
              </button>
            </div>

            <div className="text-[10px] text-[#7a8180] text-center font-mono">
              Cálculos sinódicos y locales con total privacidad.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
