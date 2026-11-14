// Pure helpers that turn a report list into dashboard / map numbers.
// Placeholder analytics: the ML service will replace hotspots() and redTimeZones() later.
import { CATEGORIES } from '../data/categories.js';

const DAY = 86400000;
const when = (r) => new Date(r.occurredAt || r.createdAt);

/** Totals, status split and a 14-day trend. */
export function summarize(reports, now = Date.now()) {
  const open = reports.filter((r) => r.status !== 'RESOLVED').length;
  const anonymous = reports.filter((r) => r.isAnonymous).length;
  const daily = Array.from({ length: 14 }, (_, i) => {
    const start = startOfDay(now) - (13 - i) * DAY;
    return reports.filter((r) => {
      const t = new Date(r.createdAt).getTime();
      return t >= start && t < start + DAY;
    }).length;
  });
  const thisWeek = daily.slice(7).reduce((a, b) => a + b, 0);
  const lastWeek = daily.slice(0, 7).reduce((a, b) => a + b, 0);

  return {
    total: reports.length,
    open,
    resolved: reports.length - open,
    anonymous,
    anonymousShare: reports.length ? Math.round((anonymous / reports.length) * 100) : 0,
    daily,
    thisWeek,
    weekDelta: lastWeek ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : null,
  };
}

/** Count per category, in the categories' own order. */
export function byCategory(reports) {
  return CATEGORIES.map((c) => ({
    ...c,
    count: reports.filter((r) => r.category === c.value).length,
  }));
}

/** Reports per hour of the day (0–23). */
export function byHour(reports) {
  const hours = Array(24).fill(0);
  reports.forEach((r) => {
    hours[when(r).getHours()] += 1;
  });
  return hours;
}

export const TIME_BANDS = [
  { id: 'morning', label: 'Morning', range: '6 AM – 12 PM', from: 6, to: 12 },
  { id: 'afternoon', label: 'Afternoon', range: '12 – 5 PM', from: 12, to: 17 },
  { id: 'evening', label: 'Evening', range: '5 – 8 PM', from: 17, to: 20 },
  { id: 'night', label: 'Night', range: '8 PM – 12 AM', from: 20, to: 24 },
  { id: 'late', label: 'Late night', range: '12 – 6 AM', from: 0, to: 6 },
];

/**
 * Reports per time band, with `red` set on bands holding a clearly larger share
 * than an even spread would give (a "red time zone").
 */
export function redTimeZones(reports) {
  const hours = byHour(reports);
  const total = reports.length || 1;
  return TIME_BANDS.map((band) => {
    let count = 0;
    for (let h = band.from; h < band.to; h++) count += hours[h];
    const expected = ((band.to - band.from) / 24) * total;
    return { ...band, count, share: Math.round((count / total) * 100), red: count >= 3 && count > expected * 1.5 };
  });
}

/**
 * Group reports by place into "black spots", most reported first.
 * risk: high = 6+ reports or 3+ still open, medium = 3+, low = the rest.
 */
export function hotspots(reports) {
  const groups = new Map();
  reports.forEach((r) => {
    const name = r.location?.name?.trim() || 'Unknown place';
    const key = name.toLowerCase();
    if (!groups.has(key)) groups.set(key, { name, reports: [] });
    groups.get(key).reports.push(r);
  });

  return [...groups.values()]
    .map(({ name, reports: list }) => {
      const open = list.filter((r) => r.status !== 'RESOLVED').length;
      const hours = byHour(list);
      const peakHour = hours.indexOf(Math.max(...hours));
      const counts = byCategory(list).filter((c) => c.count).sort((a, b) => b.count - a.count);
      return {
        name,
        count: list.length,
        open,
        latitude: average(list.map((r) => r.location?.latitude)),
        longitude: average(list.map((r) => r.location?.longitude)),
        peakHour,
        topCategory: counts[0]?.value ?? null,
        risk: list.length >= 6 || open >= 3 ? 'high' : list.length >= 3 ? 'medium' : 'low',
        reports: list,
      };
    })
    .sort((a, b) => b.count - a.count);
}

function average(values) {
  const nums = values.filter(Number.isFinite);
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null;
}

function startOfDay(t) {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}
