import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CallToActionSection() {
  return (
    <section
      id="get-started"
      className="js-section-cta relative overflow-hidden rounded-[40px] border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 text-white shadow-2xl shadow-slate-900/30 dark:border-slate-700/80 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900/90 dark:shadow-slate-900/60"
    >
      <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay" aria-hidden />
      <div className="relative z-10 flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl space-y-4">
          <h2 className="text-3xl font-semibold sm:text-4xl">Ready to turn every scan into a conversation?</h2>
          <p className="text-base text-white/70">
            Start free, brand your QR code, and gather your first insights in minutes. No credit card required.
          </p>
        </div>
        <Link
          href="#"
          className="group inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-xl transition hover:scale-[1.03] dark:bg-sky-500 dark:text-slate-900 dark:shadow-sky-500/40 dark:hover:bg-sky-400"
        >
          Create your free account
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
