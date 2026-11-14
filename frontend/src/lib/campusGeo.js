// Geometry for the campus: the boundary check, and the Web Mercator projection
// the map uses so report dots line up with the map tiles underneath.
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

// ---- Web Mercator: the same pixel grid as slippy-map tiles ----

/** Tile zoom level used for the campus map. */
export const TILE_ZOOM = 18;
const TILE = 256;
const WORLD = TILE * 2 ** TILE_ZOOM;

const worldX = (lng) => ((lng + 180) / 360) * WORLD;
const worldY = (lat) => {
  const phi = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(phi) + 1 / Math.cos(phi)) / Math.PI) / 2) * WORLD;
};

const lats = CAMPUS_BOUNDARY.map(([lat]) => lat);
const lngs = CAMPUS_BOUNDARY.map(([, lng]) => lng);
const LEFT = worldX(Math.min(...lngs));
const RIGHT = worldX(Math.max(...lngs));
const TOP = worldY(Math.max(...lats));
const BOTTOM = worldY(Math.min(...lats));

// Map units: the campus is 1000 units wide, north up.
const K = 1000 / (RIGHT - LEFT);
const CENTER_LAT = (Math.min(...lats) + Math.max(...lats)) / 2;
const M_PER_WORLD_PX = (156543.03392 * Math.cos((CENTER_LAT * Math.PI) / 180)) / 2 ** TILE_ZOOM;
const PAD = 40;

/** Map units per metre. */
export const UNITS_PER_M = K / M_PER_WORLD_PX;

/** viewBox of the campus map, with padding around the boundary. */
export const MAP_VIEWBOX = { x: -PAD, y: -PAD, width: 1000 + PAD * 2, height: (BOTTOM - TOP) * K + PAD * 2 };

/** Project a coordinate to { x, y } in map units. */
export function project(latitude, longitude) {
  return { x: (worldX(longitude) - LEFT) * K, y: (worldY(latitude) - TOP) * K };
}

/** The boundary as an SVG path. */
export const BOUNDARY_PATH = `${CAMPUS_BOUNDARY.map(([lat, lng], i) => {
  const { x, y } = project(lat, lng);
  return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
}).join(' ')} Z`;

/** Street map tiles (OpenStreetMap). `url(x, y, z)` builds one tile's address. */
export const STREET_TILES = {
  url: (x, y, z) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`,
  attribution: '© OpenStreetMap contributors',
};

/** The tiles that cover the campus, positioned in map units: [{ key, tx, ty, x, y, size }]. */
export const CAMPUS_TILES = (() => {
  const tiles = [];
  for (let tx = Math.floor(LEFT / TILE); tx <= Math.floor(RIGHT / TILE); tx++) {
    for (let ty = Math.floor(TOP / TILE); ty <= Math.floor(BOTTOM / TILE); ty++) {
      tiles.push({ key: `${tx}-${ty}`, tx, ty, x: (tx * TILE - LEFT) * K, y: (ty * TILE - TOP) * K, size: TILE * K });
    }
  }
  return tiles;
})();
