import { QuoteForm } from "@/components/QuoteForm";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FairnessSection } from "@/components/home/FairnessSection";
import { TransparencySection } from "@/components/home/TransparencySection";
import { ReliabilitySection } from "@/components/home/ReliabilitySection";
import { HowItWorksComparison } from "@/components/home/HowItWorksComparison";
import heroBg from "@/assets/rideshare-hero.jpg";
import rideshareDriver from "@/assets/rideshare-driver.png";
import { Car, ShieldAlert, Waves, Cloud, Flame, Star } from "lucide-react";

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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 text-primary-foreground leading-tight opacity-0 animate-fade-up [animation-delay:300ms]">
              <span className="block bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent animate-pulse [animation-duration:3s]">
                Affordable, Community-Powered Cover
              </span>
              <span className="block mt-2 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl">
                for Australia's Rideshare Drivers
              </span>
            </h1>
            
            <div className="mb-4 max-w-4xl mx-auto opacity-0 animate-fade-up [animation-delay:600ms]">
              <p className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
                Transparent, All-Risk Cover for Uber & Ola Drivers
              </p>
              <p className="text-xl md:text-2xl text-accent font-semibold mb-4">
                from $41/Month
              </p>
              
              {/* Coverage Icons */}
              <div 
                role="list" 
                aria-label="Coverage types included"
                className="flex flex-wrap justify-center gap-3 md:gap-4 mt-6"
              >
                <div 
                  role="listitem"
                  className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-foreground/20 hover:scale-105 transition-transform duration-300 opacity-0 animate-fade-up [animation-delay:750ms]"
                >
                  <Car className="h-5 w-5 text-accent" aria-hidden="true" />
                  <span className="text-sm md:text-base text-primary-foreground font-medium">Collision</span>
                </div>
                
                <div 
                  role="listitem"
                  className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-foreground/20 hover:scale-105 transition-transform duration-300 opacity-0 animate-fade-up [animation-delay:800ms]"
                >
                  <ShieldAlert className="h-5 w-5 text-accent" aria-hidden="true" />
                  <span className="text-sm md:text-base text-primary-foreground font-medium">Theft</span>
                </div>
                
                <div 
                  role="listitem"
                  className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-foreground/20 hover:scale-105 transition-transform duration-300 opacity-0 animate-fade-up [animation-delay:850ms]"
                >
                  <Waves className="h-5 w-5 text-accent" aria-hidden="true" />
                  <span className="text-sm md:text-base text-primary-foreground font-medium">Flood</span>
                </div>
                
                <div 
                  role="listitem"
                  className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-foreground/20 hover:scale-105 transition-transform duration-300 opacity-0 animate-fade-up [animation-delay:900ms]"
                >
                  <Cloud className="h-5 w-5 text-accent" aria-hidden="true" />
                  <span className="text-sm md:text-base text-primary-foreground font-medium">Hail</span>
                </div>
                
                <div 
                  role="listitem"
                  className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-foreground/20 hover:scale-105 transition-transform duration-300 opacity-0 animate-fade-up [animation-delay:950ms]"
                >
                  <Flame className="h-5 w-5 text-accent" aria-hidden="true" />
                  <span className="text-sm md:text-base text-primary-foreground font-medium">Fire</span>
                </div>
              </div>
            </div>

            <div className="max-w-3xl mx-auto opacity-0 animate-fade-up [animation-delay:1100ms]">
              <p className="text-base md:text-lg text-primary-foreground/90 leading-relaxed mb-6">
                Join your rideshare community, backed by ASIC-regulated protection and AFCA supervision. 
                Get your quote today and drive with confidence, knowing your livelihood is protected by a 
                trusted, transparent mutual.
              </p>
              
              {/* Google Reviews Trust Badge */}
              <div 
                role="img" 
                aria-label="5 stars on Google Reviews"
                className="flex items-center justify-center gap-3 bg-primary-foreground/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-primary-foreground/20 mx-auto max-w-md hover:bg-primary-foreground/15 transition-colors duration-300"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">G</span>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <p className="text-xs text-primary-foreground/80 font-medium">Google Reviews</p>
                  </div>
                </div>
              </div>
            </div>
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
