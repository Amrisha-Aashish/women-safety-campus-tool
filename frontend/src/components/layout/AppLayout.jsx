import { GlassToaster } from 'glassform';
import { Outlet } from 'react-router';
import AppSidebar from './AppSidebar.jsx';
import AppTopbar from './AppTopbar.jsx';

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
        <AppTopbar />
        <main className="flex-1 px-3 pt-4 pb-10 sm:px-5">
          <Outlet />
        </main>
      </div>

      <GlassToaster position="top-center" />
    </div>
  );
}
