import type { StatsGridProps } from "./types";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import SplitText from "@/components/shared/SplitText";

export type PerformanceOverviewSectionProps = {
  businessName: string;
  metrics: StatsGridProps["metrics"];
  hasConvexError?: boolean;
};

export function PerformanceOverviewSection({ businessName, metrics, hasConvexError = false }: PerformanceOverviewSectionProps) {
  return (
    <section className="space-y-6">
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
