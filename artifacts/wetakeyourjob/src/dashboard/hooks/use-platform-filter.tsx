import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { PlatformKey } from "@dashboard/lib/channel-map";

interface PlatformFilterCtx {
  selected: Set<PlatformKey>;
  toggle: (key: PlatformKey) => void;
  clear: () => void;
  isAll: boolean;
}

const Ctx = createContext<PlatformFilterCtx | null>(null);

export function PlatformFilterProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Set<PlatformKey>>(new Set());

  const toggle = useCallback((key: PlatformKey) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const clear = useCallback(() => setSelected(new Set()), []);

  return (
    <Ctx.Provider value={{ selected, toggle, clear, isAll: selected.size === 0 }}>
      {children}
    </Ctx.Provider>
  );
}

export function usePlatformFilter() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePlatformFilter must be used inside PlatformFilterProvider");
  return ctx;
}
