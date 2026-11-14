import { GlassSurface } from 'glassform';
import { CATEGORIES } from '../../data/categories.js';
import { RISK } from '../../data/risk.js';

/** Glass legend floating over the bottom-left of the map. */
export default function MapLegend() {
  return (
    <GlassSurface radius={18} tint="rgb(13 16 32 / 0.75)" className="pointer-events-auto px-3.5 py-3 text-xs">
      <p className="mb-1.5 font-semibold text-slate-200">Reports</p>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
        {CATEGORIES.map((c) => (
          <li key={c.value} className="flex items-center gap-1.5 text-slate-300">
            <span className="size-2.5 rounded-full ring-2 ring-ink-900" style={{ background: c.color }} />
            {c.label}
          </li>
        ))}
      </ul>
      <p className="mt-3 mb-1.5 font-semibold text-slate-200">Risk zones</p>
      <ul className="flex flex-wrap gap-x-3 gap-y-1">
        {Object.entries(RISK).map(([key, r]) => (
          <li key={key} className="flex items-center gap-1.5 text-slate-300">
            <span className="size-3 rounded-full border-2" style={{ borderColor: r.color, background: `${r.color}33` }} />
            {r.label.replace(' risk', '')}
          </li>
        ))}
      </ul>
    </GlassSurface>
  );
}
