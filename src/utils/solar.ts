import { DailySolarInfo } from '../types';
import { padZero } from './date';

/**
 * Approximate solar times calculation for latitude/longitude
 * Uses standard solar declination approximations.
 */
export function calculateSolarTimes(
  date: Date = new Date(),
  lat: number = 40.7128, // Default ~40deg (mid-latitude)
  lon: number = -74.0060
): DailySolarInfo {
  // Day of year
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Solar declination approximation
  const declination = 23.45 * Math.sin((360 / 365) * (dayOfYear - 81) * (Math.PI / 180));
  
  // Hour angle
  const latRad = lat * (Math.PI / 180);
  const decRad = declination * (Math.PI / 180);
  
  let cosHourAngle = -Math.tan(latRad) * Math.tan(decRad);
  cosHourAngle = Math.max(-1, Math.min(1, cosHourAngle));
  
  const hourAngle = Math.acos(cosHourAngle) * (180 / Math.PI);
  const dayLengthHours = (2 * hourAngle) / 15;

  // Approx solar noon at 12:00 local standard solar time
  const sunriseHour = 12 - (dayLengthHours / 2);
  const sunsetHour = 12 + (dayLengthHours / 2);

  const sunriseMin = Math.round((sunriseHour % 1) * 60);
  const sunsetMin = Math.round((sunsetHour % 1) * 60);

  const sunriseStr = `${padZero(Math.floor(sunriseHour))}:${padZero(sunriseMin)}`;
  const sunsetStr = `${padZero(Math.floor(sunsetHour))}:${padZero(sunsetMin)}`;

  const currentHourDec = date.getHours() + (date.getMinutes() / 60) + (date.getSeconds() / 3600);
  const isDaytime = currentHourDec >= sunriseHour && currentHourDec <= sunsetHour;

  let sunProgressPercent = 0;
  if (isDaytime) {
    sunProgressPercent = Math.round(((currentHourDec - sunriseHour) / dayLengthHours) * 100);
  } else if (currentHourDec > sunsetHour) {
    sunProgressPercent = 100;
  }

  const dayLengthH = Math.floor(dayLengthHours);
  const dayLengthM = Math.round((dayLengthHours % 1) * 60);

  return {
    sunrise: sunriseStr,
    sunset: sunsetStr,
    dayLength: `${dayLengthH}h ${dayLengthM}m`,
    solarNoon: '12:00',
    isDaytime,
    sunProgressPercent
  };
}
