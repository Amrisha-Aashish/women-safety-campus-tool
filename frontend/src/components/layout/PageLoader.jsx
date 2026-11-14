import { GlassBadge } from 'glassform';

/** Placeholder while a lazily loaded page downloads. */
export default function PageLoader() {
  return (
    <div className="grid min-h-[40vh] place-items-center">
      <GlassBadge tone="accent" dot pulse size="lg">
        Loading…
      </GlassBadge>
    </div>
  );
}
