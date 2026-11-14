import PageToolbar from '../components/layout/PageToolbar.jsx';
import ReportAside from '../components/report/ReportAside.jsx';
import ReportForm from '../components/report/ReportForm.jsx';
import ReportResult from '../components/report/ReportResult.jsx';
import { useReportForm } from '../hooks/useReportForm.js';

/** Incident report page: the form (or the result once it's sent) beside privacy notes. */
export default function Report() {
  const form = useReportForm();
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageToolbar />
      <div className="grid items-start gap-5 lg:grid-cols-3">
        {form.status === 'success' ? <ReportResult report={form.result} onReset={form.reset} /> : <ReportForm form={form} />}
        <ReportAside />
      </div>
    </div>
  );
}
