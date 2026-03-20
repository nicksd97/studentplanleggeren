import { categoryGroups } from "@/lib/products";
import ProductCard from "@/components/ui/ProductCard";
import Button from "@/components/ui/Button";

export default function ProductGrid() {
  return (
    <section id="planleggere" className="bg-brand-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium mb-3">
            ✦ 25 planleggere ✦
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-brand-dark mb-4">
            Verktøyene som gir deg kontroll
          </h2>
          <p className="text-brand-medium max-w-2xl mx-auto">
            Alle planleggere er fyllbare PDF-er — fyll inn digitalt eller skriv ut. 49 kr per stykk.
          </p>
        </div>

        {categoryGroups.map((group) => (
          <div key={group.key} className="mb-16 last:mb-12">
            <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium text-center mb-6">
              ✦ {group.label} ✦
            </p>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${
                group.products.length <= 3 ? "max-w-3xl mx-auto" : ""
              } ${group.products.length === 1 ? "max-w-sm mx-auto !grid-cols-1" : ""}`}
            >
              {group.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ))}

        {/* Funnel CTA */}
        <div className="text-center">
          <p className="text-brand-medium mb-4">
            Vil du ha alle 25? Spar 71% med komplett pakke.
          </p>
          <Button href="#komplett" variant="primary" className="text-base px-8 py-3.5">
            Se Studentplanlegger Komplett — 349 kr
          </Button>
        </div>
      </div>
    </section>
  );
}
