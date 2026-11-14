// Placeholder reports for demos and for when the API is offline.
// Generated from a fixed seed so the dashboard and map look the same on every load.
// Shape matches the backend's report object.
import { CAMPUS_PLACES } from './campusPlaces.js';

// Places that get more reports, and the hours they cluster around: the
// patterns the analytics service should find in real data.
const HOTSPOTS = [
  { placeId: 'north-road', weight: 9, hours: [20, 21, 22, 23], categories: ['STALKING', 'UNSAFE_AREA', 'HARASSMENT'] },
  { placeId: 'west-road', weight: 7, hours: [19, 20, 21], categories: ['UNSAFE_AREA', 'HARASSMENT'] },
  { placeId: 'main-gate', weight: 6, hours: [18, 19, 22], categories: ['HARASSMENT', 'STALKING', 'UNSAFE_AREA'] },
  { placeId: 'sports-ground', weight: 3, hours: [17, 18, 19], categories: ['HARASSMENT', 'OTHER'] },
  { placeId: 'engineering', weight: 2, hours: [13, 14], categories: ['HARASSMENT', 'OTHER'] },
  { placeId: 'north-block', weight: 2, hours: [10, 16], categories: ['OTHER', 'STALKING'] },
  { placeId: 'college-road', weight: 2, hours: [8, 23], categories: ['EMERGENCY', 'OTHER'] },
  { placeId: 'north-west-block', weight: 3, hours: [21, 22, 0], categories: ['STALKING', 'EMERGENCY'] },
];

const DESCRIPTIONS = {
  HARASSMENT: ['A group passed comments at students walking by.', 'Someone kept making unwanted remarks near the entrance.'],
  STALKING: ['A person followed me from the bus stop to the hostel.', 'The same man has been waiting here on several evenings.'],
  UNSAFE_AREA: ['Street lights are out, the path is completely dark.', 'Bushes are overgrown and there is nobody around after classes.'],
  EMERGENCY: ['A student fainted and nobody knew whom to call.', 'Fight broke out near the gate, guards arrived late.'],
  OTHER: ['CCTV camera here has been broken for weeks.', 'Guard post is empty most evenings.'],
};

const NAMES = ['Amber', 'Brave', 'Calm', 'Kind', 'Quiet', 'Swift'];
const NOUNS = ['Comet', 'Lotus', 'Maple', 'River', 'Sparrow', 'Willow'];

function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function build(count = 46) {
  const rand = seeded(20261114);
  const pick = (list) => list[Math.floor(rand() * list.length)];
  const pool = HOTSPOTS.flatMap((h) => Array(h.weight).fill(h));
  const now = Date.now();
  const reports = [];

  for (let i = 0; i < count; i++) {
    const spot = pick(pool);
    const place = CAMPUS_PLACES.find((p) => p.id === spot.placeId);
    const category = pick(spot.categories);
    const daysAgo = Math.floor(rand() * 28);
    const when = new Date(now - daysAgo * 86400000);
    when.setHours(pick(spot.hours), Math.floor(rand() * 60), 0, 0);
    if (when.getTime() > now) when.setDate(when.getDate() - 1); // never in the future
    const anonymous = rand() < 0.72;
    // Older reports are more likely to be resolved already.
    const status = daysAgo > 10 && rand() < 0.7 ? 'RESOLVED' : 'OPEN';

    reports.push({
      id: `sample-${String(i + 1).padStart(3, '0')}-${Math.floor(rand() * 1e8).toString(16)}`,
      category,
      description: pick(DESCRIPTIONS[category]),
      location: {
        name: place.name,
        latitude: Number((place.latitude + (rand() - 0.5) * 0.0003).toFixed(6)),
        longitude: Number((place.longitude + (rand() - 0.5) * 0.0003).toFixed(6)),
      },
      occurredAt: when.toISOString(),
      isAnonymous: anonymous,
      reporterPseudonym: anonymous ? `${pick(NAMES)}${pick(NOUNS)}${1000 + Math.floor(rand() * 9000)}` : null,
      status,
      createdAt: new Date(when.getTime() + rand() * 3600000).toISOString(),
    });
  }
  return reports.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export const SAMPLE_REPORTS = build();
