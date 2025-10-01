"use client";

import { MantineProvider } from "@mantine/core";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ColorScheme = "light" | "dark";

type ThemeContextValue = {
  colorScheme: ColorScheme;
  setColorScheme: (value: ColorScheme) => void;
  toggleColorScheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem("color-scheme");
    if (stored === "dark" || stored === "light") {
      setColorSchemeState(stored);
      return;
    }

    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setColorSchemeState("dark");
    }
  }, []);

  useEffect(() => {
    if (!mounted || typeof document === "undefined") {
      return;
    }

    const root = document.documentElement;
    const body = document.body;

    root.classList.toggle("dark", colorScheme === "dark");
    root.setAttribute("data-mantine-color-scheme", colorScheme);

    if (body) {
      body.classList.toggle("dark", colorScheme === "dark");
    }

    window.localStorage.setItem("color-scheme", colorScheme);
  }, [colorScheme, mounted]);

  const setColorScheme = useCallback((value: ColorScheme) => {
    setColorSchemeState(value);
  }, []);

  const toggleColorScheme = useCallback(() => {
    setColorSchemeState((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const contextValue = useMemo(
    () => ({
      colorScheme,
      setColorScheme,
      toggleColorScheme,
    }),
    [colorScheme, setColorScheme, toggleColorScheme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MantineProvider defaultColorScheme="light" forceColorScheme={colorScheme}>
        {children}
      </MantineProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
