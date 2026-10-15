import React, { useEffect } from 'react';
import { useTimeStore } from './store/useTimeStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Sidebar } from './components/navigation/Sidebar';
import { TopBar } from './components/navigation/TopBar';
import { ToastContainer } from './components/ui/ToastContainer';
import { KeyboardShortcutsModal } from './components/navigation/KeyboardShortcutsModal';

import { TimedriftHome } from './features/clock/TimedriftHome';
import { InteractiveTimeline } from './features/timeline/InteractiveTimeline';
import { TimezonesView } from './features/timezone/TimezonesView';
import { FocusTimer } from './features/focus/FocusTimer';
import { PomodoroView } from './features/pomodoro/PomodoroView';
import { TimerView } from './features/timer/TimerView';
import { MusicPlayerView } from './features/music/MusicPlayerView';
import { StatsView } from './features/statistics/StatsView';
import { CalendarView } from './features/calendar/CalendarView';
import { SettingsView } from './features/settings/SettingsView';
import { TidesSimulatorView } from './features/tides/TidesSimulatorView';
import { ArrowLeft } from 'lucide-react';

export default function App() {
  const { activeTab, setActiveTab, settings, isFullscreen, toggleFullscreen } = useTimeStore();

  const isTimedriftActive = activeTab === 'time';

  // Initialize keyboard shortcuts listener
  useKeyboardShortcuts();

  // Set theme class on document element
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'light') {
      root.classList.add('light-theme');
      root.classList.remove('dark');
    } else {
      root.classList.remove('light-theme');
      root.classList.add('dark');
    }
  }, [settings.theme]);

  // Handle Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        toggleFullscreen();
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isFullscreen, toggleFullscreen]);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'time':
        return <TimedriftHome />;
      case 'timeline':
        return <InteractiveTimeline />;
      case 'timezones':
        return <TimezonesView />;
      case 'focus':
        return <FocusTimer />;
      case 'pomodoro':
        return <PomodoroView />;
      case 'timer':
        return <TimerView />;
      case 'music':
        return <MusicPlayerView />;
      case 'stats':
        return <StatsView />;
      case 'calendar':
        return <CalendarView />;
      case 'settings':
        return <SettingsView />;
      case 'tides':
        return <TidesSimulatorView />;
      default:
        return <TimedriftHome />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0A0A] text-[#FFFFFF] antialiased select-none font-sans">
      {/* If we are on the main Timedrift screen, display 100% full screen matching the screenshot */}
      {isTimedriftActive ? (
        <main className="w-full h-full overflow-hidden bg-[#0A0A0A]">
          <TimedriftHome />
        </main>
      ) : (
        /* When in a secondary tool, show sidebar & navigation with quick return */
        <div className="flex h-full w-full bg-[#0A0A0A]">
          {!isFullscreen && <Sidebar />}

          <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative bg-[#0A0A0A]">
            <header className="h-12 border-b border-[#1F1F1F] px-4 flex items-center justify-between bg-[#0A0A0A] shrink-0">
              <button
                onClick={() => setActiveTab('time')}
                className="btn-caps-stripe py-1 px-3 text-[11px] flex items-center gap-2 text-[#888888] hover:text-[#FFFFFF] transition-colors cursor-pointer"
              >
                <ArrowLeft size={12} className="text-[var(--accent-rind)]" />
                <span className="tracking-wider">RETURN TO CHRONOMETER</span>
              </button>

              <TopBar />
            </header>

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#0A0A0A]">
              <div className="max-w-7xl mx-auto h-full flex flex-col">
                {renderActiveView()}
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Floating Elements */}
      <ToastContainer />
      <KeyboardShortcutsModal />
    </div>
  );
}
