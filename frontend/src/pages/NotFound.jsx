import { GlassButton } from 'glassform';
import { Link } from 'react-router';
import Icon from '../components/Icon.jsx';
import Logo from '../components/Logo.jsx';

/** Shown for any unknown URL. */
export default function NotFound() {
  return (
    <main className="dark relative isolate grid min-h-dvh place-items-center overflow-hidden bg-ink-900 px-6 text-center text-white">
      <div aria-hidden="true" className="absolute top-1/3 left-1/2 -z-10 size-[480px] -translate-x-1/2 rounded-full bg-brand-600/35 blur-[120px]" />
      <div className="flex flex-col items-center">
        <Logo />
        <p className="mt-12 font-display text-7xl font-extrabold text-brand-300">404</p>
        <h1 className="mt-3 text-2xl font-bold">This page doesn’t exist</h1>
        <p className="mt-2 max-w-sm text-neutral-400">The link may be old or mistyped. These will get you back on track.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <GlassButton as={Link} to="/" prominent>
            <Icon name="home" />
            Home
          </GlassButton>
          <GlassButton as={Link} to="/dashboard">
            Dashboard
          </GlassButton>
          <GlassButton as={Link} to="/sos" tint="rgb(220 38 38 / 0.88)" className="text-white">
            <Icon name="siren" />
            SOS
          </GlassButton>
        </div>
      </div>
    </main>
  );
}
