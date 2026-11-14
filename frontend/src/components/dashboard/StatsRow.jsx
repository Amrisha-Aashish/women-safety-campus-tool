import { StatCard } from 'glassform';
import Icon from '../Icon.jsx';

const iconTile = (name, className) => (
  <span className={`grid size-9 place-items-center rounded-xl ${className}`}>
    <Icon name={name} size={18} />
  </span>
);

// StatCard's icon box is hidden on phones, where two cards share a row and the labels need the room.
const CARD = 'max-sm:[&_div[aria-hidden].size-9]:hidden';

/**
 * Four headline numbers: total reports (with a 14-day trend), open, resolved
 * and the share sent anonymously. A 2×2 grid on phones and tablets, one row on wide screens.
 * @param {{ summary: ReturnType<typeof import('../../lib/reportStats.js').summarize>, loading?: boolean }} props
 */
export default function StatsRow({ summary, loading }) {
  const { total, open, resolved, anonymousShare, daily, weekDelta, thisWeek } = summary;
  const resolvedShare = total ? Math.round((resolved / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <StatCard
        radius={22}
        className={CARD}
        loading={loading}
        label="Total reports"
        value={total}
        animate
        icon={iconTile('file-text', 'bg-brand-500/15 text-brand-300')}
        delta={weekDelta ?? undefined}
        deltaLabel={`${thisWeek} in the last 7 days`}
        invertTrend
        data={daily}
        chartColor="var(--lg-accent)"
      />
      <StatCard
        radius={22}
        className={CARD}
        loading={loading}
        label="Open"
        value={open}
        animate
        icon={iconTile('alert-circle', 'bg-amber-500/15 text-amber-300')}
        deltaLabel="Waiting for action"
      />
      <StatCard
        radius={22}
        className={CARD}
        loading={loading}
        label="Resolved"
        value={resolved}
        animate
        icon={iconTile('check-circle', 'bg-emerald-500/15 text-emerald-300')}
        deltaLabel={`${resolvedShare}% of all reports`}
      />
      <StatCard
        radius={22}
        className={CARD}
        loading={loading}
        label="Sent anonymously"
        value={anonymousShare}
        suffix="%"
        animate
        icon={iconTile('eye-off', 'bg-fuchsia-500/15 text-fuchsia-300')}
        deltaLabel="Shown with a pseudonym"
      />
    </div>
  );
}
