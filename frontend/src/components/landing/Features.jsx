import { Badge, Card } from 'glassform';
import { FEATURES } from '../../data/landingContent.js';
import Icon from '../Icon.jsx';
import SectionHeading from './SectionHeading.jsx';

/** Grid of the platform's main features. */
export default function Features() {
  return (
    <section id="features" className="scroll-mt-24 border-y border-neutral-50/5 bg-neutral-900/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Features" title="Everything a campus needs to stay ahead">
          Built for students who need to speak up safely, and for the people responsible for acting on it.
        </SectionHeading>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon, title, text, soon }) => (
            <li key={title} className="flex">
              <Card
                radius={22}
                padding="sm"
                className="w-full p-5"
                leading={
                  <span className="grid size-10 place-items-center rounded-xl bg-brand-500/15 text-brand-300">
                    <Icon name={icon} size={20} />
                  </span>
                }
                badge={soon && <Badge tone="warning">Coming soon</Badge>}
              >
                <h3 className="mt-1 text-base font-bold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-300">{text}</p>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
