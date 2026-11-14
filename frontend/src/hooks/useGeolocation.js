import { useCallback, useState } from 'react';

const MESSAGES = {
  1: 'Location permission was denied. Allow it in the browser, or enter the place by hand.',
  2: "Your position isn't available right now. Try again, or enter the place by hand.",
  3: 'Finding your location took too long. Try again.',
};

/**
 * One-shot browser geolocation. Nothing is read until `locate()` is called.
 * @returns {{ status: 'idle'|'locating'|'success'|'error', coords: { latitude: number, longitude: number, accuracy: number }|null, error: string|null, locate: () => Promise<object|null> }}
 */
export function useGeolocation() {
  const [state, setState] = useState({ status: 'idle', coords: null, error: null });

  const locate = useCallback(
    () =>
      new Promise((resolve) => {
        if (!('geolocation' in navigator)) {
          setState({ status: 'error', coords: null, error: "This browser can't share your location." });
          resolve(null);
          return;
        }
        setState((s) => ({ ...s, status: 'locating', error: null }));
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            const value = {
              latitude: Number(coords.latitude.toFixed(6)),
              longitude: Number(coords.longitude.toFixed(6)),
              accuracy: Math.round(coords.accuracy),
            };
            setState({ status: 'success', coords: value, error: null });
            resolve(value);
          },
          (error) => {
            setState({ status: 'error', coords: null, error: MESSAGES[error.code] ?? error.message });
            resolve(null);
          },
          { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
        );
      }),
    [],
  );

  return { ...state, locate };
}
