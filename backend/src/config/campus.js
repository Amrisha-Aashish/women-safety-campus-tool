// Campus boundary of Ajeenkya DY Patil University, Lohegaon, Pune, as
// [latitude, longitude] corners in order (OpenStreetMap way 1410120541).
// Reports outside it are rejected. Keep it identical to
// frontend/src/data/campusPlaces.js.
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

/** True when the point lies inside the campus boundary (ray casting). */
export function isInsideCampus(latitude, longitude, polygon = CAMPUS_BOUNDARY) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [latI, lngI] = polygon[i];
    const [latJ, lngJ] = polygon[j];
    const crosses = latI > latitude !== latJ > latitude && longitude < ((lngJ - lngI) * (latitude - latI)) / (latJ - latI) + lngI;
    if (crosses) inside = !inside;
  }
  return inside;
}
