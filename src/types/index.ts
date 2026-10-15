export type NavTab = 
  | 'time'
  | 'timeline'
  | 'focus'
  | 'pomodoro'
  | 'timer'
  | 'music'
  | 'timezones'
  | 'stats'
  | 'calendar'
  | 'settings'
  | 'tides';

export type TimeDisplayMode = 'timedrift' | 'digital' | 'minimal' | 'timeline' | 'focus' | 'fullscreen';

export type WatchDialTheme = 'obsidian' | 'celestial' | 'stealth' | 'solaris' | 'cyber';
export type TimelineRulerSpan = '12h' | '24h' | '36h';
export type TimedriftMode = 'normal' | 'clock' | 'timeline';

export type ClockFormat = '12h' | '24h';
export type ClockTypography = 'mono' | 'display' | 'sans';
export type ClockSize = 'compact' | 'standard' | 'large' | 'massive';
export type ClockAlignment = 'center' | 'left' | 'right';

export interface ClockSettings {
  format: ClockFormat;
  showSeconds: boolean;
  showMilliseconds: boolean;
  showDate: boolean;
  showDay: boolean;
  showTimezone: boolean;
  showDayProgress: boolean;
  showSolarTimes: boolean;
  typography: ClockTypography;
  size: ClockSize;
  alignment: ClockAlignment;
  dialTheme?: WatchDialTheme;
  rulerSpan?: TimelineRulerSpan;
  timedriftMode?: TimedriftMode;
  showTasksWidget?: boolean;
  showTimezonesWidget?: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  category?: string;
  dueDate?: string;
}

export interface CityTimezone {
  id: string;
  city: string;
  country: string;
  iana: string; // e.g., 'Europe/Madrid', 'America/New_York', 'Asia/Tokyo'
  isFavorite: boolean;
  order: number;
}

export type EventCategory = 'WORK' | 'FOCUS' | 'BREAK' | 'PERSONAL' | 'MEETING' | 'OTHER';

export interface TimelineEvent {
  id: string;
  title: string;
  startTime: string; // "HH:mm" (24h)
  endTime: string;   // "HH:mm" (24h)
  date: string;      // "YYYY-MM-DD"
  category: EventCategory;
  color?: string;
  notes?: string;
}

export interface FocusSession {
  id: string;
  date: string;        // "YYYY-MM-DD"
  timestamp: number;   // epoch ms
  durationMinutes: number;
  actualSeconds: number;
  type: 'focus' | 'pomodoro' | 'timer';
  completed: boolean;
  label?: string;
}

export type PomodoroPhase = 'focus' | 'short_break' | 'long_break';

export interface PomodoroConfig {
  focusDuration: number;      // in minutes (default 25)
  shortBreakDuration: number; // in minutes (default 5)
  longBreakDuration: number;  // in minutes (default 15)
  cyclesBeforeLongBreak: number; // default 4
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  soundEnabled: boolean;
}

export interface TimerPreset {
  id: string;
  label: string;
  minutes: number;
}

export type AmbientSoundCategory = 
  | 'LO-FI' 
  | 'FOCUS' 
  | 'AMBIENT' 
  | 'NATURE' 
  | 'RAIN' 
  | 'DEEP' 
  | 'SPACE' 
  | 'WHITE NOISE';

export interface AmbientTrack {
  id: string;
  name: string;
  category: AmbientSoundCategory;
  description: string;
  synthType: 'rain' | 'whitenoise' | 'pinknoise' | 'drone' | 'waves' | 'lofiChords' | 'spacePad' | 'forest';
}

export interface AppSettings {
  theme: 'dark' | 'light';
  accentColor?: string;
  uiDensity: 'compact' | 'comfortable';
  reducedMotion: boolean;
  soundAlerts: boolean;
  hapticFeedback: boolean;
  notifications: boolean;
  clock: ClockSettings;
  pomodoro: PomodoroConfig;
}

export interface DailySolarInfo {
  sunrise: string;
  sunset: string;
  dayLength: string;
  solarNoon: string;
  isDaytime: boolean;
  sunProgressPercent: number;
}

// Lunar Engine & Calendar Types
export type MoonPhaseKey =
  | 'NEW_MOON'
  | 'WAXING_CRESCENT'
  | 'FIRST_QUARTER'
  | 'WAXING_GIBBOUS'
  | 'FULL_MOON'
  | 'WANING_GIBBOUS'
  | 'LAST_QUARTER'
  | 'WANING_CRESCENT';

export interface LunarDayData {
  date: string; // YYYY-MM-DD
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  dayOfWeek: number; // 0=Sunday..6=Saturday
  phase: number; // 0-7
  phaseName: string; // e.g. "Luna Nueva", "Luna Llena"
  phaseKey: MoonPhaseKey;
  illumination: number; // 0 to 100%
  moonAge: number; // 0.0 to 29.53 days
  traditionalName?: string;
  isSupermoon?: boolean;
  isMicromoon?: boolean;
  isEclipse?: boolean;
  eclipseType?: 'solar' | 'lunar' | null;
  isKeyPhase?: boolean; // Is it peak full moon or new moon
  zodiacSign?: string;
}

export type LunarViewMode =
  | 'clock_dial'
  | 'monthly'
  | 'yearly_grid'
  | 'season_range'
  | 'canva_generator'
  | 'styles_gallery';

export type LunarCalendarFilter = 'all' | 'full_moons' | 'new_moons' | 'key_events';

export type LunarStyleId =
  | 'editorial'
  | 'spiritual'
  | 'scientific'
  | 'modern_dark'
  | 'vintage'
  | 'retro'
  | 'cyber'
  | 'gold_alchemy'
  | 'nordic'
  | 'obsidian';

export interface LunarStyleTheme {
  id: LunarStyleId;
  name: string;
  tagline: string;
  description: string;
  palette: {
    bg: string;
    card: string;
    text: string;
    muted: string;
    accent: string;
    moonLit: string;
    moonShadow: string;
    border: string;
    gridLines: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    monoFont: string;
    tracking: string;
  };
  moonIconVariant: 'minimal-vector' | 'astronomical' | 'engraved' | 'geometric' | 'glow';
}

export type CanvaFormat = 'horizontal' | 'vertical';
export type CanvaResolution = 'hd' | '2k' | '4k' | '8k';
export type CanvaExportFormat = 'pdf' | 'png' | 'jpg' | 'svg' | 'webp';

export interface CanvaFilters {
  brightness: number; // 50 to 150 (100 = normal)
  contrast: number;   // 50 to 150 (100 = normal)
  blur: number;       // 0 to 10px
  grayscale: number;  // 0 to 100%
  sepia: number;      // 0 to 100%
  vignette: number;   // 0 to 100%
}

export interface CanvaToggles {
  showPhaseNames: boolean;
  showIllumination: boolean;
  showTraditionalNames: boolean;
  showMoonAge: boolean;
  showDayNumbers: boolean;
  showGridBorders: boolean;
  showZodiac: boolean;
}

export interface CanvaConfig {
  year: number;
  month: number | null; // null for full year
  isRange: boolean;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  styleId: LunarStyleId;
  format: CanvaFormat;
  aspectRatio: '16:9' | '9:16' | '1:1' | 'a4_horizontal' | 'a4_vertical';
  customColors: {
    bg: string;
    accent: string;
    text: string;
    moon: string;
  };
  bgImage: string | null;
  filters: CanvaFilters;
  toggles: CanvaToggles;
  title: string;
  subtitle: string;
  quote: string;
}
