import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { PerformanceOverviewSection } from "./sections/PerformanceOverviewSection";
import { RatingDistributionSection } from "./sections/RatingDistributionSection";
import { RatingTrendSection } from "./sections/RatingTrendSection";
import { RecentFeedbackSection } from "./sections/RecentFeedbackSection";
import { RecentRatingsSection } from "./sections/RecentRatingsSection";
import { HeaderMegaMenu } from "@/components/navigation/HeaderMegaMenu";
import { PageBackground } from "@/components/shared/PageBackground";
import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convexClient";

import { resolveAppUrl } from "../settings/actions";

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
  const dashboardData = business
    ? await convex
        .query(api.feedbacks.dashboardData, {
          businessId: business._id,
        })
        .catch(() => null)
    : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7ff] text-slate-950">
      <HeaderMegaMenu />
      <PageBackground>
        <div className="absolute left-1/2 top-[-8%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.22),_rgba(255,255,255,0))] blur-3xl" />
        <div className="absolute right-[6%] top-[28%] h-60 w-60 rounded-full bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.32),_rgba(255,255,255,0))] blur-3xl" />
        <div className="absolute left-[10%] bottom-[18%] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.28),_rgba(255,255,255,0))] blur-3xl" />
      </PageBackground>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-24 pt-20 sm:px-8 lg:px-12">
        <PerformanceOverviewSection businessName={businessName} metrics={dashboardData?.metrics ?? []} />
        <div className="grid gap-10 lg:grid-cols-2">
          <RatingTrendSection data={dashboardData?.ratingTrend ?? []} />
          <RatingDistributionSection data={dashboardData?.ratingDistribution ?? []} />
          <RecentRatingsSection ratings={dashboardData?.recentRatings ?? []} totalCount={dashboardData?.recentRatings.length ?? 0} />
          <RecentFeedbackSection
            feedback={dashboardData?.recentFeedback ?? []}
            totalCount={dashboardData?.recentFeedback.length ?? 0}
          />
        </div>
      </main>
    </div>
  );
}
