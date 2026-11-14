import { GlassToaster } from 'glassform';
import { Outlet } from 'react-router';
import AppSidebar from './AppSidebar.jsx';

/**
 * Frame for the internal pages: a floating glass sidebar on the left and the
 * page on the right, on a flat dark background.
 */
export default function AppLayout() {
  return (
    <div className="relative isolate flex min-h-dvh bg-canvas">
      <div className="sticky top-0 hidden h-dvh shrink-0 p-3 pr-0 lg:block">
        <AppSidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-4 pt-6 pb-10 sm:px-6 lg:px-8 lg:pt-10">
          <Outlet />
        </main>
      </div>

      <GlassToaster position="top-center" />
    </div>
  );
}
