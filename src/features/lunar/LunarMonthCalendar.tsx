import React, { useState, useMemo } from 'react';
import { useTimeStore } from '../../store/useTimeStore';
import { getMonthLunarDays, TRADITIONAL_MOON_NAMES } from '../../utils/lunarEngine';
import { VectorMoon } from '../../components/lunar/VectorMoon';
import { LunarDayData, LunarCalendarFilter } from '../../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles, Filter } from 'lucide-react';

interface LunarMonthCalendarProps {
  onSelectDay?: (day: LunarDayData) => void;
  selectedDateStr?: string;
}

export const LunarMonthCalendar: React.FC<LunarMonthCalendarProps> = ({
  onSelectDay,
  selectedDateStr
}) => {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // September 2026 by default
  const [activeFilter, setActiveFilter] = useState<LunarCalendarFilter>('all');
  const [hoveredDay, setHoveredDay] = useState<LunarDayData | null>(null);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const weekdayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Days in selected month with lunar calculations
  const lunarDays = useMemo(() => {
    return getMonthLunarDays(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  // First day offset (0 = Sunday, 1 = Monday...)
  const firstDayOfMonth = new Date(Date.UTC(currentYear, currentMonth - 1, 1)).getUTCDay();

  const prevMonth = () => {
    if (currentMonth === 1) {
      if (currentYear > 2026) {
        setCurrentYear(currentYear - 1);
        setCurrentMonth(12);
      }
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const traditionalInfo = TRADITIONAL_MOON_NAMES[currentMonth];

  return (
    <div className="w-full flex flex-col gap-4 font-sans select-none">
      {/* Month Navigation & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1F1F1F]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              disabled={currentYear === 2026 && currentMonth === 1}
              className="h-[32px] w-[32px] rounded-[8px] bg-[#171717] hover:bg-[#1E1E1E] text-[#FFFFFF] flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer select-none focus:outline-none focus:ring-1 focus:ring-[#444444]"
              title="Mes anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextMonth}
              className="h-[32px] w-[32px] rounded-[8px] bg-[#171717] hover:bg-[#1E1E1E] text-[#FFFFFF] flex items-center justify-center transition-colors cursor-pointer select-none focus:outline-none focus:ring-1 focus:ring-[#444444]"
              title="Mes siguiente"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex items-baseline gap-2">
            <h3 className="text-[17px] font-[600] text-[#FFFFFF] tracking-tight">
              {monthNames[currentMonth - 1]} {currentYear}
            </h3>
            {traditionalInfo && (
              <span className="text-[12px] text-[#888888] hidden sm:inline-block font-sans">
                • {traditionalInfo.name} ({traditionalInfo.english})
              </span>
            )}
          </div>
        </div>

        {/* Filters: Todas, Lunas Llenas, Lunas Nuevas, Eventos */}
        <div className="flex items-center gap-1 bg-[#171717] p-1 rounded-[8px] text-[12px] font-[500]">
          <button
            onClick={() => setActiveFilter('all')}
            className={`h-[24px] px-2.5 rounded-[6px] transition-colors cursor-pointer select-none ${
              activeFilter === 'all'
                ? 'bg-[#2E2E2E] text-[#FFFFFF] font-[600]'
                : 'text-[#888888] hover:text-[#FFFFFF]'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setActiveFilter('full_moons')}
            className={`h-[24px] px-2.5 rounded-[6px] transition-colors cursor-pointer select-none ${
              activeFilter === 'full_moons'
                ? 'bg-[#2E2E2E] text-[#FFFFFF] font-[600]'
                : 'text-[#888888] hover:text-[#FFFFFF]'
            }`}
          >
            Lunas Llenas
          </button>
          <button
            onClick={() => setActiveFilter('new_moons')}
            className={`h-[24px] px-2.5 rounded-[6px] transition-colors cursor-pointer select-none ${
              activeFilter === 'new_moons'
                ? 'bg-[#2E2E2E] text-[#FFFFFF] font-[600]'
                : 'text-[#888888] hover:text-[#FFFFFF]'
            }`}
          >
            Lunas Nuevas
          </button>
          <button
            onClick={() => setActiveFilter('key_events')}
            className={`h-[24px] px-2.5 rounded-[6px] transition-colors cursor-pointer select-none flex items-center gap-1 ${
              activeFilter === 'key_events'
                ? 'bg-[#2E2E2E] text-[#FFFFFF] font-[600]'
                : 'text-[#888888] hover:text-[#FFFFFF]'
            }`}
          >
            <Sparkles size={11} />
            <span>Eventos</span>
          </button>
        </div>
      </div>

      {/* Weekday Labels Grid (Sun..Sat) */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-mono font-medium text-white/40 pb-1">
        {weekdayNames.map((d, i) => (
          <div key={d} className={`py-1 ${i === 0 || i === 6 ? 'text-white/60' : ''}`}>
            {d}
          </div>
        ))}
      </div>

      {/* Mathematical Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {/* Empty padding cells for first day of month */}
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div
            key={`empty-${i}`}
            className="aspect-square rounded-[12px] bg-white/[0.02] border border-white/[0.04] opacity-30 pointer-events-none"
          />
        ))}

        {/* Calendar Days */}
        {lunarDays.map((day) => {
          const isSelected = selectedDateStr === day.date;
          
          // Apply active filter
          let matchesFilter = true;
          if (activeFilter === 'full_moons') {
            matchesFilter = day.phaseKey === 'FULL_MOON';
          } else if (activeFilter === 'new_moons') {
            matchesFilter = day.phaseKey === 'NEW_MOON';
          } else if (activeFilter === 'key_events') {
            matchesFilter = day.isKeyPhase || day.isSupermoon || day.phaseKey === 'FULL_MOON';
          }

          const isPeak = day.isKeyPhase;
          const isSuper = day.isSupermoon;

          return (
            <div
              key={day.date}
              onClick={() => onSelectDay && onSelectDay(day)}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              className={`group relative aspect-square p-1.5 sm:p-2.5 rounded-[12px] border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-[#1c1c1c] border-white shadow-[0_0_15px_rgba(255,255,255,0.2)] ring-1 ring-white'
                  : matchesFilter
                  ? 'bg-[#0f0f0f] border-white/10 hover:border-white/30 hover:bg-[#161616] hover:scale-[1.02]'
                  : 'bg-[#0a0a0a] border-white/5 opacity-30 hover:opacity-70'
              }`}
            >
              {/* Top Row: Day Number & Supermoon badge */}
              <div className="flex items-center justify-between w-full">
                <span className={`text-xs font-mono font-medium ${
                  isPeak ? 'text-white font-bold' : 'text-white/70'
                }`}>
                  {day.day}
                </span>

                {isSuper && (
                  <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                    SUPER
                  </span>
                )}
                {day.isKeyPhase && !isSuper && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                )}
              </div>

              {/* Center: Vector Moon with exact illumination */}
              <div className="flex-1 flex items-center justify-center my-0.5">
                <VectorMoon
                  phase={day.phase}
                  phaseKey={day.phaseKey}
                  illumination={day.illumination}
                  size={28}
                  glow={day.phaseKey === 'FULL_MOON'}
                  className="transition-transform duration-300 group-hover:scale-115"
                />
              </div>

              {/* Bottom: Illumination % and Age */}
              <div className="flex items-center justify-between text-[9px] font-mono text-white/50 w-full pt-0.5">
                <span className={day.illumination > 80 ? 'text-white/90 font-medium' : ''}>
                  {day.illumination}%
                </span>
                <span className="hidden sm:inline text-white/35">
                  {day.moonAge}d
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hover Info Tooltip Bar */}
      <div className="min-h-[42px] bg-[#0d0d0d] border border-white/10 rounded-[12px] px-4 py-2 flex items-center justify-between text-xs text-white/80">
        {hoveredDay ? (
          <div className="flex items-center gap-3 w-full justify-between">
            <div className="flex items-center gap-2">
              <VectorMoon phase={hoveredDay.phase} phaseKey={hoveredDay.phaseKey} size={18} />
              <span className="font-semibold text-white">
                {hoveredDay.day} de {monthNames[hoveredDay.month - 1]} ({hoveredDay.phaseName})
              </span>
              {hoveredDay.traditionalName && (
                <span className="text-amber-300/80 font-serif italic text-[11px]">
                  • {hoveredDay.traditionalName}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px] text-white/60">
              <span>Iluminación: <b className="text-white">{hoveredDay.illumination}%</b></span>
              <span>Edad: <b className="text-white">{hoveredDay.moonAge} días</b></span>
              <span>Signo: <b className="text-white">{hoveredDay.zodiacSign}</b></span>
            </div>
          </div>
        ) : (
          <span className="text-white/40 text-xs italic">
            Coloca el cursor sobre un día para ver detalles astronómicos exactos o haz clic para seleccionarlo.
          </span>
        )}
      </div>
    </div>
  );
};
