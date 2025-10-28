import { QuoteForm } from "@/components/QuoteForm";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FairnessSection } from "@/components/home/FairnessSection";
import { TransparencySection } from "@/components/home/TransparencySection";
import { ReliabilitySection } from "@/components/home/ReliabilitySection";
import { HowItWorksComparison } from "@/components/home/HowItWorksComparison";
import heroBg from "@/assets/rideshare-hero.jpg";
import watermarkLogo from "@/assets/mcm-logo-small-watermark.webp";
import rideshareDriver from "@/assets/rideshare-driver.png";
import { Car, Shield, TrendingUp, Clock, BadgeCheck } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="min-h-[85vh] flex items-center justify-center relative overflow-hidden px-4 py-20">
        {/* Background image with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroBg})`,
            filter: 'brightness(0.6)',
          }}
        />

        {/* Watermark logo - bottom right */}
        <div className="absolute bottom-8 right-8 opacity-15 pointer-events-none">
          <img 
            src={watermarkLogo} 
            alt="" 
            className="w-32 h-32 object-contain"
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-white animate-in fade-in slide-in-from-left-8 duration-1000">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold leading-tight mb-4">
                <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                  Affordable, Community-Powered Rideshare Cover
                </span>
              </h1>
              
              <h2 className="text-2xl md:text-3xl text-blue-100 leading-relaxed font-semibold">
                Transparent, All-Risk Protection for Uber & Ola Drivers
              </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 flex-shrink-0 mt-1 text-accent" />
                <div>
                  <p className="font-semibold text-lg">Comprehensive Cover</p>
                  <p className="text-sm text-gray-300">All-risk protection that doesn't exclude rideshare</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BadgeCheck className="w-6 h-6 flex-shrink-0 mt-1 text-accent" />
                <div>
                  <p className="font-semibold text-lg">Fully Licenced</p>
                  <p className="text-sm text-gray-300">ASIC regulated and supervised</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 flex-shrink-0 mt-1 text-accent" />
                <div>
                  <p className="font-semibold text-lg">Fair Pricing</p>
                  <p className="text-sm text-gray-300">Predictable premiums based on vehicle value</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 flex-shrink-0 mt-1 text-accent" />
                <div>
                  <p className="font-semibold text-lg">24/7 Support</p>
                  <p className="text-sm text-gray-300">Always available when you need us</p>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
            <QuoteForm />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">How It Works for Rideshare Drivers</h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get protected in three simple steps - no complicated insurance jargon
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-8">
                <div className="flex gap-6 items-start group">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                    1
                  </div>
                  <div className="flex-grow pt-3">
                    <h4 className="text-2xl font-semibold mb-2">Enter Your Rego</h4>
                    <p className="text-muted-foreground text-lg">
                      Just your vehicle registration and address - we automatically fetch your car details and value
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start group">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                    2
                  </div>
                  <div className="flex-grow pt-3">
                    <h4 className="text-2xl font-semibold mb-2">Instant Quote</h4>
                    <p className="text-muted-foreground text-lg">
                      Get your membership price immediately - fair pricing from $500 to $2,500 based on vehicle value
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start group">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                    3
                  </div>
                  <div className="flex-grow pt-3">
                    <h4 className="text-2xl font-semibold mb-2">Drive & Earn Protected</h4>
                    <p className="text-muted-foreground text-lg">
                      Focus on your passengers and earnings - we've got your vehicle covered
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <img 
                  src={rideshareDriver} 
                  alt="Happy rideshare driver" 
                  className="w-full h-auto rounded-2xl shadow-strong"
                />
              </div>
            </div>

            {/* Comparison Table */}
            <HowItWorksComparison />
          </div>
        </div>
      </section>

      {/* Fairness Section */}
      <section id="fairness" className="py-20 bg-card">
        <FairnessSection />
      </section>

      {/* Transparency Section */}
      <section id="transparency" className="py-20 bg-background">
        <TransparencySection />
      </section>

      {/* Reliability Section */}
      <section id="reliability" className="py-20 bg-gradient-to-br from-accent/5 to-primary/5">
        <ReliabilitySection />
      </section>

      <Footer />
    </div>
  );
};

export default Index;
