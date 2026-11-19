"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import { localizePath } from "@/lib/i18n/config";
import { useMessages } from "@/lib/i18n/provider";
import { useLocale } from "@/lib/i18n/use-locale";

/** 404 body for notFound() inside a language route; language comes from I18nProvider. */
export default function NotFoundContent() {
  const locale = useLocale();
  const t = useMessages().notFound;
  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-cream pt-28 pb-20 px-4">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-sm font-medium tracking-[0.1em] uppercase text-brand-medium mb-3">404</p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-brand-dark mb-4">
            {t.heading}
          </h1>
          <p className="text-brand-medium mb-8">{t.text}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={localizePath("/", locale)}
              className="inline-flex items-center rounded-full bg-brand-accent px-6 py-2.5 text-sm font-bold text-brand-dark hover:brightness-110 transition-all"
            >
              {t.home}
            </Link>
            <Link
              href={localizePath("/produkter", locale)}
              className="inline-flex items-center rounded-full border border-brand-soft px-6 py-2.5 text-sm font-medium text-brand-dark hover:bg-white transition-all"
            >
              {t.planners}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
