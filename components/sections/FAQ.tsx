import Accordion from "@/components/ui/Accordion";

const faqItems = [
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
      "Studentplanlegger Komplett inneholder alle 25 planleggere (daglige, ukentlige, månedlige, årlige, produktivitet, helse og sporing) pluss 12 papirmaler (prikket, rutenett og linjert i ulike størrelser). Alt som fyllbare PDF-er.",
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
