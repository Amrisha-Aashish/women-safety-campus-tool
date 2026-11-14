import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import { CAMPUS_CENTER } from '../../data/campusPlaces.js';
import { getCategory } from '../../data/categories.js';
import { formatDateTime } from '../../lib/format.js';

// Standard OpenStreetMap tiles: free with attribution, no API key.
const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/** Popup content built from DOM nodes (textContent), so report text is never parsed as HTML. */
function reportPopup(report) {
  const category = getCategory(report.category);
  const root = document.createElement('div');
  root.className = 'sc-popup';
  const tag = document.createElement('span');
  tag.className = 'sc-popup-tag';
  tag.style.color = category.color;
  tag.textContent = category.label;
  const text = document.createElement('p');
  text.textContent = report.description;
  const meta = document.createElement('small');
  meta.textContent = `${report.location?.name ?? 'Unknown place'} · ${formatDateTime(report.occurredAt ?? report.createdAt)}`;
  root.append(tag, text, meta);
  return root;
}

/**
 * Leaflet map of the campus with one dot per report, coloured by category.
 * Leaflet is used only to draw the map; every control around it is glassform.
 *
 * @param {{ reports: object[], className?: string }} props
 */
export default function CampusMap({ reports, className }) {
  const container = useRef(null);
  const map = useRef(null);
  const reportLayer = useRef(null);

  // Create the map once.
  useEffect(() => {
    const instance = L.map(container.current, {
      center: [CAMPUS_CENTER.latitude, CAMPUS_CENTER.longitude],
      zoom: 17,
      zoomControl: false,
      attributionControl: true,
    });
    L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(instance);
    L.control.zoom({ position: 'bottomright' }).addTo(instance);
    reportLayer.current = L.layerGroup().addTo(instance);
    map.current = instance;
    return () => {
      instance.remove();
      map.current = null;
    };
  }, []);

  // Redraw report markers when the reports change.
  useEffect(() => {
    const layer = reportLayer.current;
    if (!layer) return;
    layer.clearLayers();
    reports.forEach((report) => {
      const { latitude, longitude } = report.location ?? {};
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
      const { color } = getCategory(report.category);
      L.circleMarker([latitude, longitude], {
        radius: 7,
        color: '#fff',
        weight: 2,
        fillColor: color,
        fillOpacity: 0.95,
      })
        .bindPopup(() => reportPopup(report), { maxWidth: 260 })
        .addTo(layer);
    });
  }, [reports]);

  return <div ref={container} className={className} role="region" aria-label="Campus safety map" />;
}
