import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import SiteLayout from './layout/SiteLayout';
import DashboardLayout from './layout/DashboardLayout';
import ProtectedRoute from './lib/ProtectedRoute';

import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

import DashboardLoginPlaceholder from './pages/dashboard/DashboardLoginPlaceholder';
import DashboardOverviewPlaceholder from './pages/dashboard/DashboardOverviewPlaceholder';
import DashboardMessagesPlaceholder from './pages/dashboard/DashboardMessagesPlaceholder';
import DashboardEscalationsPlaceholder from './pages/dashboard/DashboardEscalationsPlaceholder';
import DashboardContentPlaceholder from './pages/dashboard/DashboardContentPlaceholder';
import DashboardSettingsPlaceholder from './pages/dashboard/DashboardSettingsPlaceholder';
import DashboardCatchAll from './pages/dashboard/DashboardCatchAll';

import BlueMarlinDemoPlaceholder from './pages/demo/BlueMarlinDemoPlaceholder';

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* ── Marketing (public) ── */}
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* ── Dashboard login (standalone, no sidebar) ── */}
        <Route path="/dashboard/login" element={<DashboardLoginPlaceholder />} />

        {/* ── Dashboard (authenticated routes) ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardOverviewPlaceholder />} />
            <Route path="/dashboard/messages" element={<DashboardMessagesPlaceholder />} />
            <Route path="/dashboard/escalations" element={<DashboardEscalationsPlaceholder />} />
            <Route path="/dashboard/content" element={<DashboardContentPlaceholder />} />
            <Route path="/dashboard/settings" element={<DashboardSettingsPlaceholder />} />
            <Route path="/dashboard/*" element={<DashboardCatchAll />} />
          </Route>
        </Route>

        {/* ── Hidden demo (not in nav/footer, direct URL only) ── */}
        <Route path="/demo/bluemarlin" element={<BlueMarlinDemoPlaceholder />} />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
