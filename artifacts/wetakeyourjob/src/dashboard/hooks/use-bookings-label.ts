import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "wtyj_bookings_label";
const EVENT_NAME = "wtyj:bookings-label";

export function useBookingsLabel() {
  const [label, setLabel] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || "Bookings";
  });

  useEffect(() => {
    const handler = () => setLabel(localStorage.getItem(STORAGE_KEY) || "Bookings");
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, []);

  const save = useCallback((newLabel: string) => {
    const trimmed = newLabel.trim() || "Bookings";
    localStorage.setItem(STORAGE_KEY, trimmed);
    setLabel(trimmed);
    window.dispatchEvent(new Event(EVENT_NAME));
  }, []);

  return { label, save };
}
