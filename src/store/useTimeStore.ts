import { useState, useEffect, useCallback } from 'react';
import { 
  NavTab, 
  TimeDisplayMode, 
  AppSettings, 
  CityTimezone, 
  TimelineEvent, 
  FocusSession,
  AmbientTrack,
  TaskItem,
  WatchDialTheme,
  TimelineRulerSpan,
  TimedriftMode,
  LunarViewMode,
  LunarStyleId,
  LunarDayData
} from '../types';
import { StorageService } from '../services/storageService';
import { audioService } from '../services/audioService';
import { AMBIENT_TRACKS, DEFAULT_SETTINGS, DEFAULT_TIMEZONES, DEFAULT_EVENTS, DEFAULT_TASKS } from '../data/defaultData';
import { NotificationService } from '../services/notificationService';
import { getLunarDayData } from '../utils/lunarEngine';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning';
}

// Global runtime state singleton
let globalState = {
  activeTab: 'time' as NavTab,
  timeDisplayMode: 'timedrift' as TimeDisplayMode,
  isSidebarCollapsed: false,
  isFullscreen: false,
  isShortcutsOpen: false,
  settings: StorageService.getSettings(),
  timezones: StorageService.getTimezones(),
  events: StorageService.getEvents(),
  sessions: StorageService.getSessions(),
  tasks: StorageService.getTasks(),
  activePinnedCityId: 'tz-madrid' as string | null,
  watchTheme: (StorageService.getSettings().clock.dialTheme || 'obsidian') as WatchDialTheme,
  timedriftMode: (StorageService.getSettings().clock.timedriftMode || 'normal') as TimedriftMode,
  rulerSpan: (StorageService.getSettings().clock.rulerSpan || '36h') as TimelineRulerSpan,
  showTasksWidget: StorageService.getSettings().clock.showTasksWidget ?? true,
  showTimezonesWidget: StorageService.getSettings().clock.showTimezonesWidget ?? true,
  // Lunar states
  lunarViewMode: 'clock_dial' as LunarViewMode,
  selectedLunarDay: getLunarDayData(new Date()) as LunarDayData | null,
  activeLunarStyleId: 'obsidian' as LunarStyleId,
  // Ambient player
  activeTrackId: AMBIENT_TRACKS[0].id as string | null,
  isPlayingAudio: false,
  audioVolume: StorageService.getAudioVolume(),
  isAudioMuted: false,
  // Toasts
  toasts: [] as ToastMessage[]
};

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach(l => l());
}

export function useTimeStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const l = () => setTick(t => t + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  const setActiveTab = useCallback((tab: NavTab) => {
    globalState.activeTab = tab;
    notify();
  }, []);

  const setTimeDisplayMode = useCallback((mode: TimeDisplayMode) => {
    globalState.timeDisplayMode = mode;
    notify();
  }, []);

  const toggleSidebar = useCallback(() => {
    globalState.isSidebarCollapsed = !globalState.isSidebarCollapsed;
    notify();
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      globalState.isFullscreen = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      globalState.isFullscreen = false;
    }
    notify();
  }, []);

  const setShortcutsOpen = useCallback((open: boolean) => {
    globalState.isShortcutsOpen = open;
    notify();
  }, []);

  const addToast = useCallback((message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    globalState.toasts = [...globalState.toasts, { id, message, type }];
    notify();

    setTimeout(() => {
      globalState.toasts = globalState.toasts.filter(t => t.id !== id);
      notify();
    }, 3200);
  }, []);

  const removeToast = useCallback((id: string) => {
    globalState.toasts = globalState.toasts.filter(t => t.id !== id);
    notify();
  }, []);

  // Settings
  const updateSettings = useCallback((updater: Partial<AppSettings> | ((prev: AppSettings) => AppSettings)) => {
    const next = typeof updater === 'function' ? updater(globalState.settings) : { ...globalState.settings, ...updater };
    globalState.settings = next;
    StorageService.saveSettings(next);
    // Apply theme
    if (next.theme === 'light') {
      document.documentElement.classList.add('theme-light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('theme-light');
      document.documentElement.classList.add('dark');
    }
    notify();
  }, []);

  // Timezones
  const addTimezone = useCallback((tz: Omit<CityTimezone, 'id' | 'order'>) => {
    const exists = globalState.timezones.some(t => t.iana === tz.iana && t.city === tz.city);
    if (exists) {
      addToast(`${tz.city} already added`, 'warning');
      return;
    }
    const newTz: CityTimezone = {
      ...tz,
      id: `tz-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      order: globalState.timezones.length
    };
    const next = [...globalState.timezones, newTz];
    globalState.timezones = next;
    StorageService.saveTimezones(next);
    addToast(`Added ${tz.city} timezone`, 'success');
    notify();
  }, [addToast]);

  const removeTimezone = useCallback((id: string) => {
    const next = globalState.timezones.filter(t => t.id !== id);
    globalState.timezones = next;
    StorageService.saveTimezones(next);
    notify();
  }, []);

  const toggleFavoriteTimezone = useCallback((id: string) => {
    const next = globalState.timezones.map(t => t.id === id ? { ...t, isFavorite: !t.isFavorite } : t);
    globalState.timezones = next;
    StorageService.saveTimezones(next);
    notify();
  }, []);

  const moveTimezone = useCallback((id: string, direction: 'up' | 'down') => {
    const index = globalState.timezones.findIndex(t => t.id === id);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= globalState.timezones.length) return;

    const list = [...globalState.timezones];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);
    const updated = list.map((item, idx) => ({ ...item, order: idx }));
    globalState.timezones = updated;
    StorageService.saveTimezones(updated);
    notify();
  }, []);

  // Events
  const addEvent = useCallback((eventData: Omit<TimelineEvent, 'id'>) => {
    const newEvent: TimelineEvent = {
      ...eventData,
      id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    const next = [...globalState.events, newEvent];
    globalState.events = next;
    StorageService.saveEvents(next);
    addToast(`Scheduled "${newEvent.title}"`, 'success');
    notify();
  }, [addToast]);

  const updateEvent = useCallback((event: TimelineEvent) => {
    const next = globalState.events.map(e => e.id === event.id ? event : e);
    globalState.events = next;
    StorageService.saveEvents(next);
    addToast(`Updated "${event.title}"`, 'info');
    notify();
  }, [addToast]);

  const deleteEvent = useCallback((id: string) => {
    const target = globalState.events.find(e => e.id === id);
    const next = globalState.events.filter(e => e.id !== id);
    globalState.events = next;
    StorageService.saveEvents(next);
    if (target) addToast(`Removed "${target.title}"`, 'info');
    notify();
  }, [addToast]);

  const duplicateEvent = useCallback((id: string) => {
    const target = globalState.events.find(e => e.id === id);
    if (!target) return;
    const dup: TimelineEvent = {
      ...target,
      id: `ev-${Date.now()}`,
      title: `${target.title} (Copy)`
    };
    const next = [...globalState.events, dup];
    globalState.events = next;
    StorageService.saveEvents(next);
    addToast(`Duplicated "${target.title}"`, 'success');
    notify();
  }, [addToast]);

  // Focus sessions
  const logSession = useCallback((session: Omit<FocusSession, 'id'>) => {
    const newSession: FocusSession = {
      ...session,
      id: `sess-${Date.now()}`
    };
    const next = [newSession, ...globalState.sessions];
    globalState.sessions = next;
    StorageService.saveSessions(next);
    notify();
  }, []);

  // Audio actions
  const playTrack = useCallback((trackId: string) => {
    const track = AMBIENT_TRACKS.find(t => t.id === trackId);
    if (!track) return;
    globalState.activeTrackId = trackId;
    globalState.isPlayingAudio = true;
    audioService.setVolume(globalState.audioVolume);
    audioService.playTrack(track.id, track.synthType);
    notify();
  }, []);

  const toggleAudio = useCallback(() => {
    if (globalState.isPlayingAudio) {
      audioService.stop();
      globalState.isPlayingAudio = false;
    } else {
      const trackId = globalState.activeTrackId || AMBIENT_TRACKS[0].id;
      const track = AMBIENT_TRACKS.find(t => t.id === trackId) || AMBIENT_TRACKS[0];
      globalState.activeTrackId = track.id;
      globalState.isPlayingAudio = true;
      audioService.setVolume(globalState.audioVolume);
      audioService.playTrack(track.id, track.synthType);
    }
    notify();
  }, []);

  const nextTrack = useCallback(() => {
    const currentIndex = AMBIENT_TRACKS.findIndex(t => t.id === globalState.activeTrackId);
    const nextIdx = (currentIndex + 1) % AMBIENT_TRACKS.length;
    playTrack(AMBIENT_TRACKS[nextIdx].id);
  }, [playTrack]);

  const prevTrack = useCallback(() => {
    const currentIndex = AMBIENT_TRACKS.findIndex(t => t.id === globalState.activeTrackId);
    const prevIdx = (currentIndex - 1 + AMBIENT_TRACKS.length) % AMBIENT_TRACKS.length;
    playTrack(AMBIENT_TRACKS[prevIdx].id);
  }, [playTrack]);

  const setAudioVolume = useCallback((vol: number) => {
    globalState.audioVolume = vol;
    StorageService.saveAudioVolume(vol);
    audioService.setVolume(vol);
    notify();
  }, []);

  const toggleAudioMute = useCallback(() => {
    const muted = audioService.toggleMute();
    globalState.isAudioMuted = muted;
    notify();
  }, []);

  const addTask = useCallback((title: string, category: string = 'FOCUS') => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const newTask: TaskItem = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: trimmed,
      completed: false,
      createdAt: Date.now(),
      category
    };
    globalState.tasks = [newTask, ...globalState.tasks];
    StorageService.saveTasks(globalState.tasks);
    notify();
  }, []);

  const toggleTask = useCallback((id: string) => {
    globalState.tasks = globalState.tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    StorageService.saveTasks(globalState.tasks);
    notify();
  }, []);

  const deleteTask = useCallback((id: string) => {
    globalState.tasks = globalState.tasks.filter(t => t.id !== id);
    StorageService.saveTasks(globalState.tasks);
    notify();
  }, []);

  const setWatchTheme = useCallback((theme: WatchDialTheme) => {
    globalState.watchTheme = theme;
    globalState.settings = {
      ...globalState.settings,
      clock: {
        ...globalState.settings.clock,
        dialTheme: theme
      }
    };
    StorageService.saveSettings(globalState.settings);
    notify();
  }, []);

  const setTimedriftMode = useCallback((mode: TimedriftMode) => {
    globalState.timedriftMode = mode;
    globalState.settings = {
      ...globalState.settings,
      clock: {
        ...globalState.settings.clock,
        timedriftMode: mode
      }
    };
    StorageService.saveSettings(globalState.settings);
    notify();
  }, []);

  const setRulerSpan = useCallback((span: TimelineRulerSpan) => {
    globalState.rulerSpan = span;
    globalState.settings = {
      ...globalState.settings,
      clock: {
        ...globalState.settings.clock,
        rulerSpan: span
      }
    };
    StorageService.saveSettings(globalState.settings);
    notify();
  }, []);

  const setActivePinnedCity = useCallback((id: string | null) => {
    globalState.activePinnedCityId = id;
    notify();
  }, []);

  const toggleTasksWidget = useCallback(() => {
    const val = !globalState.showTasksWidget;
    globalState.showTasksWidget = val;
    globalState.settings = {
      ...globalState.settings,
      clock: {
        ...globalState.settings.clock,
        showTasksWidget: val
      }
    };
    StorageService.saveSettings(globalState.settings);
    notify();
  }, []);

  const toggleTimezonesWidget = useCallback(() => {
    const val = !globalState.showTimezonesWidget;
    globalState.showTimezonesWidget = val;
    globalState.settings = {
      ...globalState.settings,
      clock: {
        ...globalState.settings.clock,
        showTimezonesWidget: val
      }
    };
    StorageService.saveSettings(globalState.settings);
    notify();
  }, []);

  const exportAllData = useCallback((): string => {
    return StorageService.exportBackup();
  }, []);

  const importAllData = useCallback((jsonString: string): boolean => {
    const ok = StorageService.importBackup(jsonString);
    if (ok) {
      globalState.settings = StorageService.getSettings();
      globalState.timezones = StorageService.getTimezones();
      globalState.events = StorageService.getEvents();
      globalState.sessions = StorageService.getSessions();
      globalState.tasks = StorageService.getTasks();
      globalState.watchTheme = globalState.settings.clock.dialTheme || 'obsidian';
      globalState.timedriftMode = globalState.settings.clock.timedriftMode || 'normal';
      globalState.rulerSpan = globalState.settings.clock.rulerSpan || '24h';
      globalState.showTasksWidget = globalState.settings.clock.showTasksWidget ?? true;
      globalState.showTimezonesWidget = globalState.settings.clock.showTimezonesWidget ?? true;
      notify();
    }
    return ok;
  }, []);

  const resetToDefaults = useCallback(() => {
    StorageService.clearAllData();
    globalState.settings = DEFAULT_SETTINGS;
    globalState.timezones = DEFAULT_TIMEZONES;
    globalState.events = DEFAULT_EVENTS;
    globalState.sessions = [];
    globalState.tasks = DEFAULT_TASKS;
    globalState.watchTheme = 'obsidian';
    globalState.timedriftMode = 'normal';
    globalState.rulerSpan = '24h';
    globalState.showTasksWidget = true;
    globalState.showTimezonesWidget = true;
    notify();
  }, []);

  const setLunarViewMode = useCallback((mode: LunarViewMode) => {
    globalState.lunarViewMode = mode;
    notify();
  }, []);

  const setSelectedLunarDay = useCallback((day: LunarDayData | null) => {
    globalState.selectedLunarDay = day;
    notify();
  }, []);

  const setActiveLunarStyleId = useCallback((id: LunarStyleId) => {
    globalState.activeLunarStyleId = id;
    notify();
  }, []);

  return {
    ...globalState,
    setActiveTab,
    setTimeDisplayMode,
    toggleSidebar,
    toggleFullscreen,
    setShortcutsOpen,
    addToast,
    removeToast,
    updateSettings,
    addTimezone,
    removeTimezone,
    toggleFavoriteTimezone,
    moveTimezone,
    addEvent,
    updateEvent,
    deleteEvent,
    duplicateEvent,
    logSession,
    playTrack,
    toggleAudio,
    nextTrack,
    prevTrack,
    setAudioVolume,
    toggleAudioMute,
    addTask,
    toggleTask,
    deleteTask,
    setWatchTheme,
    setTimedriftMode,
    setRulerSpan,
    setActivePinnedCity,
    toggleTasksWidget,
    toggleTimezonesWidget,
    setLunarViewMode,
    setSelectedLunarDay,
    setActiveLunarStyleId,
    exportAllData,
    importAllData,
    resetToDefaults
  };
}

useTimeStore.getState = () => globalState;

