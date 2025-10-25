import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PricingExplorerWidget } from "@/components/pricing/PricingExplorerWidget";
import { MapPin, TrendingDown, Search, Info } from "lucide-react";

const WidgetPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent" />
        <div className="container mx-auto px-4 py-12 md:py-16 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-sm font-medium text-accent mb-4">
              <MapPin className="h-4 w-4" />
              Interactive Price Explorer
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
              Discover Insurance Costs Across Australia
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore how your suburb compares. Search 5,000+ locations to understand relative insurance pricing in plain language.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-card border rounded-full text-sm shadow-soft">
                <TrendingDown className="h-4 w-4 text-accent" />
                <span>State Rankings</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card border rounded-full text-sm shadow-soft">
                <Search className="h-4 w-4 text-accent" />
                <span>Smart Search</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card border rounded-full text-sm shadow-soft">
                <Info className="h-4 w-4 text-accent" />
                <span>Plain Language</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Widget Section */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <PricingExplorerWidget />
        
        {/* Info Section */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="bg-card border rounded-xl p-6 md:p-8 shadow-medium">
            <h2 className="text-2xl font-bold mb-4">How to Use This Tool</h2>
            <div className="space-y-4 text-muted-foreground">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Select Your State</h3>
                  <p className="text-sm">Choose from the state buttons to see how each state ranks for insurance affordability.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Search or Browse Suburbs</h3>
                  <p className="text-sm">Use the search bar to find your suburb, or browse the most affordable and expensive areas.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">View Detailed Analysis</h3>
                  <p className="text-sm">Click any suburb to see detailed pricing information in plain language, comparing it to the cheapest suburb in your state.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WidgetPage;
