import { GlassButton, GlassNavbar } from 'glassform';
import { Link } from 'react-router';
import Icon from '../Icon.jsx';
import Logo from '../Logo.jsx';

const LINKS = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#privacy', label: 'Privacy' },
];

/** Floating glass navbar fixed over the landing page. Folds into a menu on phones. */
export default function SiteHeader() {
  return (
    <div className="dark fixed inset-x-0 top-3 z-30 px-3 sm:px-6">
      <GlassNavbar
        brand={<Logo />}
        links={LINKS}
        align="center"
        tint="rgb(18 18 18 / 0.55)"
        className="text-white"
        actions={
          <>
            <GlassButton as={Link} to="/sos" size="sm" tint="rgb(220 38 38 / 0.85)" className="text-white">
              <Icon name="siren" />
              SOS
            </GlassButton>
            <GlassButton as={Link} to="/dashboard" size="sm" className="hidden sm:inline-flex">
              Open app
              <Icon name="arrow-right" />
            </GlassButton>
          </>
        }
      />
    </div>
  );
}
