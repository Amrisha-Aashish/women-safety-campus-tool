import { Card, GlassSegmented } from 'glassform';
import { useMemo, useState } from 'react';
import DataSourceBar from '../components/app/DataSourceBar.jsx';
import CampusMap from '../components/map/CampusMap.jsx';
import CategoryFilter from '../components/map/CategoryFilter.jsx';
import MapLegend from '../components/map/MapLegend.jsx';
import SpotList from '../components/map/SpotList.jsx';
import { CATEGORIES } from '../data/categories.js';
import { useReports } from '../hooks/useReports.js';
import { hotspots } from '../lib/reportStats.js';

const LAYERS = [
  { value: 'all', label: 'All' },
  { value: 'reports', label: 'Reports' },
  { value: 'zones', label: 'Risk zones' },
];

/**
 * Safety map: reported incidents and risk zones ("black spots") on the campus.
 * Risk zones are computed in the browser for now; the analytics service will supply them later.
 */
export default function SafetyMap() {
  const [source, setSource] = useState('live');
  const [layer, setLayer] = useState('all');
  const [categories, setCategories] = useState(() => new Set(CATEGORIES.map((c) => c.value)));
  const [selected, setSelected] = useState(null);
  const { reports, status, updatedAt, refresh } = useReports({ source });

  const visible = useMemo(() => reports.filter((r) => categories.has(r.category)), [reports, categories]);
  const spots = useMemo(() => hotspots(visible), [visible]);
  const counts = useMemo(() => Object.fromEntries(CATEGORIES.map((c) => [c.value, reports.filter((r) => r.category === c.value).length])), [reports]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <DataSourceBar source={source} onSourceChange={setSource} status={status} updatedAt={updatedAt} onRefresh={refresh} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card radius={24} padding="none" className="relative overflow-hidden">
          <CampusMap
            reports={visible}
            spots={spots}
            showReports={layer !== 'zones'}
            showZones={layer !== 'reports'}
            selected={selected}
            onSelect={setSelected}
            className="z-0 h-[480px] w-full sm:h-[560px] lg:h-[calc(100dvh-200px)] lg:min-h-[560px]"
          />
          {/* Glass controls float over the map (Leaflet panes use z-index up to 1000). */}
          <div className="pointer-events-none absolute inset-x-3 top-3 z-[1000] flex flex-wrap items-start justify-between gap-2">
            <div className="pointer-events-auto">
              <GlassSegmented options={LAYERS} value={layer} onChange={setLayer} aria-label="Map layers" />
            </div>
            <p className="pointer-events-auto rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
              {visible.length} reports · {spots.length} places
            </p>
          </div>
          <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] hidden sm:block">
            <MapLegend />
          </div>
        </Card>

        <div className="flex flex-col gap-5">
          <CategoryFilter selected={categories} onChange={setCategories} counts={counts} />
          <SpotList spots={spots} selected={selected} onSelect={setSelected} />
        </div>
      </div>
    </div>
  );
}
