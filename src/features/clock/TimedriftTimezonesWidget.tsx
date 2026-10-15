import React, { useState } from 'react';
import { useTimeStore } from '../../store/useTimeStore';
import { Plus, X, Globe, Check, Search } from 'lucide-react';
import { POPULAR_CITIES_CATALOG } from '../../data/defaultData';

export const TimedriftTimezonesWidget: React.FC = () => {
  const { 
    timezones, 
    addTimezone, 
    removeTimezone, 
    activePinnedCityId, 
    setActivePinnedCity 
  } = useTimeStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Local device IANA
  const localIana = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Format time for a given IANA timezone
  const getTimeForTz = (iana: string) => {
    try {
      const now = new Date();
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: iana,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).formatToParts(now);

      const h = parts.find(p => p.type === 'hour')?.value || '12';
      const m = parts.find(p => p.type === 'minute')?.value || '00';
      const ampm = parts.find(p => p.type === 'dayPeriod')?.value || 'AM';

      // 24-hour hour for day/night bar calculation
      const h24Str = new Intl.DateTimeFormat('en-US', {
        timeZone: iana,
        hour: 'numeric',
        hour12: false
      }).format(now);
      const h24 = parseInt(h24Str, 10) % 24;
      const dayProgress = Math.round((h24 / 24) * 100);

      // Calculate GMT offset
      const match = new Intl.DateTimeFormat('en-US', {
        timeZone: iana,
        timeZoneName: 'shortOffset'
      }).format(now);
      const gmt = match.split(' ').pop() || 'GMT+2:00';

      return {
        formatted: `${h}:${m}`,
        ampm,
        gmt,
        h24,
        dayProgress
      };
    } catch {
      return {
        formatted: '3:54',
        ampm: 'AM',
        gmt: 'GMT+2:00',
        h24: 3,
        dayProgress: 16
      };
    }
  };

  const filteredCatalog = POPULAR_CITIES_CATALOG.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      item.city.toLowerCase().includes(q) ||
      item.country.toLowerCase().includes(q) ||
      item.iana.toLowerCase().includes(q)
    );
  }).filter(item => !timezones.some(t => t.iana === item.iana));

  return (
    <div className="w-[280px] sm:w-[300px] select-none font-sans">
      {/* Outer Card Container from score.motion.dev */}
      <div className="bg-[#0c0f10] rounded-xl border border-[#1e2427] p-4 shadow-xl flex flex-col gap-3 relative ms-corner-bracket">
        {/* Header: "> TIMEZONES" and "+ Add" */}
        <div className="flex items-center justify-between">
          <span className="ms-kicker text-xs font-mono tracking-[0.16em]">
            <span className="ms-kicker-caret">&gt;</span> TIMEZONES
          </span>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-caps-stripe py-1 px-2.5 text-[10px]"
          >
            <Plus size={10} className="text-[var(--accent-rind)]" />
            <span>ADD</span>
          </button>
        </div>

        {/* Timezone Item(s) */}
        <div className="flex flex-col gap-2.5 max-h-[360px] overflow-y-auto pr-0.5 custom-scrollbar">
          {timezones.slice(0, 3).map(tz => {
            const timeInfo = getTimeForTz(tz.iana);
            const isLocal = tz.iana === localIana || tz.city === 'Madrid';
            const isPinned = activePinnedCityId === tz.id;

            return (
              <div
                key={tz.id}
                onClick={() => setActivePinnedCity(tz.id)}
                className={`group relative p-3 rounded-lg border transition-all cursor-pointer ${
                  isPinned
                    ? 'bg-[#14181a] border-[var(--border-focus)] shadow-inner'
                    : 'bg-black border-[#1e2427] hover:border-[var(--border-focus)] hover:bg-[#14181a]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Digital time readout */}
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-mono font-bold text-[#ededec] tracking-tight leading-none">
                        {timeInfo.formatted}
                      </span>
                      <span className="text-[10px] font-mono text-[#7a8180] uppercase">
                        {timeInfo.ampm}
                      </span>
                    </div>

                    {/* Miniature segmented emerald day/night progress indicator */}
                    <div className="flex items-center gap-0.5 mt-2">
                      {Array.from({ length: 12 }, (_, i) => {
                        const active = (i / 12) * 100 <= Math.max(15, timeInfo.dayProgress);
                        return (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-[1px] transition-colors ${
                              active
                                ? 'bg-[var(--accent-rind)] shadow-[0_0_4px_var(--accent-rind)]'
                                : 'bg-[#1e2427]'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Location info */}
                  <div className="text-right flex flex-col justify-between items-end">
                    <div className="text-xs font-medium text-[#ededec] truncate max-w-[130px]">
                      {tz.city}, <span className="text-[#7a8180] font-normal">{tz.country}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#7a8180] mt-1">
                      <span>{timeInfo.gmt}</span>
                      {isLocal && (
                        <>
                          <span>|</span>
                          <span className="text-[var(--accent-rind)] font-bold tracking-wider">LOCAL</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remove button on hover (if more than 1) */}
                {timezones.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTimezone(tz.id);
                    }}
                    className="absolute top-2 right-2 p-1 rounded text-white/30 hover:text-red-400 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    title="Remove timezone"
                  >
                    <X size={11} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060607]/80 backdrop-blur-sm">
          <div className="bg-[#13181a] rounded-xl w-full max-w-md p-5 flex flex-col gap-3.5 border border-[#1e2427] shadow-2xl relative ms-corner-bracket">
            <div className="flex items-center justify-between border-b border-[#1e2427] pb-2.5">
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-[var(--accent-rind)]" />
                <span className="ms-kicker text-xs font-mono tracking-wider">
                  <span className="ms-kicker-caret">&gt;</span> AGREGAR ZONA HORARIA
                </span>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setSearchQuery('');
                }}
                className="text-[#7a8180] hover:text-[#ededec] p-1"
              >
                ✕
              </button>
            </div>

            <div className="ms-input-wrap">
              <Search size={13} className="text-[#7a8180] mr-2" />
              <input
                type="text"
                placeholder="Buscar ciudad, país o IANA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-xs text-[#ededec] placeholder:text-[#7a8180] focus:outline-none font-mono"
              />
            </div>

            <div className="max-h-60 overflow-y-auto flex flex-col gap-1 pr-1 custom-scrollbar">
              {filteredCatalog.slice(0, 15).map(item => (
                <button
                  key={item.iana}
                  onClick={() => {
                    addTimezone({
                      city: item.city,
                      country: item.country,
                      iana: item.iana,
                      isFavorite: false
                    });
                    setIsAddModalOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full flex items-center justify-between p-2 rounded hover:bg-[#181f21] text-left transition-colors cursor-pointer border border-transparent hover:border-[#1e2427]"
                >
                  <div>
                    <div className="text-xs font-medium text-[#ededec]">{item.city}</div>
                    <div className="text-[10px] text-[#7a8180] font-mono">{item.country} • {item.iana}</div>
                  </div>
                  <Plus size={13} className="text-[#7a8180]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
