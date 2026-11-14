import { Badge, DescriptionList, GlassButton } from 'glassform';
import { formatTime } from '../../lib/format.js';
import Icon from '../Icon.jsx';

/**
 * Shown after the alert is sent: when, where, and an "I'm safe now" button.
 * @param {{ alert: Awaited<ReturnType<typeof import('../../lib/sos.js').sendSos>>, onDone: () => void }} props
 */
export default function SosResult({ alert, onDone }) {
  const { location } = alert;
  return (
    <div className="flex w-full max-w-md animate-fade-up flex-col items-center text-center">
      <span className="grid size-20 place-items-center rounded-full bg-emerald-500 text-white ring-[10px] ring-emerald-500/25">
        <Icon name="check" size={40} strokeWidth={2.6} />
      </span>
      <h2 className="mt-6 text-3xl font-extrabold">Alert sent</h2>
      <p className="mt-2 text-slate-300">Help is on the way. Stay where people can see you and keep your phone with you.</p>
      {alert.demo && (
        <Badge tone="warning" className="mt-4">
          Demo mode: no alert reaches security until the SOS API is connected
        </Badge>
      )}

      <DescriptionList
        className="mt-6 w-full text-left"
        items={[
          { label: 'Sent at', value: formatTime(alert.sentAt) },
          {
            label: 'Location',
            value: location ? (
              <a
                href={`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=18/${location.latitude}/${location.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="text-brand-200 underline"
              >
                {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
              </a>
            ) : (
              'Not shared'
            ),
          },
          { label: 'Alert ID', value: <code className="text-xs">{alert.id}</code> },
        ]}
      />

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <GlassButton href="tel:112" tint="rgb(220 38 38 / 0.9)" className="text-white">
          <Icon name="phone" />
          Call 112
        </GlassButton>
        <GlassButton onClick={onDone}>
          <Icon name="shield-check" />
          I’m safe now
        </GlassButton>
      </div>
    </div>
  );
}
