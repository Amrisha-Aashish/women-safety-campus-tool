import { Select } from 'glassform';
import { CATEGORIES } from '../../data/categories.js';

const OPTIONS = CATEGORIES.map((c) => ({
  value: c.value,
  label: c.label,
  description: c.hint,
  icon: (
    <span className="grid size-7 place-items-center rounded-lg" style={{ background: `color-mix(in srgb, ${c.color} 18%, transparent)`, color: c.color }}>
      <c.icon size={16} />
    </span>
  ),
}));

/** Category dropdown with an icon and hint for each option. */
export default function CategoryField({ value, onChange, error }) {
  return (
    <Select
      label="Category"
      required
      placeholder="What kind of concern is it?"
      options={OPTIONS}
      value={value}
      onChange={onChange}
      error={error}
      name="category"
    />
  );
}
