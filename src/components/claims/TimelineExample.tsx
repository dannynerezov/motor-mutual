import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const TimelineExample = () => {
  const atFaultTimeline = [
    { day: "Day 1", event: "Submit claim online" },
    { day: "Day 2-3", event: "Damage assessment completed" },
    { day: "Day 5", event: "Settlement offer presented" },
    { day: "Day 7", event: "Cash payment issued" }
  ];

  const notAtFaultTimeline = [
    { day: "Day 1", event: "Submit claim online" },
    { day: "Same Day", event: "Accident management partner assigned" },
    { day: "Day 2", event: "Replacement vehicle delivered" },
    { day: "Day 5-10", event: "Repairs completed, vehicle returned" }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Real Timeline Examples
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          See how quickly we resolve actual claims from submission to completion
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* At Fault Timeline */}
        <Card className="border-2">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-accent" />
              At-Fault Claim Example
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {atFaultTimeline.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      index === atFaultTimeline.length - 1 
                        ? 'bg-accent text-accent-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    {index < atFaultTimeline.length - 1 && (
                      <div className="w-0.5 h-12 bg-border my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="font-bold text-accent mb-1">{item.day}</div>
                    <div className="text-foreground">{item.event}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
              <p className="text-sm font-medium text-foreground">
                ⚡ Total Resolution Time: <span className="text-accent">~7 days</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Not At Fault Timeline */}
        <Card className="border-2">
          <CardHeader className="bg-accent/5">
            <CardTitle className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-accent" />
              Not-At-Fault Claim Example
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {notAtFaultTimeline.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      index === notAtFaultTimeline.length - 1 
                        ? 'bg-accent text-accent-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    {index < notAtFaultTimeline.length - 1 && (
                      <div className="w-0.5 h-12 bg-border my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="font-bold text-accent mb-1">{item.day}</div>
                    <div className="text-foreground">{item.event}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
              <p className="text-sm font-medium text-foreground">
                ⚡ Total Resolution Time: <span className="text-accent">~5-10 days</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center p-6 bg-muted/50 rounded-2xl">
        <p className="text-muted-foreground">
          <strong className="text-foreground">Compare this to traditional insurers:</strong> Many claims take 
          15-30+ days due to repair shop coordination, quality disputes, and approval delays. 
          Our streamlined approach delivers results in a fraction of the time.
        </p>
      </div>
    </div>
  );
};
