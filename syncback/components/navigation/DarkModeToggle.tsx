"use client";

import clsx from "clsx";

import { useTheme } from "@/lib/theme-context";

export function DarkModeToggle() {
  const { isDark, setColorScheme } = useTheme();

  return (
    <div className="flex items-center">
      <button
        type="button"
        aria-label="Enable dark mode"
        aria-pressed={isDark}
        onClick={() => setColorScheme("dark")}
        className={clsx(
          "hs-dark-mode-active:hidden hs-dark-mode font-medium text-gray-800 rounded-full hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200",
          { block: !isDark, hidden: isDark },
        )}
      >
        <span className="group inline-flex shrink-0 justify-center items-center size-9">
          <svg
            className="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        </span>
      </button>
      <button
        type="button"
        aria-label="Enable light mode"
        aria-pressed={!isDark}
        onClick={() => setColorScheme("light")}
        className={clsx(
          "hs-dark-mode-active:block hs-dark-mode font-medium text-gray-800 rounded-full hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200",
          { block: isDark, hidden: !isDark },
        )}
      >
        <span className="group inline-flex shrink-0 justify-center items-center size-9">
          <svg
            className="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        </span>
      </button>
    </div>
  );
}
