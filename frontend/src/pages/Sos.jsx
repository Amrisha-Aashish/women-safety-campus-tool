import { toast } from 'glassform';
import { useState } from 'react';
import SosButton from '../components/sos/SosButton.jsx';
import SosConfirmDialog from '../components/sos/SosConfirmDialog.jsx';
import { sendSos } from '../lib/sos.js';

/** Emergency page: one large button, a confirmation step, then the alert. */
export default function Sos() {
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);

  const confirm = async () => {
    setSending(true);
    await sendSos(null);
    setSending(false);
    setConfirming(false);
    toast.success('SOS alert sent');
  };

  return (
    <div className="mx-auto max-w-6xl">
      <section className="dark relative isolate grid place-items-center overflow-hidden rounded-[28px] bg-ink-900 px-6 py-16 text-center text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/35 blur-[110px]" />
        </div>
        <SosButton onPress={() => setConfirming(true)} />
        <p className="mt-10 max-w-sm text-slate-300">Press the button if you feel unsafe or need help right now.</p>
      </section>
      <SosConfirmDialog open={confirming} onOpenChange={setConfirming} onConfirm={confirm} sending={sending} />
    </div>
  );
}
