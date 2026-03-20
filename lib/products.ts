export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  format: "PDF + Regneark" | "PDF";
  features: string[];
  badge?: string;
  category: "finans" | "produktivitet";
}

export interface Bundle {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  productCount: number;
  format: string;
  badge?: string;
  includes: string[];
  featured?: boolean;
}

export const finansProdukter: Product[] = [
  {
    id: "studentbudsjettet",
    name: "Studentbudsjettet",
    description:
      "Månedlig budsjettmal med studentkategorier som husleie, mat, kollektiv, trening og streaming. Automatisk utregning av balanse og sparerate.",
    price: 149,
    format: "PDF + Regneark",
    features: [
      "Norske studentkategorier",
      "Auto-kalkulert balanse",
      "Sparerate-tracker",
    ],
    badge: "Bestselger",
    category: "finans",
  },
  {
    id: "lanekassen-planleggeren",
    name: "Lånekassen-planleggeren",
    description:
      "Full oversikt over Lånekassen: stipend vs. lån, semesterutbetalinger, total gjeld ved endt studium og nedbetalingsscenarier etter studiene.",
    price: 149,
    format: "PDF + Regneark",
    features: [
      "Stipend vs. lån-splitting",
      "Gjeldsoversikt ved ferdig studie",
      "Nedbetalingsscenarier",
    ],
    category: "finans",
  },
  {
    id: "sparegrisen",
    name: "Sparegrisen",
    description:
      "Sparemål-tracker med visuell progresjon. Sett flere mål — ferie, nødfond, BSU, bil, utveksling — og følg med på månedlige bidrag.",
    price: 129,
    format: "PDF + Regneark",
    features: [
      "Flere sparemål samtidig",
      "Visuell progresjon",
      "Månedlig bidrag-tracker",
    ],
    category: "finans",
  },
  {
    id: "sommerjobb-kalkulatoren",
    name: "Sommerjobb-kalkulatoren",
    description:
      "Planlegg inntekt fra sommerjobb og deltidsjobb. Estimerer netto lønn etter skatt (frikort/skattekort) og fordeler inntekt på sparemål og semesterutgifter.",
    price: 99,
    format: "PDF + Regneark",
    features: [
      "Netto lønn-kalkulator",
      "Frikort/skattekort-støtte",
      "Fordeling på sparemål",
    ],
    category: "finans",
  },
  {
    id: "etter-eksamen",
    name: "Etter-eksamen (FI Starter)",
    description:
      "Finansiell uavhengighet etter studiene. Nettoverdioversikt, investeringsgrunnlag, gjeldsnedbetaling, BSU-tracker og FI-progresjonskalkulator.",
    price: 179,
    format: "PDF + Regneark",
    features: ["Nettoverdi-dashboard", "Gjeldsnedbetaling", "FI-progresjon"],
    badge: "Premium",
    category: "finans",
  },
];

export const produktivitetsProdukter: Product[] = [
  {
    id: "ukentlig-plan",
    name: "Ukentlig Plan",
    description:
      "Ukentlig planlegger med fokusområder og daglige blokker for å holde orden på studier og hverdag.",
    price: 79,
    format: "PDF",
    features: ["Fokusområder", "Daglige blokker", "Prioriteringsfelt"],
    category: "produktivitet",
  },
  {
    id: "vane-tracker",
    name: "Vane Tracker",
    description:
      "Månedlig vanefølger i rutenett-format. Bygg gode vaner og hold oversikt over fremgangen din.",
    price: 79,
    format: "PDF",
    features: [
      "Månedlig rutenett",
      "Fleksible kategorier",
      "Visuell fremgang",
    ],
    category: "produktivitet",
  },
  {
    id: "pomodoro-planlegger",
    name: "Pomodoro Planlegger",
    description:
      "Studieøkt-planlegger med Pomodoro-teknikken og produktivitetsscoring for mer effektive studiedager.",
    price: 79,
    format: "PDF",
    features: [
      "Pomodoro-timer",
      "Produktivitetsscoring",
      "Øktplanlegging",
    ],
    category: "produktivitet",
  },
  {
    id: "prosject-planlegger",
    name: "Prosject Planlegger",
    description:
      "Prosjektplanlegging med tidslinje og milepæler. Perfekt for semesteroppgaver og gruppearbeid.",
    price: 79,
    format: "PDF",
    features: ["Tidslinje", "Milepæler", "Oppgavedeling"],
    category: "produktivitet",
  },
  {
    id: "daglig-plan",
    name: "Daglig Plan + Mål Planlegger",
    description:
      "Daglig planlegger og målsettingsark for å starte hver dag med retning og intensjon.",
    price: 79,
    format: "PDF",
    features: ["Daglig agenda", "Målsetting", "Refleksjon"],
    category: "produktivitet",
  },
];

export const pakker: Bundle[] = [
  {
    id: "okonomipakken",
    name: "Økonomipakken",
    description:
      "Alle 5 finansverktøy — både PDF og regneark. Alt du trenger for å ta kontroll over studentøkonomien.",
    price: 399,
    originalPrice: 705,
    productCount: 5,
    format: "PDF + Regneark",
    badge: "Mest populær",
    featured: true,
    includes: [
      "Studentbudsjettet",
      "Lånekassen-planleggeren",
      "Sparegrisen",
      "Sommerjobb-kalkulatoren",
      "Etter-eksamen (FI Starter)",
      "PDF + regneark inkludert",
    ],
  },
  {
    id: "produktivitetspakken",
    name: "Produktivitetspakken",
    description: "Alle 5 produktivitetsplanleggere i ett.",
    price: 249,
    originalPrice: 395,
    productCount: 5,
    format: "PDF",
    includes: [
      "Ukentlig Plan",
      "Vane Tracker",
      "Pomodoro Planlegger",
      "Prosject Planlegger",
      "Daglig Plan + Mål Planlegger",
    ],
  },
  {
    id: "alt-i-ett",
    name: "Alt-i-ett-pakken",
    description: "Alle 10 produkter — finansverktøy og produktivitetsplanleggere.",
    price: 549,
    originalPrice: 1100,
    productCount: 10,
    format: "PDF + Regneark",
    badge: "Best verdi",
    includes: [
      "Alle 5 finansverktøy",
      "Alle 5 produktivitetsplanleggere",
      "PDF + regneark for finansverktøy",
      "PDF for produktivitetsplanleggere",
    ],
  },
];

export function formatPrice(price: number): string {
  return `${price} kr`;
}

export function calculateSavings(bundle: Bundle): number {
  return Math.round(
    ((bundle.originalPrice - bundle.price) / bundle.originalPrice) * 100
  );
}
