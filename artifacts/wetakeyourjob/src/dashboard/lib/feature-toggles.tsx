import { createContext, useContext, useState, useCallback, ReactNode } from "react";

const STORAGE_KEY = "unboks_features";

interface Features {
  showSocial: boolean;
  showCreate: boolean;
}

function load(): Features {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { showSocial: false, showCreate: false, ...JSON.parse(raw) };
  } catch {}
  return { showSocial: false, showCreate: false };
}

function save(f: Features) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(f));
}

interface FeatureTogglesCtx {
  features: Features;
  toggle: (key: keyof Features) => void;
}

const Ctx = createContext<FeatureTogglesCtx | null>(null);

export function FeatureTogglesProvider({ children }: { children: ReactNode }) {
  const [features, setFeatures] = useState<Features>(load);

  const toggle = useCallback((key: keyof Features) => {
    setFeatures((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      save(next);
      return next;
    });
  }, []);

  return <Ctx.Provider value={{ features, toggle }}>{children}</Ctx.Provider>;
}

export function useFeatureToggles() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFeatureToggles must be used inside FeatureTogglesProvider");
  return ctx;
}
