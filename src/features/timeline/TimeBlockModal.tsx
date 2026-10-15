import React, { useState, useEffect } from 'react';
import { TimelineEvent, EventCategory } from '../../types';
import { Dialog } from '../../components/ui/Dialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Trash2, Copy } from 'lucide-react';

interface TimeBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit: TimelineEvent | null;
  onSave: (event: Omit<TimelineEvent, 'id'> | TimelineEvent) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  initialStartTime?: string;
}

const CATEGORIES: { id: EventCategory; label: string; color: string }[] = [
  { id: 'FOCUS', label: 'Deep Focus', color: 'bg-indigo-500' },
  { id: 'WORK', label: 'Work', color: 'bg-blue-500' },
  { id: 'MEETING', label: 'Meeting', color: 'bg-amber-500' },
  { id: 'BREAK', label: 'Break / Rest', color: 'bg-emerald-500' },
  { id: 'PERSONAL', label: 'Personal', color: 'bg-purple-500' },
  { id: 'OTHER', label: 'Other', color: 'bg-zinc-500' }
];

export const TimeBlockModal: React.FC<TimeBlockModalProps> = ({
  isOpen,
  onClose,
  eventToEdit,
  onSave,
  onDelete,
  onDuplicate,
  initialStartTime = '09:00'
}) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState('10:00');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<EventCategory>('FOCUS');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setStartTime(eventToEdit.startTime);
      setEndTime(eventToEdit.endTime);
      setDate(eventToEdit.date);
      setCategory(eventToEdit.category);
      setNotes(eventToEdit.notes || '');
    } else {
      setTitle('');
      setStartTime(initialStartTime);
      // default end 1 hour later
      const [h, m] = initialStartTime.split(':').map(Number);
      const endH = Math.min(23, h + 1).toString().padStart(2, '0');
      setEndTime(`${endH}:${m.toString().padStart(2, '0')}`);
      setDate(new Date().toISOString().split('T')[0]);
      setCategory('FOCUS');
      setNotes('');
    }
    setError('');
  }, [eventToEdit, isOpen, initialStartTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (startTime >= endTime) {
      setError('End time must be after start time');
      return;
    }

    if (eventToEdit) {
      onSave({
        ...eventToEdit,
        title: title.trim(),
        startTime,
        endTime,
        date,
        category,
        notes: notes.trim()
      });
    } else {
      onSave({
        title: title.trim(),
        startTime,
        endTime,
        date,
        category,
        notes: notes.trim()
      });
    }
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={eventToEdit ? 'Edit Time Block' : 'Schedule Time Block'}
      description="Define focus periods, meetings, and breaks on your timeline"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          placeholder="e.g. System Architecture Design"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError('');
          }}
          autoFocus
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start Time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <Input
            label="End Time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div>
          <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5 uppercase tracking-wider">
            Category
          </label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map(cat => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-2 p-2 rounded-lg border text-xs text-left transition-all cursor-pointer ${
                  category === cat.id
                    ? 'bg-white/10 border-white text-white font-medium'
                    : 'bg-[#111111] border-white/5 text-[#A0A0A0] hover:text-white hover:border-white/15'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                <span className="truncate">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5 uppercase tracking-wider">
            Notes (Optional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Context, objectives or checklist..."
            className="w-full bg-[#111111] border border-white/10 rounded-lg text-sm text-white placeholder:text-[#555555] px-3.5 py-2 focus:outline-none focus:border-white/30"
          />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex items-center justify-between pt-3 border-t border-white/8">
          <div className="flex items-center gap-2">
            {eventToEdit && onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(eventToEdit.id);
                  onClose();
                }}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                title="Delete Block"
              >
                <Trash2 size={16} />
              </button>
            )}
            {eventToEdit && onDuplicate && (
              <button
                type="button"
                onClick={() => {
                  onDuplicate(eventToEdit.id);
                  onClose();
                }}
                className="p-2 text-[#A0A0A0] hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                title="Duplicate Block"
              >
                <Copy size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {eventToEdit ? 'Save Changes' : 'Create Block'}
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
};
