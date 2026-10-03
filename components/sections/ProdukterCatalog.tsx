import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import ProdukterStickyBar from "@/components/sections/ProdukterStickyBar";
import { alleProdukter, categoryGroups } from "@/lib/products";
import { catalogPath, type Catalog } from "@/lib/catalog";

const tabs = [
  { key: "alle", label: "Alle", count: alleProdukter.length },
  ...categoryGroups.map((group) => ({
    key: group.key,
    label: group.label,
    count: group.products.length,
  })),
];

export default function ProdukterCatalog({
  catalog,
  heading,
  intro,
}: {
  catalog: Catalog;
  heading: string;
  intro: string;
}) {
  return (
    <>
      <main className="min-h-screen bg-brand-cream pt-24 pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-brand-dark mb-3">
              {heading}
            </h1>
            <p className="text-brand-medium max-w-xl mx-auto">{intro}</p>
          </div>

          <nav
            aria-label="Produktkategorier"
            className="mb-10 -mx-4 px-4 overflow-x-auto scrollbar-hide"
          >
            <div className="flex gap-1 min-w-max justify-center">
              {tabs.map((tab) => (
                <Link
                  key={tab.key}
                  href={catalogPath(tab.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    catalog.key === tab.key
                      ? "bg-brand-accent text-brand-dark"
                      : "text-brand-medium hover:text-brand-dark hover:bg-brand-pale"
                  }`}
                >
                  {tab.label}
                  <span className="ml-1.5 text-xs opacity-60">({tab.count})</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {catalog.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
      <ProdukterStickyBar />
    </>
  );
}
