import { useEffect, useMemo, useState } from 'react';
import DataSourceBar from '../components/app/DataSourceBar.jsx';
import BlackSpotsCard from '../components/dashboard/BlackSpotsCard.jsx';
import CategoryCard from '../components/dashboard/CategoryCard.jsx';
import RecentReportsTable from '../components/dashboard/RecentReportsTable.jsx';
import RiskZonesCard from '../components/dashboard/RiskZonesCard.jsx';
import SosStatusCard from '../components/dashboard/SosStatusCard.jsx';
import StatsRow from '../components/dashboard/StatsRow.jsx';
import TimeZonesCard from '../components/dashboard/TimeZonesCard.jsx';
import { getRedTimeZones, getRiskZones } from '../lib/api.js';
import { SAMPLE_RISK_ZONES } from '../data/sampleRiskZones.js';
import { useReports } from '../hooks/useReports.js';
import { useSosAlerts } from '../hooks/useSosAlerts.js';
import { byCategory, hotspots, redTimeZones, summarize } from '../lib/reportStats.js';
import { summarizeSos } from '../lib/sosStats.js';

export default function Dashboard() {
  const [source, setSource] = useState('live');
  const [riskZones, setRiskZones] = useState([]);
  const [analyticsHours, setAnalyticsHours] = useState([]);
  const [analyticsStatus, setAnalyticsStatus] = useState('loading');

  const { reports, status, updatedAt, refresh } = useReports({ source });
  const sos = useSosAlerts({ source });

  async function refreshAnalytics() {
    if (source !== 'live') {
      setRiskZones([]);
      setAnalyticsHours([]);
      setAnalyticsStatus('idle');
      return;
    }

    setAnalyticsStatus('loading');

    try {
      const [zones, timeZones] = await Promise.all([
        getRiskZones(),
        getRedTimeZones()
      ]);

      const hours = Array(24).fill(0);
      timeZones.forEach(({ hour, reportCount }) => {
        hours[hour] = reportCount;
      });

      setRiskZones(zones);
      setAnalyticsHours(hours);
      setAnalyticsStatus('success');
    } catch {
      setRiskZones([]);
      setAnalyticsHours([]);
      setAnalyticsStatus('error');
    }
  }

  useEffect(() => {
    refreshAnalytics();
  }, [source]);

  const sosSummary = useMemo(() => summarizeSos(sos.alerts), [sos.alerts]);
  const summary = useMemo(() => summarize(reports), [reports]);
  const categories = useMemo(() => byCategory(reports), [reports]);
  const hours = analyticsStatus === 'success' ? analyticsHours : Array(24).fill(0);
  const bands = useMemo(() => redTimeZones(hours), [hours]);
  const spots = useMemo(() => hotspots(reports), [reports]);

  const refreshAll = () => Promise.all([
    refresh(),
    sos.refresh(),
    refreshAnalytics()
  ]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <DataSourceBar
        source={source}
        onSourceChange={setSource}
        status={status}
        updatedAt={updatedAt}
        onRefresh={refreshAll}
      />

      <StatsRow summary={summary} loading={status === 'loading'} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <SosStatusCard alerts={sos.alerts} summary={sosSummary} />
        <RiskZonesCard
          zones={analyticsStatus === 'success' ? riskZones : SAMPLE_RISK_ZONES}
          placeholder={analyticsStatus !== 'success'}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <CategoryCard
          categories={categories}
          open={summary.open}
          resolved={summary.resolved}
        />
        <TimeZonesCard hours={hours} bands={bands} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <RecentReportsTable reports={reports} loading={status === 'loading'} />
        <BlackSpotsCard spots={spots} />
      </div>
    </div>
  );
}