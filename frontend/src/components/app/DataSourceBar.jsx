import { GlassBadge, GlassButton, GlassSegmented } from 'glassform';
import { formatTime } from '../../lib/format.js';
import Icon from '../Icon.jsx';
import PageToolbar from '../layout/PageToolbar.jsx';

const SOURCES = [
  { value: 'live', label: 'Live' },
  { value: 'sample', label: 'Sample' },
];

/**
 * Toolbar for pages that show reports (dashboard, map): Live / Sample switch,
 * refresh and SOS. A warning appears only when the server can't be reached,
 * in which case sample data is shown instead.
 *
 * @param {{ source: 'live'|'sample', onSourceChange: (s) => void, status: string, updatedAt: Date|null, onRefresh: () => void }} props
 */
export default function DataSourceBar({ source, onSourceChange, status, updatedAt, onRefresh }) {
  return (
    <PageToolbar
      actions={
        <GlassButton
          size="sm"
          onClick={onRefresh}
          aria-label="Refresh reports"
          title={updatedAt ? `Updated ${formatTime(updatedAt)}` : 'Refresh reports'}
          className="w-9 px-0"
        >
          <Icon name="refresh" />
        </GlassButton>
      }
    >
      <GlassSegmented options={SOURCES} value={source} onChange={onSourceChange} aria-label="Data source" />
      {status === 'offline' && (
        <GlassBadge tone="warning" dot>
          Server unreachable, showing sample data
        </GlassBadge>
      )}
    </PageToolbar>
  );
}
