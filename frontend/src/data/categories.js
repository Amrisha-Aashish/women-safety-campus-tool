// Incident categories accepted by the backend (validate-report.middleware.js).
// `color` is used for badges, chart bars and map markers; `icon` is an <Icon> name.
export const CATEGORIES = [
  { value: 'HARASSMENT', label: 'Harassment', hint: 'Verbal, physical or online harassment', color: '#db2777', icon: 'megaphone' },
  { value: 'STALKING', label: 'Stalking', hint: 'Being followed or watched repeatedly', color: '#7c3aed', icon: 'footprints' },
  { value: 'UNSAFE_AREA', label: 'Unsafe area', hint: 'Dark, isolated or poorly guarded places', color: '#d97706', icon: 'alert-triangle' },
  { value: 'EMERGENCY', label: 'Emergency', hint: 'Something that needs help right now', color: '#dc2626', icon: 'siren' },
  { value: 'OTHER', label: 'Other', hint: 'Any other safety concern', color: '#0891b2', icon: 'help' },
];

const BY_VALUE = Object.fromEntries(CATEGORIES.map((c) => [c.value, c]));

/** Look up a category by its API value, falling back to "Other". */
export function getCategory(value) {
  return BY_VALUE[value] ?? BY_VALUE.OTHER;
}
