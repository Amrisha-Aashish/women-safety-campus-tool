import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import { CAMPUS_CENTER } from '../../data/campusPlaces.js';
import { getCategory } from '../../data/categories.js';
import { RISK } from '../../data/risk.js';
import { formatDateTime, formatHour } from '../../lib/format.js';

// Standard OpenStreetMap tiles: free with attribution, no API key.
const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/** Small DOM builder for popups. Text goes in via textContent, so report text is never parsed as HTML. */
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function reportPopup(report) {
  const category = getCategory(report.category);
  const root = el('div', 'sc-popup');
  const tag = el('span', 'sc-popup-tag', category.label);
  tag.style.color = category.color;
  root.append(
    tag,
    el('p', null, report.description),
    el('small', null, `${report.location?.name ?? 'Unknown place'} · ${formatDateTime(report.occurredAt ?? report.createdAt)}`),
  );
  return root;
}

function zonePopup(spot) {
  const root = el('div', 'sc-popup');
  const tag = el('span', 'sc-popup-tag', `${RISK[spot.risk].label} zone`);
  tag.style.color = RISK[spot.risk].color;
  root.append(
    tag,
    el('p', null, spot.name),
    el('small', null, `${spot.count} reports · ${spot.open} open · peak ${formatHour(spot.peakHour)}`),
  );
  return root;
}

/** Circle size grows with the number of reports at a place. */
const zoneRadius = (count) => Math.min(140, 30 + count * 9);

/**
 * Leaflet map of the campus: one dot per report (coloured by category) and a
 * shaded circle per black spot (coloured by risk). Leaflet only draws the map;
 * every control around it is glassform.
 *
 * @param {{
 *   reports: object[],
 *   spots: object[],
 *   showReports?: boolean,
 *   showZones?: boolean,
 *   selected?: string|null,
 *   onSelect?: (name: string) => void,
 *   className?: string,
 * }} props  `selected` is a black spot name; the map flies to it.
 */
export default function CampusMap({ reports, spots, showReports = true, showZones = true, selected, onSelect, className }) {
  const container = useRef(null);
  const map = useRef(null);
  const reportLayer = useRef(null);
  const zoneLayer = useRef(null);
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;

  // Create the map once.
  useEffect(() => {
    const instance = L.map(container.current, {
      center: [CAMPUS_CENTER.latitude, CAMPUS_CENTER.longitude],
      zoom: 16,
      zoomControl: false,
    });
    L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(instance);
    L.control.zoom({ position: 'bottomright' }).addTo(instance);
    zoneLayer.current = L.layerGroup().addTo(instance);
    reportLayer.current = L.layerGroup().addTo(instance);
    map.current = instance;
    return () => {
      instance.remove();
      map.current = null;
    };
  }, []);

  // Risk zones, under the report dots.
  useEffect(() => {
    const layer = zoneLayer.current;
    layer.clearLayers();
    if (!showZones) return;
    spots.forEach((spot) => {
      if (!Number.isFinite(spot.latitude) || !Number.isFinite(spot.longitude)) return;
      const { color } = RISK[spot.risk];
      L.circle([spot.latitude, spot.longitude], {
        radius: zoneRadius(spot.count),
        color,
        weight: spot.name === selected ? 3 : 1.5,
        dashArray: spot.risk === 'low' ? '4 6' : undefined,
        fillColor: color,
        fillOpacity: spot.risk === 'high' ? 0.22 : 0.14,
      })
        .bindPopup(() => zonePopup(spot), { maxWidth: 240 })
        .on('click', () => selectRef.current?.(spot.name))
        .addTo(layer);
    });
  }, [spots, showZones, selected]);

  // Report dots.
  useEffect(() => {
    const layer = reportLayer.current;
    layer.clearLayers();
    if (!showReports) return;
    reports.forEach((report) => {
      const { latitude, longitude } = report.location ?? {};
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
      L.circleMarker([latitude, longitude], {
        radius: 6,
        color: '#fff',
        weight: 2,
        fillColor: getCategory(report.category).color,
        fillOpacity: 0.95,
      })
        .bindPopup(() => reportPopup(report), { maxWidth: 260 })
        .addTo(layer);
    });
  }, [reports, showReports]);

  // Fly to the selected black spot.
  useEffect(() => {
    const spot = spots.find((s) => s.name === selected);
    if (spot && Number.isFinite(spot.latitude)) map.current?.flyTo([spot.latitude, spot.longitude], 18, { duration: 0.8 });
  }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={container} className={className} role="region" aria-label="Campus safety map" />;
}
