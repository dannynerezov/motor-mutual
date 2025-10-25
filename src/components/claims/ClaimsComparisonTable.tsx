import { Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const ClaimsComparisonTable = () => {
  const comparisons = [
    {
      aspect: "Repairer Choice",
      traditional: "Network only",
      mutual: "Your choice",
      advantage: true
    },
    {
      aspect: "Repair Management",
      traditional: "Insurer controls",
      mutual: "You control",
      advantage: true
    },
    {
      aspect: "Settlement Speed",
      traditional: "15-30+ days",
      mutual: "5-10 days",
      advantage: true
    },
    {
      aspect: "Replacement Vehicle (Not-at-Fault)",
      traditional: "Maybe",
      mutual: "Yes, always",
      advantage: true
    },
    {
      aspect: "Dispute Process",
      traditional: "Complex ombudsman",
      mutual: "Internal resolution + evidence",
      advantage: true
    },
    {
      aspect: "Cash Settlement Option",
      traditional: "Rare",
      mutual: "Standard for at-fault",
      advantage: true
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          How We Compare to Traditional Insurers
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Side-by-side comparison showing why the Mutual's approach delivers better outcomes
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block border-2 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-bold text-foreground text-base w-1/3">Aspect</TableHead>
              <TableHead className="font-bold text-foreground text-base w-1/3">Traditional Insurers</TableHead>
              <TableHead className="font-bold text-foreground text-base w-1/3 bg-accent/10">Mutual Coverage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisons.map((item, index) => (
              <TableRow key={index} className="hover:bg-muted/30">
                <TableCell className="font-medium text-foreground">{item.aspect}</TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-destructive flex-shrink-0" />
                    {item.traditional}
                  </div>
                </TableCell>
                <TableCell className="bg-accent/5">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="font-medium text-foreground">{item.mutual}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {comparisons.map((item, index) => (
          <div key={index} className="border-2 rounded-xl overflow-hidden">
            <div className="bg-muted/50 p-4 font-bold text-foreground">
              {item.aspect}
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-2">
                <X className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Traditional Insurers</div>
                  <div className="text-foreground">{item.traditional}</div>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-accent/5 -mx-4 -mb-4 p-4">
                <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Mutual Coverage</div>
                  <div className="text-foreground font-medium">{item.mutual}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-accent/30 rounded-2xl">
        <p className="text-foreground font-medium">
          ✨ Our approach puts you in control, eliminates common delay points, and delivers faster resolutions
        </p>
      </div>
    </div>
  );
};
