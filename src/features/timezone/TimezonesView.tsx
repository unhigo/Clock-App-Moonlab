import React, { useState } from 'react';
import { useTimeStore } from '../../store/useTimeStore';
import { TimezoneCard } from './TimezoneCard';
import { AddTimezoneModal } from './AddTimezoneModal';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Globe, Plus, Star } from 'lucide-react';

export const TimezonesView: React.FC = () => {
  const { 
    timezones, 
    addTimezone, 
    removeTimezone, 
    toggleFavoriteTimezone, 
    moveTimezone 
  } = useTimeStore();

  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const displayedTimezones = timezones
    .slice()
    .sort((a, b) => a.order - b.order)
    .filter(t => filter === 'all' || t.isFavorite);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Globe size={20} />
            <span>World Timezones</span>
          </h2>
          <p className="text-xs text-[#A0A0A0] mt-1">
            Global chronometer with calculated offsets and relative differences
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#111111] p-1 rounded-lg border border-white/8 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer font-medium ${
                filter === 'all' ? 'bg-white text-black font-semibold' : 'text-[#A0A0A0] hover:text-white'
              }`}
            >
              All ({timezones.length})
            </button>
            <button
              onClick={() => setFilter('favorites')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer font-medium ${
                filter === 'favorites' ? 'bg-white text-black font-semibold' : 'text-[#A0A0A0] hover:text-white'
              }`}
            >
              <Star size={11} className="text-amber-400" />
              <span>Favorites ({timezones.filter(t => t.isFavorite).length})</span>
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add City
          </Button>
        </div>
      </div>

      {/* Grid of Timezones */}
      {displayedTimezones.length === 0 ? (
        <Card className="text-center py-16 text-xs text-[#666666]">
          <Globe size={32} className="mx-auto mb-3 text-[#333333]" />
          <p className="text-sm font-medium text-white mb-1">No timezones in this view</p>
          <p className="text-[#A0A0A0]">
            {filter === 'favorites' ? 'Mark cities as favorites using the star icon.' : 'Add your first world clock.'}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add City
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedTimezones.map((tz, idx) => (
            <TimezoneCard
              key={tz.id}
              timezone={tz}
              onToggleFavorite={toggleFavoriteTimezone}
              onRemove={removeTimezone}
              onMoveUp={(id) => moveTimezone(id, 'up')}
              onMoveDown={(id) => moveTimezone(id, 'down')}
              isFirst={idx === 0}
              isLast={idx === displayedTimezones.length - 1}
            />
          ))}
        </div>
      )}

      <AddTimezoneModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addTimezone}
      />
    </div>
  );
};
