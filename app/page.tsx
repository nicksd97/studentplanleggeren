import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import PainPoints from "@/components/sections/PainPoints";
import ProductGrid from "@/components/sections/ProductGrid";
import Bundles from "@/components/sections/Bundles";
import HowItWorks from "@/components/sections/HowItWorks";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import NewsletterSignup from "@/components/sections/NewsletterSignup";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PainPoints />
        <ProductGrid />
        <Bundles />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <NewsletterSignup />
      </main>
      <Footer />
    </>
  );
}
