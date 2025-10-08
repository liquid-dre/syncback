import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convexClient";

import { resolveAppUrl } from "../../../(dashboard)/settings/actions";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    console.error("Failed to load business for dashboard API", error);
  }

  let dashboardData: Awaited<ReturnType<typeof convex.query>> | null = null;

  if (business) {
    try {
      dashboardData = await convex.query(api.feedbacks.dashboardData, {
        businessId: business._id,
      });
    } catch (error) {
      hasConvexError = true;
      console.error("Failed to load dashboard data via API", error);
    }
  }

  const businessName = business?.name ?? "Your business";

  return NextResponse.json({
    businessName,
    dashboardData,
    hasConvexError,
  });
}
