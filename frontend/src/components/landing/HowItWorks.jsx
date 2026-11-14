import { Card } from 'glassform';
import { STEPS } from '../../data/landingContent.js';
import SectionHeading from './SectionHeading.jsx';

/** Three-step explanation: report → analyse → prevent. */
export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="How it works" title="From one report to a safer campus">
          Every report adds to a picture of campus safety that nobody could see before.
        </SectionHeading>

        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex">
              <Card radius={22} className="w-full" eyebrow={`Step 0${i + 1}`} title={step.title}>
                <p className="text-sm leading-relaxed text-slate-300">{step.text}</p>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
