import { GlassButton, Card } from 'glassform';
import { Link } from 'react-router';
import Icon from '../Icon.jsx';

const PROMISES = [
  'Anonymous reports carry a pseudonym, never your name or roll number.',
  'Your location is only read when you press a location button.',
  'No tracking, no ads. Reports exist to make the campus safer.',
];

/** Dark band with the privacy promise and a final call to action. */
export default function PrivacyBand() {
  return (
    <section id="privacy" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="dark relative isolate overflow-hidden rounded-[32px] bg-ink-900 px-6 py-12 text-white ring-1 ring-white/10 sm:px-12 sm:py-16">
          <div aria-hidden="true" className="absolute -top-24 -right-24 -z-10 size-96 rounded-full bg-brand-600/40 blur-3xl" />
          <div aria-hidden="true" className="absolute -bottom-32 left-1/3 -z-10 size-80 rounded-full bg-rose-500/20 blur-3xl" />
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="grid size-11 place-items-center rounded-xl bg-white/10 text-brand-200">
                <Icon name="lock" size={20} />
              </span>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">Speak up without being exposed.</h2>
              <ul className="mt-6 space-y-3 text-neutral-300">
                {PROMISES.map((text) => (
                  <li key={text} className="flex gap-3">
                    <Icon name="check" size={18} className="mt-0.5 shrink-0 text-emerald-300" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            {/* Glass over the glowing band: the call to action is a control, so it gets glass. */}
            <Card material="glass" radius={24} title="Seen something that felt unsafe?" subtitle="It helps even if it seems small. Patterns start with one report.">
              <div className="mt-2 flex flex-wrap gap-3">
                <GlassButton as={Link} to="/report" prominent>
                  Report an incident
                  <Icon name="arrow-right" />
                </GlassButton>
                <GlassButton href="tel:112">
                  <Icon name="phone" />
                  Call 112
                </GlassButton>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
