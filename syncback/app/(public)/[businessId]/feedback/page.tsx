import { notFound } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convexClient";

import FeedbackForm from "./ui/feedback-form";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  const slug = decodeURIComponent(businessId);
  const convex = getConvexClient();

  const business = await convex
    .query(api.businesses.publicInfo, { slug })
    .catch(() => null);

  if (!business) {
    return {
      title: "Share your feedback",
      description: "Tell us about your recent experience.",
    };
  }

  return {
    title: `${business.name} feedback`,
    description: `Share your experience with ${business.name}.`,
  };
}

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  const slug = decodeURIComponent(businessId);
  const convex = getConvexClient();

  const business = await convex
    .query(api.businesses.publicInfo, { slug })
    .catch(() => null);

  if (!business) {
    notFound();
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7ff] text-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-18%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.28),_rgba(245,247,255,0))] blur-3xl" />
        <div className="absolute left-[10%] top-[32%] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(236,72,153,0.24),_rgba(245,247,255,0))] blur-3xl" />
        <div className="absolute right-[12%] bottom-[20%] h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,_rgba(45,212,191,0.22),_rgba(245,247,255,0))] blur-3xl" />
        <div className="absolute inset-0 bg-grid-soft opacity-40" />
        <div className="absolute inset-0 bg-noise opacity-30 mix-blend-soft-light" />
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 pb-16 pt-20 sm:px-8">
        <div className="space-y-4 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-sky-600 shadow-sm backdrop-blur">
            We love hearing from you
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Share your experience with {business.name}
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg">
            Your voice helps {business.name} celebrate the wins and spot the moments to improve. Rate your visit and leave a few words below.
          </p>
        </div>

        <FeedbackForm business={business} />
      </div>
    </div>
  );
}
