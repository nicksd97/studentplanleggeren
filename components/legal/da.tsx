import Link from "next/link";
import type { LegalCopy } from "./types";

// Danish privacy policy and terms of sale. The Norwegian pages are legally binding.

export const da: LegalCopy = {
  personvern: {
    metaTitle: "Privatlivspolitik — Studentplanlegger",
    metaDescription:
      "Sådan behandler Studentplanlegger personoplysninger ved køb og ved den gratis smagsprøve og nyhedsbrevet. Kontakt hei@studentplanlegger.no.",
    orgLine: "Studentplanlegger Davidson · Org.nr. 937416156",
    title: "Privatlivspolitik",
    updated: "Sidst opdateret: 18. november 2026",
    body: (
      <>
        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Hvem vi er</h2>
          <p>
            Studentplanlegger.no drives af Studentplanlegger Davidson, org.nr. 937416156.
            Vi sælger udfyldelige PDF-planlæggere som digitale downloads.
          </p>
          <p>
            <strong>Kontakt:</strong>{" "}
            <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
              hei@studentplanlegger.no
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Hvilke oplysninger vi indsamler</h2>
          <p>Når du handler hos os, indsamler vi følgende personoplysninger:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Fornavn</li>
            <li>Efternavn</li>
            <li>Mailadresse</li>
          </ul>
          <p>
            Oplysningerne er nødvendige for at behandle din ordre og sende dig et downloadlink til
            de produkter, du har købt.
          </p>
          <p>
            Når du sender formularen på{" "}
            <Link href="/da/gratis" className="text-brand-accent hover:underline">
              /gratis
            </Link>{" "}
            eller forsiden, indsamler vi din mailadresse til nyhedsbrevet, velkomstserien og den
            gratis smagsprøve på ugeplanen. Hvis du er kommet via et kampagnelink, gemmer vi også de
            kampagneværdier (UTM), der hører til tilmeldingen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Nyhedsbrev og gratis smagsprøve</h2>
          <p>
            Vi indsamler din <strong>mailadresse</strong>, når du sender formularen på /gratis
            eller forsiden.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Formål:</strong> at sende den gratis smagsprøve på ugeplanen, en velkomstserie
              og løbende mails med studietips og produktinformation.
            </li>
            <li>
              <strong>Retsgrundlag:</strong> samtykke (når du sender formularen). Du kan til enhver
              tid trække dit samtykke tilbage.
            </li>
            <li>
              <strong>Dataansvarlig:</strong> Studentplanlegger Davidson, org.nr. 937416156.
            </li>
            <li>
              <strong>Databehandlere:</strong> Resend (udsendelse af mails, kontaktliste og
              velkomstserie) og Supabase (leadregister og ordrer).
            </li>
            <li>
              <strong>Opbevaring:</strong> mailadresse, kilde (for eksempel gratis-ukeplan),
              tidspunkt for samtykke, afmeldingsstatus, kampagne-/UTM-felter, hvor de findes, og
              hvilke mailkampagner du har modtaget (smagsprøve og velkomstserie). Oplysningerne
              opbevares i Resend Contacts (segmentet lead-gratis-ukeplan) og i Supabase-tabellerne
              leads og lead_campaigns, indtil du beder os om at slette dem eller afmelder dig, eller
              indtil oplysningerne ikke længere er relevante.
            </li>
            <li>
              <strong>Afmelding:</strong> svar til{" "}
              <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
                hei@studentplanlegger.no
              </a>{" "}
              og bed om at blive afmeldt, eller brug linket i mailen, hvor det findes.
            </li>
          </ul>
          <p>
            Rettighederne nedenfor (indsigt, berigtigelse, sletning og klage til Datatilsynet, det
            norske datatilsyn) gælder også for oplysninger til nyhedsbrevet.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Betaling</h2>
          <p>
            Vi tilbyder betaling via Stripe og Vipps. Alle betalingsoplysninger (kortnummer,
            Vipps-oplysninger) håndteres direkte af betalingsudbyderen. Vi gemmer aldrig kort- eller
            betalingsoplysninger på vores servere.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Cookies og sporing</h2>
          <p>
            Vi bruger <strong>ingen sporingscookies fra tredjeparter</strong>. Kurven og kassen
            bruger kun det, der er teknisk nødvendigt. Derudover sætter vi en førstepartscookie{" "}
            <code>sp_campaign</code> i op til 30 dage med UTM-værdier fra kampagnelinks, så vi kan
            knytte et køb eller en tilmelding på /gratis til den kampagne, du kom fra. Den sendes
            ikke videre til annoncenetværk.
          </p>
          <p>
            For at forstå, hvordan hjemmesiden bliver brugt, har vi anonym besøgsstatistik fra{" "}
            <strong>Vercel Web Analytics</strong>. Den bruger ingen cookies og gemmer intet på din
            enhed. Vi ser sidevisninger og enkle hændelser, for eksempel at nogen har klikket på en
            knap, lagt en planlægger i kurven eller gennemført et køb, med produkt, prisniveau og
            hvilket kampagnelink besøget kom fra. Statistikken indeholder hverken navn,
            mailadresse eller andet, der kan identificere dig, og downloadlinks fjernes fra
            adresserne, før de sendes. Vercel er databehandler for statistikken.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Sprog og valuta</h2>
          <p>
            Vi bruger to funktionelle cookies, som er strengt nødvendige for at vise hjemmesiden på
            det rigtige sprog og med priser i den rigtige valuta. De kræver ikke samtykke, bruges
            ikke til sporing og deles ikke med nogen.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <code>NEXT_LOCALE</code> — husker det sprog, du har valgt i sprogmenuen, så du får den
              samme sprogversion næste gang. Sættes, når du vælger et sprog. Levetid: 1 år.
            </li>
            <li>
              <code>sp_currency</code> — husker, hvilken valuta priserne vises i (for eksempel NOK
              eller EUR). Sættes af hjemmesiden ved dit første besøg ud fra det land, du besøger os
              fra. Levetid: 1 år.
            </li>
          </ul>
          <p>
            Til at vælge sprog og valuta bruger vi det land, din IP-adresse hører til, som vores
            hostingudbyder Vercel videregiver ved hvert besøg. Landet bruges kun til dette valg, og
            hverken landet eller din IP-adresse gemmes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Sådan bruger vi oplysningerne</h2>
          <p>Dine personoplysninger bruges kun til at:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Behandle og levere din ordre</li>
            <li>Sende ordrebekræftelse og downloadlink på mail</li>
            <li>Kontakte dig, hvis der opstår problemer med din ordre</li>
            <li>Sende den gratis smagsprøve, velkomstserien og nyhedsbrevet, du har givet samtykke til</li>
          </ul>
          <p>
            Vi sælger aldrig dine personoplysninger og deler dem aldrig med tredjeparter til
            markedsføringsformål.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Opbevaring og sikkerhed</h2>
          <p>
            Ordreoplysninger og mail-leads opbevares sikkert hos vores databaseudbyder (Supabase)
            med kryptering og adgangskontrol. Serveren bruger en servicenøgle; almindelige browsere
            har hverken læse- eller skriveadgang til lead-tabellerne. Vi opbevarer oplysningerne,
            så længe det er nødvendigt for at gennemføre ordren, sende mails, du har givet samtykke
            til, og overholde bokføringsloven (den norske bogføringslov).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Dine rettigheder</h2>
          <p>
            Efter personopplysningsloven (den norske persondatalov) og GDPR har du ret til at:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Få indsigt i de oplysninger, vi har om dig</li>
            <li>Få urigtige oplysninger berigtiget</li>
            <li>Få dine oplysninger slettet</li>
            <li>
              Klage til Datatilsynet (det norske datatilsyn), hvis du mener, at vi behandler dine
              oplysninger i strid med reglerne
            </li>
          </ul>
          <p>
            Kontakt os på{" "}
            <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
              hei@studentplanlegger.no
            </a>{" "}
            for at gøre brug af dine rettigheder.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Lovvalg</h2>
          <p>
            Denne privatlivspolitik er underlagt norsk ret, herunder personopplysningsloven og
            EU&apos;s databeskyttelsesforordning (GDPR).
          </p>
        </section>
      </>
    ),
  },
  vilkar: {
    metaTitle: "Handelsbetingelser — Studentplanlegger",
    metaDescription:
      "Handelsbetingelser for udfyldelige PDF-planlæggere fra Studentplanlegger. Priser, levering, fortrydelsesret og brugsvilkår.",
    orgLine: "Studentplanlegger Davidson · Org.nr. 937416156",
    title: "Handelsbetingelser",
    updated: "Sidst opdateret: 18. november 2026",
    body: (
      <>
        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Om tjenesten</h2>
          <p>
            Studentplanlegger.no sælger digitale produkter i form af udfyldelige PDF-planlæggere.
            Alle produkter leveres som digital download med det samme, når betalingen er
            gennemført.
          </p>
          <p>
            <strong>Sælger:</strong> Enkeltmandsvirksomhed (registrering i gang via Altinn, den
            norske offentlige indberetningsportal)
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
            Priserne vises i din egen valuta, hvor vi understøtter den (NOK, SEK, DKK, EUR, GBP
            eller USD), ellers i amerikanske dollars, og er inklusive moms. Du betaler det beløb,
            der vises i kassen.
          </p>
          <p>
            Vi tilbyder kortbetaling via Stripe i alle disse valutaer og Vipps ved betaling i norske
            kroner (NOK). Betalingen sker, før produktet leveres.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Levering</h2>
          <p>
            Så snart betalingen er gennemført, får du et downloadlink. Du modtager også en
            bekræftelse på mail med et link til downloaden.
          </p>
          <p>
            Downloadlinket gælder i <strong>7 dage</strong> fra købstidspunktet, med maksimalt{" "}
            <strong>10 downloads</strong> pr. ordre.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Fortrydelsesret</h2>
          <p>
            Efter § 22 litra n i angrerettloven (den norske fortrydelseslov) gælder
            fortrydelsesretten ikke for levering af digitalt indhold, der ikke leveres på et fysisk
            medium, når leveringen er påbegyndt med forbrugerens udtrykkelige forudgående samtykke,
            og forbrugeren har anerkendt, at fortrydelsesretten dermed går tabt.
          </p>
          <p>
            Ved at gennemføre købet giver du samtykke til øjeblikkelig levering af det digitale
            indhold og accepterer, at fortrydelsesretten bortfalder.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Brugsvilkår for produkterne</h2>
          <p>
            De produkter, du køber, er udelukkende til <strong>personlig brug</strong>. Du må ikke:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Videresælge eller distribuere produkterne</li>
            <li>Dele downloadlinket med andre</li>
            <li>Bruge produkterne kommercielt uden en skriftlig aftale</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Reklamation og support</h2>
          <p>
            Hvis du har problemer med downloaden, eller produktet ikke virker som forventet, så
            kontakt os på{" "}
            <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
              hei@studentplanlegger.no
            </a>
            , så hjælper vi dig.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Lovvalg</h2>
          <p>
            Disse handelsbetingelser er underlagt norsk ret. Eventuelle tvister søges løst i
            mindelighed. Lykkes det ikke, kan sagen indbringes for Forbrukerrådet (det norske
            forbrugerråd) eller de almindelige domstole.
          </p>
        </section>
      </>
    ),
  },
};
