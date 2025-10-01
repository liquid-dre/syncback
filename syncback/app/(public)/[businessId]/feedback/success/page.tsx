import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Sparkles } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convexClient";

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
      title: "Thanks for sharing",
      description: "We appreciate your feedback.",
    };
  }

  return {
    title: `Thanks for sharing with ${business.name}`,
    description: `Your note has been delivered to ${business.name}.`,
  };
}

export default async function FeedbackSuccessPage({
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-20%] h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.35),_rgba(15,23,42,0))] blur-3xl" />
        <div className="absolute left-[16%] top-[30%] h-60 w-60 rounded-full bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.25),_rgba(15,23,42,0))] blur-3xl" />
        <div className="absolute right-[18%] bottom-[20%] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(96,165,250,0.25),_rgba(15,23,42,0))] blur-3xl" />
        <div className="absolute inset-0 bg-grid-soft opacity-30" />
        <div className="absolute inset-0 bg-noise opacity-30 mix-blend-soft-light" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 py-20 text-center sm:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-sky-100 backdrop-blur">
          <Sparkles className="h-4 w-4 text-sky-200" aria-hidden />
          Feedback delivered
        </div>
        <CheckCircle2 className="mt-10 h-16 w-16 text-emerald-300" strokeWidth={1.6} aria-hidden />
        <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
          Thanks for sharing with {business.name}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-200 sm:text-lg">
          Your feedback is now in the hands of the {business.name} team. Every response helps them celebrate what’s working and refine what comes next.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/${business.slug}/feedback`}
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Share another response
          </Link>
          <Link
            href="https://syncback.app"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
          >
            Learn more about SyncBack
          </Link>
        </div>
      </div>
    </div>
  );
}
