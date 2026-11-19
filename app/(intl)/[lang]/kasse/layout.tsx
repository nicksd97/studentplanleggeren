import type { Metadata } from "next";
import { getContent } from "@/lib/i18n/content";
import { routeLocale, type LangParams } from "@/lib/i18n/route";
import { pageMeta } from "@/lib/site";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await routeLocale(params);
  const { kasse } = getContent(locale).meta;
  return pageMeta({
    title: kasse.title,
    description: kasse.description,
    path: "/kasse",
    index: false,
    locale,
  });
}

export default function KasseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
