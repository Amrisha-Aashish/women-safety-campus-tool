import { Badge, Button } from 'glassform';
import Icon from '../Icon.jsx';

/**
 * Location status inside the SOS dialog: finding it, found (with accuracy), or
 * unavailable (the alert can still be sent without it).
 * @param {{ geo: ReturnType<typeof import('../../hooks/useGeolocation.js').useGeolocation> }} props
 */
export default function SosLocation({ geo }) {
  if (geo.status === 'success') {
    return (
      <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-900 ring-1 ring-emerald-200">
        <Icon name="map-pin" size={18} className="mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold">Your location will be shared</p>
          <p className="text-emerald-800 tabular-nums">
            {geo.coords.latitude.toFixed(5)}, {geo.coords.longitude.toFixed(5)} · about {geo.coords.accuracy} m
          </p>
        </div>
      </div>
    );
  }
  if (geo.status === 'error') {
    return (
      <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-3 text-sm text-amber-900 ring-1 ring-amber-200">
        <Icon name="alert-triangle" size={18} className="mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="font-semibold">Location not available</p>
          <p>{geo.error} You can still send the alert.</p>
          <Button size="sm" className="mt-2" onClick={geo.locate}>
            <Icon name="locate" />
            Try again
          </Button>
        </div>
      </div>
    );
  }
  return (
    <Badge tone="info" dot pulse size="lg">
      Finding your location…
    </Badge>
  );
}
