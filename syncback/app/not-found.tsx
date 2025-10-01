import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7ff] text-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-18%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.28),_rgba(245,247,255,0))] blur-3xl" />
        <div className="absolute left-[10%] top-[34%] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(236,72,153,0.22),_rgba(245,247,255,0))] blur-3xl" />
        <div className="absolute right-[14%] bottom-[20%] h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.24),_rgba(245,247,255,0))] blur-3xl" />
        <div className="absolute inset-0 bg-grid-soft opacity-40" />
        <div className="absolute inset-0 bg-noise opacity-30 mix-blend-soft-light" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6 py-20 sm:px-8">
        <div className="w-full max-w-3xl rounded-[32px] border border-white/80 bg-white/95 p-8 text-center shadow-[0_30px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:p-12">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-200/70 bg-amber-50/80 px-4 py-2 text-sm font-medium text-amber-700 shadow-sm">
            <Compass className="h-4 w-4" aria-hidden />
            Page not found
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            We can’t find the page you’re looking for
          </h1>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            The link might be out of date or the page may have moved. Try heading back to the dashboard or explore our latest updates.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to home
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-slate-300/70 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            >
              Go to dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
