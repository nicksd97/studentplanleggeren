import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

/** Shown at the top of translated legal pages: the Norwegian version is the binding one. */
export default function LegalTranslationNote({
  locale,
  norwegianPath,
}: {
  locale: Locale;
  norwegianPath: string;
}) {
  const t = getMessages(locale).legalNote;
  return (
    <p className="mb-8 rounded-xl border border-brand-soft bg-brand-pale/40 px-4 py-3 text-sm text-brand-dark/80">
      {t.before}
      <Link href={norwegianPath} hrefLang="nb" className="text-brand-accent hover:underline">
        {t.link}
      </Link>
      {t.after}
    </p>
  );
}
