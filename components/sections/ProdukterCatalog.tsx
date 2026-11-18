import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import ProdukterStickyBar from "@/components/sections/ProdukterStickyBar";
import TrackView from "@/components/analytics/TrackView";
import { alleProdukter, categoryGroups } from "@/lib/products";
import { catalogPath, type Catalog } from "@/lib/catalog";
import { localizePath, type Locale } from "@/lib/i18n/config";
import PriceText from "@/components/i18n/PriceText";
import { getMessages } from "@/lib/i18n/messages";
import { categoryLabel, localizeProduct, pdfLanguageCopy } from "@/lib/i18n/products";

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
  locale = "nb",
}: {
  catalog: Catalog;
  heading: string;
  intro: string;
  locale?: Locale;
}) {
  const messages = getMessages(locale);
  const t = messages.catalog;
  const language = pdfLanguageCopy(locale, messages).sentence;
  return (
    <>
      <TrackView event="catalog_view" props={{ category: catalog.key }} />
      <main className="min-h-screen bg-brand-cream pt-24 pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-brand-dark mb-3">
              {heading}
            </h1>
            <p className="text-brand-medium max-w-xl mx-auto">
              <PriceText text={intro} />
            </p>
            <p className="text-sm text-brand-dark mt-4">
              <PriceText text={t.prices} />
            </p>
            {language && (
              <p className="text-sm text-brand-medium mt-2 max-w-xl mx-auto">{language}</p>
            )}
          </div>

          <nav
            aria-label={t.nav}
            className="mb-10 -mx-4 px-4 overflow-x-auto scrollbar-hide"
          >
            <div className="flex gap-1 min-w-max justify-center">
              {tabs.map((tab) => (
                <Link
                  key={tab.key}
                  href={localizePath(catalogPath(tab.key), locale)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    catalog.key === tab.key
                      ? "bg-brand-accent text-brand-dark"
                      : "text-brand-medium hover:text-brand-dark hover:bg-brand-pale"
                  }`}
                >
                  {categoryLabel(tab.key, tab.key === "alle" ? t.allTab : tab.label, messages)}
                  <span className="ml-1.5 text-xs opacity-60">({tab.count})</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {catalog.products.map((product) => (
              <ProductCard key={product.id} product={localizeProduct(product, messages)} />
            ))}
          </div>
        </div>
      </main>
      <ProdukterStickyBar />
    </>
  );
}
