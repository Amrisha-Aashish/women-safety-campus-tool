// Campus boundary as [latitude, longitude] corners, in order. Reports outside
// it are rejected. Keep it identical to frontend/src/data/campusPlaces.js.
// TODO: replace with the real campus outline.
export const CAMPUS_BOUNDARY = [
  [23.3484, 85.3058],
  [23.3484, 85.3128],
  [23.3466, 85.3142],
  [23.3416, 85.3142],
  [23.3402, 85.3124],
  [23.3402, 85.3058],
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
