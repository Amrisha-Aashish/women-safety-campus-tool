import { GlassButton } from 'glassform';
import { Siren } from 'lucide-react';

/** The large round SOS button with pulsing rings. Opens the confirmation step. */
export default function SosButton({ onPress, disabled }) {
  return (
    <div className="relative grid place-items-center">
      {!disabled && (
        <>
          <span aria-hidden="true" className="absolute size-56 animate-sos-ring rounded-full bg-red-500/40 sm:size-64" />
          <span aria-hidden="true" className="absolute size-56 animate-sos-ring rounded-full bg-red-500/30 [animation-delay:1.2s] sm:size-64" />
        </>
      )}
      <GlassButton
        onClick={onPress}
        disabled={disabled}
        tint="rgb(220 38 38 / 0.9)"
        thickness={34}
        className="relative size-56 flex-col gap-1 p-0 text-white sm:size-64"
        aria-label="Send SOS alert"
      >
        <Siren size={52} strokeWidth={1.8} />
        <span className="font-display text-5xl font-extrabold tracking-wider">SOS</span>
        <span className="text-sm font-medium text-red-100">Tap for help</span>
      </GlassButton>
    </div>
  );
}
