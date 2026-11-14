import { Badge, GlassSurface } from 'glassform';
import { getCategory } from '../../data/categories.js';
import { formatDateTime } from '../../lib/format.js';
import Icon from '../Icon.jsx';

/**
 * Glass card over the map with the report that was clicked.
 * @param {{ report: object, onClose: () => void }} props
 */
export default function ReportDetail({ report, onClose }) {
  const category = getCategory(report.category);
  return (
    <GlassSurface radius={20} tint="rgb(28 28 28 / 0.9)" className="dark pointer-events-auto w-full animate-fade-up p-4 text-left text-neutral-100 sm:w-80">
      <div className="flex items-start justify-between gap-3">
        <Badge tone={category.color} dot>
          {category.label}
        </Badge>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close report"
          className="-m-1 grid size-7 cursor-pointer place-items-center rounded-full text-neutral-400 hover:bg-white/10 hover:text-white"
        >
          <Icon name="x" size={16} />
        </button>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-neutral-100">{report.description}</p>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-neutral-400">
        <Icon name="map-pin" />
        {report.location?.name ?? 'Unknown place'}
      </p>
      <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400">
        <Icon name="clock" />
        {formatDateTime(report.occurredAt ?? report.createdAt)}
      </p>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-3 text-xs">
        <span className={report.isAnonymous ? 'text-neutral-400 italic' : 'text-neutral-300'}>
          {report.isAnonymous ? report.reporterPseudonym || 'Anonymous' : 'Named reporter'}
        </span>
        <Badge tone={report.status === 'RESOLVED' ? 'positive' : 'warning'} size="sm">
          {report.status === 'RESOLVED' ? 'Resolved' : 'Open'}
        </Badge>
      </div>
    </GlassSurface>
  );
}
