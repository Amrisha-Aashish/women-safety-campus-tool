import { useCallback, useEffect, useRef, useState } from 'react';
import { SAMPLE_SOS_ALERTS } from '../data/sampleSosAlerts.js';
import { acknowledgeSosAlert, getSosAlerts, resolveSosAlert } from '../lib/api.js';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * SOS alerts from GET /api/sos-alerts, refreshed every `interval` ms while the
 * tab is visible, with acknowledge / resolve actions.
 * With `source: 'sample'`, or when the API can't be reached, sample alerts are
 * shown and the actions only change them in memory.
 *
 * @param {{ source?: 'live'|'sample', interval?: number }} [options]
 * @returns {{
 *   alerts: object[],
 *   status: 'loading'|'live'|'offline'|'sample',
 *   error: string|null,
 *   updatedAt: Date|null,
 *   refresh: () => Promise<void>,
 *   acknowledge: (id: string) => Promise<void>,
 *   resolve: (id: string) => Promise<void>,
 * }}
 */
export function useSosAlerts({ source = 'live', interval = 5000 } = {}) {
  const [state, setState] = useState({ alerts: [], status: 'loading', error: null, updatedAt: null });
  const controller = useRef(null);
  const live = state.status === 'live';

  const refresh = useCallback(async () => {
    if (source === 'sample') {
      setState({ alerts: SAMPLE_SOS_ALERTS, status: 'sample', error: null, updatedAt: new Date() });
      return;
    }
    controller.current?.abort();
    const ac = new AbortController();
    controller.current = ac;
    try {
      const data = await getSosAlerts(ac.signal);
      setState({ alerts: data ?? [], status: 'live', error: null, updatedAt: new Date() });
    } catch (error) {
      if (error.name === 'AbortError') return;
      // Keep showing what we had if a poll fails after a good load; otherwise fall back to samples.
      setState((s) => ({
        alerts: s.status === 'live' ? s.alerts : SAMPLE_SOS_ALERTS,
        status: 'offline',
        error: error.message,
        updatedAt: new Date(),
      }));
    }
  }, [source]);

  useEffect(() => {
    refresh();
    if (source === 'sample' || !interval) return undefined;
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') refresh();
    }, interval);
    return () => {
      clearInterval(id);
      controller.current?.abort();
    };
  }, [refresh, source, interval]);

  const replace = (updated) =>
    setState((s) => ({ ...s, alerts: s.alerts.map((a) => (a.id === updated.id ? { ...a, ...updated } : a)) }));

  // Live: the server's answer replaces the alert. Sample / offline: change it in memory.
  const act = useCallback(
    async (id, request, local) => {
      if (live) {
        replace(await request(id));
        return;
      }
      await wait(400);
      replace({ id, ...local() });
    },
    [live],
  );

  const acknowledge = useCallback((id) => act(id, acknowledgeSosAlert, () => ({ status: 'ACKNOWLEDGED' })), [act]);
  const resolve = useCallback(
    (id) => act(id, resolveSosAlert, () => ({ status: 'RESOLVED', resolvedAt: new Date().toISOString() })),
    [act],
  );

  return { ...state, refresh, acknowledge, resolve };
}
