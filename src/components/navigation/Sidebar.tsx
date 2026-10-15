import React from 'react';
import { useTimeStore } from '../../store/useTimeStore';
import { NavTab } from '../../types';
import { 
  Clock, 
  AlignLeft, 
  Target, 
  Hourglass, 
  Timer, 
  Headphones, 
  Globe, 
  BarChart3, 
  Calendar,
  Settings, 
  Maximize2, 
  Minimize2, 
  HelpCircle,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Waves
} from 'lucide-react';
import { AMBIENT_TRACKS } from '../../data/defaultData';

interface NavItemDef {
  id: NavTab;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
}

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isSidebarCollapsed, 
    toggleSidebar, 
    isFullscreen, 
    toggleFullscreen,
    setShortcutsOpen,
    isPlayingAudio,
    toggleAudio,
    activeTrackId,
    isAudioMuted,
    toggleAudioMute
  } = useTimeStore();

  const navItems: NavItemDef[] = [
    { id: 'time', label: 'Time', icon: <Clock size={18} />, shortcut: 'C' },
    { id: 'timeline', label: 'Timeline', icon: <AlignLeft size={18} />, shortcut: 'L' },
    { id: 'focus', label: 'Focus', icon: <Target size={18} />, shortcut: 'F' },
    { id: 'pomodoro', label: 'Pomodoro', icon: <Hourglass size={18} /> },
    { id: 'timer', label: 'Timer', icon: <Timer size={18} />, shortcut: 'T' },
    { id: 'music', label: 'Ambient', icon: <Headphones size={18} />, shortcut: 'M' },
    { id: 'timezones', label: 'Timezones', icon: <Globe size={18} />, shortcut: 'Z' },
    { id: 'stats', label: 'Stats', icon: <BarChart3 size={18} />, shortcut: 'S' },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={18} /> },
    { id: 'tides', label: 'Simulador de Mareas', icon: <Waves size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> }
  ];

  const currentTrack = AMBIENT_TRACKS.find(t => t.id === activeTrackId) || AMBIENT_TRACKS[0];

  return (
    <aside 
      className={`hidden md:flex flex-col h-full bg-black border-r border-white/8 transition-all duration-200 z-30 select-none ${
        isSidebarCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-white/8">
        {!isSidebarCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse-subtle" />
            <span className="font-display-title font-semibold tracking-wider text-sm uppercase text-white">
              Time Studio
            </span>
          </div>
        )}

        {isSidebarCollapsed && (
          <div className="mx-auto w-2.5 h-2.5 rounded-full bg-white animate-pulse-subtle" />
        )}

        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md text-[#666666] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Main Navigation Items */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={isSidebarCollapsed ? `${item.label} (${item.shortcut || ''})` : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-[#A0A0A0] hover:text-white hover:bg-white/5'
              } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
            >
              <span className="shrink-0">{item.icon}</span>
              {!isSidebarCollapsed && (
                <span className="flex-1 text-left tracking-wide">{item.label}</span>
              )}
              {!isSidebarCollapsed && item.shortcut && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-black/15 text-black' : 'bg-white/5 text-[#666666]'
                }`}>
                  {item.shortcut}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Ambient Soundbar Mini Widget */}
      {!isSidebarCollapsed && (
        <div className="mx-2 p-2.5 mb-2 rounded-xl bg-[#111111] border border-white/8 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 overflow-hidden">
              <Headphones size={13} className={isPlayingAudio ? 'text-emerald-400' : 'text-[#666666]'} />
              <span className="truncate font-mono text-[11px] text-white">
                {currentTrack.name}
              </span>
            </div>
            <button 
              onClick={toggleAudioMute}
              className="text-[#666666] hover:text-white transition-colors cursor-pointer"
              title={isAudioMuted ? 'Unmute' : 'Mute'}
            >
              {isAudioMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-[#666666] uppercase font-mono tracking-wider">
              {isPlayingAudio ? 'Playing' : 'Paused'}
            </span>
            <button
              onClick={toggleAudio}
              className="p-1 rounded-md bg-white text-black hover:bg-[#E5E5E5] transition-colors cursor-pointer"
              title={isPlayingAudio ? 'Pause ambient audio (Space)' : 'Play ambient audio (Space)'}
            >
              {isPlayingAudio ? <Pause size={12} /> : <Play size={12} className="translate-x-[0.5px]" />}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Footer Actions */}
      <div className={`p-2 border-t border-white/8 flex items-center ${isSidebarCollapsed ? 'flex-col gap-1' : 'justify-between'}`}>
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen mode'}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        <button
          onClick={() => setShortcutsOpen(true)}
          className="p-2 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          title="Keyboard shortcuts (?)"
        >
          <HelpCircle size={16} />
        </button>

        {isSidebarCollapsed && (
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isPlayingAudio ? 'text-emerald-400 bg-white/5' : 'text-[#A0A0A0] hover:text-white hover:bg-white/5'
            }`}
            title="Toggle Ambient Audio (Space)"
          >
            {isPlayingAudio ? <Pause size={16} /> : <Play size={16} />}
          </button>
        )}
      </div>
    </aside>
  );
};
