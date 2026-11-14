import { GlassButton } from 'glassform';
import { Link, useLocation } from 'react-router';
import { navItemFor } from '../../data/navigation.js';
import Icon from '../Icon.jsx';
import ThemeToggle from '../ThemeToggle.jsx';
import MobileNav from './MobileNav.jsx';

/**
 * The row at the top of each internal page: the menu button (phones only),
 * the page title and description, then page controls, page actions, the
 * light/dark toggle and the SOS button on the right.
 *
 * @param {{ children?: import('react').ReactNode, actions?: import('react').ReactNode }} props
 */
export default function PageToolbar({ children, actions }) {
  const { pathname } = useLocation();
  const page = navItemFor(pathname);
  const onSos = pathname.startsWith('/sos');

  return (
    <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-4">
      <MobileNav />
      <div className="mr-auto min-w-0">
        <h1 className="truncate text-2xl leading-tight font-extrabold tracking-tight sm:text-4xl">{page?.title ?? 'SafeCampus'}</h1>
        {page?.description && <p className="mt-1.5 hidden truncate text-base text-neutral-400 sm:block">{page.description}</p>}
      </div>
      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
        {children}
        <div className="ml-auto flex items-center gap-2">
          {actions}
          <ThemeToggle />
          {!onSos && (
            <GlassButton as={Link} to="/sos" size="sm" tint="rgb(220 38 38 / 0.88)" className="text-white">
              <Icon name="siren" />
              SOS
            </GlassButton>
          )}
        </div>
      </div>
    </div>
  );
}
