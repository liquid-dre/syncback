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

export default function SettingsLoading() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7ff] text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <HeaderMegaMenu />
      <PageBackground>
        <div className="absolute left-1/2 top-[-8%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.22),_rgba(255,255,255,0))] blur-3xl" />
        <div className="absolute right-[8%] top-[24%] h-60 w-60 rounded-full bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.3),_rgba(255,255,255,0))] blur-3xl" />
        <div className="absolute left-[12%] bottom-[20%] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.26),_rgba(255,255,255,0))] blur-3xl" />
      </PageBackground>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-24 pt-20 sm:px-8 lg:px-12">
        <section className="grid gap-10 lg:grid-cols-[minmax(0,_1.05fr)_minmax(0,_0.95fr)] lg:items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/80 px-4 py-2 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/60">
              <div className="h-5 w-5 rounded-full bg-sky-400/60" />
              <TextSkeleton className="w-48" />
            </div>
            <div className="space-y-4">
              <BlockSkeleton className="h-12 w-full rounded-[28px]" />
              <TextSkeleton className="h-5 w-3/4" />
              <TextSkeleton className="h-5 w-2/3" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm animate-pulse backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-sky-400/20" />
                    <TextSkeleton className="w-28" />
                  </div>
                  <TextSkeleton className="mt-3 h-4 w-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-xl backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/60">
            <div className="absolute -left-8 top-10 h-24 w-24 rounded-full bg-sky-400/30 blur-3xl" />
            <div className="absolute -right-10 bottom-12 h-28 w-28 rounded-full bg-emerald-400/30 blur-3xl" />
            <div className="relative space-y-6">
              <BlockSkeleton className="h-6 w-40 rounded-xl" />
              <BlockSkeleton className="h-44 w-full rounded-3xl" />
              <div className="flex flex-wrap items-center justify-center gap-3">
                <BlockSkeleton className="h-9 w-32 rounded-full" />
                <BlockSkeleton className="h-9 w-32 rounded-full" />
              </div>
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden rounded-[36px] border border-white/70 bg-white/90 p-6 shadow-2xl backdrop-blur sm:p-10">
          <div className="absolute -left-12 top-16 h-32 w-32 rounded-full bg-sky-400/30 blur-3xl" />
          <div className="absolute -right-14 bottom-20 h-36 w-36 rounded-full bg-emerald-400/30 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,_1fr)_minmax(0,_0.85fr)] lg:items-start">
            <div className="space-y-8">
              <div className="space-y-3">
                <BlockSkeleton className="h-4 w-32 rounded-full" />
                <BlockSkeleton className="h-10 w-full max-w-sm rounded-[28px]" />
                <TextSkeleton className="h-4 w-3/4" />
                <TextSkeleton className="h-4 w-2/3" />
              </div>

              <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-4 shadow-inner animate-pulse dark:border-slate-700/60 dark:bg-slate-900/60">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-emerald-400/50" />
                  <TextSkeleton className="w-40" />
                </div>
                <TextSkeleton className="h-4 w-3/5" />
              </div>

              <div className="space-y-6">
                {[0, 1].map((index) => (
                  <div key={index} className="space-y-2">
                    <BlockSkeleton className="h-4 w-32 rounded-full" />
                    <BlockSkeleton className="h-12 w-full rounded-2xl" />
                    <TextSkeleton className="h-3.5 w-2/3" />
                  </div>
                ))}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <TextSkeleton className="h-4 w-48" />
                  <BlockSkeleton className="h-11 w-32 rounded-full" />
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-white/60 bg-white/75 p-6 shadow-inner dark:border-slate-700/60 dark:bg-slate-900/60">
              <div className="absolute -top-12 left-16 h-32 w-32 rounded-full bg-sky-400/20 blur-3xl" />
              <div className="absolute -bottom-14 right-6 h-28 w-28 rounded-full bg-emerald-400/20 blur-3xl" />
              <div className="relative space-y-6">
                <BlockSkeleton className="h-4 w-28 rounded-full" />
                <div className="flex flex-col items-center gap-6">
                  <div className="h-44 w-44 rounded-2xl border border-white/70 bg-white/90 shadow-sm animate-pulse dark:border-slate-700/60 dark:bg-slate-950/40" />
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <BlockSkeleton className="h-9 w-32 rounded-full" />
                    <BlockSkeleton className="h-9 w-32 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
