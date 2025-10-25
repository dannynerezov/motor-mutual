import { Car, DollarSign, FileCheck, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const NotAtFaultProcess = () => {
  const benefits = [
    {
      icon: Car,
      title: "Free Replacement Vehicle",
      description: "Get a replacement vehicle while yours is being repaired - at no cost to you"
    },
    {
      icon: DollarSign,
      title: "No Excess Payment",
      description: "No out-of-pocket expenses required when you're not at fault"
    },
    {
      icon: FileCheck,
      title: "Claims History Protected",
      description: "Your claims history stays clean - no impact on future premiums"
    },
    {
      icon: Clock,
      title: "Fast Turnaround",
      description: "Accident management partners handle everything quickly and efficiently"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Not Your Fault? We Keep You Driving
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          When you're not at fault, our Accident Management partners take care of everything. 
          They organize claims through the at-fault party's insurance and ensure you get all the benefits you deserve.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <Card 
              key={index} 
              className="border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                    <Icon className="h-7 w-7 text-accent" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-10 p-6 bg-accent/5 border-l-4 border-accent rounded-lg">
        <p className="text-foreground">
          <strong>How it works:</strong> Our Accident Management partners handle all communication with the at-fault party's insurer, 
          arrange your replacement vehicle, and manage the repair process. You avoid excess payments, protect your claims history, 
          and get access to all benefits - including a replacement vehicle while yours is being fixed.
        </p>
      </div>
    </div>
  );
};
