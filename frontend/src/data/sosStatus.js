// SOS alert statuses accepted by the backend (SOSStatus in backend/prisma/schema.prisma).
// `tone` is a glassform badge tone; `icon` is an <Icon> name.
export const SOS_STATUSES = [
  { value: 'ACTIVE', label: 'Active', hint: 'Waiting for security to respond', tone: 'negative', icon: 'siren' },
  { value: 'ACKNOWLEDGED', label: 'Acknowledged', hint: 'Security is on the way', tone: 'warning', icon: 'clock' },
  { value: 'RESOLVED', label: 'Resolved', hint: 'The student is safe', tone: 'positive', icon: 'check-circle' },
];

const BY_VALUE = Object.fromEntries(SOS_STATUSES.map((s) => [s.value, s]));

/** Look up a status by its API value, falling back to "Active" so nothing urgent is hidden. */
export function getSosStatus(value) {
  return BY_VALUE[value] ?? BY_VALUE.ACTIVE;
}
