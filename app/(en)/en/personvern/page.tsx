import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LegalTranslationNote from "@/components/pages/LegalTranslationNote";
import { localizePath } from "@/lib/i18n/config";
import { pageMeta } from "@/lib/site";
import Link from "next/link";

export const metadata = pageMeta({
  title: "Privacy policy — Studentplanlegger",
  description:
    "How Studentplanlegger processes personal data for purchases and for the free sample and newsletter. Contact hei@studentplanlegger.no.",
  path: "/personvern",
  locale: "en",
});

export default function PersonvernPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <p className="text-sm text-brand-muted mb-4">
            Studentplanlegger Davidson · Org. no. 937416156
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-dark mb-8">
            Privacy policy
          </h1>
          <p className="text-brand-muted mb-8">Last updated: 12 October 2026</p>
          <LegalTranslationNote norwegianPath="/personvern" />

          <div className="prose prose-brand max-w-none space-y-8 text-brand-dark/80">
            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Who we are</h2>
              <p>
                Studentplanlegger.no is run by Studentplanlegger Davidson, org. no. 937416156.
                We sell fillable PDF planners as digital downloads.
              </p>
              <p>
                <strong>Contact:</strong>{" "}
                <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
                  hei@studentplanlegger.no
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">What information we collect</h2>
              <p>When you make a purchase, we collect the following personal data:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>First name</li>
                <li>Last name</li>
                <li>Email address</li>
              </ul>
              <p>
                This information is necessary to process your order and send you a download link
                for the products you have bought.
              </p>
              <p>
                When you submit the form on{" "}
                <Link href={localizePath("/gratis", "en")} className="text-brand-accent hover:underline">
                  /gratis
                </Link>{" "}
                or the home page, we collect your email address for the newsletter, the welcome
                series and the free weekly plan sample. If you arrived via a campaign link, we also
                store the campaign values (UTM) that belong to that sign-up.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Newsletter and free sample</h2>
              <p>
                We collect your <strong>email address</strong> when you submit the form on /gratis
                or the home page.
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Purpose:</strong> to send the free weekly plan sample, a welcome series and
                  regular emails with study tips and product information.
                </li>
                <li>
                  <strong>Legal basis:</strong> consent (submitting the form). You can withdraw your
                  consent at any time.
                </li>
                <li>
                  <strong>Data controller:</strong> Studentplanlegger Davidson, org. no. 937416156.
                </li>
                <li>
                  <strong>Data processors:</strong> Resend (sending email, contact list and welcome
                  series) and Supabase (lead register and orders).
                </li>
                <li>
                  <strong>Storage:</strong> email address, source (for example gratis-ukeplan), time
                  of consent, unsubscribe status, campaign/UTM fields where present, and which email
                  campaigns you have received (sample and welcome series). The data is kept in Resend
                  Contacts (segment lead-gratis-ukeplan) and in the Supabase tables leads and
                  lead_campaigns until you ask us to delete it or unsubscribe, or the data is no
                  longer relevant.
                </li>
                <li>
                  <strong>Unsubscribing:</strong> reply to{" "}
                  <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
                    hei@studentplanlegger.no
                  </a>{" "}
                  asking to be unsubscribed, or use the link in the email where available.
                </li>
              </ul>
              <p>
                The rights below (access, correction, deletion and complaints to the Norwegian Data
                Protection Authority, Datatilsynet) also apply to newsletter data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Payment</h2>
              <p>
                We offer payment via Stripe and Vipps. All payment information (card number, Vipps
                details) is handled directly by the payment provider. We never store card or payment
                information on our servers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Cookies and tracking</h2>
              <p>
                We use <strong>no third-party tracking cookies</strong>. The cart and checkout only
                use what is technically necessary. In addition, we set a first-party cookie{" "}
                <code>sp_campaign</code> for up to 30 days with UTM values from campaign links, so
                that we can link a purchase or a /gratis sign-up to the campaign you came from. It is
                not sent to ad networks.
              </p>
              <p>
                To understand how the website is used, we have anonymous visitor statistics from{" "}
                <strong>Vercel Web Analytics</strong>. It uses no cookies and stores nothing on your
                device. We see page views and simple events, for example that someone clicked a
                button, added a planner to the cart or completed a purchase, with the product, price
                tier and which campaign link the visit came from. The statistics contain no name,
                email address or anything else that identifies you, and download links are removed
                from the addresses before they are sent. Vercel is the data processor for the
                statistics.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">How we use the information</h2>
              <p>Your personal data is only used to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Process and deliver your order</li>
                <li>Send the confirmation and download link by email</li>
                <li>Contact you if there are any problems with your order</li>
                <li>Send the free sample, welcome series and newsletter you have consented to</li>
              </ul>
              <p>
                We never sell or share your personal data with third parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Storage and security</h2>
              <p>
                Order information and email leads are stored securely with our database provider
                (Supabase) with encryption and access control. The server uses a service key; ordinary
                browsers have no read or write access to the lead tables. We keep the data for as long
                as necessary to fulfil the order, send emails you have consented to, and comply with
                the Norwegian Bookkeeping Act.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Your rights</h2>
              <p>Under the Norwegian Personal Data Act and the GDPR, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Request access to the information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>
                  Complain to the Norwegian Data Protection Authority (Datatilsynet) if you believe we
                  process your data in breach of the rules
                </li>
              </ul>
              <p>
                Contact us at{" "}
                <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
                  hei@studentplanlegger.no
                </a>{" "}
                to exercise your rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Governing law</h2>
              <p>
                This privacy policy is governed by Norwegian law, including the Personal Data Act and
                the EU General Data Protection Regulation (GDPR).
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer locale="en" />
    </>
  );
}
