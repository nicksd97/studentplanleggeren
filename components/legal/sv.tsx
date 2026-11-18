import Link from "next/link";
import type { LegalCopy } from "./types";

// Swedish privacy policy and terms of sale. The Norwegian pages are legally binding.

export const sv: LegalCopy = {
  personvern: {
    metaTitle: "Integritetspolicy — Studentplanlegger",
    metaDescription:
      "Så behandlar Studentplanlegger personuppgifter vid köp och för det kostnadsfria smakprovet och nyhetsbrevet. Kontakt: hei@studentplanlegger.no.",
    orgLine: "Studentplanlegger Davidson · Org.nr 937416156",
    title: "Integritetspolicy",
    updated: "Senast uppdaterad: 18 november 2026",
    body: (
      <>
        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Vilka vi är</h2>
          <p>
            Studentplanlegger.no drivs av Studentplanlegger Davidson, org.nr 937416156. Vi säljer
            ifyllbara PDF-planerare som digitala nedladdningar.
          </p>
          <p>
            <strong>Kontakt:</strong>{" "}
            <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
              hei@studentplanlegger.no
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Vilka uppgifter vi samlar in</h2>
          <p>När du gör ett köp samlar vi in följande personuppgifter:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Förnamn</li>
            <li>Efternamn</li>
            <li>Mejladress</li>
          </ul>
          <p>
            Uppgifterna behövs för att vi ska kunna hantera din beställning och skicka dig en
            nedladdningslänk till produkterna du har köpt.
          </p>
          <p>
            När du skickar in formuläret på{" "}
            <Link href="/sv/gratis" className="text-brand-accent hover:underline">
              /gratis
            </Link>{" "}
            eller på startsidan samlar vi in din mejladress för nyhetsbrevet, välkomstserien och
            det kostnadsfria smakprovet på veckoplanen. Om du kom via en kampanjlänk sparar vi
            också de kampanjvärden (UTM) som hör till anmälan.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Nyhetsbrev och gratis smakprov</h2>
          <p>
            Vi samlar in din <strong>mejladress</strong> när du skickar in formuläret på /gratis
            eller på startsidan.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Ändamål:</strong> att skicka det kostnadsfria smakprovet på veckoplanen, en
              välkomstserie och regelbundna mejl med studietips och produktinformation.
            </li>
            <li>
              <strong>Rättslig grund:</strong> samtycke (att du skickar in formuläret). Du kan när
              som helst återkalla ditt samtycke.
            </li>
            <li>
              <strong>Personuppgiftsansvarig:</strong> Studentplanlegger Davidson, org.nr 937416156.
            </li>
            <li>
              <strong>Personuppgiftsbiträden:</strong> Resend (utskick av mejl, kontaktlista och
              välkomstserie) och Supabase (leadregister och beställningar).
            </li>
            <li>
              <strong>Lagring:</strong> mejladress, källa (till exempel gratis-ukeplan), tidpunkt
              för samtycket, avregistreringsstatus, kampanj-/UTM-fält i förekommande fall och vilka
              mejlkampanjer du har fått (smakprov och välkomstserie). Uppgifterna sparas i Resend
              Contacts (segmentet lead-gratis-ukeplan) och i Supabase-tabellerna leads och
              lead_campaigns tills du ber oss radera dem eller avregistrerar dig, eller tills
              uppgifterna inte längre är relevanta.
            </li>
            <li>
              <strong>Avregistrering:</strong> svara till{" "}
              <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
                hei@studentplanlegger.no
              </a>{" "}
              och be om att bli avregistrerad, eller använd länken i mejlet om en sådan finns.
            </li>
          </ul>
          <p>
            Rättigheterna nedan (tillgång, rättelse, radering och klagomål till Datatilsynet, den
            norska dataskyddsmyndigheten) gäller även uppgifter för nyhetsbrevet.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Betalning</h2>
          <p>
            Vi erbjuder betalning via Stripe och Vipps. All betalningsinformation (kortnummer,
            Vipps-uppgifter) hanteras direkt av betaltjänstleverantören. Vi sparar aldrig kort- eller
            betalningsinformation på våra servrar.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Cookies och spårning</h2>
          <p>
            Vi använder <strong>inga spårningscookies från tredje part</strong>. Varukorgen och
            kassan använder bara det som är tekniskt nödvändigt. Utöver det sätter vi en
            förstapartscookie, <code>sp_campaign</code>, i upp till 30 dagar med UTM-värden från
            kampanjlänkar, så att vi kan koppla ett köp eller en anmälan på /gratis till kampanjen
            du kom från. Den skickas inte till annonsnätverk.
          </p>
          <p>
            För att förstå hur webbplatsen används har vi anonym besöksstatistik från{" "}
            <strong>Vercel Web Analytics</strong>. Den använder inga cookies och sparar ingenting
            på din enhet. Vi ser sidvisningar och enkla händelser, till exempel att någon klickade
            på en knapp, lade en planerare i varukorgen eller genomförde ett köp, tillsammans med
            produkten, prisnivån och vilken kampanjlänk besöket kom från. Statistiken innehåller
            inget namn, ingen mejladress eller något annat som identifierar dig, och
            nedladdningslänkar tas bort från adresserna innan de skickas. Vercel är
            personuppgiftsbiträde för statistiken.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Språk och valuta</h2>
          <p>
            Vi använder två funktionella cookies som är strikt nödvändiga för att visa webbplatsen
            på rätt språk och med priser i rätt valuta. De kräver inget samtycke, används inte för
            spårning och delas inte med någon.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <code>NEXT_LOCALE</code> — kommer ihåg språket du valde i språkmenyn, så att du får
              samma språkversion nästa gång. Sätts när du väljer ett språk. Livslängd: 1 år.
            </li>
            <li>
              <code>sp_currency</code> — kommer ihåg vilken valuta priserna visas i (till exempel
              NOK eller EUR). Sätts av webbplatsen vid ditt första besök, utifrån landet du besöker
              oss från. Livslängd: 1 år.
            </li>
          </ul>
          <p>
            För att välja språk och valuta använder vi landet som din IP-adress hör till, vilket vår
            hostingleverantör Vercel skickar med vid varje besök. Landet används bara för det här
            valet, och varken landet eller din IP-adress sparas.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Hur vi använder uppgifterna</h2>
          <p>Dina personuppgifter används bara för att:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Hantera och leverera din beställning</li>
            <li>Skicka bekräftelse och nedladdningslänk via mejl</li>
            <li>Kontakta dig om det uppstår problem med din beställning</li>
            <li>Skicka smakprovet, välkomstserien och nyhetsbrevet som du har samtyckt till</li>
          </ul>
          <p>
            Vi säljer eller delar aldrig dina personuppgifter med tredje part i marknadsföringssyfte.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Lagring och säkerhet</h2>
          <p>
            Beställningsinformation och mejlleads lagras säkert hos vår databasleverantör
            (Supabase) med kryptering och åtkomstkontroll. Servern använder en tjänstenyckel;
            vanliga webbläsare har varken läs- eller skrivåtkomst till leadtabellerna. Vi sparar
            uppgifterna så länge det behövs för att fullgöra beställningen, skicka mejl som du har
            samtyckt till och följa bokføringsloven (den norska bokföringslagen).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Dina rättigheter</h2>
          <p>
            Enligt personopplysningsloven (den norska personuppgiftslagen) och GDPR har du rätt att:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Begära tillgång till de uppgifter vi har om dig</li>
            <li>Begära rättelse av felaktiga uppgifter</li>
            <li>Begära radering av dina uppgifter</li>
            <li>
              Klaga hos Datatilsynet (den norska dataskyddsmyndigheten) om du anser att vi behandlar
              dina uppgifter i strid med reglerna
            </li>
          </ul>
          <p>
            Kontakta oss på{" "}
            <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
              hei@studentplanlegger.no
            </a>{" "}
            för att utöva dina rättigheter.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Tillämplig lag</h2>
          <p>
            Denna integritetspolicy regleras av norsk lag, däribland personopplysningsloven och
            EU:s dataskyddsförordning (GDPR).
          </p>
        </section>
      </>
    ),
  },
  vilkar: {
    metaTitle: "Köpvillkor — Studentplanlegger",
    metaDescription:
      "Köpvillkor för ifyllbara PDF-planerare från Studentplanlegger. Priser, leverans, ångerrätt och användarvillkor.",
    orgLine: "Studentplanlegger Davidson · Org.nr 937416156",
    title: "Köpvillkor",
    updated: "Senast uppdaterad: 18 november 2026",
    body: (
      <>
        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Om tjänsten</h2>
          <p>
            Studentplanlegger.no säljer digitala produkter i form av ifyllbara PDF-planerare. Alla
            produkter levereras som en omedelbar digital nedladdning när betalningen är genomförd.
          </p>
          <p>
            <strong>Säljare:</strong> Enskild firma (registrering pågår via Altinn)
          </p>
          <p>
            <strong>Kontakt:</strong>{" "}
            <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
              hei@studentplanlegger.no
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Priser och betalning</h2>
          <p>
            Priserna visas i din lokala valuta där vi stöder den (NOK, SEK, DKK, EUR, GBP eller
            USD), annars i amerikanska dollar, och inkluderar mervärdesskatt (moms). Du betalar
            beloppet som visas i kassan.
          </p>
          <p>
            Vi erbjuder kortbetalning via Stripe i alla dessa valutor, och Vipps för betalningar i
            norska kronor (NOK). Betalningen sker innan produkten levereras.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Leverans</h2>
          <p>
            När betalningen är genomförd får du direkt en nedladdningslänk. Du får också en
            bekräftelse via mejl med en länk till nedladdningen.
          </p>
          <p>
            Nedladdningslänken gäller i <strong>7 dagar</strong> från köptillfället, med högst{" "}
            <strong>10 nedladdningar</strong> per beställning.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Ångerrätt</h2>
          <p>
            Enligt 22 § bokstav n i angrerettloven (den norska ångerrättslagen) gäller ångerrätten
            inte för leverans av digitalt innehåll som inte levereras på ett fysiskt medium, om
            leveransen har påbörjats med konsumentens uttryckliga förhandssamtycke och konsumenten
            har bekräftat att ångerrätten därmed går förlorad.
          </p>
          <p>
            Genom att genomföra köpet samtycker du till omedelbar leverans av det digitala
            innehållet och godtar att ångerrätten upphör.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Användarvillkor för produkterna</h2>
          <p>
            Produkterna du köper är endast för <strong>personligt bruk</strong>. Du får inte:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Sälja vidare eller sprida produkterna</li>
            <li>Dela nedladdningslänken med andra</li>
            <li>Använda produkterna kommersiellt utan skriftligt avtal</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Reklamation och support</h2>
          <p>
            Om du har problem med nedladdningen eller om produkten inte fungerar som förväntat,
            kontakta oss på{" "}
            <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
              hei@studentplanlegger.no
            </a>{" "}
            så hjälper vi dig.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Tillämplig lag</h2>
          <p>
            Dessa köpvillkor regleras av norsk lag. Eventuella tvister ska i första hand lösas i
            samförstånd. Om det inte lyckas kan ärendet tas upp hos Forbrukerrådet (det norska
            konsumentrådet) eller i allmän domstol.
          </p>
        </section>
      </>
    ),
  },
};
