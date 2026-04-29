import { createContext, useContext, createElement } from "react";
import type { ReactNode } from "react";

type Theme = "light";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  try {
    localStorage.removeItem("bluemarlin_theme");
    localStorage.removeItem("unboks_theme");
  } catch {}

  return createElement(
    ThemeContext.Provider,
    { value: { theme: "light", toggle: () => {} } },
    createElement("div", { id: "dashboard-root" }, children)
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
