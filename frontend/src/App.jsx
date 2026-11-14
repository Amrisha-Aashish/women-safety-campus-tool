import { BrowserRouter, Route, Routes } from 'react-router';
import AppLayout from './components/layout/AppLayout.jsx';
import ScrollToTop from './components/layout/ScrollToTop.jsx';
import Landing from './pages/Landing.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Report from './pages/Report.jsx';
import SafetyMap from './pages/SafetyMap.jsx';
import Sos from './pages/Sos.jsx';

// Public landing page at "/", internal pages inside the sidebar layout.
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route index element={<Landing />} />
        <Route element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="report" element={<Report />} />
          <Route path="map" element={<SafetyMap />} />
          <Route path="sos" element={<Sos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
