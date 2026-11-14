import { useEffect, useRef } from 'react';

/**
 * Calls `onNew(alert)` for every ACTIVE alert that shows up after the first
 * load, so an admin watching the page notices a new SOS straight away.
 * Alerts already there when the page opens, or when the source changes, are not announced.
 *
 * @param {object[]} alerts
 * @param {string} status the hook status; only 'live' data is announced
 * @param {(alert: object) => void} onNew
 */
export function useNewSosAlert(alerts, status, onNew) {
  const seen = useRef(null);
  const callback = useRef(onNew);
  callback.current = onNew;

  useEffect(() => {
    if (status !== 'live') {
      seen.current = null;
      return;
    }
    if (seen.current) {
      alerts.filter((a) => a.status === 'ACTIVE' && !seen.current.has(a.id)).forEach((a) => callback.current(a));
    }
    seen.current = new Set(alerts.map((a) => a.id));
  }, [alerts, status]);
}
