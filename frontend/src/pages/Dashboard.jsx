import { useMemo, useState } from 'react';
import DataSourceBar from '../components/app/DataSourceBar.jsx';
import BlackSpotsCard from '../components/dashboard/BlackSpotsCard.jsx';
import CategoryCard from '../components/dashboard/CategoryCard.jsx';
import StatsRow from '../components/dashboard/StatsRow.jsx';
import TimeZonesCard from '../components/dashboard/TimeZonesCard.jsx';
import { useReports } from '../hooks/useReports.js';
import { byCategory, byHour, hotspots, redTimeZones, summarize } from '../lib/reportStats.js';

/** Admin dashboard: live totals, categories, red time zones, black spots and recent reports. */
export default function Dashboard() {
  const [source, setSource] = useState('live');
  const { reports, status, updatedAt, refresh } = useReports({ source });
  const summary = useMemo(() => summarize(reports), [reports]);
  const categories = useMemo(() => byCategory(reports), [reports]);
  const hours = useMemo(() => byHour(reports), [reports]);
  const bands = useMemo(() => redTimeZones(reports), [reports]);
  const spots = useMemo(() => hotspots(reports), [reports]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <DataSourceBar source={source} onSourceChange={setSource} status={status} updatedAt={updatedAt} onRefresh={refresh} />
      <StatsRow summary={summary} loading={status === 'loading'} />
      <div className="grid gap-5 lg:grid-cols-3">
        <CategoryCard categories={categories} open={summary.open} resolved={summary.resolved} />
        <TimeZonesCard hours={hours} bands={bands} />
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <BlackSpotsCard spots={spots} />
      </div>
    </div>
  );
}
