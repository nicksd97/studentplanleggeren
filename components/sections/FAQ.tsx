import Accordion from "@/components/ui/Accordion";

const faqItems = [
  {
    question: "Hvilke formater får jeg?",
    answer:
      "Finansverktøyene leveres som utskrivbar PDF og interaktivt regneark (Google Sheets/Excel). Produktivitetsplanleggerne leveres som PDF. Pakkene inkluderer alle tilgjengelige formater for hvert produkt.",
  },
  {
    question: "Fungerer regnearkene på mobilen?",
    answer:
      "Ja! Regnearkene er designet for å fungere godt i Google Sheets-appen på mobil. Du kan følge med på budsjettet og sparemålene dine rett fra telefonen. De fungerer også i Excel på desktop.",
  },
  {
    question: "Kan jeg skrive ut PDF-ene?",
    answer:
      "Absolutt — det er hele poenget! PDF-ene er designet for A4-utskrift med rent, lesbart design. Perfekt for å henge på kjøleskapet eller ha i studieplassen din.",
  },
  {
    question: "Hvordan laster jeg ned etter kjøp?",
    answer:
      "Du får umiddelbar tilgang til filene etter betaling. Du blir sendt til en nedlastingsside, og du mottar også en e-post med nedlastingslenker som er gyldige i 7 dager.",
  },
  {
    question: "Kan jeg betale med Vipps?",
    answer:
      "Ja! Vi støtter betaling med Vipps og vanlig bankkort (Visa/Mastercard). Du velger betalingsmetode i kassen.",
  },
  {
    question: "Er det et abonnement?",
    answer:
      "Nei — du betaler én gang og eier produktet for alltid. Ingen abonnement, ingen skjulte kostnader. Eventuelle fremtidige oppdateringer er gratis.",
  },
  {
    question: "Hva om jeg ikke er fornøyd?",
    answer:
      "Siden dette er digitale produkter med umiddelbar levering har vi normalt ikke refusjon. Men er du misfornøyd, ta kontakt med oss — vi finner en løsning.",
  },
  {
    question: "Er verktøyene oppdatert for gjeldende Lånekassen-satser?",
    answer:
      "Ja, Lånekassen-planleggeren er oppdatert med gjeldende satser for stipend og lån. Regnearket lar deg også justere beløpene manuelt om satsene endres.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-medium tracking-[0.1em] uppercase text-brand-medium mb-3">
            ✦ Spørsmål? ✦
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-brand-dark">
            Ofte stilte spørsmål
          </h2>
        </div>
        <Accordion items={faqItems} />
      </div>
    </section>
  );
}
