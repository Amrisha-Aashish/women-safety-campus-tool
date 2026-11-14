import { Card, GlassSegmented, toast } from 'glassform';
import { useMemo, useState } from 'react';
import DataSourceBar from '../components/app/DataSourceBar.jsx';
import Icon from '../components/Icon.jsx';
import SosAlertCard from '../components/sos-alerts/SosAlertCard.jsx';
import SosAlertSummary from '../components/sos-alerts/SosAlertSummary.jsx';
import { getSosStatus, SOS_STATUSES } from '../data/sosStatus.js';
import { useNewSosAlert } from '../hooks/useNewSosAlert.js';
import { useSosAlerts } from '../hooks/useSosAlerts.js';
import { nearestPlace } from '../lib/campusGeo.js';
import { byUrgency, summarizeSos } from '../lib/sosStats.js';

/** Grey placeholder cards while the first load is in flight. */
function LoadingCards() {
  return Array.from({ length: 3 }, (_, i) => (
    <Card key={i} radius={22} className="h-64 animate-pulse p-5" aria-hidden="true">
      <div className="h-5 w-20 rounded-full bg-neutral-500/20" />
      <div className="mt-6 h-6 w-3/4 rounded-lg bg-neutral-500/20" />
      <div className="mt-3 h-4 w-1/2 rounded-lg bg-neutral-500/15" />
    </Card>
  ));
}

/**
 * Admin view of SOS alerts: counts per status, a status filter, and one card
 * per alert with Acknowledge / Resolve. Live data is polled every few seconds
 * and a toast announces each new alert.
 */
export default function SosAlerts() {
  const [source, setSource] = useState('live');
  const { alerts, status, updatedAt, refresh, acknowledge, resolve } = useSosAlerts({ source });
  // Start on the alerts that still need someone to respond.
  const [filter, setFilter] = useState('ACTIVE');
  const loading = status === 'loading';

  useNewSosAlert(alerts, status, (alert) => {
    const near = nearestPlace(alert.latitude, alert.longitude);
    toast.error('New SOS alert', { description: near ? `Near ${near.place.name}` : 'Location unknown' });
  });

  const summary = useMemo(() => summarizeSos(alerts), [alerts]);
  const shown = useMemo(
    () => alerts.filter((a) => filter === 'ALL' || a.status === filter).sort(byUrgency),
    [alerts, filter],
  );

  const options = [
    { value: 'ALL', label: `All ${summary.total}` },
    ...SOS_STATUSES.map((s) => ({ value: s.value, label: `${s.label} ${summary[s.value]}` })),
  ];

  const run = (action, id, message) =>
    action(id).then(
      () => toast.success(message),
      (error) => {
        toast.error("Couldn't update the alert", { description: error.message });
        throw error;
      },
    );

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <DataSourceBar
        source={source}
        onSourceChange={setSource}
        status={status}
        updatedAt={updatedAt}
        onRefresh={refresh}
        refreshLabel="Refresh SOS alerts"
      />

      <SosAlertSummary summary={summary} loading={loading} />

      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <GlassSegmented options={options} value={filter} onChange={setFilter} aria-label="Filter alerts by status" />
      </div>

      {loading || shown.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <LoadingCards />
          ) : (
            shown.map((alert) => (
              <SosAlertCard
                key={alert.id}
                alert={alert}
                onAcknowledge={(id) => run(acknowledge, id, 'Alert acknowledged')}
                onResolve={(id) => run(resolve, id, 'Alert resolved')}
              />
            ))
          )}
        </div>
      ) : (
        <Card radius={22} className="grid place-items-center gap-2 py-14 text-center">
          <Icon name="shield-check" size={32} className="text-emerald-300" />
          <p className="font-semibold">
            {filter === 'ALL' ? 'No SOS alerts yet' : `No ${getSosStatus(filter).label.toLowerCase()} alerts`}
          </p>
          <p className="text-sm text-neutral-400">New alerts appear here within seconds of a student pressing SOS.</p>
        </Card>
      )}
    </div>
  );
}
