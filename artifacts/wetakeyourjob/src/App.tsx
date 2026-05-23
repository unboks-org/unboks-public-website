import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import DemoApp from './demo/bluemarlin/DemoApp';
import HomePage from './HomePage';
import ContactPage from './ContactPage';
import FAQPage from './FAQPage';
import AdminApp from './admin/AdminApp';
import SignupPage from './SignupPage';

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
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/demo/bluemarlin/*" element={<DemoApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
