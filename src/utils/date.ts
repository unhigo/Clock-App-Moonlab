/**
 * Precision date and time utilities using standard Intl.DateTimeFormat
 */

export function padZero(n: number, len: number = 2): string {
  return n.toString().padStart(len, '0');
}

export function formatTimeComponents(date: Date, format12_24: '12h' | '24h', showSeconds: boolean, showMs: boolean) {
  let hours = date.getHours();
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());
  const ms = padZero(Math.floor(date.getMilliseconds() / 10), 2);
  let ampm = '';

  if (format12_24 === '12h') {
    ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12
  }

  const hoursStr = padZero(hours);

  return {
    hours: hoursStr,
    minutes,
    seconds,
    milliseconds: ms,
    ampm,
    timeString: `${hoursStr}:${minutes}${showSeconds ? `:${seconds}` : ''}${showMs ? `.${ms}` : ''} ${ampm}`.trim()
  };
}

export function formatDateFormatted(date: Date, locale: string = 'en-US'): {
  dayOfWeek: string;
  dayOfWeekShort: string;
  monthName: string;
  monthShort: string;
  dayOfMonth: number;
  year: number;
  isoDate: string; // YYYY-MM-DD
  fullFormatted: string;
} {
  const dayOfWeek = date.toLocaleDateString(locale, { weekday: 'long' });
  const dayOfWeekShort = date.toLocaleDateString(locale, { weekday: 'short' });
  const monthName = date.toLocaleDateString(locale, { month: 'long' });
  const monthShort = date.toLocaleDateString(locale, { month: 'short' });
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();
  const isoDate = `${year}-${padZero(date.getMonth() + 1)}-${padZero(dayOfMonth)}`;

  return {
    dayOfWeek,
    dayOfWeekShort,
    monthName,
    monthShort,
    dayOfMonth,
    year,
    isoDate,
    fullFormatted: `${dayOfWeekShort}, ${monthShort} ${dayOfMonth}, ${year}`
  };
}

/**
 * Calculates current day progress as a fraction 0 to 1
 */
export function getDayProgress(date: Date): { fraction: number; percent: number; hoursPassed: number; minutesRemaining: number } {
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const endOfDay = startOfDay + 24 * 60 * 60 * 1000;
  const now = date.getTime();
  const fraction = Math.min(1, Math.max(0, (now - startOfDay) / (endOfDay - startOfDay)));
  const percent = Math.round(fraction * 1000) / 10;
  
  const minutesPassed = (date.getHours() * 60) + date.getMinutes();
  const minutesRemaining = 1440 - minutesPassed;
  const hoursPassed = Math.round((minutesPassed / 60) * 10) / 10;

  return { fraction, percent, hoursPassed, minutesRemaining };
}

/**
 * Timezone details for an IANA timezone string
 */
export function getTimezoneDetails(iana: string, referenceDate: Date = new Date()) {
  try {
    // Format target time
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: iana,
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      weekday: 'short',
      timeZoneName: 'short'
    });

    const parts = dtf.formatToParts(referenceDate);
    const getPart = (type: string) => parts.find(p => p.type === type)?.value || '';

    const hour = getPart('hour');
    const minute = getPart('minute');
    const second = getPart('second');
    const weekday = getPart('weekday');
    const tzName = getPart('timeZoneName');
    const month = getPart('month');
    const day = getPart('day');
    const year = getPart('year');

    // Calculate time difference between local and target zone
    // Create a date in the target timezone
    const targetDateString = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    const targetDate = new Date(targetDateString);
    const localDate = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth(),
      referenceDate.getDate(),
      referenceDate.getHours(),
      referenceDate.getMinutes(),
      referenceDate.getSeconds()
    );

    const diffMinutes = Math.round((targetDate.getTime() - localDate.getTime()) / (60 * 1000));
    const diffHours = diffMinutes / 60;
    
    let diffFormatted = '';
    if (diffMinutes === 0) {
      diffFormatted = 'Same time';
    } else if (diffMinutes > 0) {
      const h = Math.floor(diffMinutes / 60);
      const m = diffMinutes % 60;
      diffFormatted = `+${h}${m > 0 ? `:${padZero(m)}` : ''}h ahead`;
    } else {
      const absMin = Math.abs(diffMinutes);
      const h = Math.floor(absMin / 60);
      const m = absMin % 60;
      diffFormatted = `-${h}${m > 0 ? `:${padZero(m)}` : ''}h behind`;
    }

    // Determine day relationship: Yesterday, Today, Tomorrow
    const targetDayStr = `${year}-${month}-${day}`;
    const localDayStr = `${referenceDate.getFullYear()}-${padZero(referenceDate.getMonth() + 1)}-${padZero(referenceDate.getDate())}`;
    
    let dayRelation = 'Today';
    if (targetDayStr > localDayStr) {
      dayRelation = 'Tomorrow';
    } else if (targetDayStr < localDayStr) {
      dayRelation = 'Yesterday';
    }

    return {
      isValid: true,
      timeString: `${hour}:${minute}`,
      seconds: second,
      weekday,
      tzName,
      dateString: `${weekday}, ${month}/${day}`,
      diffHours,
      diffMinutes,
      diffFormatted,
      dayRelation,
      hourNum: parseInt(hour, 10),
      isDaytime: parseInt(hour, 10) >= 6 && parseInt(hour, 10) < 20
    };
  } catch (err) {
    return {
      isValid: false,
      timeString: '--:--',
      seconds: '00',
      weekday: '---',
      tzName: 'UTC',
      dateString: '',
      diffHours: 0,
      diffMinutes: 0,
      diffFormatted: 'Unavailable',
      dayRelation: 'Today',
      hourNum: 12,
      isDaytime: true
    };
  }
}
