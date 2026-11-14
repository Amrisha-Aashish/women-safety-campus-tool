import { GlassBadge } from 'glassform';
import { useApiHealth } from '../../hooks/useApiHealth.js';

const STATES = {
  checking: { tone: 'neutral', label: 'Checking server…' },
  online: { tone: 'positive', label: 'Server online' },
  offline: { tone: 'negative', label: 'Server offline' },
};

/** Live badge showing whether the backend answers GET /api/health. */
export default function ApiStatus({ className }) {
  const status = useApiHealth();
  const { tone, label } = STATES[status];
  return (
    <GlassBadge tone={tone} dot pulse={status === 'online'} className={className} title="GET /api/health">
      {label}
    </GlassBadge>
  );
}
