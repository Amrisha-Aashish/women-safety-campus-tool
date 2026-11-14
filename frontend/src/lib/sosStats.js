// Numbers derived from SOS alerts, shared by the SOS alerts page and the dashboard.

/** Counts per status and the average time from alert to resolved. */
export function summarizeSos(alerts) {
  const count = { ACTIVE: 0, ACKNOWLEDGED: 0, RESOLVED: 0 };
  let resolvedMs = 0;
  let timed = 0;
  for (const a of alerts) {
    count[a.status] = (count[a.status] ?? 0) + 1;
    if (a.status === 'RESOLVED' && a.resolvedAt) {
      resolvedMs += new Date(a.resolvedAt) - new Date(a.createdAt);
      timed += 1;
    }
  }
  return { total: alerts.length, ...count, avgResolveMs: timed ? resolvedMs / timed : null };
}

const ORDER = { ACTIVE: 0, ACKNOWLEDGED: 1, RESOLVED: 2 };

/** Active first, then acknowledged, then resolved; newest first within each. */
export const byUrgency = (a, b) =>
  (ORDER[a.status] ?? 0) - (ORDER[b.status] ?? 0) || (b.createdAt ?? '').localeCompare(a.createdAt ?? '');
