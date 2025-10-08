import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { HeaderMegaMenu } from "@/components/navigation/HeaderMegaMenu";
import { PageBackground } from "@/components/shared/PageBackground";
import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convexClient";

import { resolveAppUrl } from "../settings/actions";
import { DashboardContent } from "./DashboardContent";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const convex = getConvexClient();
  const appUrl = await resolveAppUrl();

  let hasConvexError = false;

  let business: Awaited<ReturnType<typeof convex.query>> | null = null;

  try {
    business = await convex.query(api.businesses.forClerkUser, {
      clerkUserId: user.id,
      appUrl,
    });
  } catch (error) {
    hasConvexError = true;
    console.error("Failed to load business for dashboard", error);
  }

  let dashboardData: Awaited<ReturnType<typeof convex.query>> | null = null;

  if (business) {
    try {
      dashboardData = await convex.query(api.feedbacks.dashboardData, {
        businessId: business._id,
      });
    } catch (error) {
      hasConvexError = true;
      console.error("Failed to load dashboard data", error);
    }
  }

  const businessName = business?.name ?? "Your business";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7ff] text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <HeaderMegaMenu />
      <PageBackground>
        <div className="absolute left-1/2 top-[-8%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.22),_rgba(255,255,255,0))] blur-3xl" />
        <div className="absolute right-[6%] top-[28%] h-60 w-60 rounded-full bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.32),_rgba(255,255,255,0))] blur-3xl" />
        <div className="absolute left-[10%] bottom-[18%] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.28),_rgba(255,255,255,0))] blur-3xl" />
      </PageBackground>

      <DashboardContent
        initialBusinessName={businessName}
        initialDashboardData={dashboardData}
        initialHasConvexError={hasConvexError}
      />
    </div>
  );
}
