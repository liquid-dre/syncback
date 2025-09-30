import Link from "next/link";
import {
  ArrowRight,
  Mail,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

const highlights = [
  {
    title: "Scan & share in under 10 seconds",
    description:
      "Guests simply scan the QR code and drop feedback with a quick star rating right from their phone.",
    icon: QrCode,
  },
  {
    title: "Instant alerts without dashboards",
    description:
      "Every response lands in your inbox instantly so you can celebrate wins or fix issues before they snowball.",
    icon: Mail,
  },
  {
    title: "Built for anonymous honesty",
    description:
      "No sign ups, no awkward conversations—just candid signals that help you improve customer happiness.",
    icon: ShieldCheck,
  },
];

const steps = [
  {
    title: "Create your SyncBack space",
    description:
      "Add a business name, drop in the email that should be notified, and generate your branded QR poster.",
  },
  {
    title: "Print, post, or display anywhere",
    description:
      "Place the QR code at checkout, tables, or digital screens. Customers land on a delightful feedback form.",
  },
  {
    title: "Collect insights in real time",
    description:
      "Every submission includes a star rating, open feedback, and device info so you always have actionable context.",
  },
];

const testimonials = [
  {
    quote:
      "SyncBack turned passive guests into active advocates overnight. We spot service slips before they hit reviews.",
    name: "Jasmine Lee",
    role: "Operations Lead, Wildflower Cafè",
  },
  {
    quote:
      "Our QR cards sit on every conference table. Speakers love the instant praise—and the constructive nudges.",
    name: "Omar Silva",
    role: "Event Director, Thrive Collective",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7ff] text-slate-950">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.28),_rgba(255,255,255,0))] blur-3xl" />
        <div className="absolute right-[8%] top-[25%] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.35),_rgba(255,255,255,0))] blur-3xl" />
        <div className="absolute left-[6%] bottom-[18%] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(45,212,191,0.32),_rgba(255,255,255,0))] blur-3xl" />
        <div className="absolute inset-0 bg-grid-soft opacity-50" />
        <div className="absolute inset-0 bg-noise opacity-40 mix-blend-soft-light" />
      </div>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-32 px-6 pb-24 pt-24 sm:px-8 lg:px-12">
        <section className="relative grid gap-16 lg:grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-sky-500" aria-hidden />
              Feedback that flows back instantly
            </span>
            <div className="relative inline-block">
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-200 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,186,90,0.75),_rgba(255,214,150,0.35),_rgba(255,255,255,0)_70%)] "
                aria-hidden
              />
              <h1 className="relative text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Close the feedback loop the moment customers scan with SyncBack.
              </h1>
            </div>
            <p className="max-w-xl text-lg text-slate-600 sm:text-xl">
              SyncBack is the QR-powered feedback lane that brings candid ratings straight to your inbox—no apps, no logins, just beautifully simple insights you can act on today.
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
              <div className="rounded-2xl border border-white/60 bg-white/70 p-4 text-center shadow-sm backdrop-blur">
                <p className="text-2xl font-semibold text-slate-900">+42%</p>
                <p>More in-moment feedback</p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/70 p-4 text-center shadow-sm backdrop-blur">
                <p className="text-2xl font-semibold text-slate-900">2 min</p>
                <p>Avg. setup time</p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/70 p-4 text-center shadow-sm backdrop-blur">
                <p className="text-2xl font-semibold text-slate-900">24/7</p>
                <p>Real-time alerts</p>
              </div>
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

        <section id="tour" className="grid gap-10 rounded-[36px] border border-white/70 bg-white/70 p-10 shadow-xl shadow-slate-900/5 backdrop-blur lg:grid-cols-3">
          {highlights.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group flex flex-col gap-4 rounded-3xl border border-transparent bg-white/0 p-6 transition duration-500 hover:-translate-y-2 hover:border-slate-200 hover:bg-white/70"
            >
              <div className="w-fit rounded-full bg-slate-900/90 p-3 text-white shadow-lg shadow-slate-900/20 transition duration-500 group-hover:scale-110 group-hover:bg-slate-900">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
                <p className="text-sm text-slate-600">{description}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-lg shadow-slate-900/10 backdrop-blur">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Workflow</span>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
              From scan to inbox in a heartbeat.
            </h2>
            <p className="mt-4 text-base text-slate-600">
              SyncBack was designed for busy teams that value clarity over clutter. Every step is purposefully light so you can move from setup to actionable feedback in minutes.
            </p>
            <div className="mt-8 space-y-6">
              {steps.map((step, index) => (
                <div key={step.title} className="relative pl-12">
                  <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white shadow-md shadow-slate-900/20">
                    <span className="text-base font-semibold">{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 -z-10 rounded-[40px] bg-gradient-to-br from-sky-200/70 via-indigo-200/40 to-transparent blur-2xl" aria-hidden />
            <div className="relative w-full max-w-xl rounded-[40px] border border-white/80 bg-white/80 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur">
              <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white">
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">Live session</p>
                <p className="mt-4 text-2xl font-semibold">Guest Feedback Board</p>
                <div className="mt-6 space-y-4 text-sm text-white/80">
                  <div className="flex items-center justify-between rounded-2xl bg-white/10 p-4">
                    <span>⭐️⭐️⭐️⭐️⭐️</span>
                    <span className="text-white/70">2 mins ago</span>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    “Front desk was so welcoming. Keep the smiles coming!”
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    “Tables were spotless and QR flow was effortless.”
                  </div>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white/80 p-5 text-sm text-slate-600 shadow-sm backdrop-blur">
                Your team is automatically looped in with actionable emails—no dashboards required.
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/70 bg-white/70 p-10 shadow-xl shadow-slate-900/5 backdrop-blur">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Loved by teams</span>
              <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                Real teams, real-time improvements.
              </h2>
              <p className="text-base text-slate-600">
                SyncBack keeps the spotlight on customer joy. The more you listen, the faster you iterate.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {testimonials.map(({ quote, name, role }) => (
                <div key={name} className="group flex h-full flex-col justify-between rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg shadow-slate-900/5 transition hover:-translate-y-2 hover:border-slate-300 hover:shadow-xl">
                  <p className="text-base text-slate-700">{quote}</p>
                  <div className="mt-6">
                    <p className="text-sm font-semibold text-slate-900">{name}</p>
                    <p className="text-xs text-slate-500">{role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="get-started"
          className="relative overflow-hidden rounded-[40px] border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 text-white shadow-2xl shadow-slate-900/30"
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
              className="group inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-xl transition hover:scale-[1.03]"
            >
              Create your free account
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 bg-white/70 py-10 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-slate-900">SyncBack</p>
            <p className="text-sm text-slate-500">Feedback that finds you first.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <Link href="#tour" className="transition hover:text-slate-900">
              Product tour
            </Link>
            <Link href="#" className="transition hover:text-slate-900">
              Pricing
            </Link>
            <Link href="#" className="transition hover:text-slate-900">
              Privacy
            </Link>
            <Link href="#" className="transition hover:text-slate-900">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
