import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GuidePage from "@/components/pages/GuidePage";
import { getGuide, guidePath, guides } from "@/lib/guides";
import { pageMeta } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) {
    notFound();
  }

  return pageMeta({
    title: guide.title,
    description: guide.description,
    path: guidePath(guide.slug),
  });
}

export default async function Guide({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) {
    notFound();
  }

  return <GuidePage guide={guide} locale="nb" />;
}
