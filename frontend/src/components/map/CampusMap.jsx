import { useId } from 'react';
import { CAMPUS_PLACES } from '../../data/campusPlaces.js';
import { getCategory } from '../../data/categories.js';
import { RISK } from '../../data/risk.js';
import { BOUNDARY_PATH, MAP_VIEWBOX, project, UNITS_PER_M } from '../../lib/campusGeo.js';
import { formatDateTime } from '../../lib/format.js';

/** Risk zone radius in metres: grows with the number of reports at a place. */
const zoneRadiusM = (count) => Math.min(120, 28 + count * 8);
const SCALE_M = 100;

/**
 * Minimal campus map drawn as SVG: the campus outline, place labels, risk
 * zones and one dot per report. Only the campus is shown; nothing outside
 * the boundary is drawn.
 *
 * @param {{
 *   reports: object[],
 *   spots: object[],
 *   showReports?: boolean,
 *   showZones?: boolean,
 *   selectedSpot?: string|null,
 *   onSelectSpot?: (name: string) => void,
 *   selectedReport?: string|null,
 *   onSelectReport?: (id: string) => void,
 *   className?: string,
 * }} props
 */
export default function CampusMap({
  reports,
  spots,
  showReports = true,
  showZones = true,
  selectedSpot,
  onSelectSpot,
  selectedReport,
  onSelectReport,
  className,
}) {
  const id = useId().replace(/:/g, '');
  const { x, y, width, height } = MAP_VIEWBOX;
  const activate = (fn) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fn();
    }
  };

  return (
    <svg
      viewBox={`${x} ${y} ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className={`sc-map ${className ?? ''}`}
      role="group"
      aria-label="Campus safety map"
    >
      <defs>
        <pattern id={`${id}-dots`} width="26" height="26" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.6" fill="rgb(255 255 255 / 0.08)" />
        </pattern>
        <clipPath id={`${id}-clip`}>
          <path d={BOUNDARY_PATH} />
        </clipPath>
      </defs>

      {/* Campus ground */}
      <path d={BOUNDARY_PATH} fill="rgb(255 255 255 / 0.025)" />
      <rect x={x} y={y} width={width} height={height} fill={`url(#${id}-dots)`} clipPath={`url(#${id}-clip)`} />
      <path d={BOUNDARY_PATH} fill="none" stroke="rgb(255 255 255 / 0.18)" strokeWidth="2" strokeLinejoin="round" />

      {/* Risk zones, clipped to the campus so nothing is drawn outside it */}
      <g clipPath={`url(#${id}-clip)`}>
        {showZones &&
          spots.map((spot) => {
            if (!Number.isFinite(spot.latitude) || !Number.isFinite(spot.longitude)) return null;
            const p = project(spot.latitude, spot.longitude);
            const r = zoneRadiusM(spot.count) * UNITS_PER_M;
            const { color, label } = RISK[spot.risk];
            const selected = spot.name === selectedSpot;
            return (
              <g
                key={spot.name}
                role="button"
                tabIndex={0}
                aria-label={`${spot.name}: ${label}, ${spot.count} reports`}
                aria-pressed={selected}
                className="cursor-pointer"
                onClick={() => onSelectSpot?.(spot.name)}
                onKeyDown={activate(() => onSelectSpot?.(spot.name))}
              >
                {selected && (
                  <circle cx={p.x} cy={p.y} r={r} fill={color} opacity="0.35" className="animate-sos-ring" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={r}
                  fill={color}
                  fillOpacity={spot.risk === 'high' ? 0.16 : 0.1}
                  stroke={color}
                  strokeOpacity={selected ? 0.9 : 0.45}
                  strokeWidth={selected ? 3 : 1.5}
                  strokeDasharray={spot.risk === 'low' ? '6 8' : undefined}
                />
              </g>
            );
          })}
      </g>

      {/* Places */}
      <g aria-hidden="true">
        {CAMPUS_PLACES.map((place) => {
          const p = project(place.latitude, place.longitude);
          return (
            <g key={place.id}>
              <rect x={p.x - 5} y={p.y - 5} width="10" height="10" rx="3" fill="#4a5275" />
              <text
                x={p.x}
                y={p.y + 32}
                textAnchor="middle"
                fontSize="21"
                fontWeight="500"
                fill="#8a93b4"
                stroke="#0e1120"
                strokeWidth="5"
                paintOrder="stroke"
              >
                {place.name}
              </text>
            </g>
          );
        })}
      </g>

      {/* Reports */}
      {showReports &&
        reports.map((report) => {
          const { latitude, longitude, name } = report.location ?? {};
          if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
          const p = project(latitude, longitude);
          const category = getCategory(report.category);
          const selected = report.id === selectedReport;
          const text = `${category.label} at ${name ?? 'an unknown place'}, ${formatDateTime(report.occurredAt ?? report.createdAt)}`;
          return (
            <circle
              key={report.id}
              cx={p.x}
              cy={p.y}
              r={selected ? 13 : 9}
              fill={category.color}
              stroke={selected ? '#fff' : '#0e1120'}
              strokeWidth={selected ? 4 : 3}
              role="button"
              tabIndex={0}
              aria-label={text}
              aria-pressed={selected}
              className="cursor-pointer transition-[r] duration-150"
              onClick={() => onSelectReport?.(report.id)}
              onKeyDown={activate(() => onSelectReport?.(report.id))}
            >
              <title>{text}</title>
            </circle>
          );
        })}

      {/* North arrow and scale */}
      <g aria-hidden="true" fill="#7c86a8" fontSize="20" fontWeight="600">
        <path d={`M${width + x - 36} ${y + 46} l10 -24 l10 24 l-10 -6 z`} fill="#7c86a8" />
        <text x={width + x - 26} y={y + 66} textAnchor="middle">
          N
        </text>
        <line
          x1={width + x - 30 - SCALE_M * UNITS_PER_M}
          x2={width + x - 30}
          y1={height + y - 26}
          y2={height + y - 26}
          stroke="#7c86a8"
          strokeWidth="2"
        />
        <text x={width + x - 30 - (SCALE_M * UNITS_PER_M) / 2} y={height + y - 34} textAnchor="middle">
          {SCALE_M} m
        </text>
      </g>
    </svg>
  );
}
