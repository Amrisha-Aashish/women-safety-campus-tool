import { Badge, Button, Card } from 'glassform';
import { Link } from 'react-router';
import { RISK } from '../../data/risk.js';
import Icon from '../Icon.jsx';

/**
 * Unsafe areas ranked by risk score. For now it shows placeholder zones;
 * the backend has a RiskZone model but no endpoint yet.
 *
 * @param {{ zones: Array<{ id: string, zoneName: string, riskScore: number, riskLevel: 'LOW'|'MEDIUM'|'HIGH', reason: string }>, placeholder?: boolean }} props
 */
export default function RiskZonesCard({ zones, placeholder = true }) {
  const ranked = [...zones].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <Card
      radius={22}
      title="Risk zones"
      subtitle="Unsafe areas by risk score"
      className="h-full"
      badge={placeholder && <Badge tone="neutral">Placeholder</Badge>}
      actions={
        <Button as={Link} to="/map" size="sm" aria-label="Open safety map" title="Open safety map" className="w-9 px-0">
          <Icon name="map" />
        </Button>
      }
    >
      <ul className="flex flex-col gap-4">
        {ranked.map((zone) => {
          const risk = RISK[zone.riskLevel.toLowerCase()] ?? RISK.low;
          return (
            <li key={zone.id}>
              <div className="flex items-center justify-between gap-3">
                <p className="min-w-0 truncate font-semibold">{zone.zoneName}</p>
                <Badge tone={risk.tone} size="sm">
                  {risk.label}
                </Badge>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-500/15">
                  <div className="h-full rounded-full" style={{ width: `${zone.riskScore}%`, background: risk.color }} />
                </div>
                <span className="w-8 text-right text-sm font-semibold tabular-nums">{zone.riskScore}</span>
              </div>
              <p className="mt-1.5 text-sm text-neutral-400">{zone.reason}</p>
            </li>
          );
        })}
      </ul>
      {placeholder && (
        <p className="mt-5 flex items-start gap-2 border-t border-neutral-500/15 pt-4 text-xs text-neutral-400">
          <Icon name="info" size={14} className="mt-0.5 shrink-0" />
          Sample zones. Real scores appear here once the risk zone API is ready.
        </p>
      )}
    </Card>
  );
}
