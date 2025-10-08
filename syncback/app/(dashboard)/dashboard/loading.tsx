import { HeaderMegaMenu } from "@/components/navigation/HeaderMegaMenu";
import { PageBackground } from "@/components/shared/PageBackground";

const skeletonCardBase =
  "group relative overflow-hidden rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/60 dark:shadow-slate-900/40";

function TextSkeleton({ className }: { className?: string }) {
  return <div className={`h-4 animate-pulse rounded-full bg-slate-200/80 dark:bg-slate-700/70 ${className ?? ""}`} />;
}

function BlockSkeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-3xl bg-slate-200/60 dark:bg-slate-700/50 ${className ?? ""}`} />;
}

export default function DashboardLoading() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7ff] text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <HeaderMegaMenu />
      <PageBackground>
        <div className="absolute left-1/2 top-[-8%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.22),_rgba(255,255,255,0))] blur-3xl" />
        <div className="absolute right-[6%] top-[28%] h-60 w-60 rounded-full bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.32),_rgba(255,255,255,0))] blur-3xl" />
        <div className="absolute left-[10%] bottom-[18%] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.28),_rgba(255,255,255,0))] blur-3xl" />
      </PageBackground>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-24 pt-20 sm:px-8 lg:px-12">
        <section className="space-y-6">
          <div className="space-y-3">
            <TextSkeleton className="w-40" />
            <BlockSkeleton className="h-10 w-80 rounded-2xl" />
            <TextSkeleton className="h-5 w-64" />
          </div>
          <div className="overflow-hidden rounded-[32px] border border-white/60 bg-white/70 p-8 shadow-xl backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/60 dark:shadow-slate-900/40">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="flex h-40 flex-col justify-between rounded-2xl border border-white/40 bg-white/80 p-6 shadow-inner animate-pulse dark:border-slate-700/40 dark:bg-slate-900/70">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-200/80 dark:bg-slate-700/70" />
                    <div className="flex flex-col gap-2">
                      <TextSkeleton className="w-24" />
                      <TextSkeleton className="w-20" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <BlockSkeleton className="h-6 w-28 rounded-xl" />
                    <TextSkeleton className="w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-10 lg:grid-cols-2">
          <section className={skeletonCardBase}>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <BlockSkeleton className="h-6 w-44 rounded-xl" />
                <TextSkeleton className="w-40" />
              </div>
              <BlockSkeleton className="h-7 w-24 rounded-full" />
            </div>
            <BlockSkeleton className="mt-8 h-72 w-full rounded-3xl" />
          </section>
          <section className={skeletonCardBase}>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <BlockSkeleton className="h-6 w-48 rounded-xl" />
                <TextSkeleton className="w-40" />
              </div>
              <BlockSkeleton className="h-7 w-24 rounded-full" />
            </div>
            <BlockSkeleton className="mt-8 h-72 w-full rounded-3xl" />
          </section>
        </div>

        <section className={`${skeletonCardBase} lg:col-span-2`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <BlockSkeleton className="h-6 w-52 rounded-xl" />
              <TextSkeleton className="w-60" />
            </div>
            <BlockSkeleton className="h-7 w-36 rounded-full" />
          </div>
          <div className="mt-8 space-y-4">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="flex flex-col gap-3 rounded-2xl border border-white/50 bg-white/75 p-4 shadow-inner animate-pulse dark:border-slate-700/50 dark:bg-slate-900/70">
                <BlockSkeleton className="h-5 w-48 rounded-lg" />
                <TextSkeleton className="w-full" />
                <TextSkeleton className="w-3/5" />
              </div>
            ))}
          </div>
        </section>

        <section className={`${skeletonCardBase} lg:col-span-2`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <BlockSkeleton className="h-6 w-48 rounded-xl" />
              <TextSkeleton className="w-56" />
            </div>
            <BlockSkeleton className="h-7 w-32 rounded-full" />
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="flex flex-col gap-3 rounded-2xl border border-white/50 bg-white/75 p-4 shadow-inner animate-pulse dark:border-slate-700/50 dark:bg-slate-900/70">
                <BlockSkeleton className="h-8 w-full rounded-xl" />
                <TextSkeleton className="w-2/3" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
