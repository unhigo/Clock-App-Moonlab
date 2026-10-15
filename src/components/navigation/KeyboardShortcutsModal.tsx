import React from 'react';
import { useTimeStore } from '../../store/useTimeStore';
import { Dialog } from '../ui/Dialog';

export const KeyboardShortcutsModal: React.FC = () => {
  const { isShortcutsOpen, setShortcutsOpen } = useTimeStore();

  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause ambient audio soundscape' },
    { key: 'C', desc: 'Go to Time / Clock view' },
    { key: 'L', desc: 'Go to Timeline view' },
    { key: 'F', desc: 'Go to Focus view' },
    { key: 'T', desc: 'Go to Timer view' },
    { key: 'M', desc: 'Go to Ambient Music view' },
    { key: 'Z', desc: 'Go to Timezones view' },
    { key: 'S', desc: 'Go to Statistics view' },
    { key: '← / →', desc: 'Previous / Next ambient sound generator' },
    { key: 'Esc', desc: 'Exit fullscreen or close current dialog' },
    { key: '?', desc: 'Toggle keyboard shortcuts menu' }
  ];

  return (
    <Dialog
      isOpen={isShortcutsOpen}
      onClose={() => setShortcutsOpen(false)}
      title="Keyboard Shortcuts"
      description="Quick navigation and interaction controls"
    >
      <div className="space-y-2 mt-2">
        {shortcuts.map(s => (
          <div 
            key={s.key} 
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#111111] border border-white/5"
          >
            <span className="text-xs text-[#A0A0A0]">{s.desc}</span>
            <kbd className="px-2 py-1 text-[11px] font-mono bg-white/10 text-white rounded border border-white/15">
              {s.key}
            </kbd>
          </div>
        ))}
      </div>
      <div className="mt-5 text-center">
        <span className="text-[11px] text-[#666666]">
          Press <kbd className="font-mono text-white/70">Esc</kbd> anytime to dismiss
        </span>
      </div>
    </Dialog>
  );
};
