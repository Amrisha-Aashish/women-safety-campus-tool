// Sending an SOS through POST /api/sos-alerts.
import { CAMPUS_CENTER } from '../data/campusPlaces.js';
import { createSosAlert } from './api.js';

/**
 * Send an SOS alert.
 *
 * The API needs coordinates. When the browser couldn't share a position, the
 * campus centre is sent instead so the alert still goes out, and the result is
 * marked `approximate` so the student is told security doesn't know exactly where they are.
 *
 * @param {{ latitude: number, longitude: number, accuracy?: number } | null} location
 * @returns {Promise<{
 *   id: string,
 *   status: 'ACTIVE'|'ACKNOWLEDGED'|'RESOLVED',
 *   sentAt: string,
 *   location: { latitude: number, longitude: number, accuracy?: number },
 *   approximate: boolean,
 * }>}
 * @throws {import('./api.js').ApiError} when the server can't be reached or rejects the alert
 */
export async function sendSos(location) {
  const approximate = !location;
  const point = location ?? CAMPUS_CENTER;
  const alert = await createSosAlert({ latitude: point.latitude, longitude: point.longitude });
  return {
    id: alert.id,
    status: alert.status,
    sentAt: alert.createdAt,
    location: { latitude: alert.latitude, longitude: alert.longitude, accuracy: location?.accuracy },
    approximate,
  };
}
