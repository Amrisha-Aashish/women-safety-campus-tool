import { StatCard } from 'glassform';
import { formatDuration } from '../../lib/format.js';
import Icon from '../Icon.jsx';

const iconTile = (name, className) => (
  <span className={`grid size-9 place-items-center rounded-xl ${className}`}>
    <Icon name={name} size={18} />
  </span>
);

// StatCard's icon box is hidden on phones, where two cards share a row and the labels need the room.
const CARD = 'max-sm:[&_div[aria-hidden].size-9]:hidden';

/**
 * Four headline numbers for the SOS alerts page.
 * @param {{ summary: ReturnType<typeof import('../../lib/sosStats.js').summarizeSos>, loading?: boolean }} props
 */
export default function SosAlertSummary({ summary, loading }) {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <StatCard
        radius={22}
        className={CARD}
        loading={loading}
        label="Active"
        value={summary.ACTIVE}
        animate
        icon={iconTile('siren', 'bg-red-500/15 text-red-300')}
        deltaLabel="Waiting for a response"
      />
      <StatCard
        radius={22}
        className={CARD}
        loading={loading}
        label="Acknowledged"
        value={summary.ACKNOWLEDGED}
        animate
        icon={iconTile('clock', 'bg-amber-500/15 text-amber-300')}
        deltaLabel="Security on the way"
      />
      <StatCard
        radius={22}
        className={CARD}
        loading={loading}
        label="Resolved"
        value={summary.RESOLVED}
        animate
        icon={iconTile('check-circle', 'bg-emerald-500/15 text-emerald-300')}
        deltaLabel={`of ${summary.total} alerts`}
      />
      <StatCard
        radius={22}
        className={CARD}
        loading={loading}
        label="Avg. time to resolve"
        value={summary.avgResolveMs == null ? '—' : formatDuration(summary.avgResolveMs)}
        icon={iconTile('activity', 'bg-brand-500/15 text-brand-300')}
        deltaLabel="From alert to resolved"
      />
    </div>
  );
}
