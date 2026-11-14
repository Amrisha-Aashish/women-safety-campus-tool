import { Card, Checkbox } from 'glassform';
import { CATEGORIES } from '../../data/categories.js';

/**
 * One checkbox per category, with counts, to show or hide reports on the map.
 * @param {{ selected: Set<string>, onChange: (next: Set<string>) => void, counts: Record<string, number> }} props
 */
export default function CategoryFilter({ selected, onChange, counts }) {
  const toggle = (value, on) => {
    const next = new Set(selected);
    if (on) next.add(value);
    else next.delete(value);
    onChange(next);
  };
  const all = selected.size === CATEGORIES.length;

  return (
    <Card radius={22} title="Categories" subtitle="Show or hide reports by type" padding="sm" className="p-5">
      <div className="flex flex-col gap-2.5">
        <Checkbox
          label="All categories"
          checked={all}
          indeterminate={!all && selected.size > 0}
          onChange={(on) => onChange(new Set(on ? CATEGORIES.map((c) => c.value) : []))}
        />
        <hr className="border-white/10" />
        {CATEGORIES.map((c) => (
          <div key={c.value} className="flex items-center justify-between gap-2">
            <Checkbox
              label={c.label}
              checked={selected.has(c.value)}
              onChange={(on) => toggle(c.value, on)}
              colors={{ accent: c.color }}
            />
            <span className="text-sm text-slate-400 tabular-nums">{counts[c.value] ?? 0}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
