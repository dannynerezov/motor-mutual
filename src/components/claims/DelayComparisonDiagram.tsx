import { X, Check } from "lucide-react";

export const DelayComparisonDiagram = () => {
  const comparisons = [
    {
      problem: "Repairer network disputes",
      solution: "Your choice of repairer"
    },
    {
      problem: "Quality disputes with repairs",
      solution: "You manage repairs"
    },
    {
      problem: "Multiple estimate requirements",
      solution: "Single damage assessment"
    },
    {
      problem: "Repair approval delays",
      solution: "Cash payment, no approval needed"
    },
    {
      problem: "Supplement claim back-and-forth",
      solution: "Settlement amount agreed upfront"
    },
    {
      problem: "Repairer scheduling conflicts",
      solution: "You control timing"
    },
    {
      problem: "Parts availability issues",
      solution: "Not our problem - your choice"
    },
    {
      problem: "Insurer-repairer relationship conflicts",
      solution: "No conflicts of interest"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Why Claims Get Delayed (And How We Solve It)
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Traditional insurers face numerous delays because they try to control the repair process. 
          We eliminate these problems by giving you control.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 bg-border rounded-2xl overflow-hidden">
        {/* Header Row */}
        <div className="bg-destructive/10 p-4 font-bold text-foreground border-b-2 border-border">
          <X className="inline h-5 w-5 text-destructive mr-2" />
          Traditional Insurer Problems
        </div>
        <div className="bg-accent/10 p-4 font-bold text-foreground border-b-2 border-border">
          <Check className="inline h-5 w-5 text-accent mr-2" />
          Mutual's Solution
        </div>

        {/* Comparison Rows */}
        {comparisons.map((item, index) => (
          <>
            <div 
              key={`problem-${index}`}
              className="bg-card p-4 flex items-center gap-3 hover:bg-destructive/5 transition-colors"
            >
              <X className="h-5 w-5 text-destructive flex-shrink-0" />
              <span className="text-foreground">{item.problem}</span>
            </div>
            <div 
              key={`solution-${index}`}
              className="bg-card p-4 flex items-center gap-3 hover:bg-accent/5 transition-colors"
            >
              <Check className="h-5 w-5 text-accent flex-shrink-0" />
              <span className="text-foreground font-medium">{item.solution}</span>
            </div>
          </>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-muted-foreground italic">
          By removing ourselves from the repair management process, we eliminate the majority of claims delays and disputes.
        </p>
      </div>
    </div>
  );
};
