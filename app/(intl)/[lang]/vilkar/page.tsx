import type { Metadata } from "next";
import LegalPage from "@/components/pages/LegalPage";
import { legalCopy } from "@/components/legal";
import { routeLocale, type LangParams } from "@/lib/i18n/route";
import { pageMeta } from "@/lib/site";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await routeLocale(params);
  const copy = legalCopy[locale].vilkar;
  return pageMeta({
    title: copy.metaTitle,
    description: copy.metaDescription,
    path: "/vilkar",
    locale,
  });
}

export default async function VilkarPage({ params }: LangParams) {
  const locale = await routeLocale(params);
  return <LegalPage copy={legalCopy[locale].vilkar} locale={locale} norwegianPath="/vilkar" />;
}
