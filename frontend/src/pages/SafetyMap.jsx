import { Card, GlassSegmented } from 'glassform';
import { useMemo, useState } from 'react';
import DataSourceBar from '../components/app/DataSourceBar.jsx';
import CampusMap from '../components/map/CampusMap.jsx';
import CategoryFilter from '../components/map/CategoryFilter.jsx';
import MapLegend from '../components/map/MapLegend.jsx';
import ReportDetail from '../components/map/ReportDetail.jsx';
import SpotList from '../components/map/SpotList.jsx';
import { CATEGORIES } from '../data/categories.js';
import { useReports } from '../hooks/useReports.js';
import { isOnCampus } from '../lib/campusGeo.js';
import { hotspots } from '../lib/reportStats.js';

const BASEMAP_OPTIONS = [
  { value: 'satellite', label: 'Satellite' },
  { value: 'streets', label: 'Streets' },
];

const LAYERS = [
  { value: 'all', label: 'All' },
  { value: 'reports', label: 'Reports' },
  { value: 'zones', label: 'Risk zones' },
];

/**
 * Safety map: reported incidents and risk zones ("black spots") on a satellite or
 * street map of the campus. Only the campus is shown, so reports outside its boundary are left out.
 * Risk zones are computed in the browser for now; the analytics service will supply them later.
 */
export default function SafetyMap() {
  const [source, setSource] = useState('live');
  const [layer, setLayer] = useState('all');
  const [basemap, setBasemap] = useState('satellite');
  const [categories, setCategories] = useState(() => new Set(CATEGORIES.map((c) => c.value)));
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const { reports, status, updatedAt, refresh } = useReports({ source });

  const onCampus = useMemo(() => reports.filter((r) => isOnCampus(r.location?.latitude, r.location?.longitude)), [reports]);
  const visible = useMemo(() => onCampus.filter((r) => categories.has(r.category)), [onCampus, categories]);
  const spots = useMemo(() => hotspots(visible), [visible]);
  const counts = useMemo(() => Object.fromEntries(CATEGORIES.map((c) => [c.value, onCampus.filter((r) => r.category === c.value).length])), [onCampus]);
  const report = visible.find((r) => r.id === selectedReport);

  const selectSpot = (name) => {
    setSelectedSpot((current) => (current === name ? null : name));
    setSelectedReport(null);
    if (layer === 'reports') setLayer('all');
  };
  const selectReport = (id) => setSelectedReport((current) => (current === id ? null : id));

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <DataSourceBar source={source} onSourceChange={setSource} status={status} updatedAt={updatedAt} onRefresh={refresh} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card radius={24} padding="none" className="relative overflow-hidden">
          <div className="relative h-[520px] w-full bg-[#0e1120] sm:h-[600px] lg:h-[calc(100dvh-250px)] lg:min-h-[600px]">
            <CampusMap
              reports={visible}
              spots={spots}
              showReports={layer !== 'zones'}
              showZones={layer !== 'reports'}
              selectedSpot={selectedSpot}
              onSelectSpot={selectSpot}
              selectedReport={selectedReport}
              onSelectReport={selectReport}
              basemap={basemap}
              className="absolute inset-0 size-full p-2 pt-[7.25rem] sm:p-3 sm:pt-16"
            />
          </div>

          {/* Glass controls float over the map. */}
          <div className="pointer-events-none absolute inset-x-3 top-3 flex flex-wrap items-start justify-between gap-2">
            <div className="pointer-events-auto">
              <GlassSegmented options={LAYERS} value={layer} onChange={setLayer} aria-label="Map layers" />
            </div>
            <div className="pointer-events-auto">
              <GlassSegmented options={BASEMAP_OPTIONS} value={basemap} onChange={setBasemap} aria-label="Map style" />
            </div>
          </div>
          {report && (
            <div className="pointer-events-none absolute inset-x-3 bottom-14 flex justify-end sm:bottom-16">
              <ReportDetail report={report} onClose={() => setSelectedReport(null)} />
            </div>
          )}
          <MapLegend reports={visible.length} places={spots.length} />
        </Card>

        <div className="flex flex-col gap-5">
          <CategoryFilter selected={categories} onChange={setCategories} counts={counts} />
          <SpotList spots={spots} selected={selectedSpot} onSelect={selectSpot} />
        </div>
      </div>
    </div>
  );
}
