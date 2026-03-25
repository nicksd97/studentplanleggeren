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

export default function Home() {
  return (
    <>
      <Header />
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
