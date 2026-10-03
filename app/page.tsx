import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import PainPoints from "@/components/sections/PainPoints";
import DeviceShowcase from "@/components/sections/DeviceShowcase";
import CategoryBubbles from "@/components/sections/CategoryBubbles";
import BundleShowcase from "@/components/sections/BundleShowcase";
import HowItWorks from "@/components/sections/HowItWorks";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import NewsletterSignup from "@/components/sections/NewsletterSignup";
import JsonLd from "@/components/seo/JsonLd";
import { faqItems } from "@/lib/faq";
import {
  faqPageJsonLd,
  organizationJsonLd,
  productOfferJsonLd,
  websiteJsonLd,
} from "@/lib/json-ld";
import { pakker } from "@/lib/products";
import { pageMeta } from "@/lib/site";

export const metadata = {
  ...pageMeta({
    title: "Studentplanlegger — Få orden på studiene",
    description:
      "25 fyllbare PDF-planleggere for norske studenter. Daglig, ukentlig, månedlig og mer — skriv ut eller fyll inn digitalt.",
    path: "/",
  }),
  keywords: [
    "studentplanlegger",
    "planlegger student",
    "ukentlig plan",
    "daglig planlegger",
    "vane tracker",
    "pomodoro planlegger",
    "fyllbar pdf",
    "studieplanlegger",
  ],
};

export default function Home() {
  const structuredData = [
    organizationJsonLd(),
    websiteJsonLd(),
    faqPageJsonLd(faqItems),
    ...pakker.map((bundle) => productOfferJsonLd(bundle, "/#pakker")),
  ];

  return (
    <>
      <Header />
      <JsonLd data={structuredData} />
      <main>
        <Hero />
        <DeviceShowcase />
        <CategoryBubbles />
        <PainPoints />
        <BundleShowcase />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <NewsletterSignup />
      </main>
      <Footer />
    </>
  );
}
