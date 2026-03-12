import { QuoteForm } from "@/components/QuoteForm";
import { Shield, TrendingDown, Building2, BarChart3 } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-primary py-12 md:py-24">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-primary opacity-80" />
      
      {/* Decorative circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="space-y-6 md:space-y-8 text-primary-foreground">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/15 border border-accent/30">
              <BarChart3 className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-accent">Prices Updated Daily from Market Data</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Australia's Most{" "}
              <span className="text-accent">Competitively Priced</span>{" "}
              Rideshare Cover
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-xl leading-relaxed">
              The Mutual monitors the market daily and prices its cover to remain competitive with traditional insurers. With regulated third-party protection incorporated into the price and operating under the <span className="font-semibold text-accent">Corporations Act 2001</span>, the model delivers comprehensive-level protection at a lower cost.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-start gap-3 bg-accent/20 rounded-xl px-5 py-4 border border-accent/40">
                <TrendingDown className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-lg font-bold">Beat Market Prices</p>
                  <p className="text-sm text-primary-foreground/70">The Mutual is avg 15–30% below traditional insurers</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-accent/20 rounded-xl px-5 py-4 border border-accent/40">
                <Shield className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-lg font-bold">APRA Backed</p>
                  <p className="text-sm text-primary-foreground/70"><p className="text-sm text-primary-foreground/70">$20M third-party liability included in the price</p></p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-accent/20 rounded-xl px-5 py-4 border border-accent/40">
                <Building2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-lg font-bold">AFCA Member</p>
                  <p className="text-sm text-primary-foreground/70">Full independent dispute resolution access</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quote Form */}
          <div className="lg:pl-4">
            <QuoteForm />
          </div>
        </div>
      </div>
    </section>
  );
};
