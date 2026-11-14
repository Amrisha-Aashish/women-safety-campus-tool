// Placeholder risk zones until the backend serves them.
// Shape matches the backend's RiskZone model (backend/prisma/schema.prisma):
// { id, zoneName, latitude, longitude, riskScore (0–100), riskLevel: 'LOW'|'MEDIUM'|'HIGH', reason, updatedAt }.
import { CAMPUS_PLACES } from './campusPlaces.js';

const at = (placeId) => {
  const { latitude, longitude } = CAMPUS_PLACES.find((p) => p.id === placeId);
  return { latitude, longitude };
};

const updatedAt = new Date(Date.now() - 3 * 3600_000).toISOString();

export const SAMPLE_RISK_ZONES = [
  {
    id: 'zone-north-road',
    zoneName: 'North Campus Road',
    ...at('north-road'),
    riskScore: 86,
    riskLevel: 'HIGH',
    reason: 'Stalking and unlit stretches reported after 8 PM',
    updatedAt,
  },
  {
    id: 'zone-west-road',
    zoneName: 'West Service Road',
    ...at('west-road'),
    riskScore: 72,
    riskLevel: 'HIGH',
    reason: 'Isolated road with no guard post in the evening',
    updatedAt,
  },
  {
    id: 'zone-main-gate',
    zoneName: 'Main Gate',
    ...at('main-gate'),
    riskScore: 54,
    riskLevel: 'MEDIUM',
    reason: 'Harassment reports at closing time',
    updatedAt,
  },
  {
    id: 'zone-sports-ground',
    zoneName: 'Sports Ground',
    ...at('sports-ground'),
    riskScore: 31,
    riskLevel: 'LOW',
    reason: 'Occasional reports during evening practice',
    updatedAt,
  },
];
