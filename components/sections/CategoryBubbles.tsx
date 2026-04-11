"use client";

import { useState } from "react";
import { categoryGroups } from "@/lib/products";
import FadeInOnScroll from "@/components/ui/FadeInOnScroll";

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
    <section className="bg-brand-cream py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll>
          <p className="text-center text-xs font-medium tracking-[0.1em] uppercase text-brand-medium mb-3">
            ✦ Utforsk kategoriene ✦
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-brand-dark text-center mb-10 text-shadow-sm">
            Hva trenger du?
          </h2>
        </FadeInOnScroll>

        <FadeInOnScroll delay={100}>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <div
                key={cat.slug}
                className="relative group"
                onMouseEnter={() => setHovered(cat.slug)}
                onMouseLeave={() => setHovered(null)}
              >
                <a
                  href={`/produkter?kategori=${cat.slug}`}
                  className={`inline-block rounded-full px-7 py-3.5 font-medium text-base text-brand-dark shadow-inner transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:ring-2 hover:ring-brand-accent/20 ${cat.color}`}
                >
                  {cat.label}
                </a>

                {hovered === cat.slug && cat.previewImage && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 animate-fade-in pointer-events-none z-10 hidden sm:block">
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl border border-brand-soft/50 p-2 w-48 relative after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-solid after:border-t-white/95 after:border-t-[8px] after:border-x-transparent after:border-x-[8px] after:border-b-0">
                      <img
                        src={cat.previewImage}
                        alt={cat.label}
                        className="w-full rounded-md shadow-sm"
                      />
                      <p className="text-xs text-center mt-2 font-medium text-brand-dark">
                        {cat.label}
                      </p>
                      <p className="text-[10px] text-center mt-0.5 text-brand-medium">
                        {cat.count} planleggere
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
