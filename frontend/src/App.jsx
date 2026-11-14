import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import AppLayout from './components/layout/AppLayout.jsx';
import PageLoader from './components/layout/PageLoader.jsx';
import ScrollToTop from './components/layout/ScrollToTop.jsx';
import Landing from './pages/Landing.jsx';
import NotFound from './pages/NotFound.jsx';

// App pages load on demand, so the landing page doesn't download the map library.
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Report = lazy(() => import('./pages/Report.jsx'));
const SafetyMap = lazy(() => import('./pages/SafetyMap.jsx'));
const Sos = lazy(() => import('./pages/Sos.jsx'));
const SosAlerts = lazy(() => import('./pages/SosAlerts.jsx'));

const page = (Page) => (
  <Suspense fallback={<PageLoader />}>
    <Page />
  </Suspense>
);

// Public landing page at "/", internal pages inside the sidebar layout.
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route index element={<Landing />} />
        <Route element={<AppLayout />}>
          <Route path="dashboard" element={page(Dashboard)} />
          <Route path="report" element={page(Report)} />
          <Route path="map" element={page(SafetyMap)} />
          <Route path="sos" element={page(Sos)} />
          <Route path="sos-alerts" element={page(SosAlerts)} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
