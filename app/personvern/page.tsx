import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { pageMeta } from "@/lib/site";
import Link from "next/link";

export const metadata = pageMeta({
  title: "Personvernerklæring — Studentplanlegger",
  description:
    "Slik behandler Studentplanlegger personopplysninger ved kjøp og ved utsending av gratis smakebit og nyhetsbrev. Kontakt hei@studentplanlegger.no.",
  path: "/personvern",
});

export default function PersonvernPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <p className="text-sm text-brand-muted mb-4">
            Studentplanlegger Davidson · Org.nr: 937416156
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-dark mb-8">
            Personvernerklæring
          </h1>
          <p className="text-brand-muted mb-8">Sist oppdatert: 7. oktober 2026</p>

          <div className="prose prose-brand max-w-none space-y-8 text-brand-dark/80">
            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Hvem vi er</h2>
              <p>
                Studentplanlegger.no drives av Studentplanlegger Davidson, org.nr 937416156.
                Vi selger fyllbare PDF-planleggere som digitale nedlastinger.
              </p>
              <p>
                <strong>Kontakt:</strong>{" "}
                <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
                  hei@studentplanlegger.no
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Hvilke opplysninger vi samler inn</h2>
              <p>
                Ved kjøp samler vi inn følgende personopplysninger:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Fornavn</li>
                <li>Etternavn</li>
                <li>E-postadresse</li>
              </ul>
              <p>
                Disse opplysningene er nødvendige for å behandle bestillingen din og sende deg
                nedlastingslenke for produktene du har kjøpt.
              </p>
              <p>
                Når du sender inn skjemaet på{" "}
                <Link href="/gratis" className="text-brand-accent hover:underline">
                  /gratis
                </Link>{" "}
                eller forsiden, samler vi inn e-postadressen din for nyhetsbrev og den gratis
                ukeplan-smakebiten.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Nyhetsbrev og gratis smakebit</h2>
              <p>
                Vi samler <strong>e-postadresse</strong> når du sender inn skjemaet på /gratis
                eller forsiden.
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Formål:</strong> sende den gratis ukeplan-smakebiten og jevnlige e-poster
                  med studietips og produktinfo.
                </li>
                <li>
                  <strong>Rettslig grunnlag:</strong> samtykke (skjemainnsending). Du kan trekke
                  samtykket når som helst.
                </li>
                <li>
                  <strong>Behandlingsansvarlig:</strong> Studentplanlegger Davidson, org.nr 937416156.
                </li>
                <li>
                  <strong>Databehandler:</strong> Resend (e-postutsending og kontaktliste). Ordre
                  fortsetter hos Supabase.
                </li>
                <li>
                  <strong>Lagring:</strong> i Resend Contacts, segment lead-gratis-ukeplan, til du
                  ber om sletting eller avmelding, eller opplysningene ikke lenger er relevante.
                </li>
                <li>
                  <strong>Avmelding:</strong> svar til{" "}
                  <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
                    hei@studentplanlegger.no
                  </a>{" "}
                  med ønske om avmelding, eller bruk lenken i e-posten når den finnes.
                </li>
              </ul>
              <p>
                Rettighetene under (innsyn, retting, sletting og klage til Datatilsynet) gjelder
                også for nyhetsbrevdata.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Betaling</h2>
              <p>
                Vi tilbyr betaling via Stripe og Vipps. All betalingsinformasjon (kortnummer, Vipps-detaljer)
                behandles direkte av betalingsleverandøren. Vi lagrer aldri kort- eller betalingsinformasjon
                på våre servere.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Informasjonskapsler og sporing</h2>
              <p>
                Vi bruker <strong>ingen sporingscookies</strong>. Nettsiden fungerer uten
                informasjonskapsler utover det som er teknisk nødvendig for handlekurv og
                kjøpsprosessen.
              </p>
              <p>
                For å forstå hvordan nettsiden brukes, har vi anonym besøksstatistikk fra{" "}
                <strong>Vercel Web Analytics</strong>. Den bruker ingen informasjonskapsler og lagrer
                ingenting på enheten din. Vi ser sidevisninger og enkle hendelser, for eksempel at
                noen trykket på en knapp, la en planlegger i handlekurven eller fullførte et kjøp, med
                produkt, prisnivå og hvilken kampanjelenke besøket kom fra. Statistikken inneholder
                ikke navn, e-postadresse eller annet som identifiserer deg, og nedlastingslenker
                fjernes fra adressene før de sendes. Vercel er databehandler for statistikken.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Hvordan vi bruker opplysningene</h2>
              <p>Dine personopplysninger brukes kun til å:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Behandle og levere bestillingen din</li>
                <li>Sende bekreftelse og nedlastingslenke på e-post</li>
                <li>Kontakte deg ved eventuelle problemer med bestillingen</li>
                <li>Sende den gratis smakebiten og nyhetsbrev du har samtykket til</li>
              </ul>
              <p>
                Vi selger eller deler aldri dine personopplysninger med tredjeparter
                for markedsføringsformål.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Lagring og sikkerhet</h2>
              <p>
                Ordreinformasjon lagres sikkert hos vår databaseleverandør (Supabase) med
                kryptering og tilgangskontroll. Vi beholder opplysningene så lenge det er nødvendig
                for å oppfylle bestillingen og overholde regnskapsloven.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Dine rettigheter</h2>
              <p>
                I henhold til personopplysningsloven og GDPR har du rett til å:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Be om innsyn i opplysningene vi har om deg</li>
                <li>Be om retting av feilaktige opplysninger</li>
                <li>Be om sletting av dine opplysninger</li>
                <li>Klage til Datatilsynet dersom du mener vi behandler opplysningene dine i strid med regelverket</li>
              </ul>
              <p>
                Kontakt oss på{" "}
                <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
                  hei@studentplanlegger.no
                </a>{" "}
                for å utøve dine rettigheter.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Gjeldende lovverk</h2>
              <p>
                Denne personvernerklæringen er underlagt norsk lov, herunder
                personopplysningsloven og EUs personvernforordning (GDPR).
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
