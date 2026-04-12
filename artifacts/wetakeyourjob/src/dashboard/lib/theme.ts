import { createContext, useContext, useEffect, useState, createElement, useCallback } from "react";
import type { ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("bluemarlin_theme");
    if (stored === "light" || stored === "dark") return stored;
    return "dark";
  });

  useEffect(() => {
    const root = document.getElementById("dashboard-root");
    if (!root) return;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("bluemarlin_theme", theme);
  }, [theme]);

  const applyTheme = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    node.id = "dashboard-root";
    if (theme === "dark") {
      node.classList.add("dark");
    } else {
      node.classList.remove("dark");
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return createElement(ThemeContext.Provider, { value: { theme, toggle } },
    createElement("div", { ref: applyTheme, id: "dashboard-root", className: theme === "dark" ? "dark" : "" }, children)
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
