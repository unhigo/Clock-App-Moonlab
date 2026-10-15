import React, { useState } from 'react';
import { useTimeStore } from '../../store/useTimeStore';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { BarChart3, TrendingUp, Calendar, Clock, Flame, Award } from 'lucide-react';
import { padZero } from '../../utils/date';

export const StatsView: React.FC = () => {
  const { sessions } = useTimeStore();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  // Calculations
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Total Focus Minutes
  const totalFocusMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalSessionsCount = sessions.length;
  const avgSessionDuration = totalSessionsCount > 0 
    ? Math.round(totalFocusMinutes / totalSessionsCount) 
    : 0;

  // Today's stats
  const todaySessions = sessions.filter(s => s.date === todayStr);
  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  // This Week (last 7 days)
  const last7Days: { dateStr: string; label: string; minutes: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayTotal = sessions
      .filter(s => s.date === iso)
      .reduce((acc, s) => acc + s.durationMinutes, 0);

    last7Days.push({
      dateStr: iso,
      label: dayName,
      minutes: dayTotal
    });
  }

  const thisWeekTotalMinutes = last7Days.reduce((acc, d) => acc + d.minutes, 0);
  const maxDayMinutes = Math.max(...last7Days.map(d => d.minutes), 60);

  // Hourly distribution (00:00 to 23:00)
  const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => {
    const count = sessions.filter(s => {
      const h = new Date(s.timestamp).getHours();
      return h === hour;
    }).length;
    return { hour, count };
  });

  const maxHourCount = Math.max(...hourlyDistribution.map(h => h.count), 1);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <BarChart3 size={20} />
            <span>Productivity & Time Analytics</span>
          </h2>
          <p className="text-xs text-[#A0A0A0] mt-1">
            Quantitative analysis of cognitive focus sessions and historical cadence
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="neutral" size="md">
            <Clock size={13} className="text-white" />
            <span className="font-mono">{Math.round(totalFocusMinutes / 60)} hrs total logged</span>
          </Badge>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="py-4">
          <span className="text-[10px] font-mono uppercase text-[#666666]">Total Focus</span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white mt-1">
            {totalFocusMinutes} <span className="text-xs font-normal text-[#A0A0A0]">mins</span>
          </div>
          <div className="text-[11px] text-[#666666] mt-1">
            {(totalFocusMinutes / 60).toFixed(1)} cumulative hours
          </div>
        </Card>

        <Card className="py-4">
          <span className="text-[10px] font-mono uppercase text-[#666666]">Sessions</span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white mt-1">
            {totalSessionsCount}
          </div>
          <div className="text-[11px] text-[#666666] mt-1">
            Across focus & pomodoros
          </div>
        </Card>

        <Card className="py-4">
          <span className="text-[10px] font-mono uppercase text-[#666666]">Avg Duration</span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white mt-1">
            {avgSessionDuration} <span className="text-xs font-normal text-[#A0A0A0]">mins</span>
          </div>
          <div className="text-[11px] text-[#666666] mt-1">
            Per completed session
          </div>
        </Card>

        <Card className="py-4">
          <span className="text-[10px] font-mono uppercase text-[#666666]">Today</span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white mt-1">
            {todayMinutes} <span className="text-xs font-normal text-[#A0A0A0]">mins</span>
          </div>
          <div className="text-[11px] text-[#666666] mt-1">
            {todaySessions.length} sessions completed
          </div>
        </Card>
      </div>

      {/* Daily Focus Chart (Past 7 Days) */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-semibold text-white">Daily Focus Distribution (7 Days)</h3>
            <p className="text-xs text-[#A0A0A0] mt-0.5">
              Total this week: {Math.round(thisWeekTotalMinutes / 60)}h {thisWeekTotalMinutes % 60}m
            </p>
          </div>
          <div className="text-xs font-mono text-[#666666]">
            Max: {maxDayMinutes} mins/day
          </div>
        </div>

        {/* SVG/CSS Bar Chart */}
        <div className="flex items-end justify-between gap-2 h-44 pt-6 pb-2 px-2 border-b border-white/8">
          {last7Days.map(d => {
            const heightPercent = maxDayMinutes > 0 ? (d.minutes / maxDayMinutes) * 100 : 0;
            const isToday = d.dateStr === todayStr;

            return (
              <div key={d.dateStr} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="text-[10px] font-mono text-[#A0A0A0] opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                  {d.minutes}m
                </div>
                <div 
                  className={`w-full max-w-[48px] rounded-t-lg transition-all duration-300 ${
                    isToday ? 'bg-white' : 'bg-white/20 hover:bg-white/40'
                  }`}
                  style={{ height: `${Math.max(4, heightPercent)}%` }}
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-between gap-2 pt-2 px-2">
          {last7Days.map(d => (
            <div key={d.dateStr} className="flex-1 text-center">
              <span className="text-xs font-mono text-[#A0A0A0]">{d.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Hourly Focus Density (Time-of-day heatmap) */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Time-of-Day Productive Density</h3>
            <p className="text-xs text-[#A0A0A0] mt-0.5">
              Identifies which hours of the day your cognitive work clusters in
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#666666]">24h clock</span>
        </div>

        <div className="grid grid-cols-12 sm:grid-cols-24 gap-1.5 pt-2">
          {hourlyDistribution.map(h => {
            const intensity = h.count / maxHourCount;
            let bgClass = 'bg-white/5';
            if (h.count > 0) {
              if (intensity > 0.6) bgClass = 'bg-white text-black font-bold';
              else if (intensity > 0.3) bgClass = 'bg-white/60 text-black';
              else bgClass = 'bg-white/25 text-white';
            }

            return (
              <div
                key={h.hour}
                title={`${padZero(h.hour)}:00 — ${h.count} sessions`}
                className={`h-12 rounded-md flex flex-col items-center justify-between p-1 transition-all ${bgClass}`}
              >
                <span className="text-[9px] font-mono opacity-60">{padZero(h.hour)}</span>
                <span className="text-[10px] font-mono">{h.count > 0 ? h.count : ''}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Session History Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono uppercase text-[#A0A0A0]">
          <span>Historical Log</span>
          <span>{sessions.length} records</span>
        </div>

        <div className="space-y-2">
          {sessions.slice(0, 10).map(s => (
            <div
              key={s.id}
              className="flex items-center justify-between p-3 rounded-xl bg-[#111111] border border-white/5 text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${s.type === 'focus' ? 'bg-indigo-400' : 'bg-emerald-400'}`} />
                <span className="font-sans text-white font-medium">{s.label || 'Focus Session'}</span>
                <Badge variant="outline" size="sm">{s.type}</Badge>
              </div>

              <div className="flex items-center gap-4 text-[#A0A0A0]">
                <span>{s.durationMinutes} mins</span>
                <span className="text-white/20">•</span>
                <span className="text-[#666666]">{s.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
