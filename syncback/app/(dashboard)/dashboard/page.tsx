import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HeaderMegaMenu } from "@/components/navigation/HeaderMegaMenu";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RatingTrendChart } from "@/components/dashboard/RatingTrendChart";
import { RatingDistributionChart } from "@/components/dashboard/RatingDistributionChart";
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
        </section>
      </main>
    </div>
  );
}
