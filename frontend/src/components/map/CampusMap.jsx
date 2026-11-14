import { useId } from 'react';
import { CAMPUS_PLACES } from '../../data/campusPlaces.js';
import { getCategory } from '../../data/categories.js';
import { RISK } from '../../data/risk.js';
import { BOUNDARY_PATH, CAMPUS_TILES, MAP_VIEWBOX, project, STREET_TILES, TILE_ZOOM, UNITS_PER_M } from '../../lib/campusGeo.js';
import { formatDateTime } from '../../lib/format.js';

/** Risk zone radius in metres: grows with the number of reports at a place. */
const zoneRadiusM = (count) => Math.min(70, 18 + count * 5);
const SCALE_M = 100;
/** The page's foreground colour at `pct`% (white-ish on dark, black-ish on light). */
const INK = (pct) => `color-mix(in srgb, var(--color-neutral-50) ${pct}%, transparent)`;

/**
 * Campus map: OpenStreetMap street tiles cut to the campus outline,
 * with place labels, risk zones and one dot per report drawn on top as SVG.
 * Only the campus is shown; nothing outside the boundary is drawn.
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
          <circle cx="2" cy="2" r="1.6" style={{ fill: INK(8) }} />
        </pattern>
        <clipPath id={`${id}-clip`}>
          <path d={BOUNDARY_PATH} />
        </clipPath>
      </defs>

      {/* Campus ground: a dot grid while tiles load (or if they can't), then the map tiles, slightly dimmed so dots stand out */}
      <path d={BOUNDARY_PATH} style={{ fill: INK(2.5) }} />
      <rect x={x} y={y} width={width} height={height} fill={`url(#${id}-dots)`} clipPath={`url(#${id}-clip)`} />
      <g clipPath={`url(#${id}-clip)`} aria-hidden="true">
        {CAMPUS_TILES.map((t) => (
          <image
            key={t.key}
            href={STREET_TILES.url(t.tx, t.ty, TILE_ZOOM)}
            x={t.x}
            y={t.y}
            // A hair of overlap hides seams between tiles.
            width={t.size + 0.6}
            height={t.size + 0.6}
            preserveAspectRatio="none"
          />
        ))}
        <rect x={x} y={y} width={width} height={height} fill="#0a0a0a" opacity="0.12" />
      </g>
      <path d={BOUNDARY_PATH} fill="none" strokeWidth="2.5" strokeLinejoin="round" style={{ stroke: INK(70) }} />

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
                  <circle cx={p.x} cy={p.y} r={r} opacity="0.35" className="animate-sos-ring" style={{ fill: color, transformBox: 'fill-box', transformOrigin: 'center' }} />
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={r}
                  fillOpacity={spot.risk === 'high' ? 0.26 : 0.18}
                  style={{ fill: color, stroke: color }}
                  strokeOpacity={selected ? 1 : 0.8}
                  strokeWidth={selected ? 3.5 : 2}
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
              <circle cx={p.x} cy={p.y} r="5" fill="#fff" stroke="#0a0a0a" strokeWidth="2" />
              <text
                x={p.x}
                y={p.y + 32}
                textAnchor="middle"
                fontSize="21"
                fontWeight="500"
                fill="#171717"
                stroke="#fff"
                strokeOpacity="0.85"
                strokeWidth="6"
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
              style={{ fill: category.color }}
              stroke={selected ? '#fff' : '#0a0a0a'}
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

      <text x={x + 8} y={height + y - 10} fontSize="15" style={{ fill: 'var(--color-neutral-400)' }}>
        {STREET_TILES.attribution}
      </text>

      {/* North arrow and scale */}
      <g aria-hidden="true" fontSize="20" fontWeight="600" style={{ fill: 'var(--color-neutral-300)' }}>
        <path d={`M${width + x - 36} ${y + 46} l10 -24 l10 24 l-10 -6 z`} />
        <text x={width + x - 26} y={y + 66} textAnchor="middle">
          N
        </text>
        <line
          x1={width + x - 30 - SCALE_M * UNITS_PER_M}
          x2={width + x - 30}
          y1={height + y - 26}
          y2={height + y - 26}
          style={{ stroke: 'var(--color-neutral-300)' }}
          strokeWidth="2"
        />
        <text x={width + x - 30 - (SCALE_M * UNITS_PER_M) / 2} y={height + y - 34} textAnchor="middle">
          {SCALE_M} m
        </text>
      </g>
    </svg>
  );
}
