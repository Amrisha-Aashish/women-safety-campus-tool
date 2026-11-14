import { DescriptionList, GlassButton } from 'glassform';
import { Check, Phone, Shield, ShieldCheck, TriangleAlert } from 'lucide-react';
import { useSosAlertStatus } from '../../hooks/useSosAlertStatus.js';
import { nearestPlace, osmLink } from '../../lib/campusGeo.js';
import { formatTime } from '../../lib/format.js';

const STEPS = [
  { status: 'ACTIVE', label: 'Alert sent' },
  { status: 'ACKNOWLEDGED', label: 'Security on the way' },
  { status: 'RESOLVED', label: 'Resolved' },
];

const HEADLINE = {
  ACTIVE: ['Alert sent', 'Security has your alert. Stay where people can see you and keep your phone with you.'],
  ACKNOWLEDGED: ['Help is on the way', 'Security has seen your alert and is coming to you. Stay where you are if it is safe.'],
  RESOLVED: ['Alert closed', 'Security marked this alert as resolved. Call 112 if you still need help.'],
};

/** Sent → Security on the way → Resolved, with the reached steps lit up. */
function Progress({ status }) {
  const reached = STEPS.findIndex((s) => s.status === status);
  return (
    <ol className="mt-6 grid w-full grid-cols-3 gap-2" aria-label="Alert progress">
      {STEPS.map((step, i) => {
        const done = i <= reached;
        return (
          <li key={step.status} className="flex flex-col items-center gap-2 text-center">
            <span className={`h-1.5 w-full rounded-full ${done ? 'bg-emerald-400' : 'bg-white/15'}`} />
            <span className={`text-xs font-medium ${done ? 'text-emerald-200' : 'text-neutral-400'}`}>
              {step.label}
              {i === reached && i < STEPS.length - 1 && <span className="sr-only"> (current)</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Shown after the alert is sent: live progress, when and where, and an
 * "I'm safe now" button.
 * @param {{ alert: Awaited<ReturnType<typeof import('../../lib/sos.js').sendSos>>, onDone: () => void }} props
 */
export default function SosResult({ alert, onDone }) {
  const { status } = useSosAlertStatus(alert);
  const { location, approximate } = alert;
  const near = approximate ? null : nearestPlace(location.latitude, location.longitude);
  const [title, message] = HEADLINE[status] ?? HEADLINE.ACTIVE;

  return (
    <div className="flex w-full max-w-md animate-fade-up flex-col items-center text-center">
      <span className="grid size-20 place-items-center rounded-full bg-emerald-500 text-white ring-[10px] ring-emerald-500/25">
        {status === 'ACKNOWLEDGED' ? <Shield size={40} strokeWidth={2.6} /> : <Check size={40} strokeWidth={2.6} />}
      </span>
      <h2 className="mt-6 text-3xl font-extrabold" aria-live="polite">
        {title}
      </h2>
      <p className="mt-2 text-neutral-300">{message}</p>

      <Progress status={status} />

      {approximate && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl bg-amber-500/15 p-3 text-left text-sm text-amber-100 ring-1 ring-amber-500/30">
          <TriangleAlert size={18} className="mt-0.5 shrink-0" />
          <p>Your exact location wasn’t shared, so the campus centre was sent. Tell security where you are when you call.</p>
        </div>
      )}

      <DescriptionList
        className="mt-6 w-full text-left"
        items={[
          { label: 'Sent at', value: formatTime(alert.sentAt) },
          {
            label: 'Location',
            value: approximate ? (
              'Campus centre (approximate)'
            ) : (
              <a
                href={osmLink(location.latitude, location.longitude)}
                target="_blank"
                rel="noreferrer"
                className="text-brand-200 underline"
              >
                {near ? `Near ${near.place.name}` : `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`}
              </a>
            ),
          },
          { label: 'Alert ID', value: <code className="text-xs">{alert.id}</code> },
        ]}
      />

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <GlassButton href="tel:112" tint="rgb(220 38 38 / 0.9)" className="text-white">
          <Phone />
          Call 112
        </GlassButton>
        <GlassButton onClick={onDone}>
          <ShieldCheck />
          I’m safe now
        </GlassButton>
      </div>
    </div>
  );
}
