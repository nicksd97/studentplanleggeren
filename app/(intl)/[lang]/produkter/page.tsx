import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProdukterCatalog from "@/components/sections/ProdukterCatalog";
import JsonLd from "@/components/seo/JsonLd";
import {
  catalogDescription,
  catalogHeading,
  catalogPath,
  catalogTitle,
  resolveCatalog,
} from "@/lib/catalog";
import { productListJsonLd } from "@/lib/json-ld";
import { routeLocale } from "@/lib/i18n/route";
import { pageMeta } from "@/lib/site";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ kategori?: string | string[] }>;
};

function kategoriFrom(searchParams: { kategori?: string | string[] }): string | undefined {
  const value = searchParams.kategori;
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const locale = await routeLocale(params);
  const catalog = resolveCatalog(kategoriFrom(await searchParams));
  return pageMeta({
    title: catalogTitle(catalog.key, locale),
    description: catalogDescription(catalog.key, locale),
    path: catalogPath(catalog.key),
    locale,
  });
}

export default async function ProdukterPage({ params, searchParams }: Props) {
  const locale = await routeLocale(params);
  const catalog = resolveCatalog(kategoriFrom(await searchParams));

  return (
    <>
      <Header />
      <JsonLd data={productListJsonLd(catalog, locale)} />
      <ProdukterCatalog
        catalog={catalog}
        heading={catalogHeading(catalog.key, locale)}
        intro={catalogDescription(catalog.key, locale)}
        locale={locale}
      />
      <Footer locale={locale} />
    </>
  );
}
