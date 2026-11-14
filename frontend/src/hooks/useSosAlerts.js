import { useCallback, useState } from 'react';
import { SAMPLE_SOS_ALERTS } from '../data/sampleSosAlerts.js';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * SOS alerts with acknowledge / resolve actions. For now it works on the
 * sample alerts in memory; the API is connected in a later step.
 *
 * @returns {{
 *   alerts: object[],
 *   status: 'sample',
 *   acknowledge: (id: string) => Promise<void>,
 *   resolve: (id: string) => Promise<void>,
 * }}
 */
export function useSosAlerts() {
  const [alerts, setAlerts] = useState(SAMPLE_SOS_ALERTS);

  const update = useCallback(async (id, changes) => {
    await wait(500);
    setAlerts((list) => list.map((a) => (a.id === id ? { ...a, ...changes } : a)));
  }, []);

  const acknowledge = useCallback((id) => update(id, { status: 'ACKNOWLEDGED' }), [update]);
  const resolve = useCallback((id) => update(id, { status: 'RESOLVED', resolvedAt: new Date().toISOString() }), [update]);

  return { alerts, status: 'sample', acknowledge, resolve };
}
