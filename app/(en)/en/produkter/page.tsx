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
import { pageMeta } from "@/lib/site";

type Props = {
  searchParams: Promise<{ kategori?: string | string[] }>;
};

function kategoriFrom(searchParams: { kategori?: string | string[] }): string | undefined {
  const value = searchParams.kategori;
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const catalog = resolveCatalog(kategoriFrom(await searchParams));
  return pageMeta({
    title: catalogTitle(catalog.key, "en"),
    description: catalogDescription(catalog.key, "en"),
    path: catalogPath(catalog.key),
    locale: "en",
  });
}

export default async function ProdukterPage({ searchParams }: Props) {
  const catalog = resolveCatalog(kategoriFrom(await searchParams));

  return (
    <>
      <Header />
      <JsonLd data={productListJsonLd(catalog, "en")} />
      <ProdukterCatalog
        catalog={catalog}
        heading={catalogHeading(catalog.key, "en")}
        intro={catalogDescription(catalog.key, "en")}
        locale="en"
      />
      <Footer locale="en" />
    </>
  );
}
