import type { ReactNode } from "react";

// Translated legal pages (components/legal/<lang>.tsx). The Norwegian pages in app/(nb) are
// the legally binding versions; translations show LegalTranslationNote above the body.

export interface LegalPageCopy {
  metaTitle: string;
  metaDescription: string;
  /** Line above the heading, e.g. "Studentplanlegger Davidson · Org. no. 937416156". */
  orgLine: string;
  title: string;
  /** E.g. "Last updated: 18 November 2026". */
  updated: string;
  /** <section> elements, styled like the Norwegian pages. */
  body: ReactNode;
}

export interface LegalCopy {
  personvern: LegalPageCopy;
  vilkar: LegalPageCopy;
}
