import { Card } from 'glassform';
import Icon from '../Icon.jsx';

const TIPS = [
  'Move towards a lit, busy place: a gate, the canteen or a hostel entrance.',
  'Call someone you trust and stay on the line.',
  'Keep this page open so your location can be shared again.',
];

/** Short advice for while help is coming. */
export default function SafetyTips() {
  return (
    <Card radius={22} title="While you wait" padding="sm" className="p-5">
      <ul className="space-y-2.5 text-sm text-slate-300">
        {TIPS.map((tip) => (
          <li key={tip} className="flex gap-2.5">
            <Icon name="check" size={16} className="mt-0.5 shrink-0 text-brand-300" />
            {tip}
          </li>
        ))}
      </ul>
    </Card>
  );
}
