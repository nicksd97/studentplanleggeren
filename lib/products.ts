export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: "daglig" | "ukentlig" | "maanedlig" | "aarlig" | "produktivitet" | "helse" | "sporing";
  categoryLabel: string;
  fileName: string;
  pages: number;
  features: string[];
}

export interface Bundle {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  savings: number;
  savingsPercent: number;
  productIds: string[];
  badge?: string;
  featured?: boolean;
}

// ── Daglig (Daily) ──────────────────────────────────────────────
export const dagligProdukter: Product[] = [
  {
    id: "daglig-gjennomgang",
    slug: "daglig-gjennomgang",
    name: "Daglig Gjennomgang",
    description: "Daglig gjennomgang og refleksjonsark — oppsummer dagen, noter hva som gikk bra og hva du vil forbedre.",
    price: 49,
    category: "daglig",
    categoryLabel: "Daglig",
    fileName: "2. Dagelig Gjennomgang.pdf",
    pages: 1,
    features: ["Dagsoppsummering", "Refleksjon", "Forbedringspunkter"],
  },
  {
    id: "daglig-helseplan",
    slug: "daglig-helseplan",
    name: "Daglig Helseplan",
    description: "Daglig helseplanlegger — spor trening, måltider, vanninntak og søvn.",
    price: 49,
    category: "daglig",
    categoryLabel: "Daglig",
    fileName: "3. Dagelig Helseplan.pdf",
    pages: 1,
    features: ["Treningssporing", "Måltidsplan", "Søvn og vanninntak"],
  },
  {
    id: "daglig-planlegger",
    slug: "daglig-planlegger",
    name: "Daglig Planlegger",
    description: "Daglig planlegger med agenda, fokusområder og gjøremål.",
    price: 49,
    category: "daglig",
    categoryLabel: "Daglig",
    fileName: "4. Dagelig Planlegger.pdf",
    pages: 1,
    features: ["Daglig agenda", "Fokusområder", "Gjøremålsliste"],
  },
  {
    id: "daglig-produktivitetsplan",
    slug: "daglig-produktivitetsplan",
    name: "Daglig Produktivitetsplan",
    description: "Daglig produktivitetsplan med tidsblokker og prioriteringer.",
    price: 49,
    category: "daglig",
    categoryLabel: "Daglig",
    fileName: "5. Dagelig Productivitests Plan.pdf",
    pages: 1,
    features: ["Tidsblokker", "Prioriteringer", "Produktivitetsfokus"],
  },
  {
    id: "daglig-timeplan",
    slug: "daglig-timeplan",
    name: "Daglig Timeplan",
    description: "Timebasert dagsplan fra morgen til kveld.",
    price: 49,
    category: "daglig",
    categoryLabel: "Daglig",
    fileName: "6. Dagelig timeplan.pdf",
    pages: 1,
    features: ["Timebasert plan", "Morgen til kveld", "Strukturert dag"],
  },
];

// ── Ukentlig (Weekly) ───────────────────────────────────────────
export const ukentligProdukter: Product[] = [
  {
    id: "ukentlig-gjennomgang",
    slug: "ukentlig-gjennomgang",
    name: "Ukentlig Gjennomgang",
    description: "Ukentlig oppsummering — reflekter over uken og sett mål for neste.",
    price: 49,
    category: "ukentlig",
    categoryLabel: "Ukentlig",
    fileName: "21. Ukentlig Gjennomgang.pdf",
    pages: 1,
    features: ["Ukesoppsummering", "Refleksjon", "Målsetting"],
  },
  {
    id: "ukentlig-gjoremaal",
    slug: "ukentlig-gjoremaal",
    name: "Ukentlig Gjøremål",
    description: "Ukentlig gjøremålsliste med plass til oppgaver for hver dag.",
    price: 49,
    category: "ukentlig",
    categoryLabel: "Ukentlig",
    fileName: "22. Ukentlig Gjøremål.pdf",
    pages: 1,
    features: ["Daglige oppgaver", "Ukeoversikt", "Prioriteringsfelt"],
  },
  {
    id: "ukentlig-matplan",
    slug: "ukentlig-matplan",
    name: "Ukentlig Matplan",
    description: "Ukentlig måltidsplanlegger med handleliste.",
    price: 49,
    category: "ukentlig",
    categoryLabel: "Ukentlig",
    fileName: "23. Ukentlig Mat Plan.pdf",
    pages: 1,
    features: ["Måltidsplan", "Handleliste", "Ukeoversikt"],
  },
  {
    id: "ukentlig-plan",
    slug: "ukentlig-plan",
    name: "Ukentlig Plan",
    description: "Komplett ukentlig plan med fokusområder og daglige blokker.",
    price: 49,
    category: "ukentlig",
    categoryLabel: "Ukentlig",
    fileName: "24. Ukentlig Plan.pdf",
    pages: 2,
    features: ["Fokusområder", "Daglige blokker", "2 sider"],
  },
  {
    id: "ukentlig-planlegger",
    slug: "ukentlig-planlegger",
    name: "Ukentlig Planlegger",
    description: "Enkel ukentlig planlegger for studier og hverdag.",
    price: 49,
    category: "ukentlig",
    categoryLabel: "Ukentlig",
    fileName: "25. Ukentlig Planlegger.pdf",
    pages: 1,
    features: ["Enkel oversikt", "Studier og hverdag", "Ukentlig plan"],
  },
];

// ── Månedlig (Monthly) ─────────────────────────────────────────
export const maanedligProdukter: Product[] = [
  {
    id: "maanedlig-budsjett",
    slug: "maanedlig-budsjett",
    name: "Månedlig Budsjett",
    description: "Månedlig budsjettplanlegger — spor inntekter og utgifter.",
    price: 49,
    category: "maanedlig",
    categoryLabel: "Månedlig",
    fileName: "7. Månedlig Budsjett.pdf",
    pages: 1,
    features: ["Inntektsoversikt", "Utgiftssporing", "Budsjettbalanse"],
  },
  {
    id: "maanedlig-gjennomgang",
    slug: "maanedlig-gjennomgang",
    name: "Månedlig Gjennomgang",
    description: "Månedlig gjennomgang og refleksjon.",
    price: 49,
    category: "maanedlig",
    categoryLabel: "Månedlig",
    fileName: "8. Månedlig gjennomgang.pdf",
    pages: 2,
    features: ["Månedsoppsummering", "Refleksjon", "2 sider"],
  },
  {
    id: "maanedlig-planlegger",
    slug: "maanedlig-planlegger",
    name: "Månedlig Planlegger",
    description: "Månedlig planlegger med oversikt over mål og gjøremål.",
    price: 49,
    category: "maanedlig",
    categoryLabel: "Månedlig",
    fileName: "9. Månedlig planlegger.pdf",
    pages: 1,
    features: ["Månedsmål", "Gjøremålsliste", "Oversiktlig layout"],
  },
];

// ── Årlig (Yearly) ─────────────────────────────────────────────
export const aarligProdukter: Product[] = [
  {
    id: "aarlig-planlegger",
    slug: "aarlig-planlegger",
    name: "Årlig Planlegger",
    description: "Årsplanlegger med månedsoversikt og årlige mål.",
    price: 49,
    category: "aarlig",
    categoryLabel: "Årlig",
    fileName: "26. Årlig Planlegger.pdf",
    pages: 2,
    features: ["Månedsoversikt", "Årlige mål", "2 sider"],
  },
];

// ── Produktivitet (Productivity) ────────────────────────────────
export const produktivitetProdukter: Product[] = [
  {
    id: "pomodoro-planlegger",
    slug: "pomodoro-planlegger",
    name: "Pomodoro Planlegger",
    description: "Pomodoro studieøkt-planlegger med produktivitetsscoring.",
    price: 49,
    category: "produktivitet",
    categoryLabel: "Produktivitet",
    fileName: "17. POMODORO Planlegger.pdf",
    pages: 1,
    features: ["Pomodoro-timer", "Produktivitetsscoring", "Øktplanlegging"],
  },
  {
    id: "prosjekt-planlegger",
    slug: "prosjekt-planlegger",
    name: "Prosjekt Planlegger",
    description: "Prosjektplanlegging med tidslinje og milepæler.",
    price: 49,
    category: "produktivitet",
    categoryLabel: "Produktivitet",
    fileName: "18. Prosjekt Planlegger.pdf",
    pages: 1,
    features: ["Tidslinje", "Milepæler", "Oppgavedeling"],
  },
  {
    id: "gjoremaal-liste",
    slug: "gjoremaal-liste",
    name: "Gjøremål Liste",
    description: "Enkel gjøremålsliste med prioriteringsfelt.",
    price: 49,
    category: "produktivitet",
    categoryLabel: "Produktivitet",
    fileName: "13. Gjøremål Liste.pdf",
    pages: 1,
    features: ["Prioriteringsfelt", "Enkel oversikt", "Gjøremålsliste"],
  },
  {
    id: "handlingsplan",
    slug: "handlingsplan",
    name: "Handlingsplan",
    description: "Handlingsplan for å bryte ned mål til konkrete steg.",
    price: 49,
    category: "produktivitet",
    categoryLabel: "Produktivitet",
    fileName: "14. Handlingsplan.pdf",
    pages: 1,
    features: ["Målnedbrytning", "Konkrete steg", "Handlingsfokus"],
  },
  {
    id: "maal-planlegger",
    slug: "maal-planlegger",
    name: "Mål Planlegger",
    description: "Målsettingsark med tiltak og tidsfrister.",
    price: 49,
    category: "produktivitet",
    categoryLabel: "Produktivitet",
    fileName: "16. Mål Planlegger.pdf",
    pages: 1,
    features: ["Målsetting", "Tiltak", "Tidsfrister"],
  },
];

// ── Helse og Livsstil (Health & Lifestyle) ──────────────────────
export const helseProdukter: Product[] = [
  {
    id: "helse-planlegger",
    slug: "helse-planlegger",
    name: "Helse Planlegger",
    description: "Helse- og treningsplanlegger med kostmål.",
    price: 49,
    category: "helse",
    categoryLabel: "Helse og livsstil",
    fileName: "20. Helse Planlegger.pdf",
    pages: 1,
    features: ["Treningsplan", "Kostmål", "Helseoppfølging"],
  },
  {
    id: "hjemmeplanlegger",
    slug: "hjemmeplanlegger",
    name: "Hjemmeplanlegger",
    description: "Planlegg måltider, husarbeid og handleliste for hjemmet.",
    price: 49,
    category: "helse",
    categoryLabel: "Helse og livsstil",
    fileName: "15. Hjemmeplanlegger.pdf",
    pages: 1,
    features: ["Måltidsplan", "Husarbeid", "Handleliste"],
  },
  {
    id: "reise-planlegger",
    slug: "reise-planlegger",
    name: "Reise Planlegger",
    description: "Planlegg reiser med budsjett, pakkeliste og dagsprogram.",
    price: 49,
    category: "helse",
    categoryLabel: "Helse og livsstil",
    fileName: "19. Reise Planlegger.pdf",
    pages: 1,
    features: ["Reisebudsjett", "Pakkeliste", "Dagsprogram"],
  },
];

// ── Sporing (Tracking) ─────────────────────────────────────────
export const sporingProdukter: Product[] = [
  {
    id: "personlig-finans-tracker",
    slug: "personlig-finans-tracker",
    name: "Personlig Finans Tracker",
    description: "Personlig finansoversikt med inntekter, utgifter og sparing.",
    price: 49,
    category: "sporing",
    categoryLabel: "Sporing",
    fileName: "10. Personlig Finans Tracker.pdf",
    pages: 1,
    features: ["Inntekter", "Utgifter", "Spareoversikt"],
  },
  {
    id: "vane-tracker",
    slug: "vane-tracker",
    name: "Vane Tracker",
    description: "Månedlig vanesporing i rutenett — bygg gode vaner.",
    price: 49,
    category: "sporing",
    categoryLabel: "Sporing",
    fileName: "11. Vane Tracker.pdf",
    pages: 1,
    features: ["Månedlig rutenett", "Fleksible kategorier", "Visuell fremgang"],
  },
  {
    id: "30-dagers-utfordring",
    slug: "30-dagers-utfordring",
    name: "30-Dagers Utfordring",
    description: "30-dagers utfordringstracker for nye vaner eller mål.",
    price: 49,
    category: "sporing",
    categoryLabel: "Sporing",
    fileName: "12. 30-Dagers Utfordring.pdf",
    pages: 1,
    features: ["30-dagers sporing", "Vanemål", "Daglig sjekk"],
  },
];

// ── All products ────────────────────────────────────────────────
export const alleProdukter: Product[] = [
  ...dagligProdukter,
  ...ukentligProdukter,
  ...maanedligProdukter,
  ...aarligProdukter,
  ...produktivitetProdukter,
  ...helseProdukter,
  ...sporingProdukter,
];

// ── Category groups for display ─────────────────────────────────
export const categoryGroups = [
  { key: "daglig" as const, label: "Daglig", products: dagligProdukter },
  { key: "ukentlig" as const, label: "Ukentlig", products: ukentligProdukter },
  { key: "maanedlig" as const, label: "Månedlig", products: maanedligProdukter },
  { key: "aarlig" as const, label: "Årlig", products: aarligProdukter },
  { key: "produktivitet" as const, label: "Produktivitet", products: produktivitetProdukter },
  { key: "helse" as const, label: "Helse og livsstil", products: helseProdukter },
  { key: "sporing" as const, label: "Sporing", products: sporingProdukter },
];

// ── Bundles ─────────────────────────────────────────────────────
export const pakker: Bundle[] = [
  {
    id: "komplett",
    slug: "komplett",
    name: "Studentplanlegger Komplett",
    description: "Alle 25 planleggere + 12 papirmaler. Alt du trenger for å ha full kontroll på studiene.",
    price: 349,
    originalPrice: 1225,
    savings: 876,
    savingsPercent: 71,
    productIds: alleProdukter.map((p) => p.id),
    badge: "Best verdi",
    featured: true,
  },
  {
    id: "daglig-pakke",
    slug: "daglig-pakke",
    name: "Daglig Pakke",
    description: "Alle 5 daglige planleggere i én pakke.",
    price: 149,
    originalPrice: 245,
    savings: 96,
    savingsPercent: 39,
    productIds: dagligProdukter.map((p) => p.id),
  },
  {
    id: "ukentlig-pakke",
    slug: "ukentlig-pakke",
    name: "Ukentlig Pakke",
    description: "Alle 5 ukentlige planleggere i én pakke.",
    price: 149,
    originalPrice: 245,
    savings: 96,
    savingsPercent: 39,
    productIds: ukentligProdukter.map((p) => p.id),
  },
  {
    id: "produktivitetspakken",
    slug: "produktivitetspakken",
    name: "Produktivitetspakken",
    description: "Alle 5 produktivitetsverktøy i én pakke.",
    price: 149,
    originalPrice: 245,
    savings: 96,
    savingsPercent: 39,
    productIds: produktivitetProdukter.map((p) => p.id),
  },
];

export function formatPrice(price: number): string {
  return `${price} kr`;
}
