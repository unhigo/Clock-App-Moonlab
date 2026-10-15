import { CityTimezone, AmbientTrack, TimelineEvent, AppSettings, TaskItem } from '../types';

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  accentColor: '#FFFFFF',
  uiDensity: 'comfortable',
  reducedMotion: false,
  soundAlerts: true,
  hapticFeedback: true,
  notifications: false,
  clock: {
    format: '12h',
    showSeconds: true,
    showMilliseconds: false,
    showDate: true,
    showDay: true,
    showTimezone: true,
    showDayProgress: true,
    showSolarTimes: true,
    typography: 'mono',
    size: 'large',
    alignment: 'center',
    dialTheme: 'obsidian',
    rulerSpan: '36h',
    timedriftMode: 'normal',
    showTasksWidget: true,
    showTimezonesWidget: true
  },
  pomodoro: {
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    cyclesBeforeLongBreak: 4,
    autoStartBreaks: true,
    autoStartFocus: false,
    soundEnabled: true
  }
};

export const DEFAULT_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Deep Focus: Architectural review & time calibration',
    completed: false,
    createdAt: Date.now() - 3600000,
    category: 'FOCUS'
  },
  {
    id: 'task-2',
    title: 'Review astronomical solar cycles & lunar nodes',
    completed: false,
    createdAt: Date.now() - 1800000,
    category: 'WORK'
  },
  {
    id: 'task-3',
    title: 'Synchronize timeline across Madrid, London & Tokyo',
    completed: true,
    createdAt: Date.now() - 7200000,
    category: 'WORK'
  }
];

export const DEFAULT_TIMEZONES: CityTimezone[] = [
  {
    id: 'tz-madrid',
    city: 'Madrid',
    country: 'Spain',
    iana: 'Europe/Madrid',
    isFavorite: true,
    order: 0
  },
  {
    id: 'tz-london',
    city: 'London',
    country: 'United Kingdom',
    iana: 'Europe/London',
    isFavorite: true,
    order: 1
  },
  {
    id: 'tz-nyc',
    city: 'New York',
    country: 'United States',
    iana: 'America/New_York',
    isFavorite: true,
    order: 2
  },
  {
    id: 'tz-sf',
    city: 'San Francisco',
    country: 'United States',
    iana: 'America/Los_Angeles',
    isFavorite: false,
    order: 3
  },
  {
    id: 'tz-tokyo',
    city: 'Tokyo',
    country: 'Japan',
    iana: 'Asia/Tokyo',
    isFavorite: true,
    order: 4
  },
  {
    id: 'tz-singapore',
    city: 'Singapore',
    country: 'Singapore',
    iana: 'Asia/Singapore',
    isFavorite: false,
    order: 5
  },
  {
    id: 'tz-sydney',
    city: 'Sydney',
    country: 'Australia',
    iana: 'Australia/Sydney',
    isFavorite: false,
    order: 6
  }
];

export const POPULAR_CITIES_CATALOG = [
  { city: 'Madrid', country: 'Spain', iana: 'Europe/Madrid' },
  { city: 'London', country: 'United Kingdom', iana: 'Europe/London' },
  { city: 'Paris', country: 'France', iana: 'Europe/Paris' },
  { city: 'Berlin', country: 'Germany', iana: 'Europe/Berlin' },
  { city: 'New York', country: 'United States', iana: 'America/New_York' },
  { city: 'San Francisco', country: 'United States', iana: 'America/Los_Angeles' },
  { city: 'Chicago', country: 'United States', iana: 'America/Chicago' },
  { city: 'Toronto', country: 'Canada', iana: 'America/Toronto' },
  { city: 'Tokyo', country: 'Japan', iana: 'Asia/Tokyo' },
  { city: 'Seoul', country: 'South Korea', iana: 'Asia/Seoul' },
  { city: 'Singapore', country: 'Singapore', iana: 'Asia/Singapore' },
  { city: 'Hong Kong', country: 'Hong Kong', iana: 'Asia/Hong_Kong' },
  { city: 'Sydney', country: 'Australia', iana: 'Australia/Sydney' },
  { city: 'Auckland', country: 'New Zealand', iana: 'Pacific/Auckland' },
  { city: 'Dubai', country: 'UAE', iana: 'Asia/Dubai' },
  { city: 'São Paulo', country: 'Brazil', iana: 'America/Sao_Paulo' },
  { city: 'Buenos Aires', country: 'Argentina', iana: 'America/Argentina/Buenos_Aires' },
  { city: 'Mexico City', country: 'Mexico', iana: 'America/Mexico_City' },
  { city: 'Reykjavik', country: 'Iceland', iana: 'Atlantic/Reykjavik' },
  { city: 'Zurich', country: 'Switzerland', iana: 'Europe/Zurich' },
  { city: 'Stockholm', country: 'Sweden', iana: 'Europe/Stockholm' }
];

export const AMBIENT_TRACKS: AmbientTrack[] = [
  {
    id: 'amb-lofi',
    name: 'Lo-Fi Warm Tape',
    category: 'LO-FI',
    description: 'Analog warm chords, gentle vinyl flutter and subtle harmonic resonance',
    synthType: 'lofiChords'
  },
  {
    id: 'amb-focus',
    name: 'Neural Focus Flow',
    category: 'FOCUS',
    description: '40Hz Gamma binaural rhythm for deep cognitive focus and flow state',
    synthType: 'drone'
  },
  {
    id: 'amb-rain',
    name: 'Midnight Rainfall',
    category: 'RAIN',
    description: 'Continuous soft rain with atmospheric low-pass filtered drops',
    synthType: 'rain'
  },
  {
    id: 'amb-ambient',
    name: 'Nordic Horizon',
    category: 'AMBIENT',
    description: 'Ethereal ambient pad with subtle pitch drift and slow frequency swell',
    synthType: 'spacePad'
  },
  {
    id: 'amb-nature',
    name: 'Whispering Canopy',
    category: 'NATURE',
    description: 'Gentle canopy breeze, resonant organic air movements and soft rustle',
    synthType: 'forest'
  },
  {
    id: 'amb-deep',
    name: 'Ocean Abyssal',
    category: 'DEEP',
    description: 'Ultra-low frequency rolling resonance and rhythmic coastal ocean surge',
    synthType: 'waves'
  },
  {
    id: 'amb-space',
    name: 'Orbital Silence',
    category: 'SPACE',
    description: 'Slow cosmic drone synthesized with multi-oscillator sub-bass',
    synthType: 'drone'
  },
  {
    id: 'amb-whitenoise',
    name: 'Pure Pink Noise',
    category: 'WHITE NOISE',
    description: 'Calibrated 1/f acoustic pink noise to mask distractions and external audio',
    synthType: 'pinknoise'
  }
];

export const INITIAL_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'ev-1',
    title: 'Morning Deep Work',
    startTime: '09:00',
    endTime: '11:30',
    date: new Date().toISOString().split('T')[0],
    category: 'FOCUS',
    notes: 'High-priority engineering and architecture tasks'
  },
  {
    id: 'ev-2',
    title: 'Sync & Architecture Review',
    startTime: '11:45',
    endTime: '12:30',
    date: new Date().toISOString().split('T')[0],
    category: 'MEETING',
    notes: 'Team sync on system architecture'
  },
  {
    id: 'ev-3',
    title: 'Mindful Walk & Lunch',
    startTime: '13:00',
    endTime: '14:00',
    date: new Date().toISOString().split('T')[0],
    category: 'BREAK',
    notes: 'Step away from screens'
  },
  {
    id: 'ev-4',
    title: 'Sprint Implementation',
    startTime: '14:30',
    endTime: '17:00',
    date: new Date().toISOString().split('T')[0],
    category: 'WORK',
    notes: 'Feature delivery & code reviews'
  },
  {
    id: 'ev-5',
    title: 'Day Wrap & Planning',
    startTime: '17:30',
    endTime: '18:00',
    date: new Date().toISOString().split('T')[0],
    category: 'PERSONAL',
    notes: 'Review accomplishments and set tomorrow priorities'
  }
];

export const DEFAULT_EVENTS = INITIAL_TIMELINE_EVENTS;

