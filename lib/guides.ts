import { catalogPath } from "./catalog";
import { alleProdukter, categoryGroups, type Product } from "./products";

export type GuideCatalogKey = "daglig" | "ukentlig" | "produktivitet" | "sporing";

export interface GuideSection {
  heading: string;
  paragraphs: string[];
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  heading: string;
  summary: string;
  footerLabel: string;
  catalogKey: GuideCatalogKey;
  productSlug: string;
  productLead: string;
  productCta: string;
  sections: GuideSection[];
}

export const guides: Guide[] = [
  {
    slug: "planlegg-studiedagen",
    title: "Slik planlegger du studiedagen — Studentplanlegger",
    description:
      "Velg få prioriteringer, sett av tid til lesing og pauser, og avslutt med en kort gjennomgang. En praktisk metode for studiedagen.",
    heading: "Slik planlegger du studiedagen",
    summary:
      "En lang liste er sjelden en plan. Slik velger du det som skal skje i dag, og lar resten vente.",
    footerLabel: "Planlegg studiedagen",
    catalogKey: "daglig",
    productSlug: "daglig-planlegger",
    productLead:
      "Daglig Planlegger er et fyllbart PDF-ark med agenda, fokusområder og gjøremål. I samme kategori finnes også Daglig Timeplan og Daglig Gjennomgang.",
    productCta: "Se de daglige planleggerne",
    sections: [
      {
        heading: "En lang liste er sjelden en plan",
        paragraphs: [
          "Mange studiedager starter med alt du burde gjort, og slutter med det som tilfeldigvis ble høyest på listen. Det som vanligvis fungerer bedre, er å velge noen få oppgaver som faktisk skal bli gjort, og sette av tid til dem — inkludert pauser.",
          "Du trenger ikke et komplisert system. Du trenger en rekkefølge: det som er fast, det som er viktig i dag, og det som kan vente.",
        ],
      },
      {
        heading: "Skriv ned det som må skje, så velg én til tre oppgaver",
        paragraphs: [
          "Begynn med forelesninger, innleveringer og avtaler. Deretter velger du én til tre studieoppgaver som skal få plass. Resten hører hjemme i en ukeplan eller på morgendagens liste.",
          "Hvis alt føles like viktig, spør: hva blir vanskeligere hvis jeg utsetter det til i morgen? Det svaret er ofte dagens første økt.",
        ],
      },
      {
        heading: "Sett tid, ikke bare oppgaver",
        paragraphs: [
          "«Les kapittel 4» er et ønske. «Les kapittel 4 mellom 10 og 11:30» er en plan. Du trenger ikke timeplan for hele døgnet. Det holder å blokkere de to eller tre øktene som betyr mest, og la resten av dagen ha luft.",
          "Planlegg gjerne en buffer på en halvtime. Da tåler dagen at en forelesning trekker ut, uten at kvelden kollapser.",
        ],
      },
      {
        heading: "Avslutt med tre linjer",
        paragraphs: [
          "Før du legger bort bøkene: hva ble gjort, hva gikk dårlig, og hva er første oppgave i morgen? Det tar et par minutter og gjør neste morgen roligere.",
        ],
      },
    ],
  },
  {
    slug: "ukentlig-studieplan",
    title: "Ukentlig studieplan: oversikt før mandag — Studentplanlegger",
    description:
      "Lag en ukeplan som rommer forelesninger, lesing og fritid. Slik fordeler du arbeidet så det ikke hoper seg opp mot helgen.",
    heading: "Slik lager du en ukentlig studieplan",
    summary:
      "Se faste avtaler først, så den tiden du faktisk har til pensum. Slik unngår du at alt havner på søndag.",
    footerLabel: "Ukentlig studieplan",
    catalogKey: "ukentlig",
    productSlug: "ukentlig-planlegger",
    productLead:
      "Ukentlig Planlegger er en enkel fyllbar ukeplan for studier og hverdag. Ukentlig Plan har fokusområder og daglige blokker, og Ukentlig Gjøremål gir plass til oppgaver per dag.",
    productCta: "Se de ukentlige planleggerne",
    sections: [
      {
        heading: "Dager uten ukeplan blir fort tilfeldige",
        paragraphs: [
          "Mandag fylles opp, onsdag forsvinner, og søndag går til det du skulle gjort tirsdag. En enkel ukeoversikt gjør det lettere å se hvor arbeidet faktisk får plass — før uken er i gang.",
        ],
      },
      {
        heading: "Skriv inn det faste først",
        paragraphs: [
          "Forelesninger, seminar, jobb og avtaler du ikke kan flytte, skal inn før du lover deg selv åtte timer pensum. Det som blir igjen, er den reelle tiden til lesing og oppgaver. Den er nesten alltid mindre enn du tror.",
        ],
      },
      {
        heading: "Fordel det tunge arbeidet",
        paragraphs: [
          "Ikke legg tre tunge leseøkter på samme dag som to forelesninger. Flytt én økt til en roligere dag. Ukeplanen er nyttig nettopp fordi den viser kollisjoner før de skjer.",
          "Det er greit at dagene er ulike. En ukeplan skal beskrive uken du har, ikke en uke uten undervisning.",
        ],
      },
      {
        heading: "Gi også fritid og husarbeid en plass",
        paragraphs: [
          "Mat, trening og en kveld uten skole hører hjemme i oversikten. Hvis de ikke har en plass, tar de plassen likevel — bare mer tilfeldig. En kort sjekk onsdag eller torsdag er nok til å flytte det som har sklidd.",
        ],
      },
    ],
  },
  {
    slug: "pomodoro-til-eksamen",
    title: "Pomodoro når du leser til eksamen — Studentplanlegger",
    description:
      "Korte arbeidsøkter og faste pauser gjør det lettere å holde fokus i pensum. Slik setter du opp en leseplan du faktisk følger.",
    heading: "Slik bruker du Pomodoro når du leser til eksamen",
    summary:
      "Åpne «hele dagen»-økter blir ofte trege. Korte bolker med pause imellom er lettere å starte — og å holde.",
    footerLabel: "Pomodoro til eksamen",
    catalogKey: "produktivitet",
    productSlug: "pomodoro-planlegger",
    productLead:
      "Pomodoro Planlegger er et fyllbart ark for å planlegge studieøkter og notere produktivitet. Den ligger sammen med de andre produktivitetsarkene.",
    productCta: "Se Pomodoro Planlegger",
    sections: [
      {
        heading: "Lange, åpne økter blir ofte trege",
        paragraphs: [
          "Når pensum hoper seg opp, er det fristende å sette av hele dagen. Mange merker at fokuset dabber etter en time, og at kvelden går til å ta igjen formiddagen. Korte arbeidsbolker med faste pauser — ofte kalt Pomodoro — gjør starten mindre tung.",
        ],
      },
      {
        heading: "Hva metoden faktisk er",
        paragraphs: [
          "En vanlig variant er 25 minutter konsentrert arbeid og 5 minutter pause. Etter fire slike økter tar du en lengre pause. Tidene kan justeres. Poenget er ikke klokken, men at arbeidet har en start og en slutt.",
        ],
      },
      {
        heading: "Gi hver økt ett mål",
        paragraphs: [
          "Velg ett kapittel, ett problemsett eller ett notatsett. «Les til eksamen» er for vagt til å starte på. Når økten er ferdig, kryss av det du rakk — ikke det du håpet å rekke.",
          "En eksamensuke blir mer overkommelig hvis du planlegger et antall økter, ikke et antall timer. Økter er lettere å flytte hvis en forelesning spiser formiddagen.",
        ],
      },
      {
        heading: "Pause betyr pause",
        paragraphs: [
          "Hvis pausen blir ny e-post eller en ny fane, starter neste økt tregere. Reis deg, hent vann, eller se ut av vinduet. Skjermen kan vente til neste arbeidsbolk.",
        ],
      },
    ],
  },
  {
    slug: "bygg-studievaner",
    title: "Slik bygger du studievaner som varer — Studentplanlegger",
    description:
      "Start med én liten vane, gjør den synlig, og marker fremgang. Slik unngår du å starte for stort og gi opp etter en uke.",
    heading: "Slik bygger du en studievane som varer",
    summary:
      "Én liten vane du gjentar, slår tre store planer du dropper. Slik holder du den synlig gjennom måneden.",
    footerLabel: "Bygg studievaner",
    catalogKey: "sporing",
    productSlug: "vane-tracker",
    productLead:
      "Vane Tracker er et månedlig rutenett med plass til egne kategorier, slik at du kan se fremgangen. 30-Dagers Utfordring er et mer avgrenset ark for nye vaner eller mål.",
    productCta: "Se Vane Tracker",
    sections: [
      {
        heading: "Store planer feiler oftere enn små vaner",
        paragraphs: [
          "«Les to timer hver dag» fra første mandag i semesteret holder sjelden mer enn en uke. Det som varer, er vanligvis mindre, synlig og lett å gjenta — også på dager med forelesning og dårlig søvn.",
        ],
      },
      {
        heading: "Velg én vane, og gjør den nesten for liten",
        paragraphs: [
          "Ikke start med trening, lesing, mat og søvn samtidig. Velg én: for eksempel 20 minutter pensum før lunsj, eller å pakke sekken kvelden før. Når den sitter, kan du legge til neste.",
          "Hvis to timer er for mye på en travel dag, er ti minutter det ikke. En vane du gjennomfører på en dårlig dag, er mer verdifull enn en ambisiøs plan du dropper.",
        ],
      },
      {
        heading: "Marker fremgang der du ser den",
        paragraphs: [
          "Et rutenett på kjøleskapet, i notatboken eller som fyllbar PDF gjør vanen synlig. Tomme ruter er ærlige. Det er lettere å holde en serie gående enn å starte på nytt hver mandag.",
        ],
      },
      {
        heading: "Én glemt dag er ikke et ødelagt prosjekt",
        paragraphs: [
          "Start igjen neste dag uten å «ta igjen» alt. Å straffe deg selv med dobbel økt gjør det mer sannsynlig at du dropper hele vanen. Tell dager du gjorde det, ikke dager som ble perfekte.",
        ],
      },
    ],
  },
];

export function guidePath(slug: string): string {
  return `/guider/${slug}`;
}

export function guidePaths(): string[] {
  return guides.map((guide) => guidePath(guide.slug));
}

export function getGuide(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function guideProductHref(guide: Guide): string {
  return catalogPath(guide.catalogKey);
}

export function guideProduct(guide: Guide): Product | undefined {
  return alleProdukter.find((product) => product.slug === guide.productSlug);
}

export function assertGuideCatalog(guide: Guide): boolean {
  const group = categoryGroups.find((item) => item.key === guide.catalogKey);
  const product = guideProduct(guide);
  return Boolean(
    group && product && group.products.some((item) => item.slug === guide.productSlug),
  );
}
