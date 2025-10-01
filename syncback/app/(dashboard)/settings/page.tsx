import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { SettingsIntroSection } from "./sections/SettingsIntroSection";
import { SettingsForm } from "./settings-form";
import { resolveAppUrl, type SettingsFormState } from "./actions";
import { HeaderMegaMenu } from "@/components/navigation/HeaderMegaMenu";
import { PageBackground } from "@/components/shared/PageBackground";
import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convexClient";

export default async function SettingsPage() {
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

  const defaultEmail = user.primaryEmailAddress?.emailAddress ?? "";

  const initialState: SettingsFormState = {
    status: "idle",
    businessId: business?._id,
    name: business?.name ?? "",
    email: business?.email ?? defaultEmail,
    slug: business?.slug ?? "",
    qrSvg: business?.qrSvg ?? undefined,
    feedbackUrl:
      business?.feedbackUrl ??
      (business?.slug ? `${appUrl.replace(/\/$/, "")}/${business.slug}/feedback` : undefined),
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7ff] text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <HeaderMegaMenu />
      <PageBackground>
        <div className="absolute left-1/2 top-[-8%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.22),_rgba(255,255,255,0))] blur-3xl" />
        <div className="absolute right-[8%] top-[24%] h-60 w-60 rounded-full bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.3),_rgba(255,255,255,0))] blur-3xl" />
        <div className="absolute left-[12%] bottom-[20%] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.26),_rgba(255,255,255,0))] blur-3xl" />
      </PageBackground>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-24 pt-20 sm:px-8 lg:px-12">
        <SettingsIntroSection />
        <SettingsForm initialState={initialState} />
      </main>
    </div>
  );
}
