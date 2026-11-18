import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GuidePage from "@/components/pages/GuidePage";
import { getGuide, guidePath, guides } from "@/lib/guides";
import { routeLocale } from "@/lib/i18n/route";
import { pageMeta } from "@/lib/site";

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

// Every language has the same guide slugs as Bokmål.
export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await routeLocale(params);
  const guide = getGuide((await params).slug, locale);
  if (!guide) {
    notFound();
  }

  return pageMeta({
    title: guide.title,
    description: guide.description,
    path: guidePath(guide.slug),
    locale,
  });
}

export default async function Guide({ params }: Props) {
  const locale = await routeLocale(params);
  const guide = getGuide((await params).slug, locale);
  if (!guide) {
    notFound();
  }

  return <GuidePage guide={guide} locale={locale} />;
}
