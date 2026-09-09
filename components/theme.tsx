"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "agrani-theme";
export const THEME_COOKIE_KEY = "agrani-theme";

interface ThemeContextType {
  theme: Theme;
  dark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  dark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

function applyThemeToDocument(theme: Theme) {
  if (typeof document === "undefined") return;
  const d = document.documentElement;
  d.classList.remove("light", "dark");
  d.classList.add(theme);
  d.setAttribute("data-theme", theme);
  d.style.colorScheme = theme;
}

export function ThemeProvider({
  children,
  initialTheme = "light",
}: {
  children: React.ReactNode;
  initialTheme?: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  useEffect(() => {
    try {
      const match = document.cookie.match(/(?:^|;\s*)agrani-theme=(light|dark)/);
      const stored = match ? (match[1] as Theme) : (localStorage.getItem(THEME_STORAGE_KEY) as Theme | null);
      if (stored === "light" || stored === "dark") {
        setThemeState(stored);
        applyThemeToDocument(stored);
      } else {
        applyThemeToDocument(initialTheme);
      }
    } catch {
      applyThemeToDocument(initialTheme);
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && (e.newValue === "light" || e.newValue === "dark")) {
        setThemeState(e.newValue as Theme);
        applyThemeToDocument(e.newValue as Theme);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [initialTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      document.cookie = `${THEME_COOKIE_KEY}=${newTheme}; path=/; max-age=31536000; SameSite=Lax`;
      applyThemeToDocument(newTheme);
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
        document.cookie = `${THEME_COOKIE_KEY}=${next}; path=/; max-age=31536000; SameSite=Lax`;
        applyThemeToDocument(next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        dark: theme === "dark",
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(_ignoredFallback?: Theme) {
  return useContext(ThemeContext);
}
