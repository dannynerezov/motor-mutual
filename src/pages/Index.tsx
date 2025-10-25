import { QuoteForm } from "@/components/QuoteForm";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FairnessSection } from "@/components/home/FairnessSection";
import { TransparencySection } from "@/components/home/TransparencySection";
import { ReliabilitySection } from "@/components/home/ReliabilitySection";
import { HowItWorksComparison } from "@/components/home/HowItWorksComparison";
import heroBg from "@/assets/rideshare-hero.jpg";
import rideshareDriver from "@/assets/rideshare-driver.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/80 to-background"></div>
        </div>

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 text-primary-foreground opacity-0 animate-fade-up [animation-delay:300ms]">
              Cover Built for Rideshare Drivers
            </h2>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-4 max-w-3xl mx-auto opacity-0 animate-fade-up [animation-delay:600ms]">
              Protection designed for Uber, Ola, and rideshare drivers from just $500/year
            </p>
            <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto opacity-0 animate-fade-up [animation-delay:900ms]">
              Your car is your business - protect it with coverage that understands the rideshare economy
            </p>
          </div>

          <QuoteForm />
        </div>
      </section>

      {/* Fairness Section */}
      <section id="fairness" className="py-20 bg-background">
        <FairnessSection />
      </section>

      {/* Transparency Section */}
      <section id="transparency" className="py-20 bg-card">
        <TransparencySection />
      </section>

      {/* Reliability Section */}
      <section id="reliability" className="py-20 bg-gradient-to-br from-accent/5 to-primary/5">
        <ReliabilitySection />
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

      <Footer />
    </div>
  );
};

export default Index;
