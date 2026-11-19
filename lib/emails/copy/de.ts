import type { EmailCopy } from "../types";

export const de: EmailCopy = {
  footer: {
    reason:
      "Du bekommst diese E-Mail, weil du auf studentplanlegger.no den kostenlosen Wochenplan angefordert hast.",
    signature: "Liebe Grüße, Studentplanlegger",
    unsubscribeSubject: "Abmelden",
  },
  leadMagnet: {
    subject: "Deine Probe vom Wochenplan ist da",
    preheader: "Montag bis Mittwoch als ausfüllbares PDF. Jetzt laden – der Link gilt 7 Tage.",
    label: "GRATIS-PROBE",
    heading: "Dein Wochenplan ist da",
    intro:
      "Hallo! Schön, dass du den Wochenplan ausprobieren willst. Hier ist die erste Seite: Ziele, Prioritäten, To-dos und Gewohnheiten, dazu ein Stundenplan für Montag bis Mittwoch.",
    note: "Das ist eine Probe, nicht das ganze Produkt. Aber es ist eine echte Seite aus dem Planer, mit Feldern, die du direkt im PDF ausfüllen kannst.",
    imageAlt:
      "Die Probe: erste Seite vom Wochenplan mit Zielen, Prioritäten, To-dos und Montag bis Mittwoch",
    button: "Wochenplan herunterladen",
    buttonMeta: ["Ausfüllbares PDF", "A4", "Link gilt 7 Tage"],
    textDownload: "Wochenplan herunterladen (ausfüllbares PDF, A4, Link gilt 7 Tage):",
    tipsHeading: "So nutzt du ihn",
    tips: [
      {
        title: "Öffne ihn im Adobe Acrobat Reader.",
        body: "Den gibt es kostenlos für PC und Handy. Damit kannst du direkt in die Felder schreiben und speichern.",
      },
      {
        title: "Nimm dir am Sonntagabend zehn Minuten.",
        body: "Schreib die Wochenziele und deine drei wichtigsten Prioritäten auf, bevor du den Stundenplan ausfüllst.",
      },
      {
        title: "Speicher zuerst eine leere Kopie.",
        body: "Dann hast du nächste Woche gleich eine neue Seite. Oder druck ihn aus und nimm einen Stift.",
      },
    ],
    upsellHeading: "Lust auf die ganze Woche?",
    upsellBody:
      "Der komplette Wochenplan hat zwei Seiten, auch mit Donnerstag bis Sonntag, und kostet {single}. Willst du alles, bekommst du alle 25 Planer im Komplettpaket für {komplett}.",
    linkWeekly: "Zum Wochenplan",
    linkKomplett: "Zum Komplettpaket",
    closing: "Viel Erfolg diese Woche! Wenn du Fragen hast, antworte einfach auf diese E-Mail.",
    footerUnsubscribe:
      "Keine E-Mails mehr? Antworte mit „abmelden“ oder schreib an {email}, dann tragen wir dich aus.",
    footerPrivacy: "Mehr dazu in unserer {privacy}.",
    privacyLink: "Datenschutzerklärung",
    textPrivacyLabel: "Datenschutz",
  },
  welcome: {
    unsubscribeLink: "Abmelden",
    privacyLink: "Datenschutz",
    emails: [
      {
        subject: "So holst du das Beste aus deinem Wochenplan",
        body: "Hallo! Hast du den Wochenplan schon ausprobiert? Ein kleiner Tipp: Nimm dir am Sonntagabend zehn Minuten, trag Vorlesungen, Abgaben und Job ein und such dir dann drei Dinge aus, die <em>auf jeden Fall</em> erledigt werden müssen. So wird der Montag viel entspannter. Wenn du Fragen hast, antworte einfach auf diese E-Mail.",
      },
      {
        subject: "Wenn die Prüfungen näher rücken",
        body: "Sechs Wochen vor den Prüfungen lohnt es sich, den Stoff auf die restlichen Wochen zu verteilen, damit du nicht alles in der letzten Woche lernen musst. Im Komplettpaket findest du einen Jahresplaner, einen Monatsplaner und den Wochenplan, die zusammenpassen, alles als ausfüllbare PDFs für Tablet oder PC.",
        button: "Zum Paket",
      },
      {
        subject: "Alle 25 Planer in einem Paket",
        body: "Gefällt dir der Wochenplan? Dann hol dir das ganze Komplettpaket für {bundlePrice}. Das ist ein einmaliger Kauf ohne Abo, und du kannst sofort herunterladen. Bist du in einer Studierendenvereinigung in Norwegen? Dann bekommst du mit deren Code vielleicht 20 % Rabatt.",
        button: "Komplettpaket kaufen",
      },
    ],
  },
};
