import { useEffect, useState } from 'react';
import { getSosAlerts } from '../lib/api.js';

/**
 * Follows one SOS alert's status so the student sees when security responds.
 * Polls GET /api/sos-alerts (there is no single-alert endpoint yet) every
 * `interval` ms until the alert is resolved. Network errors keep the last known status.
 *
 * @param {{ id: string, status: string }} alert the alert returned when it was sent
 * @param {number} [interval]
 * @returns {{ status: 'ACTIVE'|'ACKNOWLEDGED'|'RESOLVED', resolvedAt: string|null }}
 */
export function useSosAlertStatus(alert, interval = 5000) {
  const [state, setState] = useState({ status: alert.status, resolvedAt: null });
  const done = state.status === 'RESOLVED';

  useEffect(() => {
    if (done) return undefined;
    const ac = new AbortController();
    const check = async () => {
      try {
        const found = (await getSosAlerts(ac.signal))?.find((a) => a.id === alert.id);
        if (found) setState({ status: found.status, resolvedAt: found.resolvedAt });
      } catch {
        // Offline for a moment: keep showing the last status.
      }
    };
    const id = setInterval(check, interval);
    return () => {
      clearInterval(id);
      ac.abort();
    };
  }, [alert.id, interval, done]);

  return state;
}
