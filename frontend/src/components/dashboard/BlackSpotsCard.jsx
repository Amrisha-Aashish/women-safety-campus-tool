import { Badge, Button, Card, List } from 'glassform';
import { Link } from 'react-router';
import { getCategory } from '../../data/categories.js';
import { formatHour } from '../../lib/format.js';
import Icon from '../Icon.jsx';

export const RISK = {
  high: { tone: 'negative', label: 'High risk', color: '#dc2626' },
  medium: { tone: 'warning', label: 'Medium', color: '#d97706' },
  low: { tone: 'neutral', label: 'Low', color: '#64748b' },
};

/**
 * The places with the most reports ("black spots"), most reported first.
 * @param {{ spots: ReturnType<typeof import('../../lib/reportStats.js').hotspots>, limit?: number }} props
 */
export default function BlackSpotsCard({ spots, limit = 5 }) {
  const items = spots.slice(0, limit).map((spot, i) => ({
    id: spot.name,
    leading: (
      <span
        className="grid size-8 place-items-center rounded-full text-sm font-bold text-white"
        style={{ background: RISK[spot.risk].color }}
      >
        {i + 1}
      </span>
    ),
    title: spot.name,
    subtitle: `${spot.count} report${spot.count === 1 ? '' : 's'} · ${spot.open} open · peak ${formatHour(spot.peakHour)}${
      spot.topCategory ? ` · ${getCategory(spot.topCategory).label}` : ''
    }`,
    trailing: <Badge tone={RISK[spot.risk].tone}>{RISK[spot.risk].label}</Badge>,
  }));

  return (
    <Card
      radius={22}
      title="Top black spots"
      subtitle="Places reported most often"
      className="h-full"
      actions={
        <Button as={Link} to="/map" size="sm">
          <Icon name="map" />
          Map
        </Button>
      }
    >
      <List
        surface={false}
        items={items}
        density="compact"
        empty={<p className="py-6 text-center text-sm text-slate-500">No reports yet.</p>}
        className="-mx-2"
        classNames={{ subtitle: "whitespace-normal overflow-visible" }}
      />
    </Card>
  );
}
