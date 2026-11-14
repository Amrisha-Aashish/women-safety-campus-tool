// Date and text formatting shared across pages (Indian English locale).
const LOCALE = 'en-IN';

/** "9:42 pm" */
export const formatTime = (date) => new Date(date).toLocaleTimeString(LOCALE, { hour: 'numeric', minute: '2-digit' });

/** "14 Nov, 9:42 pm" */
export const formatDateTime = (date) =>
  new Date(date).toLocaleString(LOCALE, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

/** "5 min ago", "3 h ago", "2 d ago", or the date for anything older than a week. */
export function timeAgo(date, now = Date.now()) {
  const s = Math.round((now - new Date(date).getTime()) / 1000);
  if (s < 45) return 'just now';
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  if (s < 604800) return `${Math.round(s / 86400)} d ago`;
  return new Date(date).toLocaleDateString(LOCALE, { day: 'numeric', month: 'short' });
}

/** "< 1 min", "11 min", "1 h 5 min" for a length of time in milliseconds. */
export function formatDuration(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return '< 1 min';
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return m % 60 ? `${h} h ${m % 60} min` : `${h} h`;
}

/** "9 PM" for an hour 0–23. */
export function formatHour(hour) {
  const h = hour % 12 || 12;
  return `${h} ${hour < 12 ? 'AM' : 'PM'}`;
}
