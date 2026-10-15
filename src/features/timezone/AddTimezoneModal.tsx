import React, { useState } from 'react';
import { Dialog } from '../../components/ui/Dialog';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { POPULAR_CITIES_CATALOG } from '../../data/defaultData';
import { getTimezoneDetails } from '../../utils/date';
import { Search, Plus, MapPin } from 'lucide-react';

interface AddTimezoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tz: { city: string; country: string; iana: string; isFavorite: boolean }) => void;
}

export const AddTimezoneModal: React.FC<AddTimezoneModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [query, setQuery] = useState('');

  const filtered = POPULAR_CITIES_CATALOG.filter(c => 
    c.city.toLowerCase().includes(query.toLowerCase()) ||
    c.country.toLowerCase().includes(query.toLowerCase()) ||
    c.iana.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add World Clock"
      description="Track local times, offsets and day relationships globally"
    >
      <div className="space-y-4">
        <Input
          placeholder="Search city, country, or timezone..."
          icon={<Search size={15} />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />

        <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#666666]">
              No matching cities found in library
            </div>
          ) : (
            filtered.map(city => {
              const details = getTimezoneDetails(city.iana);
              return (
                <div
                  key={city.iana}
                  onClick={() => {
                    onAdd({
                      city: city.city,
                      country: city.country,
                      iana: city.iana,
                      isFavorite: false
                    });
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#111111] hover:bg-[#181818] border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin size={14} className="text-[#666666] group-hover:text-white transition-colors" />
                    <div>
                      <div className="text-sm font-medium text-white">{city.city}</div>
                      <div className="text-[11px] text-[#A0A0A0]">{city.country} ({city.iana})</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <div className="text-sm font-mono font-semibold text-white">{details.timeString}</div>
                      <div className="text-[10px] font-mono text-[#666666]">{details.diffFormatted}</div>
                    </div>
                    <div className="p-1 rounded-md bg-white/5 group-hover:bg-white group-hover:text-black transition-colors">
                      <Plus size={14} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Dialog>
  );
};
