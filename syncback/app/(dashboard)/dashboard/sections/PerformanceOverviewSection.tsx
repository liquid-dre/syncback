import type { StatsGridProps } from "./types";
import { StatsGrid } from "@/components/dashboard/StatsGrid";

export type PerformanceOverviewSectionProps = {
  businessName: string;
  metrics: StatsGridProps["metrics"];
};

export function PerformanceOverviewSection({ businessName, metrics }: PerformanceOverviewSectionProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Performance overview</p>
        <h1 className="text-3xl font-semibold leading-tight text-slate-950 dark:text-slate-100 sm:text-4xl lg:text-5xl">Insights for {businessName}</h1>
        <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
          Track how guests feel about every experience and spot momentum in your ratings at a glance.
        </p>
      </div>
      <div className="overflow-hidden rounded-[32px] border border-white/60 bg-white/70 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/60 dark:shadow-slate-900/40">
        <StatsGrid metrics={metrics} />
      </div>
    </section>
  );
}
