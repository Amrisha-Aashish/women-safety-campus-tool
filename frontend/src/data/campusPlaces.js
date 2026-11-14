// Ajeenkya DY Patil University, Charholi Budruk / Lohegaon, Pune.
// Boundary and places come from OpenStreetMap (university outline: way 1410120541).
// Places marked "unnamed in OSM" are real features without a name on the map;
// rename them to what students call them.
export const CAMPUS_NAME = 'Ajeenkya DY Patil University';
export const CAMPUS_CITY = 'Lohegaon, Pune';
export const CAMPUS_CENTER = { latitude: 18.6219, longitude: 73.9109 };

/**
 * Campus boundary as [latitude, longitude] corners, in order. Reports must be
 * inside it, and the map shows only this area. Keep it identical to
 * backend/src/config/campus.js.
 */
export const CAMPUS_BOUNDARY = [
  [18.624321, 73.908437],
  [18.623906, 73.90849],
  [18.622509, 73.90864],
  [18.622138, 73.908683],
  [18.620933, 73.908623],
  [18.62018, 73.908644],
  [18.619998, 73.90871],
  [18.619617, 73.910159],
  [18.619414, 73.910276],
  [18.6194, 73.910598],
  [18.619149, 73.910731],
  [18.619149, 73.910998],
  [18.619585, 73.912184],
  [18.620076, 73.913385],
  [18.622841, 73.91274],
  [18.624874, 73.912396],
  [18.62489, 73.911783],
  [18.624906, 73.911023],
  [18.624923, 73.910144],
  [18.624932, 73.909055],
  [18.624871, 73.909076],
  [18.624816, 73.908912],
  [18.624617, 73.908603],
];

export const CAMPUS_PLACES = [
  { id: 'main-gate', name: 'Main Gate', latitude: 18.61978, longitude: 73.91237 },
  { id: 'college-road', name: 'D.Y. Patil College Road', latitude: 18.620069, longitude: 73.910627 },
  { id: 'dental', name: 'D Y Patil Dental School', latitude: 18.620273, longitude: 73.9109 },
  { id: 'international-school', name: 'D Y Patil International School', latitude: 18.621032, longitude: 73.910039 },
  { id: 'engineering', name: 'School of Engineering & Technology', latitude: 18.621312, longitude: 73.912274 },
  { id: 'gate-block', name: 'Block near Main Gate', latitude: 18.620493, longitude: 73.91257 }, // unnamed in OSM
  { id: 'sports-ground', name: 'Sports Ground', latitude: 18.622168, longitude: 73.910741 },
  { id: 'sports-courts', name: 'Sports Courts', latitude: 18.622179, longitude: 73.912057 },
  { id: 'north-west-block', name: 'North-West Block', latitude: 18.622871, longitude: 73.909662 }, // unnamed in OSM
  { id: 'north-block', name: 'North Block', latitude: 18.622902, longitude: 73.911237 }, // unnamed in OSM
  { id: 'west-road', name: 'West Service Road', latitude: 18.620886, longitude: 73.909268 }, // unnamed in OSM
  { id: 'north-road', name: 'North Campus Road', latitude: 18.624038, longitude: 73.912041 }, // unnamed in OSM
];
