import { GlassButton } from 'glassform';
import { useTheme } from '../hooks/useTheme.js';
import Icon from './Icon.jsx';

/** Round glass button that switches between light and dark mode. */
export default function ThemeToggle({ className = '' }) {
  const { theme, toggle } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <GlassButton size="sm" onClick={toggle} aria-label={`Switch to ${next} mode`} title={`Switch to ${next} mode`} className={`w-9 px-0 ${className}`}>
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
    </GlassButton>
  );
}
