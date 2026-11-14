import { useEffect, useState } from 'react';
import { getHealth } from '../lib/api.js';

/**
 * Pings GET /api/health every `interval` ms.
 * @returns {'checking'|'online'|'offline'}
 */
export function useApiHealth(interval = 30000) {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let controller;
    const check = async () => {
      controller?.abort();
      controller = new AbortController();
      try {
        await getHealth(controller.signal);
        setStatus('online');
      } catch (error) {
        if (error.name !== 'AbortError') setStatus('offline');
      }
    };
    check();
    const id = setInterval(check, interval);
    return () => {
      clearInterval(id);
      controller?.abort();
    };
  }, [interval]);

  return status;
}
