import { BarList, Card, Progress } from 'glassform';
import Icon from '../Icon.jsx';

/**
 * Reports per category as ranked bars, with the open / resolved split under them.
 * @param {{ categories: ReturnType<typeof import('../../lib/reportStats.js').byCategory>, open: number, resolved: number }} props
 */
export default function CategoryCard({ categories, open, resolved }) {
  const items = categories.map((c) => ({
    id: c.value,
    label: c.label,
    value: c.count,
    tone: c.color,
    icon: <Icon name={c.icon} style={{ color: c.color }} />,
  }));
  const total = open + resolved;

  return (
    <Card radius={22} title="Reports by category" subtitle="What students are reporting" className="h-full">
      <BarList items={items} showShare barOpacity={18} />
      <div className="mt-6 border-t border-slate-100 pt-5">
        <Progress
          label="Open vs resolved"
          size="md"
          segments={
            total
              ? [
                  { value: (open / total) * 100, tone: 'warning', label: `Open ${open}` },
                  { value: (resolved / total) * 100, tone: 'positive', label: `Resolved ${resolved}` },
                ]
              : [{ value: 0 }]
          }
        />
        <div className="mt-3 flex gap-5 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-(--lg-warning)" /> Open <b className="text-slate-900">{open}</b>
          </span>
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-(--lg-positive)" /> Resolved <b className="text-slate-900">{resolved}</b>
          </span>
        </div>
      </div>
    </Card>
  );
}
