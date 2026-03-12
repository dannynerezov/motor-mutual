import { BarChart3, Shield, Layers, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: BarChart3,
    title: "Daily Competitor Monitoring",
    description: "We check competitor prices every day to ensure our members always get below-market rates.",
    bullets: ["Real-time market data", "Automated price adjustments", "Transparent methodology"],
    featured: false,
  },
  {
    icon: Shield,
    title: "APRA Third-Party Cover Included",
    description: "Unlike clubs, your third-party liability is underwritten by an APRA-regulated insurer at no additional cost.",
    bullets: ["$20M third-party cover", "APRA-regulated underwriter", "AFCA dispute access"],
    featured: true,
  },
  {
    icon: Layers,
    title: "Best of Both Worlds",
    description: "Mutual community pricing combined with institutional-grade regulatory protection you can trust.",
    bullets: ["Community-powered pricing", "Institutional backing", "Professional claims handling"],
    featured: false,
  },
  {
    icon: Heart,
    title: "No Discrimination",
    description: "We don't penalise you for your postcode, age, or gender. Your price is based on your vehicle value — full stop.",
    bullets: ["Vehicle value-based only", "No postcode loading", "No demographic penalties"],
    featured: false,
  },
];

export const CompetitivePricingSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Competitive Pricing Philosophy
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We believe rideshare drivers deserve fair, transparent pricing backed by real regulatory protection
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className={`border-2 transition-all duration-300 hover:shadow-lg ${
                feature.featured
                  ? "bg-primary text-primary-foreground border-primary"
                  : "hover:border-accent/50"
              }`}
            >
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      feature.featured ? "bg-accent/20" : "bg-accent/10"
                    }`}
                  >
                    <feature.icon
                      className={`w-5 h-5 ${feature.featured ? "text-accent" : "text-accent"}`}
                    />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                </div>
                <p
                  className={`mb-4 leading-relaxed ${
                    feature.featured ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-2 text-sm">
                      <div className={`w-1.5 h-1.5 rounded-full ${feature.featured ? "bg-accent" : "bg-accent"}`} />
                      <span className={feature.featured ? "text-primary-foreground/90" : ""}>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
