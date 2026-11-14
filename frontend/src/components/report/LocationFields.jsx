import { Badge, Button, Select, TextField } from 'glassform';
import { CAMPUS_PLACES } from '../../data/campusPlaces.js';
import { useGeolocation } from '../../hooks/useGeolocation.js';
import Icon from '../Icon.jsx';

const PLACE_OPTIONS = [
  ...CAMPUS_PLACES.map((p) => ({ value: p.id, label: p.name })),
  { value: 'custom', label: 'Somewhere else', description: 'Type the place and coordinates below' },
];

/**
 * Where it happened: pick a known campus place (fills everything in), or type
 * a place name and coordinates, or use the browser's location.
 * @param {{ values: object, set: (patch: object) => void, errors: object }} props
 */
export default function LocationFields({ values, set, errors }) {
  const geo = useGeolocation();

  const pickPlace = (placeId) => {
    const place = CAMPUS_PLACES.find((p) => p.id === placeId);
    if (place) set({ placeId, locationName: place.name, latitude: String(place.latitude), longitude: String(place.longitude) });
    else set({ placeId, locationName: '', latitude: '', longitude: '' });
  };

  const useMyLocation = async () => {
    const coords = await geo.locate();
    if (coords) {
      set({
        latitude: String(coords.latitude),
        longitude: String(coords.longitude),
        placeId: values.placeId ?? 'custom',
        locationName: values.locationName || 'My current location',
      });
    }
  };

  return (
    <fieldset className="flex flex-col gap-5">
      <legend className="mb-4 font-display text-lg font-bold">Where did it happen?</legend>

      <Select
        label="Campus place"
        placeholder="Choose a place on campus"
        options={PLACE_OPTIONS}
        value={values.placeId}
        onChange={pickPlace}
        searchable
      />

      <TextField
        label="Location name"
        required
        placeholder="e.g. East Gate Walkway"
        value={values.locationName}
        onChange={(locationName) => set({ locationName })}
        error={errors.locationName}
        leading={<Icon name="map-pin" />}
      />

      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-start">
        <TextField
          label="Latitude"
          required
          inputMode="decimal"
          placeholder="23.3441"
          value={values.latitude}
          onChange={(latitude) => set({ latitude })}
          error={errors.latitude}
        />
        <TextField
          label="Longitude"
          required
          inputMode="decimal"
          placeholder="85.3096"
          value={values.longitude}
          onChange={(longitude) => set({ longitude })}
          error={errors.longitude}
        />
        <Button
          onClick={useMyLocation}
          state={geo.status === 'locating' ? 'loading' : 'idle'}
          className="sm:mt-[26px]"
        >
          <Icon name="locate" />
          Use my location
        </Button>
      </div>

      {geo.status === 'success' && (
        <Badge tone="positive" icon={<Icon name="check" />} className="self-start">
          Location captured, accurate to about {geo.coords.accuracy} m
        </Badge>
      )}
      {geo.status === 'error' && (
        <p role="alert" className="flex items-start gap-2 text-sm text-red-700">
          <Icon name="alert-circle" className="mt-0.5 shrink-0" />
          {geo.error}
        </p>
      )}
    </fieldset>
  );
}
