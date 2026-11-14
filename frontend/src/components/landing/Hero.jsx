import { GlassBadge } from 'glassform';
import Icon from '../Icon.jsx';

const POINTS = [
  { icon: 'eye-off', label: 'Anonymous by default' },
  { icon: 'activity', label: 'Live admin dashboard' },
  { icon: 'map-pin', label: 'Black spots on a campus map' },
];

/**
 * Dark hero with the project title and pitch. The quick action cards are
 * passed in as children so they sit on the hero's colourful background,
 * where the glass has something to refract.
 */
export default function Hero({ children }) {
  return (
    <section className="dark relative isolate overflow-hidden bg-ink-900 pt-36 pb-20 text-white sm:pt-44 sm:pb-28">
      {/* Background: aurora glows and a faint grid. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-brand-600/40 blur-[120px]" />
        <div className="absolute top-72 -left-32 h-[340px] w-[440px] rounded-full bg-sky-500/20 blur-[100px]" />
        <div className="absolute top-56 -right-40 h-[380px] w-[480px] rounded-full bg-rose-500/25 blur-[110px]" />
        <div
          className="absolute inset-0 opacity-[0.07] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <GlassBadge appearance="glass" tone="#6ee7b7" dot pulse size="lg">
            Community safety platform for colleges
          </GlassBadge>
          <h1 className="mt-6 text-4xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-6xl">
            Spot danger early.
            <br />
            <span className="bg-gradient-to-r from-brand-300 via-fuchsia-300 to-rose-300 bg-clip-text text-transparent">
              Act before it happens.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-pretty text-slate-300 sm:text-lg">
            CCTV and guards react after an incident. SafeCampus works before one: students report safety concerns,
            anonymously or by name, and every report feeds a live dashboard and campus map that reveal black spots
            and red time zones, so they can be fixed in time.
          </p>
        </div>

        {children}

        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-400">
          {POINTS.map(({ icon, label }) => (
            <li key={label} className="flex items-center gap-2">
              <Icon name={icon} className="text-brand-300" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
