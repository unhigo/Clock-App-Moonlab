import React, { useState } from 'react';
import { useTimeStore } from '../../store/useTimeStore';
import { TimelineEvent } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { TimeBlockModal } from '../timeline/TimeBlockModal';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, Trash2, Edit2 } from 'lucide-react';
import { padZero } from '../../utils/date';

export const CalendarView: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent, duplicateEvent } = useTimeStore();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<TimelineEvent | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar days generation
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const selectedDayEvents = events.filter(e => e.date === selectedDateStr);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <CalendarIcon size={20} />
            <span>Event & Schedule Planner</span>
          </h2>
          <p className="text-xs text-[#A0A0A0] mt-1">
            Day-by-day structured event timeline and scheduled blocks
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={14} />}
          onClick={() => {
            setEventToEdit(null);
            setIsModalOpen(true);
          }}
        >
          Schedule Event
        </Button>
      </div>

      {/* Calendar Grid & Day Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Calendar Grid */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">
              {monthNames[month]} {year}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono text-[#666666] mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty offset padding for days before day 1 */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-16 rounded-lg bg-transparent" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${padZero(month + 1)}-${padZero(dayNum)}`;
              const isSelected = dateStr === selectedDateStr;
              const dayEvents = events.filter(e => e.date === dateStr);
              const isToday = dateStr === new Date().toISOString().split('T')[0];

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-16 p-1.5 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white/10 border-white text-white'
                      : 'bg-[#111111] border-white/5 text-[#A0A0A0] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-medium ${isToday ? 'text-white font-bold underline' : ''}`}>
                      {dayNum}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>

                  <div className="space-y-0.5 overflow-hidden">
                    {dayEvents.slice(0, 2).map(ev => (
                      <div 
                        key={ev.id} 
                        className="text-[9px] truncate px-1 py-0.5 rounded bg-white/10 text-white/90"
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[8px] text-[#666666] font-mono">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Right 1 Col: Selected Day Schedule */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/8 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#666666]">Selected Date</span>
                <h4 className="text-sm font-bold text-white mt-0.5">{selectedDateStr}</h4>
              </div>
              <Badge variant="outline">{selectedDayEvents.length} events</Badge>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {selectedDayEvents.length === 0 ? (
                <div className="text-center py-12 text-xs text-[#666666]">
                  No events scheduled for this day
                </div>
              ) : (
                selectedDayEvents.map(event => (
                  <div
                    key={event.id}
                    className="p-3 rounded-xl bg-[#111111] border border-white/8 text-xs hover:border-white/20 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-semibold text-white">{event.title}</span>
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#A0A0A0] mt-1">
                          <Clock size={11} />
                          <span>{event.startTime} - {event.endTime}</span>
                        </div>
                        {event.notes && (
                          <p className="text-[11px] text-[#666666] mt-1">{event.notes}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEventToEdit(event);
                            setIsModalOpen(true);
                          }}
                          className="p-1 text-[#A0A0A0] hover:text-white cursor-pointer"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="p-1 text-[#A0A0A0] hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-4"
            icon={<Plus size={14} />}
            onClick={() => {
              setEventToEdit(null);
              setIsModalOpen(true);
            }}
          >
            Add to this day
          </Button>
        </Card>
      </div>

      {/* Modal */}
      <TimeBlockModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEventToEdit(null);
        }}
        eventToEdit={eventToEdit}
        onSave={(data) => {
          if ('id' in data) {
            updateEvent(data as TimelineEvent);
          } else {
            addEvent({
              ...data,
              date: selectedDateStr
            });
          }
        }}
        onDelete={deleteEvent}
        onDuplicate={duplicateEvent}
      />
    </div>
  );
};
