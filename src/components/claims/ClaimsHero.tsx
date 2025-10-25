import { Shield, Clock, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const ClaimsHero = () => {
  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-br from-primary via-primary/95 to-primary/80 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary-foreground)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-accent/20 border-accent/40 text-primary-foreground hover:bg-accent/30">
            Reliability
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-fade-up">
            Fast, Fair Claims That Put You in Control
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-12 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Most claims problems happen when insurers try to control your repairs. We give you the choice.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl p-6">
              <div className="flex justify-center mb-3">
                <Clock className="h-8 w-8 text-accent" />
              </div>
              <div className="text-3xl font-bold text-primary-foreground mb-1">5-10 Days</div>
              <div className="text-sm text-primary-foreground/80">Average Resolution Time</div>
            </div>

            <div className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl p-6">
              <div className="flex justify-center mb-3">
                <DollarSign className="h-8 w-8 text-accent" />
              </div>
              <div className="text-3xl font-bold text-primary-foreground mb-1">Cash</div>
              <div className="text-sm text-primary-foreground/80">Settlement Standard</div>
            </div>

            <div className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl p-6">
              <div className="flex justify-center mb-3">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <div className="text-3xl font-bold text-primary-foreground mb-1">Your Choice</div>
              <div className="text-sm text-primary-foreground/80">Repair or Don't Repair</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
