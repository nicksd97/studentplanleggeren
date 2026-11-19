import type { Messages } from "./types";

// German UI copy. Translated from the English reference (en.ts).

export const de: Messages = {
  switcher: { label: "Sprache" },
  header: {
    planners: "Planer",
    free: "Gratis-Probe",
    bundles: "Pakete",
    faq: "FAQ",
    buyKomplett: "Komplettpaket mit Vipps kaufen",
    cart: "Warenkorb",
    menu: "Menü",
  },
  footer: {
    tagline: "Planer und Produktivitätstools, gemacht für Studierende.",
    products: "Produkte",
    komplett: "Komplettpaket",
    daily: "Tagespaket",
    weekly: "Wochenpaket",
    all: "Alle Planer",
    guides: "Ratgeber",
    info: "Info",
    faq: "FAQ",
    free: "Gratis-Probe",
    privacy: "Datenschutz",
    terms: "AGB",
    madeWith: "Mit Liebe in Norwegen gemacht",
    orgNo: "Org.-Nr.",
  },
  hero: {
    label: "✦ Gemacht für Studierende ✦",
    tagline: "Bring Ordnung in dein Studium.",
    intro:
      "25 ausfüllbare PDF-Planer für Studierende. Täglich, wöchentlich, monatlich – zum Ausdrucken oder direkt am Bildschirm ausfüllen.",
    komplett: "Zum Komplettpaket – {komplett}",
    explore: "Planer entdecken",
    trust: ["Bezahlen mit Vipps oder Karte", "Ausfüllbare PDFs", "Sofort-Download"],
    trustNoVipps: "Sichere Kartenzahlung",
    coverAlt: "Produkte von Studentplanlegger – 25 ausfüllbare PDF-Planer",
  },
  devices: {
    label: "✦ Überall nutzbar ✦",
    heading: "Funktioniert auf jedem Gerät",
    intro:
      "Füll die Planer digital am PC, Mac, iPad oder Tablet aus – oder druck sie auf Papier aus. Du entscheidest.",
    cards: [
      {
        alt: "Den Planer digital am PC, Mac, iPad oder Tablet ausfüllen",
        label: "Digital ausfüllen",
        subtext: "Für PC, Mac, iPad oder Tablet",
      },
      {
        alt: "Jahres-, Monats-, Wochen- und Tagesplaner",
        label: "Jahr, Monat, Woche und Tag",
        subtext: "Planer für jeden Bedarf",
      },
      {
        alt: "Erhältlich in mehreren Formaten: A4, A5, Letter und Half Letter",
        label: "Mehrere Formate",
        subtext: "A4, A5, Letter und Half Letter",
      },
    ],
  },
  categories: { label: "✦ Entdecke die Kategorien ✦", heading: "Was brauchst du?", planners: "Planer" },
  painPoints: {
    label: "✦ Kommt dir bekannt vor? ✦",
    heading: "Für dich, wenn du …",
    cards: [
      {
        title: "… nie weißt, wo du anfangen sollst",
        description:
          "Semesterstart, Prüfungen, Projekte – da kommt einiges zusammen. Tages- und Wochenplaner geben dir vom ersten Tag an den Überblick.",
      },
      {
        title: "… bessere Gewohnheiten aufbauen willst",
        description:
          "Anfangen ist leicht, dranbleiben ist schwer. Der Gewohnheitstracker und die 30-Tage-Challenge helfen dir, wirklich am Ball zu bleiben.",
      },
      {
        title: "… deine Ziele erreichen willst",
        description:
          "Ob Notenziele, Fitnessziele oder Sparziele – der Zielplaner und der Aktionsplan zerlegen große Ziele in konkrete Schritte.",
      },
    ],
  },
  bundleShowcase: {
    label: "✦ Alles, was du brauchst ✦",
    heading: "Studentplanlegger Komplett",
    includedTitle: "25 Planer inklusive:",
    includes: [
      "5 Tagesplaner",
      "5 Wochenplaner",
      "3 Monatsplaner",
      "1 Jahresplaner",
      "5 Produktivitätstools",
      "3 für Gesundheit & Alltag",
      "3 Tracking-Tools",
    ],
    buyKomplett: "Komplettpaket mit Vipps kaufen – {price}",
    addKomplett: "Komplettpaket in den Warenkorb – {price}",
    seeAll: "Alle 25 Planer ansehen",
    orPick: "✦ Oder wähl ein Paket ✦",
    packsNote:
      "Themenpakete {theme}. Leg fünf beliebige Einzelplaner in den Warenkorb und zahl {fivePack}.",
    bundleMeta: "{count} Planer · {price}",
    buy: "Kaufen",
    alreadyInCart: "Schon im Warenkorb",
    added: "Hinzugefügt ✓",
  },
  howItWorks: {
    label: "✦ Schnell und einfach ✦",
    heading: "So funktioniert’s",
    step: "Schritt",
    steps: [
      {
        title: "Auswählen",
        description:
          "Such dir das Tool oder Paket aus, das zu dir passt. Einzelplaner ab {single}, 5er-Pack {fivePack}, Pakete ab {theme}.",
      },
      {
        title: "Bezahlen",
        description:
          "Sichere Zahlung mit Vipps oder Bankkarte. Kein Abo – du zahlst einmal und das Produkt gehört dir für immer.",
      },
      {
        title: "Herunterladen",
        description:
          "Lade die Dateien sofort herunter – ausfüllbare PDFs zum Ausdrucken oder für die digitale Nutzung. In unter einer Minute startklar.",
      },
    ],
    payNoVipps:
      "Sichere Zahlung per Karte. Kein Abo – du zahlst einmal und das Produkt gehört dir für immer.",
  },
  testimonials: {
    label: "✦ Von Studierenden wie dir ✦",
    heading: "Das sagen andere",
    note: "Aus dem Norwegischen übersetzte Zitate.",
    quotes: [
      {
        quote:
          "Der Tagesplaner hat meine Morgenroutine verändert. Ich plane fünf Minuten lang den Tag und schaffe viel mehr.",
        study: "Jura, UiO",
      },
      {
        quote:
          "Der Wochenplan ist genial, um das Semester zu planen. Endlich sehe ich die ganze Woche auf einen Blick, statt Dinge zu vergessen.",
        study: "Pflege, NTNU",
      },
      {
        quote:
          "Ich liebe es, dass ich direkt auf dem iPad ausfüllen kann. Kein Ausdrucken nötig, und es sieht trotzdem schön aus.",
        study: "Wirtschaftswissenschaften, NHH",
      },
    ],
  },
  faq: { label: "✦ Fragen? ✦", heading: "Häufig gestellte Fragen" },
  guideList: { label: "✦ Ratgeber ✦", heading: "Tipps für den Studienalltag", read: "Ratgeber lesen" },
  guidePage: { home: "Startseite", guide: "Ratgeber" },
  newsletter: {
    heading: "Gratis-Probe vom Wochenplan",
    subheading:
      "Hol dir eine ausfüllbare Probeseite vom Wochenplan per E-Mail – eine Seite, nicht das ganze Produkt.",
    buttonLabel: "Probe zusenden",
    successMessage: "Danke! Schau in dein Postfach – die Probe ist unterwegs.",
    error: "Da ist etwas schiefgelaufen. Bitte versuch es noch einmal.",
    emailLabel: "E-Mail-Adresse",
    placeholder: "du@beispiel.de",
    sending: "Wird gesendet …",
    consentBefore:
      "Mit dem Absenden erklärst du dich einverstanden, dass wir deine E-Mail-Adresse speichern, um dir die Probe und regelmäßig Lerntipps zu schicken. Lies dazu die ",
    consentLink: "Datenschutzerklärung",
    consentAfter: ".",
  },
  gratis: {
    label: "GRATIS-PROBE",
    heading: "Lade dir eine kostenlose Probe vom Wochenplan herunter",
    intro:
      "Ein einseitiges, ausfüllbares PDF, damit du das Format testen kannst, bevor du kaufst. Das ist nicht der ganze Planer – nur ein Auszug aus dem Wochenplan.",
    bullets: [
      "Ausfüllbare Felder für Ziele, Prioritäten, To-dos, Gewohnheiten und Montag bis Mittwoch",
      "Eine echte Seite aus dem Wochenplan – im selben Design wie die Vollversion",
      "Den kompletten Wochenplan und 24 weitere PDFs findest du im Shop",
    ],
    formHeading: "Probe per E-Mail erhalten",
    formText:
      "Gib deine E-Mail-Adresse ein. Wir schicken dir einen Download-Link – nicht das ganze Produkt.",
    cta: "Alle Planer ansehen – ab {single}",
    komplett: "Komplettpaket mit 25 Planern: {komplett}.",
  },
  notFound: {
    heading: "Seite nicht gefunden",
    text: "Die gesuchte Seite gibt es leider nicht. Stöbere durch die Planer oder geh zurück zur Startseite.",
    home: "Zur Startseite",
    planners: "Planer ansehen",
  },
  catalog: {
    prices: "{single} pro Planer. Leg fünf beliebige in den Warenkorb und zahl {fivePack}.",
    nav: "Produktkategorien",
    allTab: "Alle",
  },
  productCard: {
    alreadyInCart: "Schon im Warenkorb",
    added: "Hinzugefügt ✓",
    badge: "Ausfüllbares PDF",
    pages: "Seiten",
    buy: "Jetzt kaufen",
  },
  stickyBar: {
    title: "Studentplanlegger Komplett – alle 25 für {komplett}",
    subtitle: "Alle 25 ausfüllbaren PDFs",
    alreadyInCart: "Schon im Warenkorb",
    added: "Hinzugefügt ✓",
    add: "In den Warenkorb",
  },
  cart: {
    title: "Warenkorb",
    close: "Schließen",
    empty: "Dein Warenkorb ist leer",
    seeProducts: "Produkte ansehen",
    remove: "{name} entfernen",
    onePack: "5er-Pack: fünf Planer für {fivePack}",
    manyPacks: "{packs} × 5er-Pack für {price}",
    singles: " + {count} einzeln",
    addMore: "Füg noch {count} hinzu, um das 5er-Pack für {fivePack} zu bekommen.",
    total: "Gesamt",
    checkout: "Zur Kasse",
    clear: "Warenkorb leeren",
  },
  komplettVipps: {
    label: "Komplettpaket mit Vipps kaufen",
    error: "Die Vipps-Zahlung konnte nicht gestartet werden",
  },
  kasse: {
    errors: {
      firstName: "Bitte gib deinen Vornamen ein",
      lastName: "Bitte gib deinen Nachnamen ein",
      email: "Bitte gib deine E-Mail-Adresse ein",
      emailInvalid: "Ungültige E-Mail-Adresse",
      confirm: "Bitte bestätige deine E-Mail-Adresse",
      mismatch: "Die E-Mail-Adressen stimmen nicht überein",
    },
    invalidCode: "Ungültiger Code",
    codeActive: "Code {code} ist aktiv – {percent} % für {association}. Du zahlst {amount}.",
    cancelled: "Die Zahlung wurde abgebrochen oder ist fehlgeschlagen. Es wurde keine Bestellung abgeschlossen.",
    genericError: "Da ist etwas schiefgelaufen. Bitte versuch es noch einmal.",
    emptyTitle: "Dein Warenkorb ist leer",
    emptyText: "Leg ein paar Produkte in den Warenkorb, bevor du zur Kasse gehst.",
    seeProducts: "Produkte ansehen",
    title: "Kasse",
    steps: ["Angaben", "Zahlung", "Download"],
    details: "Deine Angaben",
    firstName: "Vorname",
    firstNamePlaceholder: "Max",
    lastName: "Nachname",
    lastNamePlaceholder: "Mustermann",
    email: "E-Mail",
    emailPlaceholder: "max@example.com",
    confirmEmail: "E-Mail bestätigen",
    summary: "Bestellübersicht",
    remove: "{name} entfernen",
    fivePack: "5er-Pack",
    singleOne: "1 Einzelplaner",
    singleOther: "{count} Einzelplaner",
    discountCode: "Rabattcode",
    discountPlaceholder: "z. B. ABAKUS20",
    apply: "Einlösen",
    listPrice: "Regulärer Preis {amount}",
    total: "Gesamt",
    payVipps: "Mit Vipps bezahlen",
    recommended: "Empfohlen",
    or: "oder",
    payCard: "Mit Karte bezahlen",
    cardDisabled: "Kartenzahlung ist noch nicht verfügbar. Bitte bezahl mit Vipps.",
    secure: "Sichere Zahlung · Sofort-Download",
    acceptTerms: "Mit dem Kauf akzeptierst du unsere AGB",
  },
  takk: {
    errorTitle: "Da ist etwas schiefgelaufen",
    errorText:
      "Wir konnten deine Bestellung nicht finden. Schau in deine E-Mails oder schreib uns, wenn du Hilfe brauchst.",
    home: "Zurück zur Startseite",
    paidTitle: "Danke für deinen Kauf!",
    cancelledTitle: "Die Zahlung wurde abgebrochen",
    pendingTitle: "Warten auf die Zahlung",
    confirmationSent: "Eine Bestätigung wurde gesendet an",
    readyNoEmail:
      "Dein Download ist bereit. Behalte diese Seite, falls du keine E-Mail bekommen hast.",
    cancelledText: "Die Zahlung wurde nicht bestätigt, daher wurde der Download nicht freigeschaltet.",
    pendingText: "Wir warten auf die Bestätigung der Zahlung. Bitte schließ diese Seite nicht.",
    products: "Deine Produkte",
    download: "Herunterladen",
    downloadsLeft: "Noch {count} Downloads übrig",
    expires: "Der Link läuft ab am",
    expired: "Der Download-Link ist abgelaufen. Schreib uns, wenn du Hilfe brauchst.",
    activatesOnPayment: "Die Downloads werden freigeschaltet, sobald die Zahlung bestätigt ist",
  },
  legalNote: {
    before: "Dies ist eine deutsche Übersetzung zu deiner Information. Rechtsverbindlich ist die ",
    link: "norwegische Fassung",
    after: ".",
  },
  pdfLanguage: {
    available: { sentence: "Alle Planer gibt es auf Deutsch.", short: "Auf Deutsch" },
    norwegian: {
      sentence: "Die Planer sind auf Norwegisch (Bokmål).",
      short: "Auf Norwegisch (Bokmål)",
    },
  },
  apiErrors: {
    "Ugyldig forespørsel": "Ungültige Anfrage.",
    "Ugyldig e-postadresse": "Ungültige E-Mail-Adresse.",
    "For mange forsøk. Prøv igjen senere.": "Zu viele Versuche. Bitte versuch es später noch einmal.",
    "Kunne ikke lage nedlastingslenke": "Der Download-Link konnte nicht erstellt werden.",
    "Nyhetsbrev er ikke konfigurert": "Der Newsletter ist noch nicht eingerichtet.",
    "Kunne ikke lagre kontakten": "Deine E-Mail-Adresse konnte nicht gespeichert werden.",
    "Kunne ikke sende e-post": "Die E-Mail konnte nicht gesendet werden.",
    Serverfeil: "Serverfehler. Bitte versuch es noch einmal.",
    "Mangler produkter": "Dein Warenkorb ist leer.",
    "Ukjent produkt": "Unbekanntes Produkt im Warenkorb.",
    "Ugyldig betalingsmetode": "Ungültige Zahlungsmethode.",
    "Mangler påkrevde felt": "Bitte füll alle Pflichtfelder aus.",
    "Kunne ikke starte kortbetaling": "Die Kartenzahlung konnte nicht gestartet werden.",
    "Kortbetaling kan ikke belastes ennå. Stripe-kontoen er ikke aktivert.":
      "Kartenzahlungen können noch nicht belastet werden. Das Stripe-Konto ist nicht aktiviert.",
    "Kunne ikke opprette ordre": "Die Bestellung konnte nicht angelegt werden.",
    "Kunne ikke starte Vipps-betaling": "Die Vipps-Zahlung konnte nicht gestartet werden.",
    "Ugyldig eller utløpt rabattkode": "Ungültiger oder abgelaufener Rabattcode.",
    "Ugyldig kode": "Ungültiger Code.",
    "Ugyldig valuta": "Diese Währung wird nicht unterstützt.",
    "Vipps kan bare brukes ved betaling i norske kroner (NOK)":
      "Vipps ist nur bei Zahlung in Norwegischen Kronen (NOK) möglich.",
  },
  genericError: "Da ist etwas schiefgelaufen. Bitte versuch es noch einmal.",
  products: {
    "daglig-gjennomgang": {
      name: "Tagesrückblick",
      description:
        "Blatt für den täglichen Rückblick – fass den Tag zusammen und notier, was gut lief und was du verbessern willst.",
      features: ["Tageszusammenfassung", "Reflexion", "Verbesserungspunkte"],
    },
    "daglig-helseplan": {
      name: "Täglicher Gesundheitsplan",
      description: "Täglicher Gesundheitsplaner – behalte Training, Mahlzeiten, Trinkmenge und Schlaf im Blick.",
      features: ["Trainings-Tracking", "Essensplan", "Schlaf und Trinkmenge"],
    },
    "daglig-planlegger": {
      name: "Tagesplaner",
      description: "Tagesplaner mit Agenda, Fokusbereichen und To-dos.",
      features: ["Tagesagenda", "Fokusbereiche", "To-do-Liste"],
    },
    "daglig-produktivitetsplan": {
      name: "Täglicher Produktivitätsplan",
      description: "Täglicher Produktivitätsplan mit Zeitblöcken und Prioritäten.",
      features: ["Zeitblöcke", "Prioritäten", "Produktivitätsfokus"],
    },
    "daglig-timeplan": {
      name: "Tagesablauf",
      description: "Stündlicher Plan für den Tag, von morgens bis abends.",
      features: ["Stundenplan", "Von morgens bis abends", "Strukturierter Tag"],
    },
    "ukentlig-gjennomgang": {
      name: "Wochenrückblick",
      description: "Wochenzusammenfassung – reflektier die Woche und setz dir Ziele für die nächste.",
      features: ["Wochenzusammenfassung", "Reflexion", "Ziele setzen"],
    },
    "ukentlig-gjoremaal": {
      name: "Wochen-To-dos",
      description: "Wöchentliche To-do-Liste mit Platz für Aufgaben an jedem Tag.",
      features: ["Tagesaufgaben", "Wochenüberblick", "Prioritätsfeld"],
    },
    "ukentlig-matplan": {
      name: "Wöchentlicher Essensplan",
      description: "Wöchentlicher Essensplaner mit Einkaufsliste.",
      features: ["Essensplan", "Einkaufsliste", "Wochenüberblick"],
    },
    "ukentlig-plan": {
      name: "Wochenplan",
      description: "Kompletter Wochenplan mit Fokusbereichen und Tagesblöcken.",
      features: ["Fokusbereiche", "Tagesblöcke", "2 Seiten"],
    },
    "ukentlig-planlegger": {
      name: "Wochenplaner",
      description: "Einfacher Wochenplaner für Studium und Alltag.",
      features: ["Einfacher Überblick", "Studium und Alltag", "Wochenplan"],
    },
    "maanedlig-budsjett": {
      name: "Monatsbudget",
      description: "Monatlicher Budgetplaner – behalte Einnahmen und Ausgaben im Blick.",
      features: ["Einnahmenübersicht", "Ausgaben-Tracking", "Budgetbilanz"],
    },
    "maanedlig-gjennomgang": {
      name: "Monatsrückblick",
      description: "Monatlicher Rückblick und Reflexion.",
      features: ["Monatszusammenfassung", "Reflexion", "2 Seiten"],
    },
    "maanedlig-planlegger": {
      name: "Monatsplaner",
      description: "Monatsplaner mit Überblick über Ziele und To-dos.",
      features: ["Monatsziele", "To-do-Liste", "Übersichtliches Layout"],
    },
    "aarlig-planlegger": {
      name: "Jahresplaner",
      description: "Jahresplaner mit Monatsübersicht und Zielen für das Jahr.",
      features: ["Monatsübersicht", "Jahresziele", "2 Seiten"],
    },
    "pomodoro-planlegger": {
      name: "Pomodoro-Planer",
      description: "Planer für Pomodoro-Lerneinheiten mit Produktivitätsbewertung.",
      features: ["Pomodoro-Timer", "Produktivitätsbewertung", "Einheiten planen"],
    },
    "prosjekt-planlegger": {
      name: "Projektplaner",
      description: "Projektplanung mit Zeitstrahl und Meilensteinen.",
      features: ["Zeitstrahl", "Meilensteine", "Aufgabenaufteilung"],
    },
    "gjoremaal-liste": {
      name: "To-do-Liste",
      description: "Einfache To-do-Liste mit Prioritätsfeldern.",
      features: ["Prioritätsfelder", "Einfacher Überblick", "To-do-Liste"],
    },
    handlingsplan: {
      name: "Aktionsplan",
      description: "Aktionsplan, um Ziele in konkrete Schritte zu zerlegen.",
      features: ["Ziele aufschlüsseln", "Konkrete Schritte", "Fokus aufs Handeln"],
    },
    "maal-planlegger": {
      name: "Zielplaner",
      description: "Blatt zum Zielesetzen mit Maßnahmen und Fristen.",
      features: ["Ziele setzen", "Maßnahmen", "Fristen"],
    },
    "helse-planlegger": {
      name: "Gesundheitsplaner",
      description: "Gesundheits- und Fitnessplaner mit Ernährungszielen.",
      features: ["Trainingsplan", "Ernährungsziele", "Gesundheits-Check"],
    },
    hjemmeplanlegger: {
      name: "Haushaltsplaner",
      description: "Plane Mahlzeiten, Hausarbeit und Einkaufsliste für dein Zuhause.",
      features: ["Essensplan", "Hausarbeit", "Einkaufsliste"],
    },
    "reise-planlegger": {
      name: "Reiseplaner",
      description: "Plane Reisen mit Budget, Packliste und Tagesprogramm.",
      features: ["Reisebudget", "Packliste", "Tagesprogramm"],
    },
    "personlig-finans-tracker": {
      name: "Finanztracker",
      description: "Überblick über deine Finanzen mit Einnahmen, Ausgaben und Ersparnissen.",
      features: ["Einnahmen", "Ausgaben", "Sparübersicht"],
    },
    "vane-tracker": {
      name: "Gewohnheitstracker",
      description: "Monatliches Raster zum Tracken von Gewohnheiten – bau dir gute Routinen auf.",
      features: ["Monatsraster", "Flexible Kategorien", "Sichtbarer Fortschritt"],
    },
    "30-dagers-utfordring": {
      name: "30-Tage-Challenge",
      description: "Tracker für eine 30-Tage-Challenge – für neue Gewohnheiten oder Ziele.",
      features: ["30 Tage im Blick", "Gewohnheitsziele", "Täglicher Check"],
    },
  },
  bundles: {
    komplett: {
      name: "Studentplanlegger Komplett",
      description:
        "Alle 25 Planer. Alles, was du brauchst, um dein Studium voll im Griff zu haben.",
      badge: "Bester Preis",
    },
    "daglig-pakke": {
      name: "Tagespaket",
      description: "Alle 5 Tagesplaner in einem Paket.",
    },
    "ukentlig-pakke": {
      name: "Wochenpaket",
      description: "Alle 5 Wochenplaner in einem Paket.",
    },
    produktivitetspakken: {
      name: "Produktivitätspaket",
      description: "Alle 5 Produktivitätstools in einem Paket.",
    },
  },
  categoryLabels: {
    alle: "Alle",
    daglig: "Täglich",
    ukentlig: "Wöchentlich",
    maanedlig: "Monatlich",
    aarlig: "Jährlich",
    produktivitet: "Produktivität",
    helse: "Gesundheit & Alltag",
    sporing: "Tracking",
  },
};
