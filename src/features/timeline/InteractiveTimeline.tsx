import React, { useState, useRef, useEffect } from 'react';
import { useTimeStore } from '../../store/useTimeStore';
import { TimelineEvent, EventCategory } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { TimeBlockModal } from './TimeBlockModal';
import { Plus, Clock, Filter, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { padZero } from '../../utils/date';

const CATEGORY_COLORS: Record<EventCategory, { bg: string; text: string; border: string }> = {
  FOCUS: { bg: 'bg-indigo-500/20', text: 'text-indigo-300', border: 'border-indigo-500/40' },
  WORK: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/40' },
  MEETING: { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/40' },
  BREAK: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40' },
  PERSONAL: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/40' },
  OTHER: { bg: 'bg-zinc-500/20', text: 'text-zinc-300', border: 'border-zinc-500/40' }
};

export const InteractiveTimeline: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent, duplicateEvent } = useTimeStore();
  const [zoom, setZoom] = useState<'DAY' | 'WEEK' | 'MONTH'>('DAY');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<TimelineEvent | null>(null);
  const [modalInitialStart, setModalInitialStart] = useState('09:00');

  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentPercent = (currentMinutes / 1440) * 100;

  // Auto-scroll to current time on mount
  useEffect(() => {
    if (timelineContainerRef.current) {
      const container = timelineContainerRef.current;
      const scrollTarget = (container.scrollWidth * (currentPercent / 100)) - (container.clientWidth / 2);
      container.scrollTo({ left: Math.max(0, scrollTarget), behavior: 'smooth' });
    }
  }, []);

  const scrollToNow = () => {
    if (timelineContainerRef.current) {
      const container = timelineContainerRef.current;
      const scrollTarget = (container.scrollWidth * (currentPercent / 100)) - (container.clientWidth / 2);
      container.scrollTo({ left: Math.max(0, scrollTarget), behavior: 'smooth' });
    }
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If clicked on an event block, don't create new
    if ((e.target as HTMLElement).closest('.event-block')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    const totalMinutes = Math.round(fraction * 1440);
    // Snap to 15 minute increments
    const snappedMinutes = Math.floor(totalMinutes / 15) * 15;
    const hour = Math.floor(snappedMinutes / 60);
    const min = snappedMinutes % 60;
    const startStr = `${padZero(hour)}:${padZero(min)}`;

    setEventToEdit(null);
    setModalInitialStart(startStr);
    setIsModalOpen(true);
  };

  const filteredEvents = events.filter(e => {
    if (categoryFilter !== 'ALL' && e.category !== categoryFilter) return false;
    return true;
  });

  const hoursArray = Array.from({ length: 25 }, (_, i) => i);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Clock size={20} />
            <span>Interactive Timeline</span>
          </h2>
          <p className="text-xs text-[#A0A0A0] mt-1">
            24-hour synchronized schedule and focus blocks
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Selector */}
          <div className="flex items-center bg-[#111111] p-1 rounded-lg border border-white/8 text-xs">
            {(['DAY', 'WEEK', 'MONTH'] as const).map(z => (
              <button
                key={z}
                onClick={() => setZoom(z)}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer font-medium ${
                  zoom === z ? 'bg-white text-black font-semibold' : 'text-[#A0A0A0] hover:text-white'
                }`}
              >
                {z}
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => {
              setEventToEdit(null);
              setModalInitialStart('09:00');
              setIsModalOpen(true);
            }}
          >
            Add Block
          </Button>
        </div>
      </div>

      {/* Filter and Scroll Row */}
      <div className="flex items-center justify-between gap-3 text-xs overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5 shrink-0">
          <Filter size={13} className="text-[#666666] mr-1" />
          {['ALL', 'FOCUS', 'WORK', 'MEETING', 'BREAK', 'PERSONAL'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-white/10 text-white border-white/30'
                  : 'bg-transparent text-[#666666] border-white/5 hover:text-[#A0A0A0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {zoom === 'DAY' && (
          <button
            onClick={scrollToNow}
            className="shrink-0 text-[11px] font-mono text-[#A0A0A0] hover:text-white bg-[#111111] border border-white/10 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          >
            Go to current time
          </button>
        )}
      </div>

      {/* Main Interactive Timeline Ribbon */}
      <Card className="p-0 overflow-hidden bg-[#090909]">
        <div className="px-5 py-3 border-b border-white/8 flex items-center justify-between text-xs font-mono text-[#A0A0A0]">
          <span>00:00 — 24:00 (Full Cycle)</span>
          <span>Click on any free slot to schedule</span>
        </div>

        <div 
          ref={timelineContainerRef}
          className="overflow-x-auto py-6 px-6 relative select-none scrollbar-thin"
        >
          <div 
            onClick={handleTimelineClick}
            className="relative min-w-[1000px] h-32 bg-[#0E0E0E] rounded-xl border border-white/8 cursor-crosshair overflow-hidden group"
          >
            {/* Hour grid vertical lines and labels */}
            {hoursArray.map(hour => {
              const leftPercent = (hour / 24) * 100;
              return (
                <div
                  key={hour}
                  className="absolute top-0 bottom-0 pointer-events-none"
                  style={{ left: `${leftPercent}%` }}
                >
                  <div className="h-full border-l border-white/5" />
                  <span className="absolute top-2 left-1.5 text-[10px] font-mono text-[#555555]">
                    {padZero(hour)}:00
                  </span>
                </div>
              );
            })}

            {/* Current Time Needle */}
            <div 
              className="absolute top-0 bottom-0 z-20 pointer-events-none flex flex-col items-center"
              style={{ left: `${currentPercent}%` }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-red-400 -mt-1 shadow-sm shadow-red-400/50" />
              <div className="w-[1.5px] h-full bg-red-400" />
              <span className="text-[9px] font-mono bg-red-500 text-white px-1 rounded-xs -mt-3 shadow-xs">
                NOW
              </span>
            </div>

            {/* Render Event Blocks */}
            {filteredEvents.map(event => {
              const [startH, startM] = event.startTime.split(':').map(Number);
              const [endH, endM] = event.endTime.split(':').map(Number);
              const startTotal = startH * 60 + startM;
              const endTotal = endH * 60 + endM;
              const leftPct = (startTotal / 1440) * 100;
              const widthPct = Math.max(1.5, ((endTotal - startTotal) / 1440) * 100);

              const colorStyle = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.OTHER;

              return (
                <div
                  key={event.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEventToEdit(event);
                    setIsModalOpen(true);
                  }}
                  className={`event-block absolute top-9 bottom-3 rounded-lg border p-2 cursor-pointer transition-all hover:scale-[1.01] hover:z-10 shadow-sm overflow-hidden flex flex-col justify-between ${colorStyle.bg} ${colorStyle.border}`}
                  style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  title={`${event.title} (${event.startTime} - ${event.endTime})`}
                >
                  <div className="flex items-center justify-between gap-1 overflow-hidden">
                    <span className={`text-xs font-semibold truncate ${colorStyle.text}`}>
                      {event.title}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-white/70 truncate">
                    {event.startTime} – {event.endTime}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Scheduled Time Blocks List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono uppercase text-[#A0A0A0] px-1">
          <span>Scheduled Blocks ({filteredEvents.length})</span>
          <span>Click to edit or adjust</span>
        </div>

        {filteredEvents.length === 0 ? (
          <Card className="text-center py-10 text-xs text-[#666666]">
            <p>No time blocks found for the selected category.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => {
                setCategoryFilter('ALL');
                setIsModalOpen(true);
              }}
            >
              Add your first block
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredEvents.map(event => {
              const colorStyle = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.OTHER;
              return (
                <Card
                  key={event.id}
                  interactive
                  onClick={() => {
                    setEventToEdit(event);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center justify-between py-3.5 px-4"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${colorStyle.bg.replace('/20', '')}`} />
                    <div className="overflow-hidden">
                      <h4 className="text-sm font-semibold text-white truncate">{event.title}</h4>
                      {event.notes && (
                        <p className="text-xs text-[#A0A0A0] truncate mt-0.5">{event.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 font-mono text-xs text-[#A0A0A0]">
                    <span>{event.startTime} - {event.endTime}</span>
                    <Badge variant="outline">{event.category}</Badge>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <TimeBlockModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEventToEdit(null);
        }}
        eventToEdit={eventToEdit}
        initialStartTime={modalInitialStart}
        onSave={(data) => {
          if ('id' in data) {
            updateEvent(data as TimelineEvent);
          } else {
            addEvent(data);
          }
        }}
        onDelete={(id) => deleteEvent(id)}
        onDuplicate={(id) => duplicateEvent(id)}
      />
    </div>
  );
};
