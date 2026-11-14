import { GlassCard } from 'glassform';
import { ArrowUpRight, FileText, Map as MapIcon, Siren } from 'lucide-react';
import { Link } from 'react-router';

// Report is the primary action (accent tint), SOS is red, the map stays clear glass.
const ACTIONS = [
  {
    to: '/report',
    title: 'Report an incident',
    text: 'Anonymous or with your name. Takes under a minute.',
    icon: FileText,
    tint: 'rgb(99 56 238 / 0.72)',
  },
  {
    to: '/map',
    title: 'View safety map',
    text: 'See black spots and risk zones before you walk.',
    icon: MapIcon,
  },
  {
    to: '/sos',
    title: 'SOS',
    text: 'Alert campus security with your live location.',
    icon: Siren,
    tint: 'rgb(220 38 38 / 0.8)',
    pulse: true,
  },
];

/** The three main ways into the app, shown as large glass cards in the hero. */
export default function QuickActions() {
  return (
    <nav aria-label="Quick actions" className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-3 sm:gap-4">
      {ACTIONS.map(({ to, title, text, icon: ActionIcon, tint, pulse }) => (
        <GlassCard
          key={to}
          as={Link}
          to={to}
          interactive
          tint={tint}
          radius={24}
          padding="md"
          className="text-left text-white"
          leading={
            <span className="relative grid size-11 place-items-center rounded-xl bg-white/15">
              {pulse && <span className="absolute inset-0 animate-sos-ring rounded-xl bg-white/50" aria-hidden="true" />}
              <ActionIcon size={22} className="relative" />
            </span>
          }
          actions={<ArrowUpRight size={20} className="opacity-70" />}
        >
          <span className="mt-3 block font-display text-lg font-bold">{title}</span>
          <span className="mt-1 block text-sm leading-snug text-white/75">{text}</span>
        </GlassCard>
      ))}
    </nav>
  );
}
