const oneDay = 24 * 3600 * 1000;

export function getSafeDate(d: Date | string | number) {
  if (typeof d === 'number') return new Date(d);
  if (typeof d === 'string') return new Date(d.replace(/-/g, '/'));
  return d;
}

export function getPureDate(d: Date, ignoreDay?: boolean) {
  if (ignoreDay) return new Date(d.getFullYear(), d.getMonth());
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function getFirstDayOfMonth(year?: number, month?: number) {
  const today = new Date();
  if (year === void 0) year = today.getFullYear();
  if (month === void 0) month = today.getMonth();
  return new Date(year, month, 1);
}

export function getLastDayOfMonth(year?: number, month?: number) {
  const today = new Date();
  if (year === void 0) year = today.getFullYear();
  if (month === void 0) month = today.getMonth();
  return new Date(year, month + 1, 0);
}

export function getFirstDayOfYear(year?: number) {
  const today = new Date();
  if (year === void 0) year = today.getFullYear();
  return new Date(year, 0, 1);
}

export function getLastDayOfYear(year?: number) {
  const today = new Date();
  if (year === void 0) year = today.getFullYear();
  return new Date(year, 12, 0);
}

export function getWeekNumber(date: Date) {
  const pureDate = getPureDate(date);
  const firstDayOfYear = getFirstDayOfYear(date.getFullYear());
  const pastedDays = (pureDate.getTime() - firstDayOfYear.getTime()) / oneDay;
  return Math.ceil((pastedDays + firstDayOfYear.getDay() + 1) / 7);
}

export function equalDate(
  date1: Date | null,
  date2: Date | null,
  ignoreDay?: boolean
) {
  if (date1 == null || date2 == null) {
    return date1 === date2;
  }
  const ret =
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth();
  if (!ret || ignoreDay) return ret;
  return ret && date1.getDate() === date2.getDate();
}

export function lessThanDate(date1: Date, date2: Date) {
  const d1 = getPureDate(date1);
  const d2 = getPureDate(date2);
  return d1.getTime() < d2.getTime();
}

export function greaterThanDate(date1: Date, date2: Date) {
  const d1 = getPureDate(date1);
  const d2 = getPureDate(date2);
  return d1.getTime() > d2.getTime();
}

export function lessThanOrEqualDate(date1: Date, date2: Date) {
  return equalDate(date1, date2) || lessThanDate(date1, date2);
}

export function greaterThanOrEqualDate(date1: Date, date2: Date) {
  return equalDate(date1, date2) || greaterThanDate(date1, date2);
}

export function isPreviousMonth(date: Date, month: number) {
  return date.getMonth() < month;
}

export function isNextMonth(date: Date, month: number) {
  return date.getMonth() > month;
}

export function isCurrentMonth(date: Date, month: number) {
  return date.getMonth() === month;
}

export function isPreviousYear(date: Date, year: number) {
  return date.getFullYear() < year;
}

export function isNextYear(date: Date, year: number) {
  return date.getFullYear() > year;
}

export function isCurrentYear(date: Date, year: number) {
  return date.getFullYear() === year;
}

export function getDecade(year: number) {
  const start = ~~(year / 10) * 10;
  return [start, start + 9];
}

export function getCentury(year: number) {
  const start = ~~(year / 100) * 100;
  return [start, start + 99];
}

export function addDays(days: number, date?: Date) {
  if (!date) date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function subtractDays(days: number, date?: Date) {
  if (!date) date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
}

export function addMonths(months: number, date?: Date) {
  if (!date) date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + months, date.getDate());
}

export function subtractMonths(months: number, date?: Date) {
  if (!date) date = new Date();
  return new Date(date.getFullYear(), date.getMonth() - months, date.getDate());
}

export function diffDays(date1: Date, date2: Date) {
  const pd1 = getPureDate(date1);
  const pd2 = getPureDate(date2);
  return Math.ceil((pd2.getTime() - pd1.getTime()) / oneDay);
}

export function diffMonths(date1: Date, date2: Date) {
  const y1 = date1.getFullYear();
  const y2 = date2.getFullYear();
  const m1 = date1.getMonth();
  const m2 = date2.getMonth();
  if (y1 === y2) return m2 - m1;
  if (y1 < y2) return (y2 - y1) * 12 + m2 - m1;
  return m2 - ((y1 - y2) * 12 + m1);
}

export function sortDate(a: Date, b: Date) {
  if (equalDate(a, b)) return 0;
  return lessThanDate(a, b) ? -1 : 1;
}

/**
 *
 * @param  {Date | number} [date]
 * @param  {string} [fmt=yyyy-MM-dd]  y-year, M-month, d-day, h-hour, m-minute, s-second, S-millisecond, q-quarter
 * @return {string}
 */
export function format(date?: Date | number, fmt = 'yyyy-MM-dd') {
  const realDate = date ? new Date(date) : new Date();
  const o: Record<string, number> = {
    'M+': realDate.getMonth() + 1,
    'd+': realDate.getDate(),
    'h+': realDate.getHours(),
    'm+': realDate.getMinutes(),
    's+': realDate.getSeconds(),
    'q+': Math.floor((realDate.getMonth() + 3) / 3),
    S: realDate.getMilliseconds(),
    w: getWeekNumber(realDate),
  };
  if (/(y+)/.test(fmt)) {
    const y = (realDate.getFullYear() + '').substr(4 - RegExp.$1.length);
    fmt = fmt.replace(RegExp.$1, y);
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      const one = RegExp.$1.length === 1;
      const d = one ? o[k] : ('00' + o[k]).substr(('' + o[k]).length);
      fmt = fmt.replace(RegExp.$1, '' + d);
    }
  }
  return fmt;
}
