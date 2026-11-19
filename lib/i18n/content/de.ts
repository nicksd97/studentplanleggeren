import type { Content } from "./types";

// German page metadata, catalog, FAQ, guides and order email. Translated from en.ts.

export const de: Content = {
  meta: {
    home: {
      title: "Studentplanlegger — Bring Ordnung in dein Studium",
      description:
        "25 ausfüllbare PDF-Planer für Studierende. Je {single}, 5er-Pack {fivePack}, Themenpakete {theme} und das Komplettpaket {komplett}.",
      keywords: [
        "Studienplaner",
        "Wochenplaner",
        "Tagesplaner",
        "Habit Tracker",
        "Pomodoro Planer",
        "PDF Planer zum Ausfüllen",
        "Lernplaner",
      ],
    },
    gratis: {
      title: "Gratis-Probe vom Wochenplan — Studentplanlegger",
      description:
        "Lade dir kostenlos eine ausfüllbare Probeseite vom Wochenplan herunter. Eine Seite zum Testen – nicht das ganze Produkt. Kompletter Wochenplan ab {single}.",
    },
    kasse: {
      title: "Kasse — Studentplanlegger",
      description: "Schließ deinen Kauf von ausfüllbaren PDF-Planern bei Studentplanlegger ab.",
    },
    takk: {
      title: "Danke für deinen Kauf — Studentplanlegger",
      description: "Lade die Planer herunter, die du bei Studentplanlegger gekauft hast.",
    },
    notFound: {
      title: "Seite nicht gefunden — Studentplanlegger",
      description:
        "Diese Seite gibt es nicht. Schau bei Studentplanlegger vorbei und entdecke die ausfüllbaren PDF-Planer.",
    },
    ogImageAlt: "Studentplanlegger – 25 ausfüllbare PDF-Planer",
  },
  catalog: {
    alle: {
      title: "Alle Planer — Studentplanlegger",
      description:
        "25 ausfüllbare PDF-Planer für Studierende. Je {single}, fünf beliebige für {fivePack} oder Pakete ab {theme}.",
      heading: "Alle Planer",
    },
    daglig: {
      title: "Tagesplaner — Studentplanlegger",
      description:
        "5 PDF-Tagesplaner für Studierende. Agenda, Tagesablauf, Gesundheit und Produktivität – am Bildschirm ausfüllen oder ausdrucken.",
      heading: "Tagesplaner",
    },
    ukentlig: {
      title: "Wochenplaner — Studentplanlegger",
      description:
        "5 PDF-Wochenplaner für Studierende: Wochenplan, To-dos, Essensplan und Wochenrückblick.",
      heading: "Wochenplaner",
    },
    maanedlig: {
      title: "Monatsplaner — Studentplanlegger",
      description:
        "Monatsbudget, Monatsrückblick und Monatsplaner als ausfüllbare PDFs für Studierende.",
      heading: "Monatsplaner",
    },
    aarlig: {
      title: "Jahresplaner — Studentplanlegger",
      description:
        "Jahresplaner mit Monatsübersicht und Zielen für das Jahr. Ein ausfüllbares PDF für Studierende.",
      heading: "Jahresplaner",
    },
    produktivitet: {
      title: "Produktivitätsplaner — Studentplanlegger",
      description:
        "Pomodoro, Projektplan, To-do-Liste, Aktionsplan und Zielplaner als ausfüllbare PDFs.",
      heading: "Produktivitätsplaner",
    },
    helse: {
      title: "Gesundheit & Alltag — Studentplanlegger",
      description:
        "Gesundheitsplaner, Haushaltsplaner und Reiseplaner. Ausfüllbare PDFs für Studierende.",
      heading: "Gesundheit & Alltag",
    },
    sporing: {
      title: "Tracking-Tools — Studentplanlegger",
      description:
        "Gewohnheitstracker, Finanztracker und 30-Tage-Challenge. Ausfüllbare PDFs für Studierende.",
      heading: "Tracking-Tools",
    },
  },
  faqLanguage: {
    question: "In welcher Sprache sind die Planer?",
    available:
      "Die Planer gibt es auf Deutsch: Überschriften und Beschriftungen in den PDFs sind auf Deutsch, und beim Kauf auf der deutschen Website bekommst du die deutschen Dateien.",
    norwegian:
      "Die Planer sind auf Norwegisch (Bokmål) verfasst. Diese Website gibt es auf Deutsch, aber Überschriften und Beschriftungen in den PDFs sind auf Norwegisch.",
  },
  faq: [
    {
      question: "Was ist ein ausfüllbares PDF?",
      answer:
        "Ein ausfüllbares PDF hat interaktive Felder, in die du direkt am Computer, Tablet oder Handy tippen kannst – ganz ohne Ausdrucken. Wenn du lieber mit der Hand schreibst, kannst du es natürlich auch ausdrucken.",
    },
    {
      question: "Kann ich die Planer ausdrucken?",
      answer:
        "Klar! Alle Planer sind für den Druck auf A4 gestaltet, mit einem klaren, gut lesbaren Layout. Perfekt für die Wand oder deinen Schreibtisch.",
    },
    {
      question: "Funktionieren sie auf Handy und Tablet?",
      answer:
        "Ja! Öffne die PDFs in einem PDF-Reader und füll die Felder direkt aus. Für das beste Ergebnis empfehlen wir den Adobe Acrobat Reader (kostenlos).",
    },
    {
      question: "Wie lade ich die Dateien nach dem Kauf herunter?",
      answer:
        "Du bekommst direkt nach der Zahlung Zugriff auf die Dateien. Du wirst auf eine Download-Seite weitergeleitet und erhältst außerdem eine E-Mail mit Download-Links, die 7 Tage gültig sind.",
    },
    {
      question: "Wie kann ich bezahlen?",
      answer:
        "Per Karte (Visa/Mastercard), in deiner Landeswährung, sofern wir sie unterstützen. Wenn du in Norwegischen Kronen zahlst, kannst du auch Vipps nutzen.",
    },
    {
      question: "Ist das ein Abo?",
      answer:
        "Nein – du zahlst einmal und die Planer gehören dir für immer. Kein Abo, keine versteckten Kosten.",
    },
    {
      question: "Was, wenn ich nicht zufrieden bin?",
      answer:
        "Da es sich um digitale Produkte handelt, die sofort geliefert werden, bieten wir normalerweise keine Rückerstattung an. Wenn du trotzdem unzufrieden bist, melde dich bei uns – wir finden eine Lösung.",
    },
    {
      question: "Was ist im Komplettpaket enthalten?",
      answer:
        "Studentplanlegger Komplett enthält alle 25 Planer (Tag, Woche, Monat, Jahr, Produktivität, Gesundheit und Tracking), alle als ausfüllbare PDFs. Das Paket kostet {komplett}.",
    },
    {
      question: "Was kosten die Planer?",
      answer:
        "Jeder Einzelplaner kostet {single}. Fünf beliebige Einzelplaner im Warenkorb kosten {fivePack}. Themenpakete kosten {theme} und Studentplanlegger Komplett kostet {komplett}.",
    },
  ],
  fivePack: {
    name: "5er-Pack",
    description: "Wähl fünf beliebige Einzelplaner und zahl {fivePack}.",
  },
  email: {
    subject: "Danke für deinen Kauf! Hier ist dein Download-Link",
    heading: "Danke für deinen Kauf, {firstName}!",
    intro: "Hier ist eine Übersicht deiner Bestellung:",
    discount: "Rabatt {code} (−{percent} %) – −{amount}",
    total: "Gesamt – {amount}",
    downloadIntro: "Über den folgenden Link kannst du deine Produkte herunterladen:",
    button: "Planer herunterladen",
    validity:
      "Der Link ist ab dem Kaufzeitpunkt 7 Tage gültig. Fragen? Schreib uns an",
  },
  guides: [
    {
      slug: "planlegg-studiedagen",
      title: "So planst du deinen Lerntag — Studentplanlegger",
      description:
        "Wähl wenige Prioritäten, plane Zeit fürs Lernen und für Pausen ein und schließ mit einem kurzen Rückblick ab. Eine praktische Methode für deinen Lerntag.",
      heading: "So planst du deinen Lerntag",
      summary:
        "Eine lange Liste ist selten ein Plan. So entscheidest du, was heute passiert – und lässt den Rest warten.",
      footerLabel: "Lerntag planen",
      catalogKey: "daglig",
      productSlug: "daglig-planlegger",
      productLead:
        "Der Tagesplaner ist ein ausfüllbares PDF-Blatt mit Agenda, Fokusbereichen und To-dos für {single}. In derselben Kategorie findest du auch den Tagesablauf und den Tagesrückblick.",
      productCta: "Tagesplaner ansehen",
      sections: [
        {
          heading: "Eine lange Liste ist selten ein Plan",
          paragraphs: [
            "Viele Lerntage beginnen mit allem, was du eigentlich schon hättest erledigen sollen, und enden mit dem, was zufällig oben auf der Liste stand. Besser funktioniert meist, ein paar Aufgaben auszuwählen, die wirklich erledigt werden, und Zeit dafür einzuplanen – Pausen inklusive.",
            "Du brauchst kein kompliziertes System. Du brauchst eine Reihenfolge: Was steht fest, was ist heute wichtig, und was kann warten?",
          ],
        },
        {
          heading: "Schreib auf, was ansteht – und wähl dann ein bis drei Aufgaben",
          paragraphs: [
            "Fang mit Vorlesungen, Abgabefristen und Terminen an. Wähl dann ein bis drei Lernaufgaben aus, die einen festen Platz bekommen. Der Rest gehört in einen Wochenplan oder auf die Liste für morgen.",
            "Wenn sich alles gleich wichtig anfühlt, frag dich: Was wird schwieriger, wenn ich es auf morgen verschiebe? Die Antwort ist oft die erste Lerneinheit des Tages.",
          ],
        },
        {
          heading: "Plane Zeit ein, nicht nur Aufgaben",
          paragraphs: [
            "„Kapitel 4 lesen“ ist ein Wunsch. „Kapitel 4 von 10 bis 11:30 Uhr lesen“ ist ein Plan. Du brauchst keinen Zeitplan für den ganzen Tag. Es reicht, die zwei oder drei wichtigsten Einheiten zu blocken und dem Rest des Tages etwas Luft zu lassen.",
            "Plane wenn möglich eine halbe Stunde Puffer ein. Dann verkraftet der Tag auch eine Vorlesung, die länger dauert, ohne dass der Abend aus den Fugen gerät.",
          ],
        },
        {
          heading: "Schließ mit drei Zeilen ab",
          paragraphs: [
            "Bevor du die Bücher weglegst: Was hast du geschafft, was lief schlecht, und was ist morgen die erste Aufgabe? Das dauert ein paar Minuten und macht den nächsten Morgen entspannter.",
          ],
        },
      ],
    },
    {
      slug: "ukentlig-studieplan",
      title: "Wöchentlicher Lernplan: Überblick vor Montag — Studentplanlegger",
      description:
        "Erstell einen Wochenplan, in den Vorlesungen, Lernen und Freizeit passen. So verteilst du die Arbeit, damit sie sich nicht vor dem Wochenende staut.",
      heading: "So erstellst du einen wöchentlichen Lernplan",
      summary:
        "Schau zuerst auf feste Termine und dann auf die Zeit, die dir für den Stoff wirklich bleibt. So landet nicht alles am Sonntag.",
      footerLabel: "Wöchentlicher Lernplan",
      catalogKey: "ukentlig",
      productSlug: "ukentlig-planlegger",
      productLead:
        "Der Wochenplaner ist ein einfacher, ausfüllbarer Wochenplan für Studium und Alltag, {single}. Der Wochenplan hat Fokusbereiche und Tagesblöcke, und die Wochen-To-dos geben dir Platz für Aufgaben an jedem Tag.",
      productCta: "Wochenplaner ansehen",
      sections: [
        {
          heading: "Ohne Wochenplan werden die Tage schnell zufällig",
          paragraphs: [
            "Der Montag ist schnell voll, der Mittwoch verschwindet, und der Sonntag geht für das drauf, was du eigentlich am Dienstag machen wolltest. Ein einfacher Wochenüberblick zeigt dir, wo die Arbeit wirklich hinpasst – bevor die Woche losgeht.",
          ],
        },
        {
          heading: "Trag zuerst das Feste ein",
          paragraphs: [
            "Vorlesungen, Seminare, Job und Termine, die du nicht verschieben kannst, kommen rein, bevor du dir acht Stunden Lernen vornimmst. Was übrig bleibt, ist die echte Zeit fürs Lernen und für Aufgaben. Und die ist fast immer weniger, als du denkst.",
          ],
        },
        {
          heading: "Verteil die schwere Arbeit",
          paragraphs: [
            "Leg nicht drei anstrengende Lerneinheiten auf denselben Tag wie zwei Vorlesungen. Schieb eine Einheit auf einen ruhigeren Tag. Ein Wochenplan ist gerade deshalb nützlich, weil er Überschneidungen zeigt, bevor sie passieren.",
            "Es ist völlig okay, dass die Tage unterschiedlich sind. Ein Wochenplan soll die Woche abbilden, die du hast – nicht eine Woche ohne Lehrveranstaltungen.",
          ],
        },
        {
          heading: "Gib auch Freizeit und Haushalt ihren Platz",
          paragraphs: [
            "Essen, Sport und ein freier Abend gehören in den Überblick. Wenn sie keinen Platz haben, nehmen sie sich trotzdem einen – nur zufälliger. Ein kurzer Check am Mittwoch oder Donnerstag reicht, um zu verschieben, was liegen geblieben ist.",
          ],
        },
      ],
    },
    {
      slug: "pomodoro-til-eksamen",
      title: "Pomodoro beim Lernen für Prüfungen — Studentplanlegger",
      description:
        "Kurze Arbeitseinheiten und feste Pausen helfen dir, beim Stoff konzentriert zu bleiben. So erstellst du einen Lernplan, an den du dich wirklich hältst.",
      heading: "So nutzt du Pomodoro in der Prüfungsvorbereitung",
      summary:
        "Offene „den ganzen Tag“-Sessions ziehen sich oft. Kurze Blöcke mit Pausen dazwischen sind leichter anzufangen – und durchzuhalten.",
      footerLabel: "Pomodoro für Prüfungen",
      catalogKey: "produktivitet",
      productSlug: "pomodoro-planlegger",
      productLead:
        "Der Pomodoro-Planer ist ein ausfüllbares Blatt, um Lerneinheiten zu planen und deine Produktivität festzuhalten, {single}. Er gehört zu den übrigen Produktivitätsblättern.",
      productCta: "Pomodoro-Planer ansehen",
      sections: [
        {
          heading: "Lange, offene Lernsessions ziehen sich oft",
          paragraphs: [
            "Wenn sich der Stoff stapelt, ist es verlockend, gleich den ganzen Tag dafür zu reservieren. Viele merken aber, dass die Konzentration nach einer Stunde nachlässt und der Abend fürs Aufholen des Vormittags draufgeht. Kurze Arbeitsblöcke mit festen Pausen – oft Pomodoro genannt – machen den Einstieg leichter.",
          ],
        },
        {
          heading: "Was die Methode eigentlich ist",
          paragraphs: [
            "Eine gängige Variante sind 25 Minuten konzentrierte Arbeit und 5 Minuten Pause. Nach vier solchen Einheiten machst du eine längere Pause. Die Zeiten lassen sich anpassen. Es geht nicht um die Uhr, sondern darum, dass die Arbeit einen Anfang und ein Ende hat.",
          ],
        },
        {
          heading: "Gib jeder Einheit ein Ziel",
          paragraphs: [
            "Wähl ein Kapitel, ein Übungsblatt oder einen Satz Notizen. „Für die Prüfung lernen“ ist zu vage, um damit anzufangen. Wenn die Einheit vorbei ist, hak ab, was du geschafft hast – nicht, was du schaffen wolltest.",
            "Eine Prüfungswoche wird überschaubarer, wenn du eine Anzahl Einheiten planst statt einer Anzahl Stunden. Einheiten lassen sich leichter verschieben, wenn eine Vorlesung den Vormittag frisst.",
          ],
        },
        {
          heading: "Pause heißt Pause",
          paragraphs: [
            "Wenn die Pause zu neuen E-Mails oder einem neuen Tab wird, startet die nächste Einheit langsamer. Steh auf, hol dir ein Glas Wasser oder schau aus dem Fenster. Der Bildschirm kann bis zum nächsten Arbeitsblock warten.",
          ],
        },
      ],
    },
    {
      slug: "bygg-studievaner",
      title: "So baust du Lerngewohnheiten auf, die bleiben — Studentplanlegger",
      description:
        "Fang mit einer kleinen Gewohnheit an, mach sie sichtbar und halte deinen Fortschritt fest. So startest du nicht zu groß und gibst nach einer Woche auf.",
      heading: "So baust du eine Lerngewohnheit auf, die bleibt",
      summary:
        "Eine kleine Gewohnheit, die du wiederholst, schlägt drei große Pläne, die du fallen lässt. So bleibt sie den ganzen Monat über sichtbar.",
      footerLabel: "Lerngewohnheiten aufbauen",
      catalogKey: "sporing",
      productSlug: "vane-tracker",
      productLead:
        "Der Gewohnheitstracker ist ein Monatsraster mit Platz für deine eigenen Kategorien, damit du deinen Fortschritt siehst, {single}. Die 30-Tage-Challenge ist ein fokussierteres Blatt für neue Gewohnheiten oder Ziele.",
      productCta: "Gewohnheitstracker ansehen",
      sections: [
        {
          heading: "Große Pläne scheitern öfter als kleine Gewohnheiten",
          paragraphs: [
            "„Ab dem ersten Montag im Semester jeden Tag zwei Stunden lernen“ hält selten länger als eine Woche. Was bleibt, ist meist kleiner, sichtbar und leicht zu wiederholen – auch an Tagen mit Vorlesungen und wenig Schlaf.",
          ],
        },
        {
          heading: "Wähl eine Gewohnheit – und mach sie fast zu klein",
          paragraphs: [
            "Fang nicht gleichzeitig mit Sport, Lesen, Ernährung und Schlaf an. Wähl eine Sache: zum Beispiel 20 Minuten lesen vor dem Mittagessen oder am Abend vorher die Tasche packen. Sobald das sitzt, kannst du die nächste dazunehmen.",
            "Wenn zwei Stunden an einem vollen Tag zu viel sind – zehn Minuten sind es nicht. Eine Gewohnheit, die du auch an einem schlechten Tag durchziehst, ist mehr wert als ein ehrgeiziger Plan, den du fallen lässt.",
          ],
        },
        {
          heading: "Halte deinen Fortschritt sichtbar fest",
          paragraphs: [
            "Ein Raster am Kühlschrank, im Notizbuch oder als ausfüllbares PDF macht die Gewohnheit sichtbar. Leere Kästchen sind ehrlich. Eine Serie am Laufen zu halten ist leichter, als jeden Montag von vorn anzufangen.",
          ],
        },
        {
          heading: "Ein verpasster Tag ist kein gescheitertes Projekt",
          paragraphs: [
            "Mach am nächsten Tag einfach weiter, ohne alles „nachzuholen“. Wer sich mit einer doppelten Einheit bestraft, gibt die ganze Gewohnheit eher auf. Zähl die Tage, an denen du es gemacht hast – nicht die, die perfekt waren.",
          ],
        },
      ],
    },
  ],
};
