// Placeholder SOS alerts for demos and for when the API is offline.
// Shape matches the backend's SOSAlert: { id, userId, latitude, longitude, status, createdAt, resolvedAt }.
// Times are relative to page load so the list always looks current.
import { CAMPUS_PLACES } from './campusPlaces.js';

const place = (id) => CAMPUS_PLACES.find((p) => p.id === id);

// [place id, minutes ago, status, minutes until resolved, offset in metres north/east]
const ALERTS = [
  ['north-road', 2, 'ACTIVE', null, [18, -12]],
  ['west-road', 6, 'ACTIVE', null, [-25, 10]],
  ['main-gate', 14, 'ACKNOWLEDGED', null, [8, -20]],
  ['sports-ground', 48, 'RESOLVED', 11, [30, 15]],
  ['north-west-block', 135, 'RESOLVED', 7, [-10, 22]],
  ['college-road', 310, 'RESOLVED', 16, [12, 6]],
  ['north-road', 1460, 'RESOLVED', 9, [-6, -30]],
];

// One metre in degrees near the campus (latitude ~18.6°).
const M_LAT = 1 / 111_320;
const M_LNG = 1 / (111_320 * Math.cos((18.62 * Math.PI) / 180));

const loadedAt = Date.now();
const minutesAgo = (m) => new Date(loadedAt - m * 60_000).toISOString();

export const SAMPLE_SOS_ALERTS = ALERTS.map(([placeId, ago, status, resolvedAfter, [north, east]], i) => {
  const p = place(placeId);
  return {
    id: `sample-sos-${i + 1}`,
    userId: null,
    latitude: Number((p.latitude + north * M_LAT).toFixed(6)),
    longitude: Number((p.longitude + east * M_LNG).toFixed(6)),
    status,
    createdAt: minutesAgo(ago),
    resolvedAt: resolvedAfter ? minutesAgo(ago - resolvedAfter) : null,
  };
});
