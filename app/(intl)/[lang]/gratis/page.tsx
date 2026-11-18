import type { Metadata } from "next";
import GratisPage from "@/components/pages/GratisPage";
import { getContent } from "@/lib/i18n/content";
import { routeLocale, type LangParams } from "@/lib/i18n/route";
import { pageMeta } from "@/lib/site";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await routeLocale(params);
  const { gratis } = getContent(locale).meta;
  return pageMeta({ title: gratis.title, description: gratis.description, path: "/gratis", locale });
}

export default async function Gratis({ params }: LangParams) {
  return <GratisPage locale={await routeLocale(params)} />;
}
