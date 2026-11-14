import { Outlet } from 'react-router';
import AppSidebar from './AppSidebar.jsx';

/**
 * Frame for the internal pages: a floating glass sidebar on the left and the
 * page on the right. Soft colour glows sit behind everything so the glass
 * has something to refract.
 */
export default function AppLayout() {
  return (
    <div className="relative isolate flex min-h-dvh">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 size-[520px] rounded-full bg-brand-400/25 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 size-[460px] rounded-full bg-rose-300/25 blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 size-[420px] rounded-full bg-sky-300/25 blur-[120px]" />
      </div>

      <div className="sticky top-0 hidden h-dvh shrink-0 p-3 pr-0 lg:block">
        <AppSidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  );
}
