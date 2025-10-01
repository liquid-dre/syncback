import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

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
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7ff] text-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-18%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.32),_rgba(245,247,255,0))] blur-3xl" />
        <div className="absolute left-[12%] top-[32%] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.22),_rgba(245,247,255,0))] blur-3xl" />
        <div className="absolute right-[16%] bottom-[22%] h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.24),_rgba(245,247,255,0))] blur-3xl" />
        <div className="absolute inset-0 bg-grid-soft opacity-40" />
        <div className="absolute inset-0 bg-noise opacity-30 mix-blend-soft-light" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-6 py-20 sm:px-8">
        <div className="w-full max-w-3xl rounded-[32px] border border-white/80 bg-white/95 p-8 text-center shadow-[0_30px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:p-12">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-sky-200/60 bg-sky-50/80 px-4 py-2 text-sm font-medium text-sky-700 shadow-sm">
            <Sparkles className="h-4 w-4" aria-hidden />
            Feedback delivered
          </div>
          <CheckCircle2 className="mx-auto mt-10 h-16 w-16 text-emerald-500" strokeWidth={1.6} aria-hidden />
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Thanks for sharing with {business.name}
          </h1>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            We’ve passed your note directly to the {business.name} crew. Their team reviews every response to celebrate what guests love and smooth out the rough edges.
          </p>
          <div className="mt-8 grid gap-6 rounded-3xl border border-slate-200/70 bg-slate-50/70 p-6 text-left text-sm text-slate-600 sm:grid-cols-2">
            <div className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">What happens next</h2>
              <ul className="space-y-2 text-sm leading-6">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                  Your rating is instantly logged in SyncBack for the {business.name} leadership team.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-sky-500" aria-hidden />
                  They’ll review trends and follow up with their team to keep improving the experience.
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Want to do more?</h2>
              <ul className="space-y-2 text-sm leading-6">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-amber-500" aria-hidden />
                  Share another visit or update your thoughts any time you stop by.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-violet-500" aria-hidden />
                  Explore how SyncBack helps businesses craft unforgettable guest journeys.
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={`/${business.slug}/feedback`}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
            >
              Share another response
            </Link>
            <Link
              href="https://syncback.app"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300/70 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            >
              Learn more about SyncBack
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
