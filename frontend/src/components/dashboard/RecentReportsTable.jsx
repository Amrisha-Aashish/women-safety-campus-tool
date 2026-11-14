import { Badge, DescriptionList, Table } from 'glassform';
import { getCategory } from '../../data/categories.js';
import { formatDateTime, timeAgo } from '../../lib/format.js';

const reporterOf = (r) => (r.isAnonymous ? r.reporterPseudonym || 'Anonymous' : 'Named reporter');

const COLUMNS = [
  {
    key: 'category',
    header: 'Category',
    sortable: true,
    searchValue: (r) => getCategory(r.category).label,
    cell: (value) => {
      const c = getCategory(value);
      return (
        <Badge tone={c.color} dot>
          {c.label}
        </Badge>
      );
    },
  },
  {
    key: 'description',
    header: 'Report',
    minWidth: 220,
    searchValue: (r) => `${r.description} ${r.location?.name ?? ''} ${reporterOf(r)}`,
    cell: (value, row) => (
      <div className="min-w-0 py-0.5">
        <p className="line-clamp-1 text-white">{value}</p>
        <p className="mt-0.5 truncate text-xs text-slate-400">
          {row.location?.name ?? 'Unknown place'} · <span className={row.isAnonymous ? 'italic' : ''}>{reporterOf(row)}</span>
        </p>
      </div>
    ),
  },
  { key: 'createdAt', header: 'Reported', sortable: true, format: (v) => timeAgo(v), wrap: false },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    cell: (v) => <Badge tone={v === 'RESOLVED' ? 'positive' : 'warning'}>{v === 'RESOLVED' ? 'Resolved' : 'Open'}</Badge>,
  },
];

/** Full details shown when a row is expanded. */
function details(r) {
  const { latitude, longitude, name } = r.location ?? {};
  return (
    <DescriptionList
      layout="grid"
      columns={3}
      size="sm"
      items={[
        { label: 'Description', value: r.description, span: 3 },
        { label: 'Place', value: name ?? '—' },
        { label: 'Coordinates', value: Number.isFinite(latitude) ? `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` : '—' },
        { label: 'Happened', value: formatDateTime(r.occurredAt ?? r.createdAt) },
        { label: 'Reporter', value: reporterOf(r) },
        { label: 'Reported', value: formatDateTime(r.createdAt) },
        { label: 'Report ID', value: <code className="text-xs">{r.id}</code> },
      ]}
    />
  );
}

/**
 * Searchable, sortable list of the latest reports. Click a row for the full report.
 * @param {{ reports: object[], loading?: boolean }} props
 */
export default function RecentReportsTable({ reports, loading }) {
  return (
    <Table
      radius={22}
      className="lg:col-span-2"
      title="Recent reports"
      description="Newest first. Click a row to see the full report."
      columns={COLUMNS}
      data={reports}
      searchable
      searchPlaceholder="Search reports"
      defaultSort={{ key: 'createdAt', direction: 'desc' }}
      pageSize={8}
      density="compact"
      renderExpanded={details}
      expandOnRowClick
      singleExpand
      loading={loading}
      empty="No reports yet. Submitted reports appear here within seconds."
    />
  );
}
