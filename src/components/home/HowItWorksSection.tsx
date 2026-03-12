import { Car, TrendingDown, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: Car,
    step: "01",
    title: "Enter Vehicle Details",
    description: "Just your rego and state — we auto-fetch your vehicle details and current market value instantly.",
  },
  {
    icon: TrendingDown,
    step: "02",
    title: "See Your Beating-Market Price",
    description: "Our algorithm checks today's market rates and prices your cover below competitors — guaranteed.",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "Drive Protected",
    description: "Comprehensive mutual cover plus APRA-regulated third-party protection, all in one membership.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get covered in three simple steps — no insurance jargon, no hidden fees
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {steps.map((step) => (
            <Card
              key={step.step}
              className="relative overflow-hidden border-2 hover:border-accent/50 transition-all duration-300 hover:shadow-lg group"
            >
              {/* Orange top bar */}
              <div className="h-1 bg-accent" />
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <step.icon className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-sm font-bold text-accent">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
