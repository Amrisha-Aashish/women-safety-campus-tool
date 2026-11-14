import { Card, GlassButton, TextField, toast } from 'glassform';
import Icon from '../Icon.jsx';
import AnonymousToggle from './AnonymousToggle.jsx';
import CategoryField from './CategoryField.jsx';
import LocationFields from './LocationFields.jsx';

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
          form.submit().then((ok) => {
            if (ok) toast.success('Report submitted', { description: 'It is now on the safety dashboard.' });
          });
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

        <hr className="border-white/10" />
        <LocationFields values={values} set={set} errors={errors} />

        <hr className="border-white/10" />
        <AnonymousToggle checked={values.isAnonymous} onChange={(isAnonymous) => set({ isAnonymous })} />

        {form.serverError && (
          <div role="alert" className="flex items-start gap-3 rounded-2xl bg-red-500/10 p-4 text-sm text-red-200 ring-1 ring-red-500/30">
            <Icon name="alert-circle" size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Your report wasn't sent</p>
              <p className="mt-0.5">{form.serverError} Your answers are still here, so you can try again.</p>
            </div>
          </div>
        )}
        {Object.keys(errors).length > 0 && (
          <p role="alert" className="text-sm font-medium text-red-300">
            Please fix the highlighted fields.
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-neutral-400">Fields marked * are required.</p>
          <GlassButton type="submit" prominent size="lg" state={form.status === 'sending' ? 'loading' : 'idle'}>
            <Icon name="send" />
            Submit report
          </GlassButton>
        </div>
      </form>
    </Card>
  );
}
