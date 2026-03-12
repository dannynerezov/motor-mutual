import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { PlatformLogosStrip } from "@/components/home/PlatformLogosStrip";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { CompetitivePricingSection } from "@/components/home/CompetitivePricingSection";
import { HowItWorksComparison } from "@/components/home/HowItWorksComparison";
import { LiveQuotesSection } from "@/components/home/LiveQuotesSection";
import { PriceAnalyticsSection } from "@/components/home/PriceAnalyticsSection";
import { APRATrustStrip } from "@/components/home/APRATrustStrip";
import { ClaimsSection } from "@/components/home/ClaimsSection";
import { Shield } from "lucide-react";

const Index = () => {
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCta(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <PlatformLogosStrip />
      <HowItWorksSection />
      <CompetitivePricingSection />

      {/* Comparison Table */}
      <section id="why-choose-mutual" className="py-16 md:py-24 bg-primary">
        <div className="container mx-auto px-4 md:px-6">
          <HowItWorksComparison />
        </div>
      </section>

      <LiveQuotesSection />
      <PriceAnalyticsSection />
      <APRATrustStrip />
      <ClaimsSection />
      <Footer />

      {/* Sticky mobile CTA */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${showStickyCta ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="bg-primary/95 backdrop-blur-sm border-t border-accent/30 px-4 py-3 flex items-center justify-between gap-3">
          <span className="text-primary-foreground text-sm font-semibold truncate">Get your rideshare quote</span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-5 py-2.5 rounded-lg text-sm whitespace-nowrap flex items-center gap-2 transition-colors"
          >
            <Shield className="w-4 h-4" />
            Get a Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
