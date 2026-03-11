import { FileText, Scale, Zap, Phone, Search, ClipboardCheck, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: FileText,
    title: "Simple Reporting",
    description: "Lodge your claim online or by phone. We guide you through every step with clear, plain-language support.",
  },
  {
    icon: Scale,
    title: "Fair Dispute Resolution",
    description: "As an AFCA member, you have full access to independent dispute resolution if you're ever unhappy.",
  },
  {
    icon: Zap,
    title: "Fast Cash Settlements",
    description: "Choose your own repairer or take a cash settlement. No insurer-directed repairs, no network delays.",
  },
];

const timeline = [
  { icon: Phone, step: "1", title: "Notify Us", description: "Report your incident within 48 hours" },
  { icon: Search, step: "2", title: "Assessment", description: "We review your claim promptly" },
  { icon: ClipboardCheck, step: "3", title: "Decision", description: "Clear outcome within 5-10 business days" },
  { icon: CheckCircle, step: "4", title: "Resolution", description: "Payment or repair arranged quickly" },
];

export const ClaimsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Claims That Work For You
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transparent, fair, and fast — the way claims should be
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Left: Feature cards */}
          <div className="space-y-4">
            {features.map((feature) => (
              <Card key={feature.title} className="border-2 hover:border-accent/30 transition-colors">
                <CardContent className="p-6 flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right: Timeline */}
          <Card className="border-2 bg-primary text-primary-foreground">
            <CardContent className="p-6 md:p-8">
              <h3 className="text-xl font-bold mb-6">Claims Process</h3>
              <div className="space-y-6">
                {timeline.map((step, i) => (
                  <div key={step.step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <step.icon className="w-5 h-5 text-accent" />
                      </div>
                      {i < timeline.length - 1 && (
                        <div className="w-px h-full bg-primary-foreground/20 mt-2" />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className="text-xs text-accent font-semibold mb-1">Step {step.step}</p>
                      <h4 className="font-bold">{step.title}</h4>
                      <p className="text-sm text-primary-foreground/70">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
