import { Badge, Button, Card, List, Progress } from 'glassform';
import { Bell, ChevronRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';
import { getSosStatus, SOS_STATUSES } from '../../data/sosStatus.js';
import { nearestPlace } from '../../lib/campusGeo.js';
import { timeAgo } from '../../lib/format.js';
import { byUrgency } from '../../lib/sosStats.js';

const DOT = { ACTIVE: 'bg-(--lg-negative)', ACKNOWLEDGED: 'bg-(--lg-warning)', RESOLVED: 'bg-(--lg-positive)' };

/**
 * SOS alerts at a glance: how many are active, acknowledged and resolved, and
 * the alerts still open, most urgent first. Links to the SOS alerts page.
 *
 * @param {{ alerts: object[], summary: ReturnType<typeof import('../../lib/sosStats.js').summarizeSos>, limit?: number }} props
 */
export default function SosStatusCard({ alerts, summary, limit = 4 }) {
  const open = alerts.filter((a) => a.status !== 'RESOLVED').sort(byUrgency);
  const { total } = summary;

  const items = open.slice(0, limit).map((alert) => {
    const status = getSosStatus(alert.status);
    const near = nearestPlace(alert.latitude, alert.longitude);
    const active = alert.status === 'ACTIVE';
    return {
      id: alert.id,
      leading: (
        <span
          className={`grid size-9 place-items-center rounded-xl ${active ? 'bg-red-500/15 text-red-300' : 'bg-amber-500/15 text-amber-300'}`}
        >
          <status.icon size={18} />
        </span>
      ),
      title: near ? `Near ${near.place.name}` : 'Location unknown',
      subtitle: `${timeAgo(alert.createdAt)} · ${alert.latitude.toFixed(4)}, ${alert.longitude.toFixed(4)}`,
      trailing: (
        <Badge tone={status.tone} dot pulse={active}>
          {status.label}
        </Badge>
      ),
    };
  });

  return (
    <Card
      radius={22}
      title="SOS alerts"
      subtitle="Emergency alerts from students"
      className="h-full lg:col-span-2"
      badge={
        summary.ACTIVE ? (
          <Badge tone="negative" dot pulse>
            {summary.ACTIVE} active
          </Badge>
        ) : (
          <Badge tone="positive">All clear</Badge>
        )
      }
      actions={
        <Button as={Link} to="/sos-alerts" size="sm">
          <Bell />
          Respond
        </Button>
      }
    >
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {SOS_STATUSES.map((s) => (
          <div key={s.value} className="min-w-0 rounded-2xl bg-neutral-500/10 px-2 py-3 sm:px-4">
            <p className="truncate text-[11px] font-medium tracking-tight text-neutral-400 sm:text-sm sm:tracking-normal">{s.label}</p>
            <p className="mt-1 flex items-center gap-2 text-2xl font-bold tabular-nums">
              <span className={`size-2 shrink-0 rounded-full ${DOT[s.value]}`} />
              {summary[s.value]}
            </p>
          </div>
        ))}
      </div>

      <Progress
        className="mt-4"
        size="sm"
        aria-label="SOS alerts by status"
        segments={
          total
            ? SOS_STATUSES.map((s) => ({ value: (summary[s.value] / total) * 100, tone: s.tone, label: `${s.label} ${summary[s.value]}` }))
            : [{ value: 0 }]
        }
      />

      <div className="mt-5 border-t border-neutral-500/15 pt-3">
        <p className="mb-1 text-sm font-semibold text-neutral-300">Open alerts</p>
        <List
          surface={false}
          items={items}
          density="compact"
          showChevron={false}
          className="-mx-2"
          empty={
            <p className="flex items-center justify-center gap-2 py-6 text-sm text-emerald-300">
              <ShieldCheck size={16} />
              No open alerts. Everyone who pressed SOS has been helped.
            </p>
          }
        />
        {open.length > limit && (
          <Link to="/sos-alerts" className="mt-2 inline-flex items-center gap-1 text-sm text-brand-300 no-underline hover:underline">
            {open.length - limit} more open
            <ChevronRight size={14} />
          </Link>
        )}
      </div>
    </Card>
  );
}
