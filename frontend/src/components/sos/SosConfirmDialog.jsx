import { Button, GlassButton, GlassModal } from 'glassform';
import Icon from '../Icon.jsx';

/**
 * Confirmation step before an SOS is sent, so a stray tap doesn't raise an alarm.
 * @param {{ open: boolean, onOpenChange: (open: boolean) => void, onConfirm: () => void, sending: boolean, children?: import('react').ReactNode }} props
 *   `children` shows extra status (e.g. the captured location) inside the dialog.
 */
export default function SosConfirmDialog({ open, onOpenChange, onConfirm, sending, children }) {
  return (
    <GlassModal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      title="Send an SOS alert?"
      description="Campus security will be alerted straight away. Only send it if you need help now."
      material="solid"
      dismissible={!sending}
      footer={
        <>
          <Button onClick={() => onOpenChange(false)} disabled={sending}>
            Cancel
          </Button>
          <GlassButton tint="rgb(220 38 38 / 0.92)" className="text-white" onClick={onConfirm} state={sending ? 'loading' : 'idle'}>
            <Icon name="siren" />
            Send SOS now
          </GlassButton>
        </>
      }
    >
      {children}
    </GlassModal>
  );
}
