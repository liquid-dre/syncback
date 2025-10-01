import type { RatingDistributionChartProps } from "./types";
import { RatingDistributionChart } from "@/components/dashboard/RatingDistributionChart";

export type RatingDistributionSectionProps = {
  data: RatingDistributionChartProps["data"];
};

export function RatingDistributionSection({ data }: RatingDistributionSectionProps) {
  return (
    <section className="group relative overflow-hidden rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl dark:border-slate-700/80 dark:bg-slate-900/60 dark:shadow-slate-900/40">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Rating distribution</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Share of responses by star level</p>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">Updated hourly</span>
      </div>
      <div className="mt-8 h-72 w-full">
        <RatingDistributionChart data={data} />
      </div>
    </section>
  );
}
