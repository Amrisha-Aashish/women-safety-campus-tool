import { Card, GlassSegmented } from 'glassform';
import { useEffect, useMemo, useState } from 'react';
import DataSourceBar from '../components/app/DataSourceBar.jsx';
import CampusMap from '../components/map/CampusMap.jsx';
import CategoryFilter from '../components/map/CategoryFilter.jsx';
import MapLegend from '../components/map/MapLegend.jsx';
import ReportDetail from '../components/map/ReportDetail.jsx';
import SpotList from '../components/map/SpotList.jsx';
import { getRiskZones } from '../lib/api.js';
import { CAMPUS_NAME } from '../data/campusPlaces.js';
import { CATEGORIES } from '../data/categories.js';
import { useReports } from '../hooks/useReports.js';
import { isOnCampus } from '../lib/campusGeo.js';
import { hotspots } from '../lib/reportStats.js';

const LAYERS = [
  { value: 'all', label: 'All' },
  { value: 'reports', label: 'Reports' },
  { value: 'zones', label: 'Risk zones' }
];

export default function SafetyMap() {
  const [source, setSource] = useState('live');
  const [layer, setLayer] = useState('all');
  const [categories, setCategories] = useState(
    () => new Set(CATEGORIES.map((category) => category.value))
  );
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [riskZones, setRiskZones] = useState([]);
  const [analyticsStatus, setAnalyticsStatus] = useState('loading');

  const { reports, status, updatedAt, refresh } = useReports({ source });

  async function refreshAnalytics() {
    if (source !== 'live') {
      setRiskZones([]);
      setAnalyticsStatus('idle');
      return;
    }

    setAnalyticsStatus('loading');

    try {
      const zones = await getRiskZones();
      setRiskZones(zones);
      setAnalyticsStatus('success');
    } catch {
      setRiskZones([]);
      setAnalyticsStatus('error');
    }
  }

  useEffect(() => {
    refreshAnalytics();
  }, [source]);

  const onCampus = useMemo(
    () => reports.filter((report) =>
      isOnCampus(report.location?.latitude, report.location?.longitude)
    ),
    [reports]
  );

  const visible = useMemo(
    () => onCampus.filter((report) => categories.has(report.category)),
    [onCampus, categories]
  );

  const fallbackSpots = useMemo(() => hotspots(visible), [visible]);

  const liveSpots = useMemo(
    () =>
      riskZones
        .filter((zone) => isOnCampus(zone.latitude, zone.longitude))
        .map((zone) => ({
          name: zone.zoneName,
          latitude: zone.latitude,
          longitude: zone.longitude,
          count: zone.reportCount,
          risk: zone.riskLevel.toLowerCase(),
          reason: zone.reason,
          peakHour: null,
          topCategory: null
        })),
    [riskZones]
  );

  const spots = analyticsStatus === 'success' ? liveSpots : fallbackSpots;

  const counts = useMemo(
    () =>
      Object.fromEntries(
        CATEGORIES.map((category) => [
          category.value,
          onCampus.filter((report) => report.category === category.value).length
        ])
      ),
    [onCampus]
  );

  const report = visible.find((item) => item.id === selectedReport);

  const selectSpot = (name) => {
    setSelectedSpot((current) => (current === name ? null : name));
    setSelectedReport(null);
    if (layer === 'reports') setLayer('all');
  };

  const selectReport = (id) =>
    setSelectedReport((current) => (current === id ? null : id));

  const refreshAll = () => Promise.all([refresh(), refreshAnalytics()]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <DataSourceBar
        source={source}
        onSourceChange={setSource}
        status={status}
        updatedAt={updatedAt}
        onRefresh={refreshAll}
      />

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card radius={24} padding="none" className="relative overflow-hidden">
          <div className="relative h-[520px] w-full bg-neutral-900 sm:h-[600px] lg:h-[calc(100dvh-250px)] lg:min-h-[600px]">
            <CampusMap
              reports={visible}
              spots={spots}
              showReports={layer !== 'zones'}
              showZones={layer !== 'reports'}
              selectedSpot={selectedSpot}
              onSelectSpot={selectSpot}
              selectedReport={selectedReport}
              onSelectReport={selectReport}
              className="absolute inset-0 size-full p-2 pt-16 sm:p-3 sm:pt-16"
            />
          </div>

          <div className="pointer-events-none absolute inset-x-3 top-3 flex flex-wrap items-start justify-between gap-2">
            <div className="pointer-events-auto">
              <GlassSegmented
                options={LAYERS}
                value={layer}
                onChange={setLayer}
                aria-label="Map layers"
              />
            </div>
            <p className="pointer-events-auto rounded-full bg-neutral-900/85 px-3 py-1.5 text-xs font-semibold text-neutral-200 ring-1 ring-neutral-50/10">
              {CAMPUS_NAME}
            </p>
          </div>

          {report && (
            <div className="pointer-events-none absolute inset-x-3 bottom-14 flex justify-end sm:bottom-16">
              <ReportDetail
                report={report}
                onClose={() => setSelectedReport(null)}
              />
            </div>
          )}

          <MapLegend reports={visible.length} places={spots.length} />
        </Card>

        <div className="flex flex-col gap-5">
          <CategoryFilter
            selected={categories}
            onChange={setCategories}
            counts={counts}
          />
          <SpotList
            spots={spots}
            selected={selectedSpot}
            onSelect={selectSpot}
          />
        </div>
      </div>
    </div>
  );
}