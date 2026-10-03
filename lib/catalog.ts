import {
  alleProdukter,
  categoryGroups,
  type Product,
} from "./products.ts";

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
      "25 fyllbare PDF-planleggere for norske studenter. Velg enkeltvis eller spar med en pakke — daglig, ukentlig, månedlig og mer.",
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

export function catalogTitle(key: string): string {
  return categoryCopy[normalizeKey(key)].title;
}

export function catalogDescription(key: string): string {
  return categoryCopy[normalizeKey(key)].description;
}

export function catalogHeading(key: string): string {
  return categoryCopy[normalizeKey(key)].heading;
}

function normalizeKey(key: string): CatalogKey {
  if (key === "alle") return "alle";
  const group = categoryGroups.find((item) => item.key === key);
  return group?.key ?? "alle";
}
