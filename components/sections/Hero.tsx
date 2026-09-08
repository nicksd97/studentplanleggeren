"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/landing/Eyebrow";
import Tag from "@/components/landing/Tag";
import Parallax from "@/components/landing/Parallax";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Entrance: heading lines slide up out of their masks, then the rest fades in
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          // fromTo (not from): the start state matches the CSS pre-hide in globals.css,
          // so the server-rendered hero never flashes visible and snaps away at hydration
          .fromTo(
            "[data-hero-line]",
            { yPercent: 110 },
            { yPercent: 0, duration: 1.1, stagger: 0.12 },
            0.15
          )
          .fromTo(
            "[data-hero-fade]",
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
            0.55
          );
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="relative">
      {/* Full-height opening */}
      <div className="relative min-h-[100svh] flex flex-col justify-center pt-28 pb-20 md:pt-32">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl lg:max-w-[60%]">
            <div data-hero-fade>
              <Eyebrow n="01">Laget for norske studenter</Eyebrow>
            </div>

            <h1 className="mt-6 font-[family-name:var(--font-display)] font-bold leading-[0.92] tracking-[-0.02em] text-[clamp(3.25rem,9.5vw,8.5rem)] text-ink">
              <span className="block overflow-hidden pb-[0.08em]">
                <span data-hero-line className="block italic font-normal text-ink/80">
                  Få orden på
                </span>
              </span>{" "}
              <span className="block overflow-hidden pb-[0.12em]">
                <span data-hero-line className="block">
                  studiene.
                </span>
              </span>
            </h1>

            <p data-hero-fade className="mt-8 max-w-xl text-lg sm:text-xl leading-relaxed text-ink-muted">
              Studentplanlegger: 25 fyllbare PDF-planleggere for studenter. Daglig, ukentlig,
              månedlig — skriv ut eller fyll inn direkte på skjermen.
            </p>

            <div data-hero-fade className="mt-10 flex flex-col sm:flex-row sm:items-center gap-3">
              <Button
                href="#pakker"
                variant="primary"
                className="text-base px-8 py-3.5 shadow-[0_0_32px_rgba(196,168,130,0.35)]"
              >
                Se komplett pakke — 349 kr
              </Button>
              <Button href="/produkter" variant="ghost" className="text-base px-8 py-3.5">
                Utforsk planleggerne
              </Button>
            </div>

            <div data-hero-fade className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
              <Tag>Betal med Vipps eller kort</Tag>
              <Tag>Fyllbare PDF-er</Tag>
              <Tag>Umiddelbar nedlasting</Tag>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          data-hero-fade
          className="hidden md:flex absolute bottom-8 left-8 lg:left-16 items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-ink-muted"
        >
          <span className="h-px w-10 bg-ink-muted/50" />
          Scroll
        </div>
      </div>

      {/* Cover photo as a floating card */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-8 md:pb-16">
        <Parallax amount={90} className="max-w-3xl mx-auto">
          <img
            src="/images/brand/Front page cover photo rev.2.png"
            alt="Studentplanlegger produkter — 25 fyllbare PDF-planleggere"
            width={1320}
            height={972}
            className="w-full h-auto block rounded-xl -rotate-1 ring-1 ring-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.65)] transition-transform duration-700 hover:rotate-0"
          />
        </Parallax>
      </div>
    </section>
  );
}
