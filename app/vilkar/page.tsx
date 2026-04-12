import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Kjøpsvilkår — Studentplanlegger",
  description: "Kjøpsvilkår for Studentplanlegger.no",
};

export default function VilkarPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-dark mb-8">
            Kjøpsvilkår
          </h1>
          <p className="text-brand-muted mb-8">Sist oppdatert: 12. april 2026</p>

          <div className="prose prose-brand max-w-none space-y-8 text-brand-dark/80">
            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Om tjenesten</h2>
              <p>
                Studentplanlegger.no selger digitale produkter i form av fyllbare PDF-planleggere.
                Alle produkter leveres som umiddelbar digital nedlasting etter gjennomført betaling.
              </p>
              <p>
                <strong>Selger:</strong> Enkeltpersonforetak (registrering pågår via Altinn)
              </p>
              <p>
                <strong>Kontakt:</strong>{" "}
                <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
                  hei@studentplanlegger.no
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Priser og betaling</h2>
              <p>
                Alle priser på nettsiden er oppgitt i norske kroner (NOK) og inkluderer merverdiavgift (MVA).
              </p>
              <p>
                Vi tilbyr betaling via Stripe (kort) og Vipps. Betalingen gjennomføres
                før produktet leveres.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Levering</h2>
              <p>
                Etter gjennomført betaling mottar du umiddelbart en nedlastingslenke.
                Du vil også motta en bekreftelse på e-post med lenke til nedlasting.
              </p>
              <p>
                Nedlastingslenken er gyldig i <strong>7 dager</strong> fra kjøpstidspunktet,
                med maksimalt <strong>10 nedlastinger</strong> per ordre.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Angrerett</h2>
              <p>
                I henhold til angrerettloven §22 bokstav n gjelder ikke angreretten for
                levering av digitalt innhold som ikke leveres på et fysisk medium, når
                leveringen er påbegynt med forbrukerens uttrykkelige forhåndssamtykke og
                forbrukeren har erkjent at angreretten dermed går tapt.
              </p>
              <p>
                Ved å gjennomføre kjøpet samtykker du til umiddelbar levering av det
                digitale innholdet og aksepterer at angreretten faller bort.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Bruksvilkår for produkter</h2>
              <p>
                Produktene du kjøper er kun til <strong>personlig bruk</strong>. Det er ikke tillatt å:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Videreselge eller distribuere produktene</li>
                <li>Dele nedlastingslenken med andre</li>
                <li>Bruke produktene i kommersiell sammenheng uten skriftlig avtale</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Reklamasjon og support</h2>
              <p>
                Dersom du opplever problemer med nedlasting eller produktet ikke fungerer
                som forventet, kontakt oss på{" "}
                <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
                  hei@studentplanlegger.no
                </a>{" "}
                så hjelper vi deg.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Gjeldende lovverk</h2>
              <p>
                Disse kjøpsvilkårene er underlagt norsk lov. Eventuelle tvister skal søkes
                løst i minnelighet. Dersom dette ikke fører frem, kan saken bringes inn
                for Forbrukerrådet eller de ordinære domstolene.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
