import type { CatalogKey } from "../../catalog";
import type { FaqItem } from "../../faq";
import type { Guide } from "../../guides";

// Server-only copy for one prefixed language (lib/i18n/content/<lang>.ts): page metadata,
// catalog headings, FAQ, guides, JSON-LD and the order email. Never imported by client code.
//
// Price placeholders {single}, {fivePack}, {theme}, {komplett} are filled with the visitor's
// currency on the page, and with the language's default currency in metadata and JSON-LD.

export interface OrderEmailCopy {
  subject: string;
  /** {firstName} */
  heading: string;
  intro: string;
  /** {code}, {percent}, {amount} (formatted discount) */
  discount: string;
  /** {amount} (formatted total) */
  total: string;
  downloadIntro: string;
  button: string;
  /** Followed by the support email address and a full stop. */
  validity: string;
}

export interface Content {
  meta: {
    home: { title: string; description: string; keywords: string[] };
    gratis: { title: string; description: string };
    kasse: { title: string; description: string };
    takk: { title: string; description: string };
    notFound: { title: string; description: string };
    ogImageAlt: string;
  };
  catalog: Record<CatalogKey, { title: string; description: string; heading: string }>;
  faq: FaqItem[];
  /** Shown first in the FAQ: which language the PDFs are in (see PDF_LANGUAGES_AVAILABLE). */
  faqLanguage: { question: string; available: string; norwegian: string };
  /** Same slugs, catalogKey and productSlug as the Bokmål guides in lib/guides.ts. */
  guides: Guide[];
  fivePack: { name: string; description: string };
  email: OrderEmailCopy;
}
