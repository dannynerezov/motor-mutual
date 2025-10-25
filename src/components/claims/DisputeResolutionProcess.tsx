import { Upload, Search, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const DisputeResolutionProcess = () => {
  const steps = [
    {
      number: 1,
      icon: Upload,
      title: "Submit Your Evidence",
      description: "Provide independent repair quotes, photos, documentation, or market value assessments that support your position",
      timeline: "Within 7 days of settlement offer"
    },
    {
      number: 2,
      icon: Search,
      title: "Independent Review",
      description: "A senior assessor reviews all evidence, compares with market data, and conducts a thorough evaluation",
      timeline: "Completed within 5 business days"
    },
    {
      number: 3,
      icon: CheckCircle,
      title: "Resolution",
      description: "Receive either a revised settlement offer based on evidence, or access to third-party arbitration if needed",
      timeline: "Final decision within 10 business days"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-accent/20 border-accent/40">Fair Hearing Guaranteed</Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Disagree with Our Assessment? Here's How to Resolve It
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          We have a robust internal dispute resolution process where you can submit independent evidence 
          if you believe our damage assessment is incorrect.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <Card key={step.number} className="border-2 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                    <Icon className="h-7 w-7 text-accent" />
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-1">
                    Step {step.number}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{step.description}</p>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-accent">⏱️ {step.timeline}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-accent/30 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
          <CheckCircle className="h-7 w-7 text-accent" />
          Our Commitment to Fair Resolution
        </h3>
        <div className="space-y-3 text-muted-foreground">
          <p>
            <strong className="text-foreground">Independent Evidence Considered:</strong> We accept quotes from any licensed repairer, 
            market value assessments from automotive experts, and photo/video documentation of damage.
          </p>
          <p>
            <strong className="text-foreground">Senior Assessor Review:</strong> Your dispute is reviewed by an experienced assessor 
            who wasn't involved in the original assessment, ensuring impartiality.
          </p>
          <p>
            <strong className="text-foreground">Third-Party Arbitration:</strong> If we still can't reach agreement, 
            we offer access to independent third-party arbitration at no cost to you.
          </p>
          <p className="font-medium text-foreground mt-4">
            🛡️ Your rights are protected throughout the process, and we're committed to reaching a fair outcome based on evidence.
          </p>
        </div>
      </div>
    </div>
  );
};
