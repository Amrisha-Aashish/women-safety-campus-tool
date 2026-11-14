import { Badge, Card, List } from 'glassform';
import { getCategory } from '../../data/categories.js';
import { RISK } from '../../data/risk.js';
import { formatHour } from '../../lib/format.js';

/**
 * Clickable list of black spots; picking one flies the map there.
 * @param {{ spots: object[], selected: string|null, onSelect: (name: string) => void }} props
 */
export default function SpotList({ spots, selected, onSelect }) {
  const items = spots.slice(0, 8).map((spot) => ({
    id: spot.name,
    selected: spot.name === selected,
    leading: <span className="block size-3 rounded-full" style={{ background: RISK[spot.risk].color }} />,
    title: spot.name,
    subtitle: `${spot.count} report${spot.count === 1 ? '' : 's'} · peak ${formatHour(spot.peakHour)}${spot.topCategory ? ` · ${getCategory(spot.topCategory).label}` : ''}`,
    trailing: <Badge tone={RISK[spot.risk].tone} size="sm">{RISK[spot.risk].label.replace(' risk', '')}</Badge>,
    onClick: () => onSelect(spot.name),
  }));

  return (
    <Card radius={22} title="Black spots" subtitle="Tap one to highlight it on the map" padding="sm" className="p-5">
      <List
        surface={false}
        items={items}
        density="compact"
        showChevron={false}
        className="-mx-2"
        classNames={{ subtitle: 'whitespace-normal overflow-visible' }}
        empty={<p className="py-4 text-center text-sm text-slate-400">No reports match the filters.</p>}
      />
    </Card>
  );
}
