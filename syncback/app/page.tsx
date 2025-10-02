'use client';

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { CallToActionSection } from "@/components/home/sections/CallToActionSection";
import { FooterSection } from "@/components/home/sections/FooterSection";
import { HeroSection } from "@/components/home/sections/HeroSection";
import { HighlightsSection } from "@/components/home/sections/HighlightsSection";
import ScrollStack, { ScrollStackItem } from "@/components/home/ScrollStack";
import { TestimonialsSection } from "@/components/home/sections/TestimonialsSection";
import { WorkflowSection } from "@/components/home/sections/WorkflowSection";
import { HeaderMegaMenu } from "@/components/navigation/HeaderMegaMenu";
import { PageBackground } from "@/components/shared/PageBackground";

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [heroPulse, setHeroPulse] = useState(false);

  useEffect(() => {
    const triggerPulse = () => setHeroPulse(true);

    if (document.readyState === "complete") {
      triggerPulse();
    } else {
      window.addEventListener("load", triggerPulse);
    }

    return () => {
      window.removeEventListener("load", triggerPulse);
    };
  }, []);

  useEffect(() => {
    if (!mainRef.current) {
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const heroSection = gsap.utils.toArray<HTMLElement>(".js-section-hero")[0];
      if (heroSection) {
        gsap.from(heroSection, {
          autoAlpha: 0,
          y: 60,
          duration: 1.1,
          ease: "power3.out",
        });
      }

      const sectionSelectors = [
        ".js-section-perks",
        ".js-section-workflow",
        ".js-section-testimonials",
        ".js-section-cta",
      ];

      sectionSelectors.forEach((selector) => {
        gsap.utils.toArray<HTMLElement>(selector).forEach((section) => {
          ScrollTrigger.create({
            trigger: section,
            start: "top 80%",
            once: true,
            onEnter: () => {
              gsap.fromTo(
                section,
                { autoAlpha: 0, y: 60 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 1.1,
                  ease: "power3.out",
                  immediateRender: false,
                },
              );
            },
          });
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7ff] text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <HeaderMegaMenu />
      <PageBackground gridClassName="opacity-50" noiseClassName="opacity-40 mix-blend-soft-light">
        <div className="absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.28),_rgba(255,255,255,0))] blur-3xl" />
        <div className="absolute right-[8%] top-[25%] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.35),_rgba(255,255,255,0))] blur-3xl" />
        <div className="absolute left-[6%] bottom-[18%] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(45,212,191,0.32),_rgba(255,255,255,0))] blur-3xl" />
      </PageBackground>

      <main ref={mainRef} className="mx-auto flex w-full max-w-6xl flex-col gap-32 px-6 pb-24 pt-24 sm:px-8 lg:px-12">
        <HeroSection isPulsing={heroPulse} />
        <HighlightsSection />
        <section className="js-section-scrollstack">
          <div className="mx-auto max-w-5xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">How Syncback feels</p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Scroll through the handoff experience
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
              Every card highlights a key moment in the syncback workflow so you can quickly understand how your team keeps
              projects moving forward without the back-and-forth.
            </p>
          </div>
          <div className="mt-16 rounded-[48px] bg-white/60 p-6 shadow-xl ring-1 ring-slate-200 backdrop-blur-md dark:bg-slate-900/40 dark:ring-slate-800">
            <ScrollStack useWindowScroll className="max-h-[70vh]">
              <ScrollStackItem>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Auto-ingested briefs</h3>
                <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  Drop in your product specs and Syncback instantly structures them for designers, engineers, and GTM teams with
                  tailored fields and checklists.
                </p>
              </ScrollStackItem>
              <ScrollStackItem itemClassName="bg-blue-50/80 dark:bg-slate-800/60">
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Live status visibility</h3>
                <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  Watch every dependency progress in real time, with nudges automatically sent to owners before deadlines slip
                  through the cracks.
                </p>
              </ScrollStackItem>
              <ScrollStackItem>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">One-click handoffs</h3>
                <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  When everything is ready, Syncback packages assets, context, and launch steps into a single button press so
                  launches stay perfectly orchestrated.
                </p>
              </ScrollStackItem>
            </ScrollStack>
          </div>
        </section>
        <WorkflowSection />
        <TestimonialsSection />
        <CallToActionSection />
      </main>

      <FooterSection />
    </div>
  );
}
