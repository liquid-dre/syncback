import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HeaderMegaMenu } from "@/components/navigation/HeaderMegaMenu";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RatingTrendChart } from "@/components/dashboard/RatingTrendChart";
import { RatingDistributionChart } from "@/components/dashboard/RatingDistributionChart";
import { RecentRatingsAreaChart } from "@/components/dashboard/RecentRatingsAreaChart";
import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convexClient";

import { resolveAppUrl } from "../settings/actions";

const ratingsTrend = [
  { month: "May", average: 4.3 },
  { month: "Jun", average: 4.4 },
  { month: "Jul", average: 2.5 },
  { month: "Aug", average: 4.6 },
  { month: "Sep", average: 4.7 },
  { month: "Oct", average: 3.8 },
];

const ratingDistribution = [
  { segment: "5 Stars", value: 62 },
  { segment: "4 Stars", value: 24 },
  { segment: "3 Stars", value: 8 },
  { segment: "2 Stars", value: 4 },
  { segment: "1 Star", value: 2 },
];

const recentRatings = [
  { rating: 3.9, receivedAt: "2024-09-19T13:32:00Z" },
  { rating: 4.8, receivedAt: "2024-09-21T09:14:00Z" },
  { rating: 5, receivedAt: "2024-09-22T16:05:00Z" },
  { rating: 4.6, receivedAt: "2024-09-23T11:47:00Z" },
  { rating: 4.7, receivedAt: "2024-09-24T18:22:00Z" },
  { rating: 4.5, receivedAt: "2024-09-25T20:41:00Z" },
  { rating: 3.2, receivedAt: "2024-09-26T08:03:00Z" },
  { rating: 4.9, receivedAt: "2024-09-27T12:18:00Z" },
  { rating: 4.4, receivedAt: "2024-09-28T15:55:00Z" },
  { rating: 4.7, receivedAt: "2024-09-29T10:29:00Z" },
  { rating: 4.9, receivedAt: "2024-09-30T14:36:00Z" },
  { rating: 5, receivedAt: "2024-10-01T09:22:00Z" },
  { rating: 4.8, receivedAt: "2024-10-02T17:11:00Z" },
  { rating: 4.6, receivedAt: "2024-10-03T11:58:00Z" },
  { rating: 4.7, receivedAt: "2024-10-04T19:37:00Z" },
  { rating: 4.9, receivedAt: "2024-10-05T13:06:00Z" },
  { rating: 1.8, receivedAt: "2024-10-06T08:44:00Z" },
  { rating: 5, receivedAt: "2024-10-07T15:23:00Z" },
];

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const convex = getConvexClient();
  const appUrl = await resolveAppUrl();

  const business = await convex
    .query(api.businesses.forClerkUser, {
      clerkUserId: user.id,
      appUrl,
    })
    .catch(() => null);

  const businessName = business?.name ?? "Your business";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7ff] text-slate-950">
      <HeaderMegaMenu />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-8%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.22),_rgba(255,255,255,0))] blur-3xl" />
        <div className="absolute right-[6%] top-[28%] h-60 w-60 rounded-full bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.32),_rgba(255,255,255,0))] blur-3xl" />
        <div className="absolute left-[10%] bottom-[18%] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.28),_rgba(255,255,255,0))] blur-3xl" />
        <div className="absolute inset-0 bg-grid-soft opacity-40" />
        <div className="absolute inset-0 bg-noise opacity-40 mix-blend-soft-light" />
      </div>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-24 pt-20 sm:px-8 lg:px-12">
        <section className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Performance overview
            </p>
            <h1 className="text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Insights for {businessName}
            </h1>
            <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
              Track how guests feel about every experience and spot momentum in your ratings at a glance.
            </p>
          </div>
          <div className="overflow-hidden rounded-[32px] border border-white/60 bg-white/70 shadow-xl backdrop-blur">
            <StatsGrid />
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-2">
          <div className="group relative overflow-hidden rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Rating trend</h2>
                <p className="text-sm text-slate-500">Trailing six months of average guest ratings</p>
              </div>
              <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-600">
                Live sync
              </span>
            </div>
            <div className="mt-8 h-72 w-full">
              <RatingTrendChart data={ratingsTrend} />
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Rating distribution</h2>
                <p className="text-sm text-slate-500">Share of responses by star level</p>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
                Updated hourly
              </span>
            </div>
            <div className="mt-8 h-72 w-full">
              <RatingDistributionChart data={ratingDistribution} />
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl lg:col-span-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Recent ratings</h2>
                <p className="text-sm text-slate-500">Explore the most recent feedback and spot shifts instantly</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-slate-900/5 px-3 py-1 text-xs font-medium text-slate-600">
                {recentRatings.length} total ratings
              </span>
            </div>
            <div className="mt-8">
              <RecentRatingsAreaChart ratings={recentRatings} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
