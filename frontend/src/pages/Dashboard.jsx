import { useMemo, useState } from 'react';
import DataSourceBar from '../components/app/DataSourceBar.jsx';
import CategoryCard from '../components/dashboard/CategoryCard.jsx';
import StatsRow from '../components/dashboard/StatsRow.jsx';
import { useReports } from '../hooks/useReports.js';
import { byCategory, summarize } from '../lib/reportStats.js';

/** Admin dashboard: live totals, categories, red time zones, black spots and recent reports. */
export default function Dashboard() {
  const [source, setSource] = useState('live');
  const { reports, status, updatedAt, refresh } = useReports({ source });
  const summary = useMemo(() => summarize(reports), [reports]);
  const categories = useMemo(() => byCategory(reports), [reports]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <DataSourceBar source={source} onSourceChange={setSource} status={status} updatedAt={updatedAt} onRefresh={refresh} />
      <StatsRow summary={summary} loading={status === 'loading'} />
      <div className="grid gap-5 lg:grid-cols-3">
        <CategoryCard categories={categories} open={summary.open} resolved={summary.resolved} />
      </div>
    </div>
  );
}
