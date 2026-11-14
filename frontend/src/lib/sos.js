// SOS sending. The backend has no SOS endpoint yet, so this only simulates it.
// When POST /api/sos exists: replace the body of sendSos() with a request
// (see lib/api.js) and set SOS_CONNECTED to true.
export const SOS_CONNECTED = false;

/**
 * Send an SOS alert.
 * @param {{ latitude?: number, longitude?: number, accuracy?: number } | null} location
 * @returns {Promise<{ id: string, sentAt: string, location: object|null, demo: boolean }>}
 */
export async function sendSos(location) {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return {
    id: `sos-${Date.now().toString(36)}`,
    sentAt: new Date().toISOString(),
    location,
    demo: !SOS_CONNECTED,
  };
}
