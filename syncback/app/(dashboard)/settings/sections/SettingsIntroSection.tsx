import { BadgeCheck, MailCheck, QrCode, Sparkles } from "lucide-react";

const highlights = [
  {
    icon: Sparkles,
    title: "Brand-ready in minutes",
    description: "Your QR card pulls through your business name and routes guests to a polished form.",
  },
  {
    icon: MailCheck,
    title: "Instant inbox alerts",
    description: "Every response lands in the inbox you specify so you can act before issues snowball.",
  },
  {
    icon: BadgeCheck,
    title: "Anonymous & honest",
    description: "Guests don't need to log in—just scan, rate, and send feedback straight to you.",
  },
] as const;

export function SettingsIntroSection() {
  return (
    <section className="grid gap-10 lg:grid-cols-[minmax(0,_1.05fr)_minmax(0,_0.95fr)] lg:items-center">
      <div className="space-y-7">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur">
          <Sparkles className="h-4 w-4 text-sky-500" aria-hidden />
          Craft your feedback hub
        </span>
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Set up a beautiful QR-powered page for collecting guest feedback
          </h1>
          <p className="max-w-xl text-base text-slate-600 sm:text-lg">
            Add your business details once and we&rsquo;ll generate a shareable QR card plus a magic link that guides every guest back to your private feedback form.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {highlights.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10 text-sky-600">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
              </div>
              <p className="mt-3 text-sm text-slate-600">{description}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative order-first flex items-center justify-center lg:order-last">
        <div className="relative w-full max-w-md rounded-[32px] border border-white/70 bg-white/70 p-8 shadow-xl backdrop-blur">
          <div className="absolute -left-6 top-8 hidden h-20 w-20 rounded-full bg-gradient-to-br from-sky-400/40 to-blue-500/10 blur-xl lg:block" />
          <div className="absolute -right-6 bottom-8 hidden h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400/40 to-emerald-500/10 blur-xl lg:block" />
          <div className="relative flex flex-col items-center gap-5 text-center">
            <div className="rounded-full bg-sky-500/10 p-3 text-sky-600">
              <QrCode className="h-6 w-6" aria-hidden />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Drop your details, receive a branded QR card</h2>
            <p className="text-sm text-slate-600">
              Perfect for tabletops, checkout counters, event lanyards—wherever your guests linger.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
