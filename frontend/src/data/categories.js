// Incident categories accepted by the backend (validate-report.middleware.js).
// `color` (a CSS variable set per theme in index.css) is used for badges, chart bars and
// map markers; `icon` is a lucide-react icon component.
import { CircleQuestionMark, Footprints, Megaphone, Siren, TriangleAlert } from 'lucide-react';

export const CATEGORIES = [
  { value: 'HARASSMENT', label: 'Harassment', hint: 'Verbal, physical or online harassment', color: 'var(--cat-harassment)', icon: Megaphone },
  { value: 'STALKING', label: 'Stalking', hint: 'Being followed or watched repeatedly', color: 'var(--cat-stalking)', icon: Footprints },
  { value: 'UNSAFE_AREA', label: 'Unsafe area', hint: 'Dark, isolated or poorly guarded places', color: 'var(--cat-unsafe)', icon: TriangleAlert },
  { value: 'EMERGENCY', label: 'Emergency', hint: 'Something that needs help right now', color: 'var(--cat-emergency)', icon: Siren },
  { value: 'OTHER', label: 'Other', hint: 'Any other safety concern', color: 'var(--cat-other)', icon: CircleQuestionMark },
];

const BY_VALUE = Object.fromEntries(CATEGORIES.map((c) => [c.value, c]));

/** Look up a category by its API value, falling back to "Other". */
export function getCategory(value) {
  return BY_VALUE[value] ?? BY_VALUE.OTHER;
}
