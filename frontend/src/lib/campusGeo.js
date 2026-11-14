// Geometry for the campus: the boundary check and the projection used by the map.
import { CAMPUS_BOUNDARY } from '../data/campusPlaces.js';

/** True when the point lies inside `polygon` ([lat, lng] corners). Ray casting. */
export function isInsidePolygon(latitude, longitude, polygon = CAMPUS_BOUNDARY) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [latI, lngI] = polygon[i];
    const [latJ, lngJ] = polygon[j];
    const crosses = latI > latitude !== latJ > latitude && longitude < ((lngJ - lngI) * (latitude - latI)) / (latJ - latI) + lngI;
    if (crosses) inside = !inside;
  }
  return inside;
}

/** True for finite coordinates inside the campus boundary. */
export function isOnCampus(latitude, longitude) {
  return Number.isFinite(latitude) && Number.isFinite(longitude) && isInsidePolygon(latitude, longitude);
}

// ---- Projection: latitude / longitude → SVG units (north up, 1000 units wide) ----

const lats = CAMPUS_BOUNDARY.map(([lat]) => lat);
const lngs = CAMPUS_BOUNDARY.map(([, lng]) => lng);
const MIN_LAT = Math.min(...lats);
const MAX_LAT = Math.max(...lats);
const MIN_LNG = Math.min(...lngs);
const MAX_LNG = Math.max(...lngs);
const COS = Math.cos((((MIN_LAT + MAX_LAT) / 2) * Math.PI) / 180);
const M_PER_DEG_LAT = 110574;
const M_PER_DEG_LNG = 111320 * COS;

const WIDTH_M = (MAX_LNG - MIN_LNG) * M_PER_DEG_LNG;
const HEIGHT_M = (MAX_LAT - MIN_LAT) * M_PER_DEG_LAT;
const PAD = 60;

/** SVG units per metre. */
export const UNITS_PER_M = 1000 / WIDTH_M;

/** viewBox of the campus map, with padding around the boundary. */
export const MAP_VIEWBOX = { x: -PAD, y: -PAD, width: 1000 + PAD * 2, height: HEIGHT_M * UNITS_PER_M + PAD * 2 };

/** Project a coordinate to { x, y } in map units. */
export function project(latitude, longitude) {
  return {
    x: (longitude - MIN_LNG) * M_PER_DEG_LNG * UNITS_PER_M,
    y: (MAX_LAT - latitude) * M_PER_DEG_LAT * UNITS_PER_M,
  };
}

/** The boundary as an SVG path. */
export const BOUNDARY_PATH = `${CAMPUS_BOUNDARY.map(([lat, lng], i) => {
  const { x, y } = project(lat, lng);
  return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
}).join(' ')} Z`;
