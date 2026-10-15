import React from 'react';
import { useTimeStore } from '../../store/useTimeStore';
import { TimeDisplayMode } from '../../types';
import { useClock } from '../../hooks/useClock';
import { Maximize2, Minimize2, HelpCircle, Volume2, VolumeX, Sun, Moon } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { 
    activeTab, 
    timeDisplayMode, 
    setTimeDisplayMode, 
    isFullscreen, 
    toggleFullscreen,
    setShortcutsOpen,
    isPlayingAudio,
    toggleAudio,
    isAudioMuted,
    toggleAudioMute,
    settings,
    updateSettings
  } = useTimeStore();

  const { progress, solar } = useClock(settings.clock);

  const displayModes: { id: TimeDisplayMode; label: string }[] = [
    { id: 'timedrift', label: 'Timedrift' },
    { id: 'digital', label: 'Digital' },
    { id: 'minimal', label: 'Minimal' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'focus', label: 'Focus' }
  ];

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <header className="h-14 border-b border-white/8 px-4 sm:px-6 flex items-center justify-between bg-[#050505] select-none z-20 shrink-0">
      {/* Left: Section or Mode Switcher */}
      <div className="flex items-center gap-3">
        {activeTab === 'time' ? (
          <div className="flex items-center bg-[#111111] p-1 rounded-lg border border-white/8">
            {displayModes.map(mode => {
              const active = timeDisplayMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setTimeDisplayMode(mode.id)}
                  className={`text-xs px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    active
                      ? 'bg-white text-black font-semibold shadow-xs'
                      : 'text-[#A0A0A0] hover:text-white'
                  }`}
                >
                  {mode.label}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold tracking-wide uppercase text-white">
              {activeTab}
            </h1>
          </div>
        )}
      </div>

      {/* Center: Subtle Day Progress */}
      <div className="hidden lg:flex items-center gap-3 px-3 py-1 rounded-full bg-[#111111] border border-white/8 text-xs font-mono text-[#A0A0A0]">
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${solar.isDaytime ? 'bg-amber-400' : 'bg-indigo-400'}`} />
          <span>{solar.isDaytime ? 'Day' : 'Night'}</span>
        </div>
        <span className="text-white/20">|</span>
        <span>Day progress {progress.percent}%</span>
        <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all duration-500" 
            style={{ width: `${progress.percent}%` }} 
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          title={settings.theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
        >
          {settings.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button
          onClick={toggleAudioMute}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            isPlayingAudio ? 'text-white' : 'text-[#666666] hover:text-white'
          }`}
          title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isAudioMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        <button
          onClick={() => setShortcutsOpen(true)}
          className="hidden sm:inline-flex p-2 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          title="Keyboard shortcuts (?)"
        >
          <HelpCircle size={16} />
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>
    </header>
  );
};
