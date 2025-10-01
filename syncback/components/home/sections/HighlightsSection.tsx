import type { LucideIcon } from "lucide-react";
import { Mail, QrCode, ShieldCheck } from "lucide-react";

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
] satisfies Array<{ title: string; description: string; icon: LucideIcon }>;

export function HighlightsSection() {
  return (
    <section
      id="tour"
      className="js-section-perks grid gap-10 rounded-[36px] border border-white/70 bg-white/70 p-10 shadow-xl shadow-slate-900/5 backdrop-blur lg:grid-cols-3"
    >
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
  );
}
