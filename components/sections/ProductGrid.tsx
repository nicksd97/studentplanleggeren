import { finansProdukter, produktivitetsProdukter } from "@/lib/products";
import ProductCard from "@/components/ui/ProductCard";
import Button from "@/components/ui/Button";

export default function ProductGrid() {
  return (
    <>
      {/* Finansverktøy */}
      <section id="okonomi" className="bg-brand-cream py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium mb-3">
              ✦ Nye finansverktøy ✦
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-brand-dark mb-4">
              Ta kontroll over studentøkonomien
            </h2>
            <p className="text-brand-medium max-w-2xl mx-auto">
              Hvert verktøy kommer som utskrivbar PDF og interaktivt regneark med innebygde formler. Velg formatet som passer deg.
            </p>
          </div>

          {/* 3+2 grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {finansProdukter.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
            {finansProdukter.slice(3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Funnel CTA */}
          <div className="text-center">
            <p className="text-brand-medium mb-4">
              Vil du ha alle 5? Spar 306 kr med pakken.
            </p>
            <Button href="#okonomipakken" variant="primary" className="text-base px-8 py-3.5">
              Se Økonomipakken — 399 kr
            </Button>
          </div>
        </div>
      </section>

      {/* Produktivitetsplanleggere */}
      <section id="produktivitet" className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium mb-3">
              ✦ Produktivitetsplanleggere ✦
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-brand-dark mb-4">
              Hold orden på studiene
            </h2>
            <p className="text-brand-medium max-w-2xl mx-auto">
              Ukentlig planlegger, vane-tracker, pomodoro og mer — utskrivbare PDF-er med rent, minimalistisk design.
            </p>
          </div>

          {/* 3+2 grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {produktivitetsProdukter.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
            {produktivitetsProdukter.slice(3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Funnel CTA */}
          <div className="text-center">
            <p className="text-brand-medium mb-4">
              Vil du ha alt? Spar opptil 50% med Alt-i-ett-pakken.
            </p>
            <Button href="#pakker" variant="primary" className="text-base px-8 py-3.5">
              Se alle pakker
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
