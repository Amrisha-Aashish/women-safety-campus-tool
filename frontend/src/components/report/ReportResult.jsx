import { Button, Card, DescriptionList, GlassButton } from 'glassform';
import { Link } from 'react-router';
import { getCategory } from '../../data/categories.js';
import Icon from '../Icon.jsx';

/**
 * Confirmation shown after POST /api/reports succeeds.
 * @param {{ report: object, onReset: () => void }} props  `report` is the saved report returned by the API
 */
export default function ReportResult({ report, onReset }) {
  const category = getCategory(report.category);
  return (
    <Card radius={24} padding="lg" className="animate-fade-up lg:col-span-2">
      <div className="flex flex-col items-center text-center">
        <span className="grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
          <Icon name="check" size={32} strokeWidth={2.6} />
        </span>
        <h2 className="mt-5 text-2xl font-extrabold">Report submitted</h2>
        <p className="mt-2 max-w-md text-slate-600">
          Thank you for speaking up. Your report is now on the safety dashboard and helps find unsafe places before
          someone else gets hurt.
        </p>
        {report.isAnonymous && report.reporterPseudonym && (
          <p className="mt-5 rounded-2xl bg-brand-50 px-5 py-3 text-sm text-brand-900 ring-1 ring-brand-200">
            You reported anonymously as <b className="font-mono text-base">{report.reporterPseudonym}</b>
          </p>
        )}
      </div>

      <DescriptionList
        className="mx-auto mt-8 w-full max-w-md"
        items={[
          { label: 'Category', value: category.label },
          { label: 'Place', value: report.location?.name },
          { label: 'Status', value: report.status === 'RESOLVED' ? 'Resolved' : 'Open' },
          { label: 'Reference', value: <code className="text-xs">{report.id?.slice(0, 8)}</code> },
        ]}
      />

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={onReset}>
          <Icon name="file-text" />
          Report something else
        </Button>
        <GlassButton as={Link} to="/dashboard" prominent>
          View dashboard
          <Icon name="arrow-right" />
        </GlassButton>
      </div>
    </Card>
  );
}
