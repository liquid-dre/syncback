import type { RecentRatingsAreaChartProps } from "./types";
import { RecentRatingsAreaChart } from "@/components/dashboard/RecentRatingsAreaChart";

export type RecentRatingsSectionProps = {
  ratings: RecentRatingsAreaChartProps["ratings"];
  totalCount: number;
};

export function RecentRatingsSection({ ratings, totalCount }: RecentRatingsSectionProps) {
  return (
    <section className="group relative overflow-hidden rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl lg:col-span-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Recent ratings</h2>
          <p className="text-sm text-slate-500">Explore the most recent feedback and spot shifts instantly</p>
        </div>
        <span className="inline-flex items-center rounded-full bg-slate-900/5 px-3 py-1 text-xs font-medium text-slate-600">
          {totalCount} total ratings
        </span>
      </div>
      <div className="mt-8">
        <RecentRatingsAreaChart ratings={ratings} />
      </div>
    </section>
  );
}
