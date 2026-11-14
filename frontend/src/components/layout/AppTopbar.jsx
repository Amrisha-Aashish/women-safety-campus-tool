import { GlassButton, GlassSurface } from 'glassform';
import { Link, useLocation } from 'react-router';
import { navItemFor } from '../../data/navigation.js';
import Icon from '../Icon.jsx';
import MobileNav from './MobileNav.jsx';

/**
 * Sticky glass bar above each internal page: page title and description,
 * the mobile menu, and an SOS shortcut that is always one tap away.
 */
export default function AppTopbar() {
  const { pathname } = useLocation();
  const page = navItemFor(pathname);
  const onSos = pathname.startsWith('/sos');

  return (
    <div className="sticky top-0 z-20 px-3 pt-3 sm:px-5">
      <GlassSurface radius={20} tint="rgb(18 22 40 / 0.9)" className="flex items-center gap-3 px-3 py-2.5 sm:px-4">
        <MobileNav />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg leading-tight font-extrabold tracking-tight sm:text-xl">{page?.title ?? 'SafeCampus'}</h1>
          {page?.description && <p className="hidden truncate text-sm text-slate-400 sm:block">{page.description}</p>}
        </div>
        {!onSos && (
          <GlassButton as={Link} to="/sos" size="sm" tint="rgb(220 38 38 / 0.88)" className="text-white">
            <Icon name="siren" />
            SOS
          </GlassButton>
        )}
      </GlassSurface>
    </div>
  );
}
