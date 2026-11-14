// Light / dark theme. The choice lives on <html data-theme> and in localStorage;
// index.html applies the saved theme before the first paint so nothing flashes.
const KEY = 'safecampus-theme';
const COLORS = { dark: '#0a0a0a', light: '#f5f5f5' };
const listeners = new Set();

/** The current theme: 'dark' (default) or 'light'. */
export const getTheme = () => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

/** Switch theme, remember it, and notify subscribers. */
export function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', COLORS[theme]);
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // Storage can be blocked (private mode); the theme still applies for this visit.
  }
  listeners.forEach((listener) => listener());
}

/** Subscribe to theme changes; returns an unsubscribe function. */
export function subscribeTheme(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
