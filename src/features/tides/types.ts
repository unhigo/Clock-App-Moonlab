export interface TideLocation {
  id: string;
  name: string;
  country: string;
  region: string;
  lat: number;
  lon: number;
  baseTidalRange: number; // In meters (mean range)
  maxRange: number; // In meters (equinoctial spring tide)
  tidalType: 'semidiurnal' | 'diurnal' | 'mixed';
  description: string;
  waterBaseline: number; // Mean sea level (m)
}

export type MoonPhaseShortcut = 'NEW_MOON' | 'FIRST_QUARTER' | 'FULL_MOON' | 'LAST_QUARTER';

export interface TidePeak {
  type: 'HIGH' | 'LOW';
  timeStr: string; // HH:MM
  hours: number; // decimal hours 0..24
  height: number; // in meters
}

export interface TideSimulationState {
  currentHour: number; // 0.00 to 24.00
  selectedDate: Date;
  selectedLocation: TideLocation;
  moonAngleRad: number; // angle of moon relative to sun (0 = new moon, PI = full moon)
  tidalCoefficient: number; // 20 to 120 (SHOM standard)
  tideCategory: 'SPRING' | 'NEAP' | 'INTERMEDIATE';
  categoryLabel: string;
  currentWaterHeight: number; // meters
  trend: 'rising' | 'falling' | 'slack';
  peaksToday: TidePeak[];
  nextPeak: {
    type: 'HIGH' | 'LOW';
    timeStr: string;
    minutesLeft: number;
    height: number;
  };
  illumination: number;
  phaseName: string;
  isSupermoon: boolean;
}

export type CameraViewMode = 'orbit' | 'top' | 'coastal';
