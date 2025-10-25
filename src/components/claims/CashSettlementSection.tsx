import { HandCoins, CheckCircle, Wrench, Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CashSettlementSection = () => {
  const benefits = [
    {
      icon: HandCoins,
      title: "You Decide: Repair or Don't Repair",
      description: "Get the cash settlement and choose whether to repair your vehicle or keep the money"
    },
    {
      icon: Wrench,
      title: "Choose Your Own Repairer",
      description: "No repair shop steering - use any repairer you trust, or do the work yourself"
    },
    {
      icon: CheckCircle,
      title: "No Repair Management Delays",
      description: "We don't manage your repairs, which eliminates the main source of claims delays"
    },
    {
      icon: Timer,
      title: "Fast Payment Resolution",
      description: "Settlement amount agreed upfront - no back-and-forth with repair shops"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          At Fault? Get Cash, Get Choice
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
          For at-fault or single-vehicle incidents (flood, hailstorm, malicious damage, theft, etc.), 
          the Mutual achieves fast claims settlement through cash settlement - giving you complete control.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <Card 
              key={index}
              className="border-2 hover:shadow-lg transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-accent/20 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-foreground mb-4">
          Why Cash Settlement Works Better
        </h3>
        <p className="text-muted-foreground mb-4">
          Traditional insurers often create delays by trying to control the repair process - steering you to their preferred repair networks, 
          managing quality disputes, and requiring multiple estimates. This creates friction and extends claims resolution time.
        </p>
        <p className="text-foreground font-medium">
          With cash settlement, you receive the agreed amount and make your own decisions. 
          This eliminates repair management delays and gives you complete control over how to proceed.
        </p>
      </div>
    </div>
  );
};
