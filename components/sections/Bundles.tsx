import { pakker } from "@/lib/products";
import BundleCard from "@/components/ui/BundleCard";

export default function Bundles() {
  const featured = pakker.find((p) => p.featured)!;
  const categoryBundles = pakker.filter((p) => !p.featured);

  return (
    <section id="pakker" className="relative bg-brand-pale py-20 md:py-28">
      <div className="dot-pattern" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium mb-3">
            ✦ Spar med pakkene ✦
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-brand-dark mb-4">
            Mer verdi, én pris
          </h2>
          <p className="text-brand-medium max-w-2xl mx-auto">
            Kombiner verktøyene og spar opptil 71%. Umiddelbar nedlasting i alle formater.
          </p>
        </div>

        {/* Featured bundle */}
        <div id="komplett" className="mb-10">
          <BundleCard bundle={featured} />
        </div>

        {/* Category bundles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {categoryBundles.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>
      </div>
    </section>
  );
}
