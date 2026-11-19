import type { Metadata } from "next";
import HomePage from "@/components/pages/HomePage";
import { getContent } from "@/lib/i18n/content";
import { routeLocale, type LangParams } from "@/lib/i18n/route";
import { pageMeta } from "@/lib/site";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await routeLocale(params);
  const { home } = getContent(locale).meta;
  return {
    ...pageMeta({ title: home.title, description: home.description, path: "/", locale }),
    keywords: home.keywords,
  };
}

export default async function Home({ params }: LangParams) {
  return <HomePage locale={await routeLocale(params)} />;
}
