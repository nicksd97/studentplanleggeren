export const faqItems = [
  {
    question: "Hva er en fyllbar PDF?",
    answer:
      "En fyllbar PDF har interaktive felt du kan skrive direkte i på datamaskinen, nettbrettet eller mobilen — uten å skrive ut. Du kan også skrive ut og fylle inn for hånd hvis du foretrekker det.",
  },
  {
    question: "Kan jeg skrive ut planleggerne?",
    answer:
      "Absolutt! Alle planleggerne er designet for A4-utskrift med rent, lesbart design. Perfekt for å henge på veggen eller ha i studieplassen.",
  },
  {
    question: "Fungerer de på mobil og nettbrett?",
    answer:
      "Ja! Du kan åpne PDF-ene i en PDF-leser og fylle inn feltene direkte. Vi anbefaler Adobe Acrobat Reader (gratis) for best opplevelse.",
  },
  {
    question: "Hvordan laster jeg ned etter kjøp?",
    answer:
      "Du får umiddelbar tilgang til filene etter betaling. Du blir sendt til en nedlastingsside, og du mottar også en e-post med nedlastingslenker som er gyldige i 7 dager.",
  },
  {
    question: "Kan jeg betale med Vipps?",
    answer:
      "Ja! Vi støtter betaling med Vipps og vanlig bankkort (Visa/Mastercard).",
  },
  {
    question: "Er det et abonnement?",
    answer:
      "Nei — du betaler én gang og eier planleggerne for alltid. Ingen abonnement, ingen skjulte kostnader.",
  },
  {
    question: "Hva om jeg ikke er fornøyd?",
    answer:
      "Siden dette er digitale produkter med umiddelbar levering har vi normalt ikke refusjon. Men er du misfornøyd, ta kontakt — vi finner en løsning.",
  },
  {
    question: "Hva er inkludert i den komplette pakken?",
    answer:
      "Studentplanlegger Komplett inneholder alle 25 planleggere (daglige, ukentlige, månedlige, årlige, produktivitet, helse og sporing). Alt som fyllbare PDF-er. Pakken koster 249 kr.",
  },
  {
    question: "Hva koster planleggerne?",
    answer:
      "Hver enkeltplanlegger koster 39 kr. Fem valgfrie enkeltplanleggere i handlekurven koster 99 kr. Temapakker koster 149 kr, og Studentplanlegger Komplett koster 249 kr.",
  },
];

export const faqItemsEn: typeof faqItems = [
  {
    question: "What language are the planners in?",
    answer:
      "The planners are written in Norwegian (Bokmål). This website is available in English, but the headings and labels inside the PDFs are in Norwegian.",
  },
  {
    question: "What is a fillable PDF?",
    answer:
      "A fillable PDF has interactive fields you can type into directly on your computer, tablet or phone — no printing needed. You can also print it and fill it in by hand if you prefer.",
  },
  {
    question: "Can I print the planners?",
    answer:
      "Absolutely! All the planners are designed for A4 printing with a clean, readable layout. Perfect for your wall or your study space.",
  },
  {
    question: "Do they work on phones and tablets?",
    answer:
      "Yes! Open the PDFs in a PDF reader and fill in the fields directly. We recommend Adobe Acrobat Reader (free) for the best experience.",
  },
  {
    question: "How do I download after buying?",
    answer:
      "You get access to the files right after payment. You are taken to a download page, and you also receive an email with download links that are valid for 7 days.",
  },
  {
    question: "Can I pay with Vipps?",
    answer: "Yes! We accept Vipps and regular bank cards (Visa/Mastercard).",
  },
  {
    question: "Is it a subscription?",
    answer:
      "No — you pay once and own the planners forever. No subscription, no hidden costs.",
  },
  {
    question: "What if I'm not happy?",
    answer:
      "Because these are digital products delivered instantly, we don't normally offer refunds. But if you're unhappy, get in touch — we'll find a solution.",
  },
  {
    question: "What's included in the complete bundle?",
    answer:
      "Studentplanlegger Complete contains all 25 planners (daily, weekly, monthly, yearly, productivity, health and tracking), all as fillable PDFs in Norwegian. The bundle costs NOK 249.",
  },
  {
    question: "How much do the planners cost?",
    answer:
      "Each single planner costs NOK 39. Any five single planners in the cart cost NOK 99. Theme bundles cost NOK 149, and Studentplanlegger Complete costs NOK 249.",
  },
];

export function getFaqItems(locale: "nb" | "en"): typeof faqItems {
  return locale === "en" ? faqItemsEn : faqItems;
}
