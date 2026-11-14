import { Card, GlassButton, Timeline } from 'glassform';
import { Lock, Siren } from 'lucide-react';
import { Link } from 'react-router';

const NEXT = [
  { title: 'Your report is saved', description: 'It appears on the live dashboard within seconds.', tone: 'accent' },
  { title: 'Patterns are checked', description: 'Repeated places and hours become black spots and red time zones.', tone: 'warning' },
  { title: 'Action is taken', description: 'Lighting, patrols or guards are added where they are needed.', tone: 'positive', pending: true },
];

/** Side column: privacy promise, what happens next, and the SOS shortcut. */
export default function ReportAside() {
  return (
    <aside className="flex flex-col gap-5">
      <Card
        radius={24}
        title="Your privacy"
        leading={
          <span className="grid size-9 place-items-center rounded-xl bg-brand-500/15 text-brand-300">
            <Lock size={18} />
          </span>
        }
      >
        <ul className="space-y-2 text-sm text-neutral-300">
          <li>Anonymous reports never store your name.</li>
          <li>Your location is read only if you press “Use my location”.</li>
          <li>Only the campus safety team sees full report details.</li>
        </ul>
      </Card>

      <Card radius={24} title="What happens next">
        <Timeline items={NEXT} className="mt-1" />
      </Card>

      <div className="dark overflow-hidden rounded-[24px] bg-gradient-to-br from-red-600 to-rose-700 p-5 text-white">
        <p className="font-display text-lg font-bold">In danger right now?</p>
        <p className="mt-1 text-sm text-red-100">Don’t fill in a form. Send an SOS with your location instead.</p>
        <GlassButton as={Link} to="/sos" className="mt-4 text-white">
          <Siren />
          Open SOS
        </GlassButton>
      </div>
    </aside>
  );
}
