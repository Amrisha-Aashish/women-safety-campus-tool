import ReportForm from '../components/report/ReportForm.jsx';
import { useReportForm } from '../hooks/useReportForm.js';

/** Incident report page: the form, and the result once it's sent. */
export default function Report() {
  const form = useReportForm();
  return (
    <div className="mx-auto grid max-w-6xl items-start gap-5 lg:grid-cols-3">
      <ReportForm form={form} />
    </div>
  );
}
