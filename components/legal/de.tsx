import Link from "next/link";
import type { LegalCopy } from "./types";

// German privacy policy and terms of sale. The Norwegian pages are legally binding.

export const de: LegalCopy = {
  personvern: {
    metaTitle: "Datenschutzerklärung — Studentplanlegger",
    metaDescription:
      "Wie Studentplanlegger personenbezogene Daten bei Käufen sowie für die Gratis-Probe und den Newsletter verarbeitet. Kontakt: hei@studentplanlegger.no.",
    orgLine: "Studentplanlegger Davidson · Org.-Nr. 937416156",
    title: "Datenschutzerklärung",
    updated: "Zuletzt aktualisiert: 18. November 2026",
    body: (
      <>
        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Wer wir sind</h2>
          <p>
            Studentplanlegger.no wird von Studentplanlegger Davidson betrieben, Org.-Nr. 937416156.
            Wir verkaufen ausfüllbare PDF-Planer als digitale Downloads.
          </p>
          <p>
            <strong>Kontakt:</strong>{" "}
            <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
              hei@studentplanlegger.no
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Welche Daten wir erheben</h2>
          <p>Wenn du etwas kaufst, erheben wir folgende personenbezogene Daten:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Vorname</li>
            <li>Nachname</li>
            <li>E-Mail-Adresse</li>
          </ul>
          <p>
            Diese Daten sind notwendig, um deine Bestellung zu bearbeiten und dir einen
            Download-Link für die gekauften Produkte zu schicken.
          </p>
          <p>
            Wenn du das Formular auf{" "}
            <Link href="/de/gratis" className="text-brand-accent hover:underline">
              /gratis
            </Link>{" "}
            oder auf der Startseite absendest, erheben wir deine E-Mail-Adresse für den Newsletter,
            die Willkommensserie und die kostenlose Probe vom Wochenplan. Wenn du über einen
            Kampagnenlink gekommen bist, speichern wir außerdem die zu dieser Anmeldung gehörenden
            Kampagnenwerte (UTM).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Newsletter und Gratis-Probe</h2>
          <p>
            Wir erheben deine <strong>E-Mail-Adresse</strong>, wenn du das Formular auf /gratis
            oder auf der Startseite absendest.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Zweck:</strong> Versand der kostenlosen Probe vom Wochenplan, einer
              Willkommensserie und regelmäßiger E-Mails mit Lerntipps und Produktinformationen.
            </li>
            <li>
              <strong>Rechtsgrundlage:</strong> Einwilligung (durch das Absenden des Formulars). Du
              kannst deine Einwilligung jederzeit widerrufen.
            </li>
            <li>
              <strong>Verantwortlicher:</strong> Studentplanlegger Davidson, Org.-Nr. 937416156.
            </li>
            <li>
              <strong>Auftragsverarbeiter:</strong> Resend (E-Mail-Versand, Kontaktliste und
              Willkommensserie) und Supabase (Lead-Register und Bestellungen).
            </li>
            <li>
              <strong>Speicherung:</strong> E-Mail-Adresse, Quelle (zum Beispiel gratis-ukeplan),
              Zeitpunkt der Einwilligung, Abmeldestatus, Kampagnen-/UTM-Felder, sofern vorhanden,
              und welche E-Mail-Kampagnen du erhalten hast (Probe und Willkommensserie). Die Daten
              werden in Resend Contacts (Segment lead-gratis-ukeplan) und in den Supabase-Tabellen
              leads und lead_campaigns gespeichert, bis du uns um Löschung bittest oder dich
              abmeldest oder die Daten nicht mehr relevant sind.
            </li>
            <li>
              <strong>Abmelden:</strong> Antworte an{" "}
              <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
                hei@studentplanlegger.no
              </a>{" "}
              mit der Bitte um Abmeldung oder nutze den Link in der E-Mail, sofern vorhanden.
            </li>
          </ul>
          <p>
            Die unten genannten Rechte (Auskunft, Berichtigung, Löschung und Beschwerde bei der
            norwegischen Datenschutzbehörde Datatilsynet) gelten auch für Newsletter-Daten.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Zahlung</h2>
          <p>
            Wir bieten Zahlung über Stripe und Vipps an. Alle Zahlungsdaten (Kartennummer,
            Vipps-Daten) werden direkt vom Zahlungsanbieter verarbeitet. Wir speichern niemals
            Karten- oder Zahlungsdaten auf unseren Servern.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Cookies und Tracking</h2>
          <p>
            Wir verwenden <strong>keine Tracking-Cookies von Drittanbietern</strong>. Warenkorb
            und Kasse nutzen nur, was technisch notwendig ist. Zusätzlich setzen wir ein
            Erstanbieter-Cookie <code>sp_campaign</code> für bis zu 30 Tage mit UTM-Werten aus
            Kampagnenlinks, damit wir einen Kauf oder eine Anmeldung auf /gratis der Kampagne
            zuordnen können, über die du gekommen bist. Es wird nicht an Werbenetzwerke
            weitergegeben.
          </p>
          <p>
            Um zu verstehen, wie die Website genutzt wird, verwenden wir anonyme Besucherstatistiken
            von <strong>Vercel Web Analytics</strong>. Dabei werden keine Cookies verwendet und
            nichts auf deinem Gerät gespeichert. Wir sehen Seitenaufrufe und einfache Ereignisse,
            zum Beispiel dass jemand auf einen Button geklickt, einen Planer in den Warenkorb gelegt
            oder einen Kauf abgeschlossen hat, mit Produkt, Preisstufe und dem Kampagnenlink, über
            den der Besuch kam. Die Statistiken enthalten weder Namen noch E-Mail-Adresse oder
            sonstige Angaben, die dich identifizieren, und Download-Links werden aus den Adressen
            entfernt, bevor sie gesendet werden. Vercel ist Auftragsverarbeiter für die
            Statistiken.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Sprache und Währung</h2>
          <p>
            Wir verwenden zwei funktionale Cookies, die unbedingt erforderlich sind, um die Website
            in der richtigen Sprache und mit Preisen in der richtigen Währung anzuzeigen. Sie
            erfordern keine Einwilligung, werden nicht für Tracking verwendet und an niemanden
            weitergegeben.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <code>NEXT_LOCALE</code> – merkt sich die Sprache, die du im Sprachmenü gewählt hast,
              damit du beim nächsten Mal dieselbe Sprachversion bekommst. Wird gesetzt, wenn du eine
              Sprache auswählst. Speicherdauer: 1 Jahr.
            </li>
            <li>
              <code>sp_currency</code> – merkt sich, in welcher Währung die Preise angezeigt werden
              (zum Beispiel NOK oder EUR). Wird von der Website bei deinem ersten Besuch gesetzt,
              basierend auf dem Land, aus dem du die Seite aufrufst. Speicherdauer: 1 Jahr.
            </li>
          </ul>
          <p>
            Um Sprache und Währung auszuwählen, nutzen wir das Land, zu dem deine IP-Adresse gehört
            und das unser Hosting-Anbieter Vercel bei jedem Besuch übermittelt. Das Land wird nur
            für diese Auswahl verwendet; weder das Land noch deine IP-Adresse werden gespeichert.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Wie wir die Daten verwenden</h2>
          <p>Deine personenbezogenen Daten werden ausschließlich verwendet, um:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>deine Bestellung zu bearbeiten und auszuliefern</li>
            <li>dir die Bestätigung und den Download-Link per E-Mail zu schicken</li>
            <li>dich zu kontaktieren, falls es Probleme mit deiner Bestellung gibt</li>
            <li>
              dir die Gratis-Probe, die Willkommensserie und den Newsletter zu schicken, in die du
              eingewilligt hast
            </li>
          </ul>
          <p>
            Wir verkaufen deine personenbezogenen Daten niemals und geben sie nicht zu
            Marketingzwecken an Dritte weiter.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Speicherung und Sicherheit</h2>
          <p>
            Bestelldaten und E-Mail-Leads werden sicher bei unserem Datenbankanbieter (Supabase)
            mit Verschlüsselung und Zugriffskontrolle gespeichert. Der Server verwendet einen
            Service-Schlüssel; normale Browser haben keinen Lese- oder Schreibzugriff auf die
            Lead-Tabellen. Wir bewahren die Daten so lange auf, wie es nötig ist, um die Bestellung
            zu erfüllen, E-Mails zu senden, in die du eingewilligt hast, und das norwegische
            Buchführungsgesetz (bokføringsloven) einzuhalten.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Deine Rechte</h2>
          <p>
            Nach dem norwegischen Personendatengesetz (personopplysningsloven) und der DSGVO hast du
            das Recht:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Auskunft über die Daten zu verlangen, die wir über dich gespeichert haben</li>
            <li>die Berichtigung unrichtiger Daten zu verlangen</li>
            <li>die Löschung deiner Daten zu verlangen</li>
            <li>
              dich bei der norwegischen Datenschutzbehörde (Datatilsynet) zu beschweren, wenn du der
              Meinung bist, dass wir deine Daten unrechtmäßig verarbeiten
            </li>
          </ul>
          <p>
            Schreib uns an{" "}
            <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
              hei@studentplanlegger.no
            </a>
            , um deine Rechte auszuüben.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Anwendbares Recht</h2>
          <p>
            Für diese Datenschutzerklärung gilt norwegisches Recht, einschließlich des
            Personendatengesetzes und der EU-Datenschutz-Grundverordnung (DSGVO).
          </p>
        </section>
      </>
    ),
  },
  vilkar: {
    metaTitle: "AGB — Studentplanlegger",
    metaDescription:
      "Allgemeine Geschäftsbedingungen für ausfüllbare PDF-Planer von Studentplanlegger. Preise, Lieferung, Widerrufsrecht und Nutzungsbedingungen.",
    orgLine: "Studentplanlegger Davidson · Org.-Nr. 937416156",
    title: "Allgemeine Geschäftsbedingungen",
    updated: "Zuletzt aktualisiert: 18. November 2026",
    body: (
      <>
        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Über den Service</h2>
          <p>
            Studentplanlegger.no verkauft digitale Produkte in Form von ausfüllbaren PDF-Planern.
            Alle Produkte werden nach abgeschlossener Zahlung sofort als digitaler Download
            geliefert.
          </p>
          <p>
            <strong>Verkäufer:</strong> Einzelunternehmen (Registrierung über Altinn, das
            norwegische Behördenportal, läuft)
          </p>
          <p>
            <strong>Kontakt:</strong>{" "}
            <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
              hei@studentplanlegger.no
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Preise und Zahlung</h2>
          <p>
            Die Preise werden in deiner Landeswährung angezeigt, sofern wir sie unterstützen (NOK,
            SEK, DKK, EUR, GBP oder USD), andernfalls in US-Dollar, und enthalten die
            Mehrwertsteuer. Du zahlst den an der Kasse angezeigten Betrag.
          </p>
          <p>
            Wir bieten Kartenzahlung über Stripe in all diesen Währungen an und Vipps für Zahlungen
            in Norwegischen Kronen (NOK). Die Zahlung erfolgt vor der Lieferung des Produkts.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Lieferung</h2>
          <p>
            Sobald die Zahlung abgeschlossen ist, erhältst du sofort einen Download-Link. Außerdem
            bekommst du eine Bestätigung per E-Mail mit einem Link zum Download.
          </p>
          <p>
            Der Download-Link ist ab dem Kaufzeitpunkt <strong>7 Tage</strong> gültig, mit
            maximal <strong>10 Downloads</strong> pro Bestellung.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Widerrufsrecht</h2>
          <p>
            Nach § 22 Buchstabe n des norwegischen Widerrufsgesetzes (angrerettloven) gilt das
            Widerrufsrecht nicht für die Lieferung digitaler Inhalte, die nicht auf einem
            körperlichen Datenträger geliefert werden, wenn mit der Lieferung mit ausdrücklicher
            vorheriger Zustimmung des Verbrauchers begonnen wurde und der Verbraucher zur Kenntnis
            genommen hat, dass das Widerrufsrecht dadurch erlischt.
          </p>
          <p>
            Mit dem Abschluss des Kaufs stimmst du der sofortigen Lieferung der digitalen Inhalte zu
            und akzeptierst, dass das Widerrufsrecht erlischt.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Nutzungsbedingungen für Produkte</h2>
          <p>
            Die Produkte, die du kaufst, sind ausschließlich für den <strong>persönlichen
            Gebrauch</strong> bestimmt. Du darfst nicht:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>die Produkte weiterverkaufen oder verbreiten</li>
            <li>den Download-Link mit anderen teilen</li>
            <li>die Produkte ohne schriftliche Vereinbarung kommerziell nutzen</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Reklamation und Support</h2>
          <p>
            Wenn du Probleme mit dem Download hast oder das Produkt nicht wie erwartet funktioniert,
            schreib uns an{" "}
            <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
              hei@studentplanlegger.no
            </a>{" "}
            und wir helfen dir weiter.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-dark mb-3">Anwendbares Recht</h2>
          <p>
            Für diese Allgemeinen Geschäftsbedingungen gilt norwegisches Recht. Streitigkeiten sollen
            nach Möglichkeit einvernehmlich gelöst werden. Gelingt dies nicht, kann die Sache dem
            norwegischen Verbraucherrat (Forbrukerrådet) oder den ordentlichen Gerichten vorgelegt
            werden.
          </p>
        </section>
      </>
    ),
  },
};
