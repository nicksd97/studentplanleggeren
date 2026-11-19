import type { Messages } from "./types";

// Swedish UI copy.

export const sv: Messages = {
  switcher: { label: "Språk" },
  header: {
    planners: "Planerare",
    free: "Gratis smakprov",
    bundles: "Paket",
    faq: "Vanliga frågor",
    buyKomplett: "Köp hela paketet med Vipps",
    cart: "Varukorg",
    menu: "Meny",
  },
  footer: {
    tagline: "Planerare och produktivitetsverktyg för studenter.",
    products: "Produkter",
    komplett: "Hela paketet",
    daily: "Dagspaket",
    weekly: "Veckopaket",
    all: "Alla planerare",
    guides: "Guider",
    info: "Info",
    faq: "Vanliga frågor",
    free: "Gratis smakprov",
    privacy: "Integritet",
    terms: "Villkor",
    madeWith: "Gjort med kärlek i Norge",
    orgNo: "Org.nr",
  },
  hero: {
    label: "✦ Gjort för studenter ✦",
    tagline: "Få ordning på studierna.",
    intro:
      "25 ifyllbara PDF-planerare för studenter. För dagen, veckan och månaden — skriv ut eller fyll i direkt på skärmen.",
    komplett: "Se hela paketet — {komplett}",
    explore: "Utforska planerarna",
    trust: ["Betala med Vipps eller kort", "Ifyllbara PDF:er", "Ladda ner direkt"],
    trustNoVipps: "Säker kortbetalning",
    coverAlt: "Studentplanleggers produkter — 25 ifyllbara PDF-planerare",
  },
  devices: {
    label: "✦ Använd dem var som helst ✦",
    heading: "Fungerar på alla enheter",
    intro:
      "Fyll i planerarna digitalt på dator, Mac, iPad eller surfplatta — eller skriv ut dem på papper. Du väljer.",
    cards: [
      {
        alt: "Fyll i planeraren digitalt på dator, Mac, iPad eller surfplatta",
        label: "Fyll i digitalt",
        subtext: "Använd på dator, Mac, iPad eller surfplatta",
      },
      {
        alt: "Års-, månads-, vecko- och dagsplanerare",
        label: "För året, månaden, veckan och dagen",
        subtext: "Planerare för alla behov",
      },
      {
        alt: "Finns i flera storlekar: A4, A5, Letter och Half Letter",
        label: "Flera storlekar",
        subtext: "A4, A5, Letter och Half Letter",
      },
    ],
  },
  categories: { label: "✦ Utforska kategorierna ✦", heading: "Vad behöver du?", planners: "planerare" },
  painPoints: {
    label: "✦ Känner du igen dig? ✦",
    heading: "För dig som...",
    cards: [
      {
        title: "...aldrig vet var du ska börja",
        description:
          "Terminsstart, tentor, projekt — det är mycket att hålla koll på. Med dags- och veckoplanerare får du överblick från dag ett.",
      },
      {
        title: "...vill bygga bättre vanor",
        description:
          "Det är lätt att börja, svårt att hålla i. Vanetrackern och 30-dagarsutmaningen hjälper dig att faktiskt hålla det vid liv.",
      },
      {
        title: "...vill nå dina mål",
        description:
          "Oavsett om det gäller betyg, träning eller sparande — Målplaneraren och Handlingsplanen bryter ner stora mål i konkreta steg.",
      },
    ],
  },
  bundleShowcase: {
    label: "✦ Allt du behöver ✦",
    heading: "Studentplanlegger Komplett",
    includedTitle: "25 planerare ingår:",
    includes: [
      "5 dagsplanerare",
      "5 veckoplanerare",
      "3 månadsplanerare",
      "1 årsplanerare",
      "5 produktivitetsverktyg",
      "3 för hälsa och livsstil",
      "3 trackers",
    ],
    buyKomplett: "Köp hela paketet med Vipps — {price}",
    addKomplett: "Lägg hela paketet i varukorgen — {price}",
    seeAll: "Se alla 25 planerare",
    orPick: "✦ Eller välj ett paket ✦",
    packsNote: "Temapaket {theme}. Lägg valfria fem planerare i varukorgen för {fivePack}.",
    bundleMeta: "{count} planerare · {price}",
    buy: "Köp",
    alreadyInCart: "Redan i varukorgen",
    added: "Tillagd ✓",
  },
  howItWorks: {
    label: "✦ Snabbt och enkelt ✦",
    heading: "Så funkar det",
    step: "Steg",
    steps: [
      {
        title: "Välj",
        description:
          "Välj verktyget eller paketet som passar dig. Enskilda planerare från {single}, 5-pack {fivePack}, paket från {theme}.",
      },
      {
        title: "Betala",
        description:
          "Säker betalning med Vipps eller bankkort. Ingen prenumeration — du betalar en gång och äger produkten för alltid.",
      },
      {
        title: "Ladda ner",
        description:
          "Ladda ner filerna direkt — ifyllbara PDF:er för utskrift eller digital användning. Klart på under en minut.",
      },
    ],
    payNoVipps:
      "Säker betalning med kort. Ingen prenumeration — du betalar en gång och äger produkten för alltid.",
  },
  testimonials: {
    label: "✦ Från studenter som du ✦",
    heading: "Vad andra säger",
    note: "Citaten är översatta från norska.",
    quotes: [
      {
        quote:
          "Dagsplaneraren har förändrat min morgonrutin. Jag lägger fem minuter på att planera dagen och får mycket mer gjort.",
        study: "Juridik, UiO",
      },
      {
        quote:
          "Veckoplanen är perfekt för att planera terminen. Äntligen ser jag hela veckan på en gång i stället för att glömma saker.",
        study: "Sjuksköterskeprogrammet, NTNU",
      },
      {
        quote:
          "Älskar att jag kan fylla i direkt på iPaden. Jag slipper skriva ut, och det ser ändå snyggt ut.",
        study: "Ekonomi, NHH",
      },
    ],
  },
  faq: { label: "✦ Frågor? ✦", heading: "Vanliga frågor" },
  guideList: { label: "✦ Guider ✦", heading: "Tips för studievardagen", read: "Läs guiden" },
  guidePage: { home: "Start", guide: "Guide" },
  newsletter: {
    heading: "Gratis smakprov på veckoplanen",
    subheading: "Få ett ifyllbart smakprov på veckoplanen via mejl — en sida, inte hela produkten.",
    buttonLabel: "Skicka smakprovet",
    successMessage: "Tack! Kolla inkorgen — smakprovet är på väg.",
    error: "Något gick fel. Försök igen.",
    emailLabel: "Mejladress",
    placeholder: "du@example.com",
    sending: "Skickar...",
    consentBefore:
      "Genom att skicka in godkänner du att vi sparar din mejladress för att skicka smakprovet och regelbundna studietips. Läs vår ",
    consentLink: "integritetspolicy",
    consentAfter: ".",
  },
  gratis: {
    label: "GRATIS SMAKPROV",
    heading: "Ladda ner ett gratis smakprov på veckoplanen",
    intro:
      "En ifyllbar PDF på en sida, så att du kan testa formatet innan du köper. Det här är inte hela planeraren — bara ett utdrag ur veckoplanen.",
    bullets: [
      "Ifyllbara fält för mål, prioriteringar, att göra, vanor och måndag–onsdag",
      "En riktig sida ur Veckoplan — samma design som den fullständiga versionen",
      "Hela veckoplanen och 24 andra PDF:er finns i butiken",
    ],
    formHeading: "Få smakprovet via mejl",
    formText: "Skriv in din mejladress. Vi skickar en nedladdningslänk — inte hela produkten.",
    cta: "Se alla planerare — från {single}",
    komplett: "Hela paketet med 25 planerare: {komplett}.",
  },
  notFound: {
    heading: "Sidan finns inte",
    text: "Vi hittade inte sidan du letar efter. Kika på planerarna eller gå tillbaka till startsidan.",
    home: "Till startsidan",
    planners: "Se planerarna",
  },
  catalog: {
    prices: "{single} per planerare. Lägg valfria fem i varukorgen och betala {fivePack}.",
    nav: "Produktkategorier",
    allTab: "Alla",
  },
  productCard: {
    alreadyInCart: "Redan i varukorgen",
    added: "Tillagd ✓",
    badge: "Ifyllbar PDF",
    pages: "sidor",
    buy: "Köp nu",
  },
  stickyBar: {
    title: "Studentplanlegger Komplett — alla 25 för {komplett}",
    subtitle: "Alla 25 ifyllbara PDF:er",
    alreadyInCart: "Redan i varukorgen",
    added: "Tillagd ✓",
    add: "Lägg i varukorgen",
  },
  cart: {
    title: "Varukorg",
    close: "Stäng",
    empty: "Varukorgen är tom",
    seeProducts: "Se produkter",
    remove: "Ta bort {name}",
    onePack: "5-pack: fem planerare för {fivePack}",
    manyPacks: "{packs} × 5-pack för {price}",
    singles: " + {count} styck",
    addMore: "Lägg till {count} till så får du 5-pack för {fivePack}.",
    total: "Totalt",
    checkout: "Till kassan",
    clear: "Töm varukorgen",
  },
  komplettVipps: {
    label: "Köp hela paketet med Vipps",
    error: "Det gick inte att starta Vipps-betalningen",
  },
  kasse: {
    errors: {
      firstName: "Förnamn måste fyllas i",
      lastName: "Efternamn måste fyllas i",
      email: "Mejladress måste fyllas i",
      emailInvalid: "Ogiltig mejladress",
      confirm: "Bekräfta din mejladress",
      mismatch: "Mejladresserna stämmer inte överens",
    },
    invalidCode: "Ogiltig kod",
    codeActive: "Koden {code} är aktiv — {percent} % för {association}. Du betalar {amount}.",
    cancelled: "Betalningen avbröts eller misslyckades. Ingen beställning har genomförts.",
    genericError: "Något gick fel. Försök igen.",
    emptyTitle: "Varukorgen är tom",
    emptyText: "Lägg till produkter innan du går till kassan.",
    seeProducts: "Se produkter",
    title: "Kassa",
    steps: ["Uppgifter", "Betalning", "Nedladdning"],
    details: "Dina uppgifter",
    firstName: "Förnamn",
    firstNamePlaceholder: "Anna",
    lastName: "Efternamn",
    lastNamePlaceholder: "Andersson",
    email: "Mejladress",
    emailPlaceholder: "anna@example.com",
    confirmEmail: "Bekräfta mejladress",
    summary: "Sammanfattning",
    remove: "Ta bort {name}",
    fivePack: "5-pack",
    singleOne: "1 enskild planerare",
    singleOther: "{count} enskilda planerare",
    discountCode: "Rabattkod",
    discountPlaceholder: "t.ex. ABAKUS20",
    apply: "Använd",
    listPrice: "Ordinarie pris {amount}",
    total: "Totalt",
    payVipps: "Betala med Vipps",
    recommended: "Rekommenderas",
    or: "eller",
    payCard: "Betala med kort",
    cardDisabled: "Kortbetalning är inte tillgänglig än. Betala med Vipps.",
    secure: "Säker betalning · Ladda ner direkt",
    acceptTerms: "Genom att handla godkänner du våra köpvillkor",
  },
  takk: {
    errorTitle: "Något gick fel",
    errorText: "Vi hittade inte din beställning. Kolla din mejl eller kontakta oss för hjälp.",
    home: "Tillbaka till startsidan",
    paidTitle: "Tack för ditt köp!",
    cancelledTitle: "Betalningen avbröts",
    pendingTitle: "Väntar på betalning",
    confirmationSent: "En bekräftelse har skickats till",
    readyNoEmail: "Din nedladdning är klar. Spara den här sidan om du inte har fått något mejl.",
    cancelledText: "Betalningen bekräftades inte, så nedladdningen har inte aktiverats.",
    pendingText: "Vi väntar på att betalningen ska bekräftas. Stäng inte sidan.",
    products: "Dina produkter",
    download: "Ladda ner",
    downloadsLeft: "{count} nedladdningar kvar",
    expires: "Länken går ut",
    expired: "Nedladdningslänken har gått ut. Kontakta oss för hjälp.",
    activatesOnPayment: "Nedladdningen aktiveras när betalningen är bekräftad",
  },
  legalNote: {
    before: "Det här är en svensk översättning som vi erbjuder för enkelhetens skull. Det är den ",
    link: "norska versionen",
    after: " som är juridiskt bindande.",
  },
  pdfLanguage: {
    available: { sentence: "Alla planerare finns på svenska.", short: "På svenska" },
    norwegian: {
      sentence: "Planerarna är på norska (bokmål).",
      short: "På norska (bokmål)",
    },
  },
  apiErrors: {
    "Ugyldig forespørsel": "Ogiltig förfrågan.",
    "Ugyldig e-postadresse": "Ogiltig mejladress.",
    "For mange forsøk. Prøv igjen senere.": "För många försök. Försök igen senare.",
    "Kunne ikke lage nedlastingslenke": "Det gick inte att skapa en nedladdningslänk.",
    "Nyhetsbrev er ikke konfigurert": "Nyhetsbrevet är inte konfigurerat än.",
    "Kunne ikke lagre kontakten": "Det gick inte att spara din mejladress.",
    "Kunne ikke sende e-post": "Det gick inte att skicka mejlet.",
    Serverfeil: "Serverfel. Försök igen.",
    "Mangler produkter": "Varukorgen är tom.",
    "Ukjent produkt": "Okänd produkt i varukorgen.",
    "Ugyldig betalingsmetode": "Ogiltigt betalsätt.",
    "Mangler påkrevde felt": "Fyll i alla obligatoriska fält.",
    "Kunne ikke starte kortbetaling": "Det gick inte att starta kortbetalningen.",
    "Kortbetaling kan ikke belastes ennå. Stripe-kontoen er ikke aktivert.":
      "Kortbetalningar kan inte dras än. Stripe-kontot är inte aktiverat.",
    "Kunne ikke opprette ordre": "Det gick inte att skapa beställningen.",
    "Kunne ikke starte Vipps-betaling": "Det gick inte att starta Vipps-betalningen.",
    "Ugyldig eller utløpt rabattkode": "Ogiltig eller utgången rabattkod.",
    "Ugyldig kode": "Ogiltig kod.",
    "Ugyldig valuta": "Den här valutan stöds inte.",
    "Vipps kan bare brukes ved betaling i norske kroner (NOK)":
      "Vipps kan bara användas vid betalning i norska kronor (NOK).",
  },
  genericError: "Något gick fel. Försök igen.",
  products: {
    "daglig-gjennomgang": {
      name: "Daglig genomgång",
      description:
        "Blad för daglig genomgång och reflektion — summera dagen, skriv ner vad som gick bra och vad du vill förbättra.",
      features: ["Sammanfattning av dagen", "Reflektion", "Saker att förbättra"],
    },
    "daglig-helseplan": {
      name: "Daglig hälsoplan",
      description: "Daglig hälsoplanerare — håll koll på träning, måltider, vätskeintag och sömn.",
      features: ["Träningslogg", "Måltidsplan", "Sömn och vätskeintag"],
    },
    "daglig-planlegger": {
      name: "Dagsplanerare",
      description: "Dagsplanerare med agenda, fokusområden och att göra-lista.",
      features: ["Dagens agenda", "Fokusområden", "Att göra-lista"],
    },
    "daglig-produktivitetsplan": {
      name: "Daglig produktivitetsplan",
      description: "Daglig produktivitetsplan med tidsblock och prioriteringar.",
      features: ["Tidsblock", "Prioriteringar", "Fokus på produktivitet"],
    },
    "daglig-timeplan": {
      name: "Dagsschema",
      description: "Timme-för-timme-plan för dagen, från morgon till kväll.",
      features: ["Plan per timme", "Morgon till kväll", "Strukturerad dag"],
    },
    "ukentlig-gjennomgang": {
      name: "Veckogenomgång",
      description: "Sammanfattning av veckan — reflektera över veckan och sätt mål för nästa.",
      features: ["Sammanfattning av veckan", "Reflektion", "Målsättning"],
    },
    "ukentlig-gjoremaal": {
      name: "Veckans att göra",
      description: "Att göra-lista för veckan med plats för uppgifter varje dag.",
      features: ["Dagliga uppgifter", "Veckoöversikt", "Prioritetsfält"],
    },
    "ukentlig-matplan": {
      name: "Veckomatsedel",
      description: "Veckomatsedel med inköpslista.",
      features: ["Måltidsplan", "Inköpslista", "Veckoöversikt"],
    },
    "ukentlig-plan": {
      name: "Veckoplan",
      description: "Komplett veckoplan med fokusområden och dagsblock.",
      features: ["Fokusområden", "Dagsblock", "2 sidor"],
    },
    "ukentlig-planlegger": {
      name: "Veckoplanerare",
      description: "Enkel veckoplanerare för studier och vardag.",
      features: ["Enkel överblick", "Studier och vardag", "Veckoplan"],
    },
    "maanedlig-budsjett": {
      name: "Månadsbudget",
      description: "Månadsbudget — håll koll på inkomster och utgifter.",
      features: ["Översikt över inkomster", "Koll på utgifter", "Budgetbalans"],
    },
    "maanedlig-gjennomgang": {
      name: "Månadsgenomgång",
      description: "Genomgång och reflektion för månaden.",
      features: ["Sammanfattning av månaden", "Reflektion", "2 sidor"],
    },
    "maanedlig-planlegger": {
      name: "Månadsplanerare",
      description: "Månadsplanerare med överblick över mål och att göra.",
      features: ["Månadens mål", "Att göra-lista", "Tydlig layout"],
    },
    "aarlig-planlegger": {
      name: "Årsplanerare",
      description: "Årsplanerare med översikt månad för månad och mål för året.",
      features: ["Månadsöversikt", "Mål för året", "2 sidor"],
    },
    "pomodoro-planlegger": {
      name: "Pomodoroplanerare",
      description: "Planerare för pomodoropass med poäng för produktivitet.",
      features: ["Pomodorotimer", "Produktivitetspoäng", "Planering av pass"],
    },
    "prosjekt-planlegger": {
      name: "Projektplanerare",
      description: "Projektplanering med tidslinje och milstolpar.",
      features: ["Tidslinje", "Milstolpar", "Uppdelning i uppgifter"],
    },
    "gjoremaal-liste": {
      name: "Att göra-lista",
      description: "Enkel att göra-lista med prioritetsfält.",
      features: ["Prioritetsfält", "Enkel överblick", "Att göra-lista"],
    },
    handlingsplan: {
      name: "Handlingsplan",
      description: "Handlingsplan för att bryta ner mål i konkreta steg.",
      features: ["Mål i delsteg", "Konkreta steg", "Fokus på handling"],
    },
    "maal-planlegger": {
      name: "Målplanerare",
      description: "Blad för målsättning med åtgärder och deadlines.",
      features: ["Målsättning", "Åtgärder", "Deadlines"],
    },
    "helse-planlegger": {
      name: "Hälsoplanerare",
      description: "Planerare för hälsa och träning med kostmål.",
      features: ["Träningsplan", "Kostmål", "Uppföljning av hälsan"],
    },
    hjemmeplanlegger: {
      name: "Hemplanerare",
      description: "Planera måltider, hushållssysslor och inköpslistan för hemmet.",
      features: ["Måltidsplan", "Hushållssysslor", "Inköpslista"],
    },
    "reise-planlegger": {
      name: "Reseplanerare",
      description: "Planera resor med budget, packlista och dagsprogram.",
      features: ["Resebudget", "Packlista", "Dagsprogram"],
    },
    "personlig-finans-tracker": {
      name: "Privatekonomitracker",
      description: "Översikt över din privatekonomi med inkomster, utgifter och sparande.",
      features: ["Inkomster", "Utgifter", "Översikt över sparande"],
    },
    "vane-tracker": {
      name: "Vanetracker",
      description: "Rutnät för att följa vanor månadsvis — bygg goda vanor.",
      features: ["Månadsrutnät", "Valfria kategorier", "Visuella framsteg"],
    },
    "30-dagers-utfordring": {
      name: "30-dagarsutmaning",
      description: "Tracker för en 30-dagarsutmaning med nya vanor eller mål.",
      features: ["Koll i 30 dagar", "Vanemål", "Daglig avbockning"],
    },
  },
  bundles: {
    komplett: {
      name: "Studentplanlegger Komplett",
      description:
        "Alla 25 planerare. Allt du behöver för att ha full koll på studierna.",
      badge: "Mest för pengarna",
    },
    "daglig-pakke": {
      name: "Dagspaket",
      description: "Alla 5 dagsplanerare i ett paket.",
    },
    "ukentlig-pakke": {
      name: "Veckopaket",
      description: "Alla 5 veckoplanerare i ett paket.",
    },
    produktivitetspakken: {
      name: "Produktivitetspaket",
      description: "Alla 5 produktivitetsverktyg i ett paket.",
    },
  },
  categoryLabels: {
    alle: "Alla",
    daglig: "Dag",
    ukentlig: "Vecka",
    maanedlig: "Månad",
    aarlig: "År",
    produktivitet: "Produktivitet",
    helse: "Hälsa och livsstil",
    sporing: "Trackers",
  },
};
