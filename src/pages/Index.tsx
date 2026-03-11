import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { CompetitivePricingSection } from "@/components/home/CompetitivePricingSection";
import { HowItWorksComparison } from "@/components/home/HowItWorksComparison";
import { LiveQuotesSection } from "@/components/home/LiveQuotesSection";
import { PriceAnalyticsSection } from "@/components/home/PriceAnalyticsSection";
import { APRATrustStrip } from "@/components/home/APRATrustStrip";
import { ClaimsSection } from "@/components/home/ClaimsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <HowItWorksSection />
      <CompetitivePricingSection />

      {/* Comparison Table */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container mx-auto px-4 md:px-6">
          <HowItWorksComparison />
        </div>
      </section>

      <LiveQuotesSection />
      <PriceAnalyticsSection />
      <APRATrustStrip />
      <ClaimsSection />
      <Footer />
    </div>
  );
};

export default Index;
