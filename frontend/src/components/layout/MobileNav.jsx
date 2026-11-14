import { GlassButton, GlassModal } from 'glassform';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import AppSidebar from './AppSidebar.jsx';

/** Menu button + slide-in drawer holding the sidebar, for screens below `lg`. */
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <GlassModal
      open={open}
      onOpenChange={setOpen}
      placement="left"
      width={256}
      title="Menu"
      closeButton={false}
      tint="transparent"
      shadow={0}
      radius={24}
      classNames={{ header: 'sr-only', panel: 'p-0 gap-0', body: 'mx-0 px-0 h-full overflow-visible' }}
      trigger={
        <GlassButton size="sm" aria-label="Open menu" className="w-9 px-0 lg:hidden">
          <Menu size={18} />
        </GlassButton>
      }
    >
      <AppSidebar onNavigate={() => setOpen(false)} />
    </GlassModal>
  );
}
