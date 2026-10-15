import { TideLocation, TidePeak, TideSimulationState } from './types';
import { getLunarDayData } from '../../utils/lunarEngine';

export const COASTAL_LOCATIONS: TideLocation[] = [
  {
    id: 'fundy',
    name: 'Bahía de Fundy',
    country: 'Canadá',
    region: 'Nueva Escocia / Atlántico Norte',
    lat: 45.2,
    lon: -64.5,
    baseTidalRange: 13.5,
    maxRange: 16.3,
    tidalType: 'semidiurnal',
    waterBaseline: 8.0,
    description: 'Mayor amplitud de marea del planeta debido a la resonancia hidrodinámica del golfo.'
  },
  {
    id: 'mont-saint-michel',
    name: 'Mont-Saint-Michel',
    country: 'Francia',
    region: 'Normandía / Canal de la Mancha',
    lat: 48.63,
    lon: -1.51,
    baseTidalRange: 11.2,
    maxRange: 14.2,
    tidalType: 'semidiurnal',
    waterBaseline: 7.0,
    description: 'El mar se retira hasta 15 km y regresa "a la velocidad de un caballo al galope".'
  },
  {
    id: 'vigo',
    name: 'Ría de Vigo',
    country: 'España',
    region: 'Galicia / Costa Atlántica',
    lat: 42.23,
    lon: -8.72,
    baseTidalRange: 3.5,
    maxRange: 4.5,
    tidalType: 'semidiurnal',
    waterBaseline: 2.3,
    description: 'Clásica marea semidiurna atlántica europea con ricos ecosistemas de batea y marisqueo.'
  },
  {
    id: 'san-francisco',
    name: 'Bahía de San Francisco',
    country: 'EE.UU.',
    region: 'California / Océano Pacífico',
    lat: 37.8,
    lon: -122.42,
    baseTidalRange: 1.8,
    maxRange: 2.4,
    tidalType: 'mixed',
    waterBaseline: 1.4,
    description: 'Marea semidiurna mixta con dos pleamares desiguales (Higher High Water y Lower High Water).'
  },
  {
    id: 'honolulu',
    name: 'Honolulu',
    country: 'EE.UU.',
    region: 'Hawái / Cuenca Abierta del Pacífico',
    lat: 21.3,
    lon: -157.85,
    baseTidalRange: 0.7,
    maxRange: 0.95,
    tidalType: 'mixed',
    waterBaseline: 0.5,
    description: 'Marea oceánica pelágica pura sin amplificación topográfica ni efecto embudo costero.'
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'España',
    region: 'Cataluña / Mar Mediterráneo',
    lat: 41.38,
    lon: 2.18,
    baseTidalRange: 0.35,
    maxRange: 0.55,
    tidalType: 'semidiurnal',
    waterBaseline: 0.3,
    description: 'Cuenca semicerrada micromareal donde las mareas astronómicas son casi imperceptibles.'
  }
];

/**
 * Calculates tidal state and water height for a given location, date, and decimal hour.
 */
export function calculateTideState(
  location: TideLocation,
  date: Date,
  currentHour: number
): TideSimulationState {
  const lunarData = getLunarDayData(date);
  
  // Angle of moon relative to sun in radians [0, 2*PI]
  // Phase fraction: 0 = New Moon, 0.5 = Full Moon, 1.0 = New Moon
  const phaseFraction = lunarData.moonAge / 29.53058867;
  const moonAngleRad = phaseFraction * 2 * Math.PI;

  // Spring tides occur when Moon and Sun are aligned (phaseFraction near 0, 0.5, 1.0)
  // Neap tides occur in quadrature (phaseFraction near 0.25, 0.75)
  // Modulation coefficient from 0.0 (extreme neap) to 1.0 (extreme spring)
  const alignmentCos = Math.cos(2 * moonAngleRad); // +1 at New/Full, -1 at Quarters
  const springFactor = (alignmentCos + 1) / 2; // 0 to 1

  // Standard French/Spanish SHOM tidal coefficient: 20 (lowest neap) to 120 (highest equinoctial spring)
  // Base mean coefficient is ~70. Range goes from ~30 to ~115 (up to 120 with supermoon)
  let tidalCoefficient = Math.round(35 + springFactor * 75);
  if (lunarData.isSupermoon) {
    tidalCoefficient = Math.min(120, tidalCoefficient + 8);
  }
  if (lunarData.isMicromoon) {
    tidalCoefficient = Math.max(20, tidalCoefficient - 6);
  }

  let tideCategory: 'SPRING' | 'NEAP' | 'INTERMEDIATE' = 'INTERMEDIATE';
  let categoryLabel = 'Marea Media (Coeficiente Normal)';

  if (tidalCoefficient >= 85) {
    tideCategory = 'SPRING';
    categoryLabel = tidalCoefficient >= 105 ? 'Marea Viva Excepcional' : 'Marea Viva (Sicigias)';
  } else if (tidalCoefficient <= 50) {
    tideCategory = 'NEAP';
    categoryLabel = 'Marea Muerta (Cuadraturas)';
  }

  // Harmonic Constituents calculation for the location
  // M2 period: 12.4206h (frequency omega_M2 = 2 * PI / 12.4206 rad/h)
  // S2 period: 12.0000h (frequency omega_S2 = 2 * PI / 12.0000 rad/h)
  const omegaM2 = (2 * Math.PI) / 12.4206;
  const omegaS2 = (2 * Math.PI) / 12.0;

  // Phase offset based on Moon age and location longitude
  // Phase shift for M2 relative to local noon
  const phaseOffsetM2 = -2 * moonAngleRad + (location.lon * Math.PI) / 180;
  const phaseOffsetS2 = (location.lon * Math.PI) / 180;

  // Amplitudes: M2 is ~70% of total astronomical pull, S2 is ~30%
  const currentMaxRange = location.baseTidalRange * (0.65 + springFactor * 0.45);
  const ampM2 = (currentMaxRange / 2) * 0.72;
  const ampS2 = (currentMaxRange / 2) * 0.28;

  // Diurnal inequality for mixed tides
  const isMixed = location.tidalType === 'mixed';
  const omegaK1 = (2 * Math.PI) / 23.934;
  const ampK1 = isMixed ? (currentMaxRange / 2) * 0.35 : 0;

  // Function to get height at any hour t [0..24]
  const getHeightAt = (t: number): number => {
    const m2 = ampM2 * Math.cos(omegaM2 * t + phaseOffsetM2);
    const s2 = ampS2 * Math.cos(omegaS2 * t + phaseOffsetS2);
    const k1 = isMixed ? ampK1 * Math.cos(omegaK1 * t + phaseOffsetM2 / 2) : 0;
    const h = location.waterBaseline + m2 + s2 + k1;
    return Math.max(0, Math.round(h * 100) / 100);
  };

  const currentWaterHeight = getHeightAt(currentHour);

  // Compute trend (derivative)
  const hPast = getHeightAt(Math.max(0, currentHour - 0.1));
  const hFuture = getHeightAt(Math.min(24, currentHour + 0.1));
  const diff = hFuture - hPast;
  let trend: 'rising' | 'falling' | 'slack' = 'slack';
  if (diff > 0.02) trend = 'rising';
  else if (diff < -0.02) trend = 'falling';

  // Find all High and Low tide peaks across the 24 hours (step 0.05 hr = 3 mins)
  const peaksToday: TidePeak[] = [];
  const step = 0.05;
  let prevVal = getHeightAt(0);
  let prevSlope = (getHeightAt(step) - prevVal) / step;

  for (let t = step; t <= 24.0; t += step) {
    const curVal = getHeightAt(t);
    const nextVal = getHeightAt(Math.min(24, t + step));
    const curSlope = (nextVal - curVal) / step;

    // Zero-crossing in derivative indicates extrema
    if (prevSlope > 0 && curSlope <= 0) {
      // Local maximum -> Pleamar (High tide)
      const hH = Math.floor(t);
      const mH = Math.floor((t - hH) * 60);
      const timeStr = `${hH.toString().padStart(2, '0')}:${mH.toString().padStart(2, '0')}`;
      peaksToday.push({
        type: 'HIGH',
        timeStr,
        hours: t,
        height: Math.round(curVal * 100) / 100
      });
    } else if (prevSlope < 0 && curSlope >= 0) {
      // Local minimum -> Bajamar (Low tide)
      const hL = Math.floor(t);
      const mL = Math.floor((t - hL) * 60);
      const timeStr = `${hL.toString().padStart(2, '0')}:${mL.toString().padStart(2, '0')}`;
      peaksToday.push({
        type: 'LOW',
        timeStr,
        hours: t,
        height: Math.round(curVal * 100) / 100
      });
    }

    prevSlope = curSlope;
    prevVal = curVal;
  }

  // Find next peak from currentHour
  let upcomingPeak = peaksToday.find((p) => p.hours > currentHour);
  if (!upcomingPeak && peaksToday.length > 0) {
    // If past all peaks today, wrap to first peak tomorrow (~ +12.4h)
    const first = peaksToday[0];
    upcomingPeak = {
      ...first,
      hours: first.hours + 24
    };
  }

  const nextPeakHours = upcomingPeak ? upcomingPeak.hours : currentHour + 6;
  const minutesLeft = Math.max(0, Math.round((nextPeakHours - currentHour) * 60));

  const nextPeak = {
    type: upcomingPeak ? upcomingPeak.type : 'HIGH',
    timeStr: upcomingPeak ? upcomingPeak.timeStr : '--:--',
    minutesLeft,
    height: upcomingPeak ? upcomingPeak.height : currentWaterHeight
  };

  return {
    currentHour,
    selectedDate: date,
    selectedLocation: location,
    moonAngleRad,
    tidalCoefficient,
    tideCategory,
    categoryLabel,
    currentWaterHeight,
    trend,
    peaksToday,
    nextPeak,
    illumination: lunarData.illumination,
    phaseName: lunarData.phaseName,
    isSupermoon: !!lunarData.isSupermoon
  };
}

/**
 * Generates an array of samples throughout the 24 hours for the chart.
 */
export function get24HourTideSamples(
  location: TideLocation,
  date: Date,
  totalPoints = 96 // One point every 15 minutes
): Array<{ hour: number; timeStr: string; height: number }> {
  const samples: Array<{ hour: number; timeStr: string; height: number }> = [];
  const lunarData = getLunarDayData(date);
  const phaseFraction = lunarData.moonAge / 29.53058867;
  const moonAngleRad = phaseFraction * 2 * Math.PI;

  const alignmentCos = Math.cos(2 * moonAngleRad);
  const springFactor = (alignmentCos + 1) / 2;
  const currentMaxRange = location.baseTidalRange * (0.65 + springFactor * 0.45);
  const ampM2 = (currentMaxRange / 2) * 0.72;
  const ampS2 = (currentMaxRange / 2) * 0.28;

  const isMixed = location.tidalType === 'mixed';
  const omegaM2 = (2 * Math.PI) / 12.4206;
  const omegaS2 = (2 * Math.PI) / 12.0;
  const omegaK1 = (2 * Math.PI) / 23.934;

  const phaseOffsetM2 = -2 * moonAngleRad + (location.lon * Math.PI) / 180;
  const phaseOffsetS2 = (location.lon * Math.PI) / 180;
  const ampK1 = isMixed ? (currentMaxRange / 2) * 0.35 : 0;

  for (let i = 0; i < totalPoints; i++) {
    const t = (i / (totalPoints - 1)) * 24;
    const m2 = ampM2 * Math.cos(omegaM2 * t + phaseOffsetM2);
    const s2 = ampS2 * Math.cos(omegaS2 * t + phaseOffsetS2);
    const k1 = isMixed ? ampK1 * Math.cos(omegaK1 * t + phaseOffsetM2 / 2) : 0;
    const h = location.waterBaseline + m2 + s2 + k1;

    const hh = Math.floor(t);
    const mm = Math.floor((t - hh) * 60);
    const timeStr = `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;

    samples.push({
      hour: t,
      timeStr,
      height: Math.max(0, Math.round(h * 100) / 100)
    });
  }

  return samples;
}
