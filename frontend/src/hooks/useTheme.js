import { useSyncExternalStore } from 'react';
import { getTheme, setTheme, subscribeTheme } from '../lib/theme.js';

/**
 * The current theme and a toggle.
 * @returns {{ theme: 'dark'|'light', toggle: () => void }}
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => 'dark');
  return { theme, toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark') };
}
