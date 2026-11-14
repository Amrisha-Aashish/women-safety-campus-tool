// Thin client for the Campus Safety API (../backend).
//
// In development the Vite proxy forwards /api to http://localhost:4000, so the
// base URL is empty. For a deployed build set VITE_API_URL (see .env.example).
export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

/** Error thrown for network failures and non-2xx responses. */
export class ApiError extends Error {
  constructor(message, { status = 0, offline = false } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.offline = offline;
  }
}

async function request(path, { method = 'GET', body, signal } = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      signal,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError("Can't reach the safety server. Check that the backend is running.", { offline: true });
  }

  // The backend answers { success, data } or { success: false, message }.
  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.success === false) {
    // The Vite proxy answers 5xx when the backend is down.
    const offline = response.status >= 502 && response.status <= 504;
    throw new ApiError(
      payload?.message || (offline ? "Can't reach the safety server." : `Request failed (${response.status}).`),
      { status: response.status, offline },
    );
  }
  return payload?.data;
}

/** GET /api/health → { status, timestamp } */
export const getHealth = (signal) => request('/api/health', { signal });

/** GET /api/reports → report[] */
export const getReports = (signal) => request('/api/reports', { signal });

/**
 * POST /api/reports
 * @param {{
 *   category: 'HARASSMENT'|'STALKING'|'UNSAFE_AREA'|'EMERGENCY'|'OTHER',
 *   description: string,
 *   location: { name: string, latitude: number, longitude: number },
 *   isAnonymous: boolean,
 *   occurredAt?: string,
 * }} report
 * @returns {Promise<object>} the saved report, with `reporterPseudonym` when anonymous
 */
export const createReport = (report) => request('/api/reports', { method: 'POST', body: report });

// ---- SOS alerts ----
// An alert is { id, userId, latitude, longitude, status: 'ACTIVE'|'ACKNOWLEDGED'|'RESOLVED', createdAt, resolvedAt }.

/** GET /api/sos-alerts → alert[], newest first. */
export const getSosAlerts = (signal) => request('/api/sos-alerts', { signal });

/**
 * POST /api/sos-alerts
 * @param {{ latitude: number, longitude: number }} location
 * @returns {Promise<object>} the new alert, status ACTIVE
 */
export const createSosAlert = ({ latitude, longitude }) =>
  request('/api/sos-alerts', { method: 'POST', body: { latitude, longitude } });

/** PATCH /api/sos-alerts/:id/acknowledge → the updated alert. */
export const acknowledgeSosAlert = (id) =>
  request(`/api/sos-alerts/${encodeURIComponent(id)}/acknowledge`, { method: 'PATCH' });

/** PATCH /api/sos-alerts/:id/resolve → the updated alert, with resolvedAt. */
export const resolveSosAlert = (id) =>
  request(`/api/sos-alerts/${encodeURIComponent(id)}/resolve`, { method: 'PATCH' });
