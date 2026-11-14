import { Switch } from 'glassform';
import { EyeOff, User } from 'lucide-react';
import { useId } from 'react';

/** "Report anonymously" switch with an explanation of what each choice means. */
export default function AnonymousToggle({ checked, onChange }) {
  const id = useId();
  return (
    <div className={`flex items-start gap-4 rounded-2xl p-4 ring-1 transition-colors ${checked ? 'bg-brand-500/15 ring-brand-400/30' : 'bg-neutral-50/5 ring-neutral-50/10'}`}>
      <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${checked ? 'bg-brand-600 text-white' : 'bg-neutral-50/5 text-neutral-300 ring-1 ring-neutral-50/10'}`}>
        {checked ? <EyeOff size={20} /> : <User size={20} />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p id={`${id}-label`} className="font-semibold text-neutral-50">
            Report anonymously
          </p>
          <Switch checked={checked} onChange={onChange} aria-labelledby={`${id}-label`} aria-describedby={`${id}-desc`} />
        </div>
        <p id={`${id}-desc`} className="mt-1 text-sm text-neutral-300">
          {checked
            ? 'Your identity is hidden. The report is shown with a random pseudonym such as “QuietLotus4821”.'
            : 'The report is linked to you, so the safety team can follow up with you.'}
        </p>
      </div>
    </div>
  );
}
