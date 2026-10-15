import React, { useState, useMemo } from 'react';
import { getMonthLunarDays } from '../../utils/lunarEngine';
import { VectorMoon } from '../../components/lunar/VectorMoon';
import { LunarDayData } from '../../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from 'lucide-react';

interface LunarYearGridProps {
  onSelectDay?: (day: LunarDayData) => void;
  selectedDateStr?: string;
}

export const LunarYearGrid: React.FC<LunarYearGridProps> = ({
  onSelectDay,
  selectedDateStr
}) => {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [hoveredDay, setHoveredDay] = useState<LunarDayData | null>(null);

  const monthShort = [
    'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
    'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'
  ];

  // Generate data for all 12 months
  const yearData = useMemo(() => {
    const months = [];
    for (let m = 1; m <= 12; m++) {
      months.push({
        monthNumber: m,
        name: monthShort[m - 1],
        days: getMonthLunarDays(selectedYear, m)
      });
    }
    return months;
  }, [selectedYear]);

  // Total full moons in year
  const fullMoonsCount = useMemo(() => {
    let count = 0;
    yearData.forEach(m => {
      count += m.days.filter(d => d.phaseKey === 'FULL_MOON').length;
    });
    return count;
  }, [yearData]);

  return (
    <div className="w-full flex flex-col gap-4 font-sans select-none overflow-hidden">
      {/* Top Header & Year Controller */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedYear(Math.max(2026, selectedYear - 1))}
              disabled={selectedYear === 2026}
              className="p-1.5 rounded-lg bg-[#141414] hover:bg-[#202020] border border-white/10 text-white/70 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
              title="Año anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setSelectedYear(selectedYear + 1)}
              className="p-1.5 rounded-lg bg-[#141414] hover:bg-[#202020] border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
              title="Año siguiente"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex items-baseline gap-2">
            <h3 className="text-xl font-bold text-white tracking-tight font-display">
              CALENDARIO LUNAR ANUAL {selectedYear}
            </h3>
            <span className="text-xs text-white/50 font-mono">
              (12 Meses • Cuadrícula Matemática Continua)
            </span>
          </div>
        </div>

        {/* Legend / Key Stats */}
        <div className="flex items-center gap-4 text-xs font-mono text-white/70 bg-[#121212] px-3 py-1.5 rounded-lg border border-white/10">
          <span className="flex items-center gap-1.5">
            <VectorMoon phase={4} size={14} litColor="#ffffff" />
            <span>{fullMoonsCount} Lunas Llenas</span>
          </span>
          <span className="text-white/20">|</span>
          <span className="flex items-center gap-1.5">
            <VectorMoon phase={0} size={14} shadowColor="#27272a" />
            <span>Ciclo Sinódico 29.53d</span>
          </span>
        </div>
      </div>

      {/* The Mathematical Grid Table (Months as rows, days 1 to 31 as columns) */}
      <div className="w-full overflow-x-auto pb-2 custom-scrollbar">
        <div className="min-w-[780px] bg-[#090909] border border-white/10 rounded-[14px] p-3 flex flex-col gap-1.5">
          {/* Header row: Day numbers 1 to 31 */}
          <div className="grid grid-cols-[56px_repeat(31,1fr)] gap-1 text-center font-mono text-[10px] text-white/40 pb-1 border-b border-white/10">
            <div className="text-left pl-1 font-semibold text-white/60">MES</div>
            {Array.from({ length: 31 }, (_, i) => (
              <div key={`col-${i + 1}`} className="py-0.5">
                {i + 1}
              </div>
            ))}
          </div>

          {/* 12 Month Rows */}
          {yearData.map((m) => (
            <div
              key={`row-${m.monthNumber}`}
              className="grid grid-cols-[56px_repeat(31,1fr)] gap-1 items-center hover:bg-white/[0.02] rounded-lg transition-colors py-0.5"
            >
              {/* Row Header: Month Name */}
              <div className="font-mono text-xs font-bold text-white/80 pl-1 tracking-wider">
                {m.name}
              </div>

              {/* Day Cells (1 to 31) */}
              {Array.from({ length: 31 }, (_, i) => {
                const dayData = m.days[i];

                if (!dayData) {
                  // Day does not exist in this month (e.g. Feb 30)
                  return (
                    <div
                      key={`empty-${m.monthNumber}-${i}`}
                      className="aspect-square rounded-[4px] bg-white/[0.01] border border-transparent"
                    />
                  );
                }

                const isSelected = selectedDateStr === dayData.date;
                const isFull = dayData.phaseKey === 'FULL_MOON';
                const isNew = dayData.phaseKey === 'NEW_MOON';

                return (
                  <div
                    key={dayData.date}
                    onClick={() => onSelectDay && onSelectDay(dayData)}
                    onMouseEnter={() => setHoveredDay(dayData)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`group relative aspect-square rounded-[6px] border flex items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-black border-white shadow-[0_0_8px_#ffffff]'
                        : isFull
                        ? 'bg-white/15 border-white/40 hover:border-white shadow-[0_0_6px_rgba(255,255,255,0.3)]'
                        : isNew
                        ? 'bg-[#141414] border-white/10 hover:border-white/30'
                        : 'bg-[#0f0f0f] border-white/6 hover:border-white/20 hover:bg-[#181818]'
                    }`}
                    title={`${dayData.day} ${m.name} - ${dayData.phaseName} (${dayData.illumination}%)`}
                  >
                    <VectorMoon
                      phase={dayData.phase}
                      phaseKey={dayData.phaseKey}
                      size={14}
                      className="group-hover:scale-125 transition-transform"
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Selected/Hovered Day Inspector Bar */}
      <div className="min-h-[40px] bg-[#0c0c0c] border border-white/10 rounded-[10px] px-4 py-2 flex items-center justify-between text-xs text-white/80">
        {hoveredDay ? (
          <div className="flex items-center gap-3 w-full justify-between">
            <div className="flex items-center gap-2">
              <VectorMoon phase={hoveredDay.phase} phaseKey={hoveredDay.phaseKey} size={16} />
              <span className="font-semibold text-white">
                {hoveredDay.date} • {hoveredDay.phaseName}
              </span>
              {hoveredDay.traditionalName && (
                <span className="text-amber-300 font-serif italic text-[11px]">
                  ({hoveredDay.traditionalName})
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 font-mono text-[11px] text-white/60">
              <span>Iluminación: <b className="text-white">{hoveredDay.illumination}%</b></span>
              <span>Edad Lunar: <b className="text-white">{hoveredDay.moonAge}d</b></span>
              <span>Constelación: <b className="text-white">{hoveredDay.zodiacSign}</b></span>
            </div>
          </div>
        ) : (
          <span className="text-white/40 text-xs italic">
            Lectura inmediata de los 365 días del año. Haz clic sobre cualquier celda para seleccionarla.
          </span>
        )}
      </div>
    </div>
  );
};
