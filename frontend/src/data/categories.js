// Incident categories accepted by the backend (validate-report.middleware.js).
// `color` is used for badges, chart bars and map markers; `icon` is an <Icon> name.
export const CATEGORIES = [
  { value: 'HARASSMENT', label: 'Harassment', hint: 'Verbal, physical or online harassment', color: '#f472b6', icon: 'megaphone' },
  { value: 'STALKING', label: 'Stalking', hint: 'Being followed or watched repeatedly', color: '#a78bfa', icon: 'footprints' },
  { value: 'UNSAFE_AREA', label: 'Unsafe area', hint: 'Dark, isolated or poorly guarded places', color: '#fbbf24', icon: 'alert-triangle' },
  { value: 'EMERGENCY', label: 'Emergency', hint: 'Something that needs help right now', color: '#f87171', icon: 'siren' },
  { value: 'OTHER', label: 'Other', hint: 'Any other safety concern', color: '#22d3ee', icon: 'help' },
];

const BY_VALUE = Object.fromEntries(CATEGORIES.map((c) => [c.value, c]));

/** Look up a category by its API value, falling back to "Other". */
export function getCategory(value) {
  return BY_VALUE[value] ?? BY_VALUE.OTHER;
}
