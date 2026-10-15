import React, { useState, useMemo } from 'react';
import { getDateRangeLunarDays } from '../../utils/lunarEngine';
import { VectorMoon } from '../../components/lunar/VectorMoon';
import { LunarDayData } from '../../types';
import { Calendar, Sparkles, Compass } from 'lucide-react';

interface LunarSeasonRangeViewProps {
  onSelectDay?: (day: LunarDayData) => void;
  selectedDateStr?: string;
}

export const LunarSeasonRangeView: React.FC<LunarSeasonRangeViewProps> = ({
  onSelectDay,
  selectedDateStr
}) => {
  const [startDate, setStartDate] = useState('2026-06-21');
  const [endDate, setEndDate] = useState('2026-09-22');

  const presets = [
    { label: 'Verano 2026', start: '2026-06-21', end: '2026-09-22' },
    { label: 'Otoño 2026', start: '2026-09-23', end: '2026-12-21' },
    { label: 'Invierno 2026-27', start: '2026-12-22', end: '2027-03-20' },
    { label: 'Vacaciones 15d', start: '2026-07-15', end: '2026-07-30' },
    { label: 'Ciclo Lunar Completo', start: '2026-09-01', end: '2026-09-30' }
  ];

  const days = useMemo(() => {
    if (!startDate || !endDate || startDate > endDate) return [];
    return getDateRangeLunarDays(startDate, endDate);
  }, [startDate, endDate]);

  const fullMoons = useMemo(() => {
    return days.filter(d => d.phaseKey === 'FULL_MOON');
  }, [days]);

  return (
    <div className="w-full flex flex-col gap-4 font-sans select-none">
      {/* Date Pickers & Preset Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-[16px] bg-[#0A0A0A] border border-[#1F1F1F] rounded-[18px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-[#888888]" />
            <span className="text-[13px] font-[600] text-[#FFFFFF]">Desde:</span>
            <input
              type="date"
              value={startDate}
              min="2026-01-01"
              onChange={(e) => setStartDate(e.target.value)}
              className="h-[32px] bg-[#171717] hover:bg-[#1E1E1E] border-0 rounded-[8px] px-3 text-[12px] text-[#E5E5E5] focus:outline-none focus:ring-1 focus:ring-[#444444] font-mono select-none cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[13px] font-[600] text-[#FFFFFF]">Hasta:</span>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-[32px] bg-[#171717] hover:bg-[#1E1E1E] border-0 rounded-[8px] px-3 text-[12px] text-[#E5E5E5] focus:outline-none focus:ring-1 focus:ring-[#444444] font-mono select-none cursor-pointer"
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          {presets.map(p => (
            <button
              key={p.label}
              onClick={() => {
                setStartDate(p.start);
                setEndDate(p.end);
              }}
              className="h-[32px] px-3 rounded-[8px] bg-[#171717] hover:bg-[#1E1E1E] text-[12px] font-[500] text-[#E5E5E5] transition-colors cursor-pointer select-none focus:outline-none focus:ring-1 focus:ring-[#444444]"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stat Pill */}
      <div className="flex items-center justify-between p-[16px] rounded-[18px] bg-[#0A0A0A] border border-[#1F1F1F] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] text-[12px] text-[#888888]">
        <div>
          <span>Total período: <b className="text-[#FFFFFF]">{days.length} días</b></span>
          <span className="mx-2">•</span>
          <span>Lunas Llenas en el período: <b className="text-[#FFFFFF]">{fullMoons.length}</b></span>
        </div>
        <div className="font-mono text-[11px] text-[#888888]">
          Soporte sinódico continuo
        </div>
      </div>

      {/* Days Grid for Season Range */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 max-h-[500px] overflow-y-auto pr-1">
        {days.map(day => {
          const isSelected = selectedDateStr === day.date;
          const isPeak = day.isKeyPhase;

          return (
            <div
              key={day.date}
              onClick={() => onSelectDay && onSelectDay(day)}
              className={`group p-3 rounded-[12px] border flex flex-col justify-between items-center text-center transition-all cursor-pointer gap-2 ${
                isSelected
                  ? 'bg-white text-black border-white shadow-[0_0_12px_#ffffff]'
                  : isPeak
                  ? 'bg-[#181818] border-white/30 hover:border-white/60'
                  : 'bg-[#0f0f0f] border-white/8 hover:border-white/20 hover:bg-[#141414]'
              }`}
            >
              <div className="w-full flex items-center justify-between text-[10px] font-mono opacity-60">
                <span>{day.date.slice(5)}</span>
                {day.isSupermoon && <span className="text-amber-300 font-bold">SUPER</span>}
              </div>

              <VectorMoon
                phase={day.phase}
                phaseKey={day.phaseKey}
                size={32}
                glow={day.phaseKey === 'FULL_MOON'}
                className="group-hover:scale-115 transition-transform"
              />

              <div className="flex flex-col items-center">
                <span className="text-xs font-medium truncate max-w-full">
                  {day.phaseName}
                </span>
                <span className="text-[10px] font-mono opacity-50">
                  {day.illumination}% ilum • {day.moonAge}d
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
