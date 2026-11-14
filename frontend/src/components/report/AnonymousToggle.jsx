import { Switch } from 'glassform';
import { useId } from 'react';
import Icon from '../Icon.jsx';

/** "Report anonymously" switch with an explanation of what each choice means. */
export default function AnonymousToggle({ checked, onChange }) {
  const id = useId();
  return (
    <div className={`flex items-start gap-4 rounded-2xl p-4 ring-1 transition-colors ${checked ? 'bg-brand-50 ring-brand-200' : 'bg-slate-50 ring-slate-200'}`}>
      <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${checked ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'}`}>
        <Icon name={checked ? 'eye-off' : 'user'} size={20} />
      </span>
      <div className="min-w-0 flex-1">
        <p id={`${id}-label`} className="font-semibold text-slate-900">
          Report anonymously
        </p>
        <p id={`${id}-desc`} className="mt-0.5 text-sm text-slate-600">
          {checked
            ? 'Your identity is hidden. The report is shown with a random pseudonym such as “QuietLotus4821”.'
            : 'The report is linked to you, so the safety team can follow up with you.'}
        </p>
      </div>
      <Switch checked={checked} onChange={onChange} aria-labelledby={`${id}-label`} aria-describedby={`${id}-desc`} className="mt-1" />
    </div>
  );
}
