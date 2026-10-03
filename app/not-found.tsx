import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Siden finnes ikke — Studentplanlegger",
  description:
    "Denne siden finnes ikke. Gå til Studentplanlegger for å se de fyllbare PDF-planleggerne.",
  path: "/404",
  index: false,
});

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-cream pt-28 pb-20 px-4">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-sm font-medium tracking-[0.1em] uppercase text-brand-medium mb-3">
            404
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-brand-dark mb-4">
            Siden finnes ikke
          </h1>
          <p className="text-brand-medium mb-8">
            Vi fant ikke siden du leter etter. Se planleggerne, eller gå tilbake til
            forsiden.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-full bg-brand-accent px-6 py-2.5 text-sm font-bold text-brand-dark hover:brightness-110 transition-all"
            >
              Til forsiden
            </Link>
            <Link
              href="/produkter"
              className="inline-flex items-center rounded-full border border-brand-soft px-6 py-2.5 text-sm font-medium text-brand-dark hover:bg-white transition-all"
            >
              Se planleggerne
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
