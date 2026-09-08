"use client";

import { useState } from "react";
import { categoryGroups } from "@/lib/products";
import Eyebrow from "@/components/landing/Eyebrow";
import Reveal from "@/components/landing/Reveal";

const categories = [
  { slug: "daglig", label: "Daglig", color: "bg-[#F5E6D3]" },
  { slug: "ukentlig", label: "Ukentlig", color: "bg-[#E2EBD8]" },
  { slug: "maanedlig", label: "Månedlig", color: "bg-[#DDE4EE]" },
  { slug: "aarlig", label: "Årlig", color: "bg-[#F0E0EC]" },
  { slug: "produktivitet", label: "Produktivitet", color: "bg-[#E8DDD4]" },
  { slug: "helse", label: "Helse og livsstil", color: "bg-[#D8E8E0]" },
  { slug: "sporing", label: "Sporing", color: "bg-[#EDE4D8]" },
].map((cat) => {
  const group = categoryGroups.find((g) => g.key === cat.slug);
  return {
    ...cat,
    count: group?.products.length ?? 0,
    previewImage: group?.products[0]
      ? `/images/products/${group.products[0].image}`
      : "",
  };
});

export default function CategoryBubbles() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="relative py-24 md:py-36 overflow-x-clip">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Eyebrow n="03">Utforsk kategoriene</Eyebrow>
          <h2 className="mt-4 font-[family-name:var(--font-display)] font-bold leading-[0.95] tracking-[-0.02em] text-[clamp(2.5rem,6vw,5.5rem)] text-ink">
            Hva <span className="italic font-normal text-ink/80">trenger</span> du?
          </h2>
        </Reveal>

        <Reveal delay={100} className="mt-12 md:mt-16">
          <div className="flex flex-wrap gap-3 sm:gap-4 max-w-3xl">
            {categories.map((cat) => (
              <div
                key={cat.slug}
                className="relative group"
                onMouseEnter={() => setHovered(cat.slug)}
                onMouseLeave={() => setHovered(null)}
              >
                <a
                  href={`/produkter?kategori=${cat.slug}`}
                  className={`inline-block rounded-full px-7 py-3.5 font-medium text-base text-brand-dark shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)] hover:ring-2 hover:ring-brand-accent/40 ${cat.color}`}
                >
                  {cat.label}
                </a>

                {hovered === cat.slug && cat.previewImage && (
                  <div className="absolute bottom-full left-0 mb-4 animate-fade-in pointer-events-none z-10 hidden sm:block">
                    <div className="relative w-48 rounded-lg border border-line bg-[#1A1410]/95 md:backdrop-blur-sm p-2 text-ink shadow-2xl after:absolute after:top-full after:left-8 after:border-solid after:border-t-[#1A1410] after:border-t-[8px] after:border-x-transparent after:border-x-[8px] after:border-b-0">
                      <img
                        src={cat.previewImage}
                        alt={cat.label}
                        className="w-full rounded-md ring-1 ring-white/10"
                      />
                      <p className="mt-2 text-center text-xs font-medium text-ink">
                        {cat.label}
                      </p>
                      <p className="mt-0.5 text-center text-[10px] text-ink-muted">
                        {cat.count} planleggere
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
