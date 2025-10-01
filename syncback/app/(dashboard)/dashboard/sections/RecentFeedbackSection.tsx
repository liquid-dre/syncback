import type { RecentFeedbackTableProps } from "./types";
import { RecentFeedbackTable } from "@/components/dashboard/RecentFeedbackTable";

export type RecentFeedbackSectionProps = {
  feedback: RecentFeedbackTableProps["feedback"];
  totalCount: number;
};

export function RecentFeedbackSection({ feedback, totalCount }: RecentFeedbackSectionProps) {
  return (
    <section className="group relative overflow-hidden rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl lg:col-span-2 dark:border-slate-700/80 dark:bg-slate-900/60 dark:shadow-slate-900/40">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Feedback details</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Review individual comments, search by rating, and spot outliers fast</p>
        </div>
        <span className="inline-flex items-center rounded-full bg-slate-900/5 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-sky-500/10 dark:text-sky-300">
          {totalCount} feedback entries
        </span>
      </div>
      <div className="mt-8">
        <RecentFeedbackTable feedback={feedback} />
      </div>
    </section>
  );
}
