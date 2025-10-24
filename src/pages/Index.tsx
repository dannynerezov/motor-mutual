import { QuoteForm } from "@/components/QuoteForm";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield, Car, FileText, Users, Navigation, Clock, DollarSign } from "lucide-react";
import heroBg from "@/assets/rideshare-hero.jpg";
import rideshareDriver from "@/assets/rideshare-driver.png";
import rideshareProtection from "@/assets/rideshare-protection.png";

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
            <h2 className="text-5xl md:text-7xl font-bold mb-6 text-primary-foreground animate-fade-in [animation-delay:200ms] [animation-duration:800ms]">
              Cover Built for Rideshare Drivers
            </h2>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-4 max-w-3xl mx-auto">
              Protection designed for Uber, Ola, and rideshare drivers from just $500/year
            </p>
            <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
              Your car is your business - protect it with coverage that understands the rideshare economy
            </p>
          </div>

          <QuoteForm />
        </div>
      </section>

      {/* Features Section */}
      <section id="coverage" className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Why Rideshare Drivers Choose Us</h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Coverage that understands your unique needs on the road
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group p-6 rounded-2xl border border-border/50 bg-background/50 hover:bg-gradient-to-br hover:from-accent/10 hover:to-primary/10 hover:border-accent/30 transition-all duration-300 hover:shadow-medium">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-7 h-7 text-accent" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Rideshare-Specific</h4>
              <p className="text-muted-foreground">
                Coverage designed for the unique risks of driving for Uber, Ola, and other platforms
              </p>
            </div>

            <div className="group p-6 rounded-2xl border border-border/50 bg-background/50 hover:bg-gradient-to-br hover:from-accent/10 hover:to-primary/10 hover:border-accent/30 transition-all duration-300 hover:shadow-medium">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-7 h-7 text-accent" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Always On</h4>
              <p className="text-muted-foreground">
                24/7 coverage whether you're between rides or actively driving passengers
              </p>
            </div>

            <div className="group p-6 rounded-2xl border border-border/50 bg-background/50 hover:bg-gradient-to-br hover:from-accent/10 hover:to-primary/10 hover:border-accent/30 transition-all duration-300 hover:shadow-medium">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-7 h-7 text-accent" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Value-Based Pricing</h4>
              <p className="text-muted-foreground">
                Fair pricing from $500-$2,500 based on your vehicle's value, not inflated premiums
              </p>
            </div>

            <div className="group p-6 rounded-2xl border border-border/50 bg-background/50 hover:bg-gradient-to-br hover:from-accent/10 hover:to-primary/10 hover:border-accent/30 transition-all duration-300 hover:shadow-medium">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Navigation className="w-7 h-7 text-accent" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Quick Quotes</h4>
              <p className="text-muted-foreground">
                Get back on the road fast with instant quotes using just your rego number
              </p>
            </div>
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
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-2xl font-bold text-primary-foreground group-hover:scale-110 transition-transform duration-300">
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
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-2xl font-bold text-primary-foreground group-hover:scale-110 transition-transform duration-300">
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
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-2xl font-bold text-primary-foreground group-hover:scale-110 transition-transform duration-300">
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
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
