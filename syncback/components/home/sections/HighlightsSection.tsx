"use client";

import type { LucideIcon } from "lucide-react";
import { Mail, QrCode, ShieldCheck } from "lucide-react";

import ScrollStack, { ScrollStackItem } from "../ScrollStack";

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
      className="js-section-perks rounded-[36px] border border-white/70 bg-white/70 p-6 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/60 dark:shadow-slate-900/40"
    >
      <ScrollStack className="h-[680px] max-h-[80vh] rounded-[28px] bg-transparent">
        {highlights.map(({ icon: Icon, title, description }) => (
          <ScrollStackItem
            key={title}
            itemClassName="group flex h-auto min-h-[20rem] flex-col justify-between gap-6 border border-white/50 bg-white/90 p-10 text-left transition duration-500 hover:-translate-y-1 hover:border-slate-200 hover:bg-white dark:border-slate-700/70 dark:bg-slate-900/80 dark:hover:border-slate-600"
          >
            <div className="w-fit rounded-full bg-slate-900/90 p-3 text-white shadow-lg shadow-slate-900/20 transition duration-500 group-hover:scale-110 group-hover:bg-slate-900 dark:bg-sky-500/20 dark:text-sky-300 dark:shadow-slate-900/40">
              <Icon className="h-5 w-5" aria-hidden />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
              <p className="text-base text-slate-600 dark:text-slate-300">{description}</p>
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
}
