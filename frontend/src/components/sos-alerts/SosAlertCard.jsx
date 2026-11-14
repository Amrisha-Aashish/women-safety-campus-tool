import { Badge, Button, Card } from 'glassform';
import { getSosStatus } from '../../data/sosStatus.js';
import { nearestPlace, osmLink } from '../../lib/campusGeo.js';
import { formatDateTime, formatDuration, timeAgo } from '../../lib/format.js';
import Icon from '../Icon.jsx';

const ACCENT = {
  ACTIVE: 'ring-1 ring-red-500/50 bg-red-500/[0.06]',
  ACKNOWLEDGED: 'ring-1 ring-amber-500/30',
  RESOLVED: '',
};

/** Label → value line inside the card. */
function Meta({ icon, label, children }) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <Icon name={icon} size={16} className="mt-0.5 shrink-0 text-neutral-400" />
      <span className="w-20 shrink-0 text-neutral-400">{label}</span>
      <span className="min-w-0 flex-1 text-neutral-100">{children}</span>
    </div>
  );
}

/**
 * One SOS alert: status, nearest campus place, coordinates, time, and the
 * next action (Acknowledge while active, Resolve until it is resolved).
 *
 * @param {{
 *   alert: { id: string, latitude: number, longitude: number, status: string, createdAt: string, resolvedAt?: string|null },
 *   onAcknowledge: (id: string) => Promise<void>,
 *   onResolve: (id: string) => Promise<void>,
 * }} props
 */
export default function SosAlertCard({ alert, onAcknowledge, onResolve }) {
  const status = getSosStatus(alert.status);
  const near = nearestPlace(alert.latitude, alert.longitude);
  const active = alert.status === 'ACTIVE';
  const resolved = alert.status === 'RESOLVED';

  return (
    // Card wraps its children in one div; [&>div>div]:h-full stretches it so the actions sit at the bottom.
    <Card radius={22} className={`h-full p-5 [&>div>div]:h-full ${ACCENT[alert.status] ?? ''}`}>
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <Badge tone={status.tone} dot pulse={active}>
            {status.label}
          </Badge>
          <time dateTime={alert.createdAt} className="text-sm font-medium text-neutral-400 tabular-nums">
            {timeAgo(alert.createdAt)}
          </time>
        </div>

        <div className="flex items-start gap-3">
          <span
            className={`grid size-11 shrink-0 place-items-center rounded-2xl ${
              active ? 'bg-red-500/15 text-red-300' : resolved ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'
            }`}
          >
            <Icon name={status.icon} size={22} />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-lg leading-snug font-bold">{near ? `Near ${near.place.name}` : 'Location unknown'}</h3>
            <p className="text-sm text-neutral-400">
              {near ? `About ${near.distance} m away${near.onCampus ? '' : ' · outside campus'}` : 'No coordinates were sent'}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Meta icon="map-pin" label="Location">
            <a
              href={osmLink(alert.latitude, alert.longitude)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-brand-300 tabular-nums underline-offset-2 hover:underline"
            >
              {alert.latitude.toFixed(5)}, {alert.longitude.toFixed(5)}
              <Icon name="arrow-up-right" size={14} />
            </a>
          </Meta>
          <Meta icon="clock" label="Raised">
            {formatDateTime(alert.createdAt)}
          </Meta>
          {resolved && alert.resolvedAt && (
            <Meta icon="check-circle" label="Resolved">
              {formatDateTime(alert.resolvedAt)}{' '}
              <span className="text-neutral-400">
                · in {formatDuration(new Date(alert.resolvedAt) - new Date(alert.createdAt))}
              </span>
            </Meta>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-neutral-500/15 pt-4">
          {resolved ? (
            <p className="flex items-center gap-2 text-sm text-emerald-300">
              <Icon name="shield-check" size={16} />
              Closed. No action needed.
            </p>
          ) : (
            <>
              {active && (
                <Button size="sm" onClick={() => onAcknowledge(alert.id)} className="flex-1">
                  <Icon name="check" />
                  Acknowledge
                </Button>
              )}
              <Button
                size="sm"
                tint="rgb(16 185 129 / 0.85)"
                onClick={() => onResolve(alert.id)}
                className="flex-1 text-white"
              >
                <Icon name="shield-check" />
                Resolve
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
