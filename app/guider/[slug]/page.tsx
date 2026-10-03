import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  getGuide,
  guidePath,
  guideProductHref,
  guides,
} from "@/lib/guides";
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

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-cream pt-28 pb-20">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium mb-4">
            <Link href="/" className="hover:text-brand-dark transition-colors">
              Forside
            </Link>
            <span className="mx-2 text-brand-soft">/</span>
            Guide
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-brand-dark mb-8 text-shadow-sm">
            {guide.heading}
          </h1>

          <div className="space-y-8 text-brand-dark/80 leading-relaxed">
            {guide.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-brand-dark mb-3">
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <aside className="mt-12 rounded-2xl bg-white border border-brand-soft p-6 md:p-8">
            <p className="text-brand-dark/80 leading-relaxed mb-5">
              {guide.productLead}
            </p>
            <Link
              href={guideProductHref(guide)}
              className="inline-flex items-center rounded-full bg-brand-accent px-6 py-2.5 text-sm font-bold text-brand-dark hover:brightness-110 transition-all"
            >
              {guide.productCta}
            </Link>
          </aside>
        </article>
      </main>
      <Footer />
    </>
  );
}
