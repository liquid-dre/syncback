"use client";

import { useMemo } from "react";

import type { StatsGridProps } from "./types";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import SplitText from "@/components/shared/SplitText";
import { IconRefresh } from "@tabler/icons-react";
import clsx from "clsx";

export type PerformanceOverviewSectionProps = {
  businessName: string;
  metrics: StatsGridProps["metrics"];
  hasConvexError?: boolean;
  onReload?: () => void;
  isReloading?: boolean;
  lastUpdatedAt?: number | null;
  autoRefreshIntervalMs?: number;
};

export function PerformanceOverviewSection({
  businessName,
  metrics,
  hasConvexError = false,
  onReload,
  isReloading = false,
  lastUpdatedAt = null,
  autoRefreshIntervalMs,
}: PerformanceOverviewSectionProps) {
  const lastUpdatedLabel = useMemo(() => {
    if (!lastUpdatedAt) {
      return null;
    }

    try {
      const formatter = new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
      });
      return formatter.format(new Date(lastUpdatedAt));
    } catch {
      return new Date(lastUpdatedAt).toLocaleTimeString();
    }
  }, [lastUpdatedAt]);

  const autoRefreshLabel = useMemo(() => {
    if (!autoRefreshIntervalMs) {
      return null;
    }

    const minutes = Math.round(autoRefreshIntervalMs / 60000);

    if (minutes % 60 === 0) {
      const hours = minutes / 60;
      return hours === 1 ? "hour" : `${hours} hours`;
    }

    return minutes === 1 ? "minute" : `${minutes} minutes`;
  }, [autoRefreshIntervalMs]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Performance overview</p>
          <SplitText
            text={`Insights for ${businessName}`}
            tag="h1"
            textAlign="left"
            className="text-3xl font-semibold leading-tight text-slate-950 dark:text-slate-100 sm:text-4xl lg:text-5xl"
          />
          <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            Track how guests feel about every experience and spot momentum in your ratings at a glance.
          </p>
        </div>

        {onReload ? (
          <div className="flex flex-col items-start gap-2 text-left text-xs text-slate-500 md:items-end md:text-right dark:text-slate-400">
            {lastUpdatedLabel ? (
              <p aria-live="polite" className="text-xs">
                Last updated {lastUpdatedLabel}
                {autoRefreshLabel ? ` · Auto refreshes every ${autoRefreshLabel}` : ""}
              </p>
            ) : autoRefreshLabel ? (
              <p className="text-xs">Auto refreshes every {autoRefreshLabel}</p>
            ) : null}
            <button
              type="button"
              onClick={onReload}
              className={clsx(
                "inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/30 focus-visible:ring-offset-2 hover:bg-white disabled:cursor-not-allowed disabled:opacity-70",
                "dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-900",
              )}
              disabled={isReloading}
            >
              <IconRefresh className={clsx("h-4 w-4", isReloading && "animate-spin")} stroke={1.5} />
              {isReloading ? "Refreshing" : "Reload data"}
            </button>
          </div>
        ) : null}
      </div>
      {hasConvexError ? (
        <div
          className="overflow-hidden rounded-[32px] border border-red-200 bg-red-50/90 p-6 text-sm text-red-700 shadow-xl backdrop-blur dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          <p className="font-semibold">Data temporarily unavailable</p>
          <p className="mt-1 text-red-600 dark:text-red-300">
            We ran into a problem talking to Convex. Double-check your environment variables and try again once everything looks
            good.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[32px] border border-white/60 bg-white/70 shadow-xl backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/60 dark:shadow-slate-900/40">
          <StatsGrid metrics={metrics} />
        </div>
      )}
    </section>
  );
}
