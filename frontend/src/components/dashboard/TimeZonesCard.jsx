import { Badge, Card } from 'glassform';
import { formatHour } from '../../lib/format.js';

const AXIS = [0, 6, 12, 18, 23];

/**
 * "Red time zones": reports per hour of the day as a column chart, plus the
 * five time bands with the ones holding an outsized share marked red.
 * @param {{ hours: number[], bands: ReturnType<typeof import('../../lib/reportStats.js').redTimeZones> }} props
 */
export default function TimeZonesCard({ hours, bands }) {
  const max = Math.max(1, ...hours);
  const redHours = new Set(bands.filter((b) => b.red).flatMap((b) => Array.from({ length: b.to - b.from }, (_, i) => b.from + i)));
  const peak = hours.indexOf(Math.max(...hours));

  return (
    <Card
      radius={22}
      title="Red time zones"
      subtitle="When incidents happen, by hour of the day"
      className="h-full lg:col-span-2"
      badge={hours.some(Boolean) && <Badge tone="negative">Peak {formatHour(peak)}</Badge>}
    >
      <figure>
        <div className="flex h-40 items-end gap-[3px]" role="img" aria-label={`Reports by hour. Busiest hour: ${formatHour(peak)}.`}>
          {hours.map((count, hour) => (
            <div key={hour} className="group relative flex h-full flex-1 items-end" title={`${formatHour(hour)}: ${count} reports`}>
              <div
                className={`w-full rounded-t-[5px] transition-opacity group-hover:opacity-80 ${redHours.has(hour) ? 'bg-red-500' : 'bg-brand-300'}`}
                style={{ height: `${Math.max(count ? 6 : 2, (count / max) * 100)}%`, opacity: count ? 1 : 0.35 }}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-neutral-400">
          {AXIS.map((h) => (
            <span key={h}>{formatHour(h)}</span>
          ))}
        </div>
      </figure>

      <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {bands.map((band) => (
          <li
            key={band.id}
            className={`rounded-xl px-3 py-2.5 ring-1 ${band.red ? 'bg-red-500/10 ring-red-500/30' : 'bg-neutral-50/5 ring-neutral-50/10'}`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-semibold text-neutral-200">{band.label}</span>
              {band.red && <span className="size-2 rounded-full bg-red-500" aria-label="Red time zone" />}
            </div>
            <div className="mt-1 font-display text-xl font-bold">{band.count}</div>
            <div className="text-[11px] text-neutral-400">
              {band.range} · {band.share}%
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
