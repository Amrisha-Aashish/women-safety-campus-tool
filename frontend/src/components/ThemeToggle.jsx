import { GlassButton } from 'glassform';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme.js';

/** Round glass button that switches between light and dark mode. */
export default function ThemeToggle({ className = '' }) {
  const { theme, toggle } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <GlassButton size="sm" onClick={toggle} aria-label={`Switch to ${next} mode`} title={`Switch to ${next} mode`} className={`w-9 px-0 ${className}`}>
      {theme === 'dark' ? <Sun /> : <Moon />}
    </GlassButton>
  );
}
