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
              We monitor the market daily and price our cover to consistently beat traditional insurers — 
              backed by <span className="font-semibold text-accent">APRA-regulated third-party protection</span> included at no extra cost.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-3 bg-primary-foreground/5 rounded-lg px-4 py-3 border border-primary-foreground/10">
                <TrendingDown className="w-5 h-5 text-accent flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Beat Market Prices</p>
                  <p className="text-xs text-primary-foreground/60">Avg 15-30% below</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-primary-foreground/5 rounded-lg px-4 py-3 border border-primary-foreground/10">
                <Shield className="w-5 h-5 text-accent flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold">APRA Backed</p>
                  <p className="text-xs text-primary-foreground/60">Third-party included</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-primary-foreground/5 rounded-lg px-4 py-3 border border-primary-foreground/10">
                <Building2 className="w-5 h-5 text-accent flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold">AFCA Member</p>
                  <p className="text-xs text-primary-foreground/60">Full dispute access</p>
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
