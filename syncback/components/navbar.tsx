"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SAAS_NAME = "SyncBack";

export function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedTheme = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = storedTheme ? storedTheme === "dark" : prefersDark;

    setIsDark(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme);
  }, []);

  const toggleTheme = () => {
    if (typeof window === "undefined") {
      return;
    }

    setIsDark((previous) => {
      const next = !previous;
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-6">
      <nav
        className="flex w-full max-w-6xl items-center justify-between rounded-full border border-white/30 bg-white/60 px-4 py-2 text-sm shadow-[0_8px_32px_rgba(15,23,42,0.15)] backdrop-blur-2xl transition-colors dark:border-white/10 dark:bg-slate-900/70 md:px-6 md:py-3"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-base font-semibold text-white shadow-lg md:text-lg">
            {SAAS_NAME.charAt(0)}
          </span>
          <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-white md:text-lg">
            {SAAS_NAME}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Activate light mode" : "Activate dark mode"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/40 text-lg text-slate-800 shadow-inner transition hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:border-white/10 dark:bg-slate-800/60 dark:text-amber-300 dark:hover:bg-slate-800/80"
          >
            <span role="img" aria-hidden="true">
              {isDark ? "🌞" : "🌙"}
            </span>
          </button>

          <Link
            href="/signin"
            className="inline-flex items-center justify-center rounded-full border border-transparent bg-white/50 px-3 py-2 text-sm font-medium text-slate-900 shadow-sm backdrop-blur-md transition hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:bg-slate-800/70 dark:text-white dark:hover:bg-slate-700/80 sm:px-4"
          >
            Sign in
          </Link>

          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-3 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-blue-600 hover:via-indigo-500 hover:to-purple-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 sm:px-4"
          >
            Sign up
          </Link>
        </div>
      </nav>
    </header>
  );
}
