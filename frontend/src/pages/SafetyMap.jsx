import { Card } from 'glassform';
import { useState } from 'react';
import DataSourceBar from '../components/app/DataSourceBar.jsx';
import CampusMap from '../components/map/CampusMap.jsx';
import { useReports } from '../hooks/useReports.js';

/** Safety map: reported incidents and risk zones on the campus. */
export default function SafetyMap() {
  const [source, setSource] = useState('live');
  const { reports, status, updatedAt, refresh } = useReports({ source });

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <DataSourceBar source={source} onSourceChange={setSource} status={status} updatedAt={updatedAt} onRefresh={refresh} />
      <Card radius={24} padding="none" className="relative overflow-hidden">
        <CampusMap reports={reports} className="h-[520px] w-full lg:h-[calc(100dvh-220px)] lg:min-h-[520px]" />
      </Card>
    </div>
  );
}
