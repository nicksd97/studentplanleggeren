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
import GuideList from "@/components/sections/GuideList";
import JsonLd from "@/components/seo/JsonLd";
import { getFaqItems } from "@/lib/faq";
import type { Locale } from "@/lib/i18n/config";
import {
  faqPageJsonLd,
  fivePackOfferJsonLd,
  organizationJsonLd,
  productOfferJsonLd,
  websiteJsonLd,
} from "@/lib/json-ld";
import { pakker } from "@/lib/products";

export default function HomePage({ locale }: { locale: Locale }) {
  const structuredData = [
    organizationJsonLd(),
    websiteJsonLd(locale),
    faqPageJsonLd(getFaqItems(locale)),
    ...pakker.map((bundle) => productOfferJsonLd(bundle, "/#pakker", { locale })),
    fivePackOfferJsonLd(locale),
  ];

  return (
    <>
      <Header />
      <JsonLd data={structuredData} />
      <main>
        <Hero locale={locale} />
        <DeviceShowcase locale={locale} />
        <CategoryBubbles />
        <PainPoints locale={locale} />
        <BundleShowcase />
        <HowItWorks locale={locale} />
        <Testimonials locale={locale} />
        <FAQ locale={locale} />
        <GuideList locale={locale} />
        <NewsletterSignup />
      </main>
      <Footer locale={locale} />
    </>
  );
}
