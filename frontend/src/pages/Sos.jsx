import { toast } from 'glassform';
import { useState } from 'react';
import PageToolbar from '../components/layout/PageToolbar.jsx';
import EmergencyContacts from '../components/sos/EmergencyContacts.jsx';
import SafetyTips from '../components/sos/SafetyTips.jsx';
import SosButton from '../components/sos/SosButton.jsx';
import SosConfirmDialog from '../components/sos/SosConfirmDialog.jsx';
import SosLocation from '../components/sos/SosLocation.jsx';
import SosResult from '../components/sos/SosResult.jsx';
import { useGeolocation } from '../hooks/useGeolocation.js';
import { sendSos } from '../lib/sos.js';

/**
 * Emergency page: one large button → confirmation (location is captured
 * meanwhile) → the alert is sent → what happens now, plus numbers to call.
 */
export default function Sos() {
  const geo = useGeolocation();
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);
  const [alert, setAlert] = useState(null);

  const open = () => {
    setConfirming(true);
    if (geo.status !== 'success') geo.locate();
  };

  const confirm = async () => {
    setSending(true);
    try {
      const sent = await sendSos(geo.coords);
      setAlert(sent);
      setConfirming(false);
    } catch {
      toast.error("SOS couldn't be sent", { description: 'Call 112 now.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <PageToolbar />
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section
          aria-live="polite"
          className="dark relative isolate grid min-h-[520px] place-items-center overflow-hidden rounded-[28px] bg-ink-900 px-6 py-14 text-center text-white"
        >
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            <div
              className={`absolute top-1/2 left-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px] ${alert ? 'bg-emerald-500/25' : 'bg-red-600/35'}`}
            />
          </div>

          {alert ? (
            <SosResult alert={alert} onDone={() => setAlert(null)} />
          ) : (
            <div className="flex flex-col items-center">
              <SosButton onPress={open} />
              <p className="mt-12 max-w-sm text-neutral-300">
                Press the button if you feel unsafe or need help right now. You will be asked to confirm, and your
                location is added if your browser allows it.
              </p>
            </div>
          )}
        </section>

        <aside className="flex flex-col gap-5">
          <EmergencyContacts />
          <SafetyTips />
        </aside>

        <SosConfirmDialog open={confirming} onOpenChange={setConfirming} onConfirm={confirm} sending={sending}>
          <SosLocation geo={geo} />
        </SosConfirmDialog>
      </div>
    </div>
  );
}
