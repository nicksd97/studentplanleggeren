import type { Metadata } from "next";
import LegalPage from "@/components/pages/LegalPage";
import { legalCopy } from "@/components/legal";
import { routeLocale, type LangParams } from "@/lib/i18n/route";
import { pageMeta } from "@/lib/site";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await routeLocale(params);
  const copy = legalCopy[locale].personvern;
  return pageMeta({
    title: copy.metaTitle,
    description: copy.metaDescription,
    path: "/personvern",
    locale,
  });
}

export default async function PersonvernPage({ params }: LangParams) {
  const locale = await routeLocale(params);
  return <LegalPage copy={legalCopy[locale].personvern} locale={locale} norwegianPath="/personvern" />;
}
