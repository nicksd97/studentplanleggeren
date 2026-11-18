import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LegalTranslationNote from "@/components/pages/LegalTranslationNote";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Terms of sale — Studentplanlegger",
  description:
    "Terms of sale for fillable PDF planners from Studentplanlegger. Prices, delivery, right of withdrawal and terms of use.",
  path: "/vilkar",
  locale: "en",
});

export default function VilkarPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <p className="text-sm text-brand-muted mb-4">
            Studentplanlegger Davidson · Org. no. 937416156
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-dark mb-8">
            Terms of sale
          </h1>
          <p className="text-brand-muted mb-8">Last updated: 12 April 2026</p>
          <LegalTranslationNote norwegianPath="/vilkar" />

          <div className="prose prose-brand max-w-none space-y-8 text-brand-dark/80">
            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">About the service</h2>
              <p>
                Studentplanlegger.no sells digital products in the form of fillable PDF planners. All
                products are delivered as an instant digital download once payment is complete.
              </p>
              <p>
                <strong>Seller:</strong> Sole proprietorship (registration in progress via Altinn)
              </p>
              <p>
                <strong>Contact:</strong>{" "}
                <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
                  hei@studentplanlegger.no
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Prices and payment</h2>
              <p>
                All prices on the website are stated in Norwegian kroner (NOK) and include value added
                tax (VAT).
              </p>
              <p>
                We offer payment via Stripe (card) and Vipps. Payment is made before the product is
                delivered.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Delivery</h2>
              <p>
                Once payment is complete, you immediately receive a download link. You will also
                receive a confirmation by email with a link to the download.
              </p>
              <p>
                The download link is valid for <strong>7 days</strong> from the time of purchase, with
                a maximum of <strong>10 downloads</strong> per order.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Right of withdrawal</h2>
              <p>
                Under section 22 (n) of the Norwegian Right of Withdrawal Act (angrerettloven), the
                right of withdrawal does not apply to the supply of digital content not delivered on a
                physical medium, when delivery has begun with the consumer&apos;s express prior consent
                and the consumer has acknowledged that the right of withdrawal is thereby lost.
              </p>
              <p>
                By completing the purchase, you consent to immediate delivery of the digital content
                and accept that the right of withdrawal lapses.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Terms of use for products</h2>
              <p>
                The products you buy are for <strong>personal use</strong> only. You may not:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Resell or distribute the products</li>
                <li>Share the download link with others</li>
                <li>Use the products commercially without a written agreement</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Complaints and support</h2>
              <p>
                If you have problems with the download or the product doesn&apos;t work as expected,
                contact us at{" "}
                <a href="mailto:hei@studentplanlegger.no" className="text-brand-accent hover:underline">
                  hei@studentplanlegger.no
                </a>{" "}
                and we will help you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-dark mb-3">Governing law</h2>
              <p>
                These terms of sale are governed by Norwegian law. Any disputes shall be sought
                resolved amicably. If this does not succeed, the matter may be brought before the
                Norwegian Consumer Council (Forbrukerrådet) or the ordinary courts.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer locale="en" />
    </>
  );
}
