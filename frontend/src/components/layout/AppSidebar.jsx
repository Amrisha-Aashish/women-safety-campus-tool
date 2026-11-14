import { GlassSidebar } from 'glassform';
import { Link, useLocation } from 'react-router';
import { APP_NAV } from '../../data/navigation.js';
import Icon from '../Icon.jsx';
import Logo from '../Logo.jsx';
import ApiStatus from './ApiStatus.jsx';

/**
 * Dark glass sidebar for the internal app. The active link follows the URL;
 * SOS is always red so it can be found at a glance.
 *
 * @param {{ height?: number|string, onNavigate?: () => void, className?: string }} props
 *   `onNavigate` lets the mobile drawer close itself after a link is used.
 */
export default function AppSidebar({ height = '100%', onNavigate, className }) {
  const { pathname } = useLocation();

  const items = APP_NAV.map((item) => ({
    value: item.to,
    href: item.to,
    label: item.label,
    icon: <Icon name={item.icon} />,
    active: pathname.startsWith(item.to),
    onClick: onNavigate,
    ...(item.danger && {
      color: '#fecaca',
      background: 'rgb(220 38 38 / 0.22)',
      activeColor: '#fff',
      activeBackground: 'rgb(220 38 38 / 0.85)',
    }),
  }));

  return (
    <div className={`dark ${className ?? ''}`} style={{ height }}>
      <GlassSidebar
        linkAs={Link}
        height="100%"
        width={256}
        tint="rgb(17 21 38 / 0.96)"
        className="text-white"
        header={<Logo className="py-1" />}
        sections={[
          { title: 'Workspace', items: items.slice(0, 3) },
          { title: 'Emergency', items: items.slice(3) },
        ]}
        footer={
          <div className="space-y-3 px-1">
            <ApiStatus />
            <Link to="/" onClick={onNavigate} className="flex items-center gap-2 text-sm text-white/60 no-underline hover:text-white">
              <Icon name="home" />
              Back to home
            </Link>
          </div>
        }
      />
    </div>
  );
}
