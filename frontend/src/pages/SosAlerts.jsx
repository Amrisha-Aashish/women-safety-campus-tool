import { Card, GlassBadge, GlassSegmented, toast } from 'glassform';
import { useMemo, useState } from 'react';
import PageToolbar from '../components/layout/PageToolbar.jsx';
import SosAlertCard from '../components/sos-alerts/SosAlertCard.jsx';
import SosAlertSummary from '../components/sos-alerts/SosAlertSummary.jsx';
import Icon from '../components/Icon.jsx';
import { getSosStatus, SOS_STATUSES } from '../data/sosStatus.js';
import { useSosAlerts } from '../hooks/useSosAlerts.js';
import { byUrgency, summarizeSos } from '../lib/sosStats.js';

/**
 * Admin view of SOS alerts: counts per status, a status filter, and one card
 * per alert with Acknowledge / Resolve. Active alerts are always listed first.
 */
export default function SosAlerts() {
  const { alerts, status, acknowledge, resolve } = useSosAlerts();
  // Start on the alerts that still need someone to respond.
  const [filter, setFilter] = useState('ACTIVE');

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
      <PageToolbar>
        {status === 'sample' && (
          <GlassBadge tone="info" dot>
            Sample alerts
          </GlassBadge>
        )}
      </PageToolbar>

      <SosAlertSummary summary={summary} />

      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <GlassSegmented options={options} value={filter} onChange={setFilter} aria-label="Filter alerts by status" />
      </div>

      {shown.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((alert) => (
            <SosAlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={(id) => run(acknowledge, id, 'Alert acknowledged')}
              onResolve={(id) => run(resolve, id, 'Alert resolved')}
            />
          ))}
        </div>
      ) : (
        <Card radius={22} className="grid place-items-center gap-2 py-14 text-center">
          <Icon name="shield-check" size={32} className="text-emerald-300" />
          <p className="font-semibold">{filter === 'ALL' ? 'No SOS alerts yet' : `No ${getSosStatus(filter).label.toLowerCase()} alerts`}</p>
          <p className="text-sm text-neutral-400">New alerts appear here as soon as a student presses SOS.</p>
        </Card>
      )}
    </div>
  );
}
