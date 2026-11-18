import Link from "next/link";

/** Shown at the top of English legal pages. */
export default function LegalTranslationNote({ norwegianPath }: { norwegianPath: string }) {
  return (
    <p className="mb-8 rounded-xl border border-brand-soft bg-brand-pale/40 px-4 py-3 text-sm text-brand-dark/80">
      This is an English translation provided for convenience. The{" "}
      <Link href={norwegianPath} hrefLang="nb" className="text-brand-accent hover:underline">
        Norwegian version
      </Link>{" "}
      is the legally binding one.
    </p>
  );
}
