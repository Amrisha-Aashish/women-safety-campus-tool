import { Card, TextField } from 'glassform';
import CategoryField from './CategoryField.jsx';

/**
 * The incident report form. State lives in useReportForm (passed in as `form`).
 * @param {{ form: ReturnType<typeof import('../../hooks/useReportForm.js').useReportForm> }} props
 */
export default function ReportForm({ form }) {
  const { values, set, errors } = form;

  return (
    <Card radius={24} padding="lg" className="lg:col-span-2">
      <form
        noValidate
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          form.submit();
        }}
      >
        <fieldset className="flex flex-col gap-5">
          <legend className="mb-4 font-display text-lg font-bold">What happened?</legend>
          <CategoryField value={values.category} onChange={(category) => set({ category })} error={errors.category} />
          <TextField
            label="Description"
            required
            multiline
            rows={5}
            maxLength={2000}
            showCount
            placeholder="Describe what happened or what feels unsafe. Include the time if it was not just now."
            value={values.description}
            onChange={(description) => set({ description })}
            error={errors.description}
            description="Don't include names of other people unless it's necessary."
          />
        </fieldset>
      </form>
    </Card>
  );
}
