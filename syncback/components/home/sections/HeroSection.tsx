import Link from "next/link";
import { ArrowRight, Mail, MessageCircle, QrCode, Sparkles, Star } from "lucide-react";

const floatingStats = [
  { label: "More in-moment feedback", value: "+42%" },
  { label: "Avg. setup time", value: "2 min" },
  { label: "Real-time alerts", value: "24/7" },
] as const;

export type HeroSectionProps = {
  isPulsing: boolean;
};

export function HeroSection({ isPulsing }: HeroSectionProps) {
  return (
    <section className="js-section-hero relative grid gap-16 lg:grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)] lg:items-center">
      <div className="space-y-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur">
          <Sparkles className="h-4 w-4 text-sky-500" aria-hidden />
          Feedback that flows back instantly
        </span>
        <div className="relative inline-block">
          <div
            className={`pointer-events-none absolute left-1/2 top-1/2 h-200 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.7),_rgba(56,189,248,0.38),_rgba(255,255,255,0)_70%)] ${
              isPulsing ? "animate-hero-pulse" : ""
            }`}
            aria-hidden
          />
          <h1 className="relative text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Close the feedback loop the moment customers scan with SyncBack.
          </h1>
        </div>
        <p className="max-w-xl text-lg text-slate-600 sm:text-xl">
          SyncBack is the QR-powered feedback lane that brings candid ratings straight to your inbox—no apps, no logins, just
          beautifully simple insights you can act on today.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="#get-started"
            className="group inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-base font-medium text-white shadow-lg shadow-slate-900/20 transition hover:scale-[1.02] hover:bg-slate-800"
          >
            Start for free
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
          <Link
            href="#tour"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-base font-medium text-slate-900 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-slate-300"
          >
            See how it works
          </Link>
        </div>
        <div className="grid max-w-2xl grid-cols-2 gap-4 text-sm text-slate-600 sm:grid-cols-3">
          {floatingStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/60 bg-white/70 p-4 text-center shadow-sm backdrop-blur">
              <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center gap-6">
        <div className="relative h-full w-full max-w-[420px] rounded-[36px] border border-white/80 bg-white/80 p-6 shadow-xl shadow-slate-900/10 backdrop-blur">
          <div className="flex items-center justify-between rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white">
            <div>
              <p className="text-sm text-white/70">New feedback</p>
              <p className="text-2xl font-semibold">“Service was so attentive today!”</p>
              <div className="mt-4 flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} className="h-5 w-5 fill-amber-400 text-amber-400" aria-hidden />
                ))}
              </div>
            </div>
            <div className="rounded-full bg-white/10 p-3">
              <MessageCircle className="h-6 w-6" aria-hidden />
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-slate-300">
              <div className="rounded-full bg-slate-900/90 p-2 text-white shadow-lg">
                <QrCode className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Lobby kiosk</p>
                <p className="text-sm text-slate-600">“Loved the express checkout. Keep it up!”</p>
              </div>
            </div>
            <div className="animate-float animate-glow rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-lg backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Email alert sent to</p>
                  <p className="text-base font-semibold text-slate-900">hello@syncback.com</p>
                </div>
                <Mail className="h-5 w-5 text-sky-500" aria-hidden />
              </div>
              <p className="mt-4 text-sm text-slate-600">
                “Team handled our concern within minutes. Really appreciated the follow up!”
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-3xl border border-white/70 bg-white/80 px-5 py-4 text-sm font-medium text-slate-700 shadow-lg shadow-slate-900/10 backdrop-blur animate-float">
          <div className="flex items-center gap-1 text-amber-400">
            {[...Array(5)].map((_, index) => (
              <Star key={`floating-${index}`} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          “Made sharing thoughts so easy!”
        </div>
      </div>
    </section>
  );
}
