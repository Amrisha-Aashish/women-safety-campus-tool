// Incident categories accepted by the backend (validate-report.middleware.js).
// `color` (a CSS variable set per theme in index.css) is used for badges, chart bars and
// map markers; `icon` is an <Icon> name.
export const CATEGORIES = [
  { value: 'HARASSMENT', label: 'Harassment', hint: 'Verbal, physical or online harassment', color: 'var(--cat-harassment)', icon: 'megaphone' },
  { value: 'STALKING', label: 'Stalking', hint: 'Being followed or watched repeatedly', color: 'var(--cat-stalking)', icon: 'footprints' },
  { value: 'UNSAFE_AREA', label: 'Unsafe area', hint: 'Dark, isolated or poorly guarded places', color: 'var(--cat-unsafe)', icon: 'alert-triangle' },
  { value: 'EMERGENCY', label: 'Emergency', hint: 'Something that needs help right now', color: 'var(--cat-emergency)', icon: 'siren' },
  { value: 'OTHER', label: 'Other', hint: 'Any other safety concern', color: 'var(--cat-other)', icon: 'help' },
];

const BY_VALUE = Object.fromEntries(CATEGORIES.map((c) => [c.value, c]));

/** Look up a category by its API value, falling back to "Other". */
export function getCategory(value) {
  return BY_VALUE[value] ?? BY_VALUE.OTHER;
}
