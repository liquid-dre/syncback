import "@mantine/core/styles.css";
import "./globals.css";

import { HeaderMegaMenu } from "@/components/navigation/HeaderMegaMenu";
import { PageBackground } from "@/components/shared/PageBackground";

function TextSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`h-4 animate-pulse rounded-full bg-slate-200/80 dark:bg-slate-700/70 ${className ?? ""}`}
    />
  );
}

function BlockSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-3xl bg-slate-200/60 dark:bg-slate-700/50 ${className ?? ""}`}
    />
  );
}

export default function RootLoading() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7ff] text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <HeaderMegaMenu />
      <PageBackground gridClassName="opacity-50" noiseClassName="opacity-40 mix-blend-soft-light">
        <div className="absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.28),_rgba(255,255,255,0))] blur-3xl" />
        <div className="absolute right-[8%] top-[25%] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.35),_rgba(255,255,255,0))] blur-3xl" />
        <div className="absolute left-[6%] bottom-[18%] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(45,212,191,0.32),_rgba(255,255,255,0))] blur-3xl" />
      </PageBackground>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-24 pt-24 sm:px-8 lg:px-12">
        <section className="grid gap-16 lg:grid-cols-[minmax(0,_1fr)_minmax(0,_0.75fr)] lg:items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/80 px-4 py-2 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/60">
              <div className="h-4 w-4 rounded-full bg-sky-400/60" />
              <TextSkeleton className="w-40" />
            </div>
            <div className="space-y-4">
              <BlockSkeleton className="h-14 w-full max-w-xl rounded-3xl" />
              <TextSkeleton className="h-5 w-3/4" />
              <TextSkeleton className="h-5 w-2/3" />
            </div>
            <div className="flex flex-wrap gap-3">
              <BlockSkeleton className="h-11 w-36 rounded-full" />
              <BlockSkeleton className="h-11 w-40 rounded-full" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/80 p-10 shadow-xl backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/60">
            <div className="absolute -left-8 top-12 h-28 w-28 rounded-full bg-sky-400/30 blur-3xl" />
            <div className="absolute -right-10 bottom-10 h-32 w-32 rounded-full bg-emerald-400/30 blur-3xl" />
            <div className="relative space-y-5">
              <BlockSkeleton className="h-6 w-48 rounded-xl" />
              <BlockSkeleton className="h-48 w-full rounded-3xl" />
              <div className="flex flex-wrap items-center gap-4">
                <BlockSkeleton className="h-10 w-32 rounded-full" />
                <BlockSkeleton className="h-10 w-32 rounded-full" />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm animate-pulse dark:border-slate-700/70 dark:bg-slate-900/60"
              >
                <div className="h-12 w-12 rounded-2xl bg-slate-200/70 dark:bg-slate-700/60" />
                <TextSkeleton className="w-24" />
                <TextSkeleton className="w-32" />
              </div>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {[0, 1].map((index) => (
              <div
                key={index}
                className="space-y-5 rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-lg animate-pulse backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/60"
              >
                <BlockSkeleton className="h-6 w-48 rounded-xl" />
                <TextSkeleton className="w-4/5" />
                <BlockSkeleton className="h-60 w-full rounded-3xl" />
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/40 bg-white/70 px-6 py-10 shadow-inner backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/60 sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <TextSkeleton className="h-5 w-40" />
          <div className="flex flex-wrap gap-4">
            {[0, 1, 2].map((index) => (
              <TextSkeleton key={index} className="h-4 w-24" />
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
