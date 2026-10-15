import React from 'react';
import { CityTimezone } from '../../types';
import { getTimezoneDetails } from '../../utils/date';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Star, Trash2, ArrowUp, ArrowDown, Sun, Moon } from 'lucide-react';

interface TimezoneCardProps {
  timezone: CityTimezone;
  onToggleFavorite: (id: string) => void;
  onRemove: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  isFirst: boolean;
  isLast: boolean;
}

export const TimezoneCard: React.FC<TimezoneCardProps> = ({
  timezone,
  onToggleFavorite,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast
}) => {
  const details = getTimezoneDetails(timezone.iana);

  return (
    <Card className="flex flex-col justify-between py-4 px-5 relative group">
      {/* Top Header: City, Country & Actions */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white tracking-tight">{timezone.city}</h3>
            <button
              onClick={() => onToggleFavorite(timezone.id)}
              className="p-0.5 text-[#666666] hover:text-amber-400 transition-colors cursor-pointer"
              title={timezone.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star 
                size={14} 
                className={timezone.isFavorite ? 'text-amber-400 fill-amber-400' : ''} 
              />
            </button>
          </div>
          <div className="text-xs text-[#A0A0A0] flex items-center gap-1.5 mt-0.5">
            <span>{timezone.country}</span>
            <span className="text-white/20">•</span>
            <span className="font-mono text-[11px] text-[#666666]">{details.tzName}</span>
          </div>
        </div>

        {/* Daytime / Nighttime Badge & Actions */}
        <div className="flex items-center gap-1.5">
          <Badge variant={details.isDaytime ? 'warning' : 'neutral'} size="sm">
            {details.isDaytime ? (
              <Sun size={11} className="text-amber-400" />
            ) : (
              <Moon size={11} className="text-indigo-400" />
            )}
            <span className="font-mono text-[10px]">{details.isDaytime ? 'Day' : 'Night'}</span>
          </Badge>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
            <button
              onClick={() => onMoveUp(timezone.id)}
              disabled={isFirst}
              className="p-1 text-[#666666] hover:text-white disabled:opacity-20 cursor-pointer"
              title="Move Up"
            >
              <ArrowUp size={13} />
            </button>
            <button
              onClick={() => onMoveDown(timezone.id)}
              disabled={isLast}
              className="p-1 text-[#666666] hover:text-white disabled:opacity-20 cursor-pointer"
              title="Move Down"
            >
              <ArrowDown size={13} />
            </button>
            <button
              onClick={() => onRemove(timezone.id)}
              className="p-1 text-[#666666] hover:text-red-400 transition-colors cursor-pointer"
              title="Remove City"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Clock Readout */}
      <div className="my-2 flex items-baseline justify-between">
        <div className="text-4xl font-mono font-bold text-white tracking-tight tabular-nums">
          {details.timeString}
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold text-white">
            {details.dayRelation !== 'Today' ? (
              <span className="text-amber-300 mr-1">{details.dayRelation},</span>
            ) : null}
            <span>{details.dateString}</span>
          </div>
          <div className="text-[11px] font-mono text-[#A0A0A0] mt-0.5">
            {details.diffFormatted}
          </div>
        </div>
      </div>

      {/* 24-hour visual daylight indicator bar */}
      <div className="mt-3 pt-3 border-t border-white/8">
        <div className="flex justify-between text-[10px] font-mono text-[#666666] mb-1">
          <span>00:00</span>
          <span>12:00</span>
          <span>24:00</span>
        </div>
        <div className="w-full h-1.5 bg-[#181818] rounded-full overflow-hidden relative">
          {/* Daytime zone approx 06:00 to 18:00 (25% to 75%) */}
          <div className="absolute left-[25%] right-[25%] top-0 bottom-0 bg-white/10" />
          {/* Current hour marker */}
          <div 
            className="absolute top-0 bottom-0 w-1.5 bg-white rounded-full"
            style={{ left: `${(details.hourNum / 24) * 100}%` }}
          />
        </div>
      </div>
    </Card>
  );
};
