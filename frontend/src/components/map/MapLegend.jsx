import { CATEGORIES } from '../../data/categories.js';
import { RISK } from '../../data/risk.js';

/**
 * One-line legend under the map: how many reports and places are shown, report colours and risk zone levels.
 * @param {{ reports: number, places: number }} props
 */
export default function MapLegend({ reports, places }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 px-4 py-3 text-xs text-neutral-400">
      <span className="font-semibold text-neutral-200">
        {reports} reports · {places} places
      </span>
      <span className="hidden h-4 w-px bg-white/10 sm:block" aria-hidden="true" />
      {CATEGORIES.map((c) => (
        <span key={c.value} className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full" style={{ background: c.color }} />
          {c.label}
        </span>
      ))}
      <span className="hidden h-4 w-px bg-white/10 sm:block" aria-hidden="true" />
      {Object.entries(RISK).map(([key, r]) => (
        <span key={key} className="flex items-center gap-1.5">
          <span
            className="size-3 rounded-full border"
            style={{ borderColor: r.color, background: `${r.color}26`, borderStyle: key === 'low' ? 'dashed' : 'solid' }}
          />
          {r.label}
        </span>
      ))}
    </div>
  );
}
