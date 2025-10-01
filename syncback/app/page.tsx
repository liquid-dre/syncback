'use client';

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { CallToActionSection } from "@/components/home/sections/CallToActionSection";
import { FooterSection } from "@/components/home/sections/FooterSection";
import { HeroSection } from "@/components/home/sections/HeroSection";
import { HighlightsSection } from "@/components/home/sections/HighlightsSection";
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
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7ff] text-slate-950">
      <HeaderMegaMenu />
      <PageBackground gridClassName="opacity-50" noiseClassName="opacity-40 mix-blend-soft-light">
        <div className="absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.28),_rgba(255,255,255,0))] blur-3xl" />
        <div className="absolute right-[8%] top-[25%] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.35),_rgba(255,255,255,0))] blur-3xl" />
        <div className="absolute left-[6%] bottom-[18%] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(45,212,191,0.32),_rgba(255,255,255,0))] blur-3xl" />
      </PageBackground>

      <main ref={mainRef} className="mx-auto flex w-full max-w-6xl flex-col gap-32 px-6 pb-24 pt-24 sm:px-8 lg:px-12">
        <HeroSection isPulsing={heroPulse} />
        <HighlightsSection />
        <WorkflowSection />
        <TestimonialsSection />
        <CallToActionSection />
      </main>

      <FooterSection />
    </div>
  );
}
