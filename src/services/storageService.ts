import { AppSettings, CityTimezone, TimelineEvent, FocusSession, TaskItem } from '../types';
import { DEFAULT_SETTINGS, DEFAULT_TIMEZONES, INITIAL_TIMELINE_EVENTS, DEFAULT_TASKS } from '../data/defaultData';

const SCHEMA_VERSION = 'time_studio_v2';
const KEYS = {
  VERSION: `${SCHEMA_VERSION}_schema`,
  SETTINGS: `${SCHEMA_VERSION}_settings`,
  TIMEZONES: `${SCHEMA_VERSION}_timezones`,
  EVENTS: `${SCHEMA_VERSION}_events`,
  SESSIONS: `${SCHEMA_VERSION}_sessions`,
  TASKS: `${SCHEMA_VERSION}_tasks`,
  ACTIVE_TRACK: `${SCHEMA_VERSION}_active_track`,
  AUDIO_VOLUME: `${SCHEMA_VERSION}_audio_volume`
};

export class StorageService {
  static getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          clock: { ...DEFAULT_SETTINGS.clock, ...(parsed.clock || {}) },
          pomodoro: { ...DEFAULT_SETTINGS.pomodoro, ...(parsed.pomodoro || {}) }
        };
      }
    } catch (e) {
      console.warn('StorageService: Error loading settings, using defaults', e);
    }
    return DEFAULT_SETTINGS;
  }

  static saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('StorageService: Failed to save settings', e);
    }
  }

  static getTimezones(): CityTimezone[] {
    try {
      const data = localStorage.getItem(KEYS.TIMEZONES);
      if (data) {
        const list = JSON.parse(data);
        if (Array.isArray(list) && list.length > 0) {
          return list;
        }
      }
    } catch (e) {
      console.warn('StorageService: Error loading timezones', e);
    }
    return DEFAULT_TIMEZONES;
  }

  static saveTimezones(timezones: CityTimezone[]): void {
    try {
      localStorage.setItem(KEYS.TIMEZONES, JSON.stringify(timezones));
    } catch (e) {
      console.error('StorageService: Failed to save timezones', e);
    }
  }

  static getEvents(): TimelineEvent[] {
    try {
      const data = localStorage.getItem(KEYS.EVENTS);
      if (data) {
        const list = JSON.parse(data);
        if (Array.isArray(list)) {
          return list;
        }
      }
    } catch (e) {
      console.warn('StorageService: Error loading events', e);
    }
    return INITIAL_TIMELINE_EVENTS;
  }

  static saveEvents(events: TimelineEvent[]): void {
    try {
      localStorage.setItem(KEYS.EVENTS, JSON.stringify(events));
    } catch (e) {
      console.error('StorageService: Failed to save events', e);
    }
  }

  static getSessions(): FocusSession[] {
    try {
      const data = localStorage.getItem(KEYS.SESSIONS);
      if (data) {
        const list = JSON.parse(data);
        if (Array.isArray(list)) {
          return list;
        }
      }
    } catch (e) {
      console.warn('StorageService: Error loading sessions', e);
    }
    // Return initial sample sessions for meaningful graphs on first load
    const today = new Date();
    const result: FocusSession[] = [];
    // Seed 4 days of history
    for (let i = 4; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const count = i === 0 ? 3 : Math.floor(Math.random() * 3) + 2;
      for (let j = 0; j < count; j++) {
        const mins = [25, 45, 50, 25][j % 4];
        result.push({
          id: `seed-${i}-${j}`,
          date: iso,
          timestamp: d.getTime() + j * 3600000 + 36000000,
          durationMinutes: mins,
          actualSeconds: mins * 60,
          type: 'focus',
          completed: true,
          label: j % 2 === 0 ? 'Deep Engineering' : 'System Design'
        });
      }
    }
    return result;
  }

  static saveSessions(sessions: FocusSession[]): void {
    try {
      localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (e) {
      console.error('StorageService: Failed to save sessions', e);
    }
  }

  static getAudioVolume(): number {
    try {
      const v = localStorage.getItem(KEYS.AUDIO_VOLUME);
      if (v !== null) return parseFloat(v);
    } catch {}
    return 0.5;
  }

  static saveAudioVolume(v: number): void {
    try {
      localStorage.setItem(KEYS.AUDIO_VOLUME, v.toString());
    } catch {}
  }

  static getTasks(): TaskItem[] {
    try {
      const data = localStorage.getItem(KEYS.TASKS);
      if (data) {
        const list = JSON.parse(data);
        if (Array.isArray(list)) {
          return list;
        }
      }
    } catch (e) {
      console.warn('StorageService: Error loading tasks', e);
    }
    return DEFAULT_TASKS;
  }

  static saveTasks(tasks: TaskItem[]): void {
    try {
      localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('StorageService: Failed to save tasks', e);
    }
  }

  static exportBackup(): string {
    const backup = {
      version: SCHEMA_VERSION,
      timestamp: Date.now(),
      settings: this.getSettings(),
      timezones: this.getTimezones(),
      events: this.getEvents(),
      sessions: this.getSessions(),
      tasks: this.getTasks()
    };
    return JSON.stringify(backup, null, 2);
  }

  static importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings) this.saveSettings(data.settings);
      if (data.timezones) this.saveTimezones(data.timezones);
      if (data.events) this.saveEvents(data.events);
      if (data.sessions) this.saveSessions(data.sessions);
      if (data.tasks) this.saveTasks(data.tasks);
      return true;
    } catch (e) {
      console.error('StorageService: Failed to import backup', e);
      return false;
    }
  }

  static clearAllData(): void {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  }
}
