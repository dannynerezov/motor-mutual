import { QuoteForm } from "@/components/QuoteForm";
import { Shield, Car, FileText, Users } from "lucide-react";
import logo from "@/assets/mcm-logo.png";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Motor Cover Mutual" className="h-12 w-12" />
              <div>
                <h1 className="text-xl font-bold text-primary-foreground">Motor Cover Mutual</h1>
                <p className="text-xs text-primary-foreground/70">Protection You Can Trust</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#coverage" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Coverage
              </a>
              <a href="#how-it-works" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                How It Works
              </a>
              <a href="#contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>

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
            <h2 className="text-5xl md:text-7xl font-bold mb-6 text-primary-foreground">
              Protect Your Journey
            </h2>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-4 max-w-3xl mx-auto">
              Comprehensive vehicle protection starting from just $500 per year
            </p>
            <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
              Get instant quotes based on your vehicle's value with our innovative membership cover program
            </p>
          </div>

          <QuoteForm />
        </div>
      </section>

      {/* Features Section */}
      <section id="coverage" className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">Why Choose Motor Cover Mutual?</h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive protection designed for Australian drivers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group p-6 rounded-2xl border border-border/50 bg-background/50 hover:bg-gradient-to-br hover:from-accent/10 hover:to-primary/10 hover:border-accent/30 transition-all duration-300 hover:shadow-medium">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-7 h-7 text-accent" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Comprehensive Coverage</h4>
              <p className="text-muted-foreground">
                Full protection for vehicle damage with transparent pricing based on vehicle value
              </p>
            </div>

            <div className="group p-6 rounded-2xl border border-border/50 bg-background/50 hover:bg-gradient-to-br hover:from-accent/10 hover:to-primary/10 hover:border-accent/30 transition-all duration-300 hover:shadow-medium">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Car className="w-7 h-7 text-accent" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Instant Quotes</h4>
              <p className="text-muted-foreground">
                Get your quote in seconds using just your vehicle registration number
              </p>
            </div>

            <div className="group p-6 rounded-2xl border border-border/50 bg-background/50 hover:bg-gradient-to-br hover:from-accent/10 hover:to-primary/10 hover:border-accent/30 transition-all duration-300 hover:shadow-medium">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-7 h-7 text-accent" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Easy Claims</h4>
              <p className="text-muted-foreground">
                Simple and straightforward claims process when you need it most
              </p>
            </div>

            <div className="group p-6 rounded-2xl border border-border/50 bg-background/50 hover:bg-gradient-to-br hover:from-accent/10 hover:to-primary/10 hover:border-accent/30 transition-all duration-300 hover:shadow-medium">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-7 h-7 text-accent" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Mutual Trust</h4>
              <p className="text-muted-foreground">
                A community of members protecting each other on the road
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">How It Works</h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get protected in three simple steps
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex gap-6 items-start group">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-2xl font-bold text-primary-foreground group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <div className="flex-grow pt-3">
                  <h4 className="text-2xl font-semibold mb-2">Enter Your Details</h4>
                  <p className="text-muted-foreground text-lg">
                    Provide your vehicle registration and address. We'll automatically retrieve your vehicle information.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-2xl font-bold text-primary-foreground group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <div className="flex-grow pt-3">
                  <h4 className="text-2xl font-semibold mb-2">Get Your Quote</h4>
                  <p className="text-muted-foreground text-lg">
                    Receive an instant quote based on your vehicle's value. Prices from $500 to $2,500 per year.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-2xl font-bold text-primary-foreground group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <div className="flex-grow pt-3">
                  <h4 className="text-2xl font-semibold mb-2">Drive Protected</h4>
                  <p className="text-muted-foreground text-lg">
                    Once approved, you're covered. File claims easily through our platform whenever needed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-primary py-12 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={logo} alt="Motor Cover Mutual" className="h-10 w-10" />
                <span className="font-bold text-lg text-primary-foreground">Motor Cover Mutual</span>
              </div>
              <p className="text-primary-foreground/70">
                Protecting Australian drivers with transparent, value-based coverage.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-primary-foreground">Quick Links</h5>
              <ul className="space-y-2 text-primary-foreground/70">
                <li><a href="#coverage" className="hover:text-primary-foreground transition-colors">Coverage</a></li>
                <li><a href="#how-it-works" className="hover:text-primary-foreground transition-colors">How It Works</a></li>
                <li><a href="#contact" className="hover:text-primary-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-primary-foreground">Contact Us</h5>
              <ul className="space-y-2 text-primary-foreground/70">
                <li>Email: info@motorcovermutual.com.au</li>
                <li>Phone: 1300 XXX XXX</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/60">
            <p>&copy; 2025 Motor Cover Mutual. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
