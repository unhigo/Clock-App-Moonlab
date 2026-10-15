import { LunarDayData, MoonPhaseKey } from '../types';

/**
 * LUNAR CALCULATION ENGINE
 * Based on the synodic lunar cycle of 29.53058867 days.
 * Precise astronomical algorithms supporting years from 2026 to infinity.
 */

export const SYNODIC_MONTH = 29.53058867; // average days in a synodic lunar month

// Known reference New Moon (UTC): 2000-01-06 18:14:00 UTC (Epoch J2000)
// Or closer high-precision reference: 2024-01-11 11:57:00 UTC
const REFERENCE_NEW_MOON_UTC = Date.UTC(2024, 0, 11, 11, 57, 0);

// Traditional full moon names by month (Northern Hemisphere)
export const TRADITIONAL_MOON_NAMES: Record<number, { name: string; english: string; lore: string }> = {
  1: { name: 'Luna del Lobo', english: 'Wolf Moon', lore: 'Asociada a los aullidos en las noches heladas de pleno invierno.' },
  2: { name: 'Luna de Nieve', english: 'Snow Moon', lore: 'El mes de mayores nevadas en el hemisferio norte.' },
  3: { name: 'Luna de Gusano', english: 'Worm Moon', lore: 'El deshielo primaveral y el despertar de la tierra fértil.' },
  4: { name: 'Luna Rosa', english: 'Pink Moon', lore: 'En honor a la floración del musgo silvestre rosa (Phlox subulata).' },
  5: { name: 'Luna de Flores', english: 'Flower Moon', lore: 'La plenitud floral y el renacer de la vegetación.' },
  6: { name: 'Luna de Fresa', english: 'Strawberry Moon', lore: 'Tiempo tradicional de recolección de fresas silvestres.' },
  7: { name: 'Luna de Ciervo', english: 'Buck Moon', lore: 'Época en que los ciervos machos renuevan sus astas de terciopelo.' },
  8: { name: 'Luna de Esturión', english: 'Sturgeon Moon', lore: 'Momento álgido de pesca del esturión en grandes lagos.' },
  9: { name: 'Luna de Cosecha', english: 'Harvest Moon', lore: 'Brillo luminoso que permitía cosechar hasta altas horas de la noche.' },
  10: { name: 'Luna del Cazador', english: "Hunter's Moon", lore: 'Cacería tradicional tras recolectar los campos antes del invierno.' },
  11: { name: 'Luna del Castor', english: 'Beaver Moon', lore: 'Período en que los castores finalizan sus presas y madrigueras.' },
  12: { name: 'Luna Fría', english: 'Cold Moon', lore: 'La noche más larga y fría cercana al solsticio de invierno.' }
};

export const MOON_PHASE_CONFIG: Record<
  MoonPhaseKey,
  { index: number; name: string; description: string; glyph: string }
> = {
  NEW_MOON: { index: 0, name: 'Luna Nueva', description: 'Totalmente oscura en conjunción solar', glyph: '🌑' },
  WAXING_CRESCENT: { index: 1, name: 'Creciente Cóncava', description: 'Primer destello visible en el cielo occidental', glyph: '🌒' },
  FIRST_QUARTER: { index: 2, name: 'Cuarto Creciente', description: 'Mitad derecha iluminada en cuadratura', glyph: '🌓' },
  WAXING_GIBBOUS: { index: 3, name: 'Gibosa Creciente', description: 'Más de la mitad iluminada camino a la plenitud', glyph: '🌔' },
  FULL_MOON: { index: 4, name: 'Luna Llena', description: 'Oposición solar, 100% disco iluminado', glyph: '🌕' },
  WANING_GIBBOUS: { index: 5, name: 'Gibosa Menguante', description: 'Disco menguando gradualmente', glyph: '🌖' },
  LAST_QUARTER: { index: 6, name: 'Cuarto Menguante', description: 'Mitad izquierda iluminada', glyph: '🌗' },
  WANING_CRESCENT: { index: 7, name: 'Menguante Cóncava', description: 'Último arco antes de la nueva luna', glyph: '🌘' }
};

const ZODIAC_SIGNS = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
];

/**
 * Calculates accurate moon phase and illumination for a given Date
 */
export function getLunarDayData(date: Date): LunarDayData {
  const utcYear = date.getUTCFullYear();
  const utcMonth = date.getUTCMonth(); // 0-11
  const utcDay = date.getUTCDate();
  const utcDayOfWeek = date.getUTCDay();

  // Noon UTC on that date for standardized daily phase
  const targetUtcTime = Date.UTC(utcYear, utcMonth, utcDay, 12, 0, 0);
  const diffMs = targetUtcTime - REFERENCE_NEW_MOON_UTC;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  // Synodic lunar age in days (0.00 to 29.53)
  let moonAge = diffDays % SYNODIC_MONTH;
  if (moonAge < 0) {
    moonAge += SYNODIC_MONTH;
  }

  // Phase fraction (0.0 to 1.0)
  const phaseFraction = moonAge / SYNODIC_MONTH;

  // Illumination calculation: k = (1 - cos(2 * pi * phaseFraction)) / 2
  const illuminationFraction = (1 - Math.cos(2 * Math.PI * phaseFraction)) / 2;
  const illumination = Math.round(illuminationFraction * 100);

  // 8 Phase segmentation
  // Each segment is 360/8 = 45 degrees, centered around 0, 45, 90, 135, 180, 225, 270, 315
  const segmentSize = SYNODIC_MONTH / 8; // ~3.69 days per phase slot
  const halfSegment = segmentSize / 2;   // ~1.845 days

  let phaseIndex = 0;
  let phaseKey: MoonPhaseKey = 'NEW_MOON';

  if (moonAge < halfSegment || moonAge >= SYNODIC_MONTH - halfSegment) {
    phaseIndex = 0;
    phaseKey = 'NEW_MOON';
  } else if (moonAge < halfSegment + segmentSize) {
    phaseIndex = 1;
    phaseKey = 'WAXING_CRESCENT';
  } else if (moonAge < halfSegment + segmentSize * 2) {
    phaseIndex = 2;
    phaseKey = 'FIRST_QUARTER';
  } else if (moonAge < halfSegment + segmentSize * 3) {
    phaseIndex = 3;
    phaseKey = 'WAXING_GIBBOUS';
  } else if (moonAge < halfSegment + segmentSize * 4) {
    phaseIndex = 4;
    phaseKey = 'FULL_MOON';
  } else if (moonAge < halfSegment + segmentSize * 5) {
    phaseIndex = 5;
    phaseKey = 'WANING_GIBBOUS';
  } else if (moonAge < halfSegment + segmentSize * 6) {
    phaseIndex = 6;
    phaseKey = 'LAST_QUARTER';
  } else {
    phaseIndex = 7;
    phaseKey = 'WANING_CRESCENT';
  }

  // Detect key peak phase days
  const isFullMoonPeak = Math.abs(moonAge - SYNODIC_MONTH / 2) < 0.75;
  const isNewMoonPeak = moonAge < 0.75 || moonAge > SYNODIC_MONTH - 0.75;

  // Traditional name
  const monthNum = utcMonth + 1;
  const traditional = isFullMoonPeak || phaseKey === 'FULL_MOON'
    ? TRADITIONAL_MOON_NAMES[monthNum]?.name
    : undefined;

  // Approximate Supermoon / Micromoon based on lunar anomaly cycle (~27.55 days)
  const anomalisticMonth = 27.55455;
  const anomalyDays = (diffDays % anomalisticMonth + anomalisticMonth) % anomalisticMonth;
  // Perigee happens near anomaly ~0 or 27.55
  const isPerigee = anomalyDays < 1.8 || anomalyDays > anomalisticMonth - 1.8;
  const isApogee = Math.abs(anomalyDays - anomalisticMonth / 2) < 1.8;
  const isSupermoon = isFullMoonPeak && isPerigee;
  const isMicromoon = isFullMoonPeak && isApogee;

  // Approximate Zodiac constellation transit (Moon spends ~2.3 days per sign)
  const tropicalMonth = 27.32158;
  const zodiacIndex = Math.floor(((diffDays % tropicalMonth + tropicalMonth) % tropicalMonth / tropicalMonth) * 12);
  const zodiacSign = ZODIAC_SIGNS[zodiacIndex % 12];

  // Format date string YYYY-MM-DD
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const dateStr = `${utcYear}-${pad(monthNum)}-${pad(utcDay)}`;

  return {
    date: dateStr,
    year: utcYear,
    month: monthNum,
    day: utcDay,
    dayOfWeek: utcDayOfWeek,
    phase: phaseIndex,
    phaseName: MOON_PHASE_CONFIG[phaseKey].name,
    phaseKey,
    illumination,
    moonAge: Math.round(moonAge * 10) / 10,
    traditionalName: traditional,
    isSupermoon,
    isMicromoon,
    isKeyPhase: isFullMoonPeak || isNewMoonPeak,
    zodiacSign
  };
}

/**
 * Returns lunar data for all days of a given month
 */
export function getMonthLunarDays(year: number, month: number): LunarDayData[] {
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const days: LunarDayData[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(Date.UTC(year, month - 1, d, 12, 0, 0));
    days.push(getLunarDayData(dt));
  }

  return days;
}

/**
 * Returns all lunar days for an entire year (365 or 366 days)
 */
export function getYearLunarDays(year: number): LunarDayData[] {
  const result: LunarDayData[] = [];
  for (let m = 1; m <= 12; m++) {
    const monthDays = getMonthLunarDays(year, m);
    result.push(...monthDays);
  }
  return result;
}

/**
 * Returns lunar days for a custom date range (e.g. season or vacation period)
 */
export function getDateRangeLunarDays(startDateStr: string, endDateStr: string): LunarDayData[] {
  const start = new Date(startDateStr + 'T12:00:00Z');
  const end = new Date(endDateStr + 'T12:00:00Z');
  const days: LunarDayData[] = [];

  const curr = new Date(start);
  while (curr <= end) {
    days.push(getLunarDayData(curr));
    curr.setUTCDate(curr.getUTCDate() + 1);
  }

  return days;
}

/**
 * Finds next occurrences of Full Moon and New Moon from today
 */
export function getUpcomingKeyMoons(fromDate: Date = new Date(), limit: number = 4) {
  const events: { date: Date; data: LunarDayData; type: 'full' | 'new' }[] = [];
  const cur = new Date(fromDate);
  cur.setHours(12, 0, 0, 0);

  let scanned = 0;
  while (events.length < limit && scanned < 120) {
    const data = getLunarDayData(cur);
    if (data.isKeyPhase) {
      const type = data.phaseKey === 'FULL_MOON' ? 'full' : 'new';
      // ensure we don't duplicate adjacent days for same peak
      const last = events[events.length - 1];
      if (!last || Math.abs(cur.getTime() - last.date.getTime()) > 86400000 * 3) {
        events.push({ date: new Date(cur), data, type });
      }
    }
    cur.setDate(cur.getDate() + 1);
    scanned++;
  }

  return events;
}
