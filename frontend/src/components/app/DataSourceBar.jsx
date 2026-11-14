import { GlassBadge, GlassButton, GlassSegmented } from 'glassform';
import { formatTime } from '../../lib/format.js';
import Icon from '../Icon.jsx';

const SOURCES = [
  { value: 'live', label: 'Live' },
  { value: 'sample', label: 'Sample' },
];

const STATUS = {
  loading: { tone: 'neutral', text: 'Loading reports…' },
  live: { tone: 'positive', text: 'Live from /api/reports' },
  offline: { tone: 'warning', text: 'Server unreachable, showing sample data' },
  sample: { tone: 'info', text: 'Showing sample data' },
};

/**
 * Live / Sample switch plus the data status, shared by the dashboard and map.
 * Sample data keeps demos meaningful while the backend's store is empty.
 *
 * @param {{ source: 'live'|'sample', onSourceChange: (s) => void, status: string, updatedAt: Date|null, onRefresh: () => void }} props
 */
export default function DataSourceBar({ source, onSourceChange, status, updatedAt, onRefresh }) {
  const { tone, text } = STATUS[status] ?? STATUS.loading;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <GlassSegmented options={SOURCES} value={source} onChange={onSourceChange} aria-label="Data source" />
      <GlassBadge tone={tone} dot pulse={status === 'live'}>
        {text}
      </GlassBadge>
      {updatedAt && <span className="text-xs text-slate-400">Updated {formatTime(updatedAt)}</span>}
      <GlassButton size="sm" onClick={onRefresh} aria-label="Refresh reports" className="ml-auto w-9 px-0">
        <Icon name="refresh" />
      </GlassButton>
    </div>
  );
}
