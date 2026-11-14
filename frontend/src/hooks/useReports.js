import { useCallback, useEffect, useRef, useState } from 'react';
import { getReports } from '../lib/api.js';
import { SAMPLE_REPORTS } from '../data/sampleReports.js';

const newestFirst = (a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? '');

/**
 * Reports from GET /api/reports, refreshed every `interval` ms while the tab is visible.
 * With `source: 'sample'`, or when the API can't be reached, the built-in sample reports are used.
 *
 * @param {{ source?: 'live'|'sample', interval?: number }} [options]
 * @returns {{
 *   reports: object[],
 *   status: 'loading'|'live'|'offline'|'sample',
 *   error: string|null,
 *   updatedAt: Date|null,
 *   refresh: () => Promise<void>,
 * }}
 */
export function useReports({ source = 'live', interval = 10000 } = {}) {
  const [state, setState] = useState({ reports: [], status: 'loading', error: null, updatedAt: null });
  const controller = useRef(null);

  const refresh = useCallback(async () => {
    if (source === 'sample') {
      setState({ reports: SAMPLE_REPORTS, status: 'sample', error: null, updatedAt: new Date() });
      return;
    }
    controller.current?.abort();
    const ac = new AbortController();
    controller.current = ac;
    try {
      const data = await getReports(ac.signal);
      setState({ reports: [...(data ?? [])].sort(newestFirst), status: 'live', error: null, updatedAt: new Date() });
    } catch (error) {
      if (error.name === 'AbortError') return;
      setState({ reports: SAMPLE_REPORTS, status: 'offline', error: error.message, updatedAt: new Date() });
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

  return { ...state, refresh };
}
