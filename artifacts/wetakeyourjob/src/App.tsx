import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@dashboard/components/ui/tooltip';

import SiteLayout from './layout/SiteLayout';

import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

import { ThemeProvider, useTheme } from '@dashboard/lib/theme';
import { FeatureTogglesProvider } from '@dashboard/lib/feature-toggles';
import { AuthProvider } from '@dashboard/components/auth/AuthProvider';
import { ProtectedRoute } from '@dashboard/components/auth/ProtectedRoute';
import { AppLayout } from '@dashboard/components/layout/AppLayout';

import Login from '@dashboard/pages/Login';
import Overview from '@dashboard/pages/Overview';
import Messages from '@dashboard/pages/Messages';
import Escalations from '@dashboard/pages/Escalations';
import ContentPipeline from '@dashboard/pages/ContentPipeline';
import Create from '@dashboard/pages/Create';
import BrandTraining from '@dashboard/pages/BrandTraining';
import Settings from '@dashboard/pages/Settings';
import PublishedPosts from '@dashboard/pages/PublishedPosts';
import BrandLearnings from '@dashboard/pages/BrandLearnings';
import AssetLibrary from '@dashboard/pages/AssetLibrary';
import CapacityChecker from '@dashboard/pages/CapacityChecker';
import DashboardNotFound from '@dashboard/pages/not-found';

import BlueMarlinDemoPlaceholder from './pages/demo/BlueMarlinDemoPlaceholder';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const msg = error instanceof Error ? error.message.toLowerCase() : '';
        if (msg.includes('unauthorized') || msg.includes('401')) return false;
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
    },
  },
});

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);
  return null;
}

function ThemedToaster() {
  const { theme } = useTheme();
  return (
    <Toaster
      theme={theme}
      position="bottom-right"
      toastOptions={{
        style:
          theme === 'dark'
            ? { background: '#0F1E32', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }
            : { background: '#fff', border: '1px solid #D2E0EE', color: '#0E1D30' },
      }}
    />
  );
}

function DashboardShell() {
  return (
    <ThemeProvider>
      <FeatureTogglesProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuthProvider>
              <Routes>
                <Route path="login" element={<Login />} />

                <Route element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}>
                    <Route index element={<Overview />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="escalations" element={<Escalations />} />
                    <Route path="social" element={<ContentPipeline />} />
                    <Route path="create" element={<Create />} />
                    <Route path="training" element={<BrandTraining />} />
                    <Route path="settings" element={<Settings />} />

                    <Route path="content" element={<Navigate to="/dashboard/social" replace />} />
                    <Route path="published" element={<PublishedPosts />} />
                    <Route path="learnings" element={<BrandLearnings />} />
                    <Route path="assets" element={<AssetLibrary />} />
                    <Route path="capacity" element={<CapacityChecker />} />
                  </Route>
                </Route>

                <Route path="*" element={<DashboardNotFound />} />
              </Routes>
              <ThemedToaster />
            </AuthProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </FeatureTogglesProvider>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route path="/dashboard/*" element={<DashboardShell />} />

        <Route path="/demo/bluemarlin" element={<BlueMarlinDemoPlaceholder />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
