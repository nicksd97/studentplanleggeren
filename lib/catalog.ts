import type { Locale } from "./i18n/config";
import {
  alleProdukter,
  categoryGroups,
  type Product,
} from "./products";

export type CatalogKey = "alle" | (typeof categoryGroups)[number]["key"];

export interface Catalog {
  key: CatalogKey;
  products: Product[];
}

const categoryCopy: Record<
  CatalogKey,
  { title: string; description: string; heading: string }
> = {
  alle: {
    title: "Alle planleggere — Studentplanlegger",
    description:
      "25 fyllbare PDF-planleggere for norske studenter. 39 kr per stykk, fem valgfrie for 99 kr, eller pakker fra 149 kr.",
    heading: "Alle planleggere",
  },
  daglig: {
    title: "Daglige planleggere — Studentplanlegger",
    description:
      "5 daglige PDF-planleggere for studenter. Agenda, timeplan, helse og produktivitet — fyll inn digitalt eller skriv ut.",
    heading: "Daglige planleggere",
  },
  ukentlig: {
    title: "Ukentlige planleggere — Studentplanlegger",
    description:
      "5 ukentlige PDF-planleggere. Ukeplan, gjøremål, matplan og gjennomgang for norske studenter.",
    heading: "Ukentlige planleggere",
  },
  maanedlig: {
    title: "Månedlige planleggere — Studentplanlegger",
    description:
      "Månedlig budsjett, gjennomgang og planlegger som fyllbare PDF-er for norske studenter.",
    heading: "Månedlige planleggere",
  },
  aarlig: {
    title: "Årlig planlegger — Studentplanlegger",
    description:
      "Årsplanlegger med månedsoversikt og årlige mål. Fyllbar PDF for norske studenter.",
    heading: "Årlig planlegger",
  },
  produktivitet: {
    title: "Produktivitetsplanleggere — Studentplanlegger",
    description:
      "Pomodoro, prosjektplan, gjøremål, handlingsplan og målplanlegger som fyllbare PDF-er.",
    heading: "Produktivitetsplanleggere",
  },
  helse: {
    title: "Helse og livsstil — Studentplanlegger",
    description:
      "Helseplanlegger, hjemmeplanlegger og reiseplanlegger. Fyllbare PDF-er for norske studenter.",
    heading: "Helse og livsstil",
  },
  sporing: {
    title: "Sporingsverktøy — Studentplanlegger",
    description:
      "Vane tracker, finans tracker og 30-dagers utfordring. Fyllbare PDF-er for norske studenter.",
    heading: "Sporingsverktøy",
  },
};

const categoryCopyEn: Record<
  CatalogKey,
  { title: string; description: string; heading: string }
> = {
  alle: {
    title: "All planners — Studentplanlegger",
    description:
      "25 fillable PDF planners for students, written in Norwegian (Bokmål). NOK 39 each, any five for NOK 99, or bundles from NOK 149.",
    heading: "All planners",
  },
  daglig: {
    title: "Daily planners — Studentplanlegger",
    description:
      "5 daily PDF planners for students, in Norwegian (Bokmål). Agenda, schedule, health and productivity — fill in on screen or print.",
    heading: "Daily planners",
  },
  ukentlig: {
    title: "Weekly planners — Studentplanlegger",
    description:
      "5 weekly PDF planners in Norwegian (Bokmål). Weekly plan, to-dos, meal plan and weekly review for students.",
    heading: "Weekly planners",
  },
  maanedlig: {
    title: "Monthly planners — Studentplanlegger",
    description:
      "Monthly budget, monthly review and monthly planner as fillable PDFs for students, in Norwegian (Bokmål).",
    heading: "Monthly planners",
  },
  aarlig: {
    title: "Yearly planner — Studentplanlegger",
    description:
      "Yearly planner with a month-by-month overview and goals for the year. Fillable PDF in Norwegian (Bokmål).",
    heading: "Yearly planner",
  },
  produktivitet: {
    title: "Productivity planners — Studentplanlegger",
    description:
      "Pomodoro, project plan, to-do list, action plan and goal planner as fillable PDFs in Norwegian (Bokmål).",
    heading: "Productivity planners",
  },
  helse: {
    title: "Health & lifestyle — Studentplanlegger",
    description:
      "Health planner, home planner and travel planner. Fillable PDFs for students, in Norwegian (Bokmål).",
    heading: "Health & lifestyle",
  },
  sporing: {
    title: "Tracking tools — Studentplanlegger",
    description:
      "Habit tracker, finance tracker and 30-day challenge. Fillable PDFs for students, in Norwegian (Bokmål).",
    heading: "Tracking tools",
  },
};

function copyFor(locale: Locale) {
  return locale === "en" ? categoryCopyEn : categoryCopy;
}

export function catalogPath(key: string | undefined): string {
  if (!key || key === "alle") {
    return "/produkter";
  }
  return `/produkter?kategori=${key}`;
}

export function resolveCatalog(kategori: string | undefined): Catalog {
  if (!kategori || kategori === "alle") {
    return { key: "alle", products: alleProdukter };
  }
  const group = categoryGroups.find((item) => item.key === kategori);
  if (!group) {
    return { key: "alle", products: alleProdukter };
  }
  return { key: group.key, products: group.products };
}

export function catalogTitle(key: string, locale: Locale = "nb"): string {
  return copyFor(locale)[normalizeKey(key)].title;
}

export function catalogDescription(key: string, locale: Locale = "nb"): string {
  return copyFor(locale)[normalizeKey(key)].description;
}

export function catalogHeading(key: string, locale: Locale = "nb"): string {
  return copyFor(locale)[normalizeKey(key)].heading;
}

function normalizeKey(key: string): CatalogKey {
  if (key === "alle") return "alle";
  const group = categoryGroups.find((item) => item.key === key);
  return group?.key ?? "alle";
}
