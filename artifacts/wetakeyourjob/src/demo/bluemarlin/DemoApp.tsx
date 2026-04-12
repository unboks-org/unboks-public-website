import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from '@demo/components/Navbar';
import Footer from '@demo/components/Footer';
import HomePage from '@demo/pages/home';
import TripsPage from '@demo/pages/trips';
import BookingPage from '@demo/pages/booking';
import BookPage from '@demo/pages/book';
import AboutPage from '@demo/pages/about';
import NotFound from '@demo/pages/not-found';

function DemoScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
}

export default function DemoApp() {
  return (
    <div id="demo-root" className="min-h-screen bg-background text-foreground antialiased">
      <DemoScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="trips" element={<TripsPage />} />
          <Route path="booking" element={<BookingPage />} />
          <Route path="book" element={<BookPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
