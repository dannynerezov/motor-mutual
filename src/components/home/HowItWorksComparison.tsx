import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, AlertTriangle } from "lucide-react";

export const HowItWorksComparison = () => {
  return (
    <div className="mt-16">
      <div className="text-center mb-12">
        <h3 className="text-3xl md:text-4xl font-bold mb-4">
          Why Choose the Mutual Over Traditional Insurance or Rideshare Clubs?
        </h3>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Compare what you <span className="font-semibold text-accent">get</span> with The Mutual vs what you <span className="font-semibold text-muted-foreground">miss</span> with others
        </p>
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block border-2 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold border-r">Aspect</th>
                  <th className="px-6 py-4 text-center font-semibold border-r bg-accent/10">
                    <div className="flex flex-col items-center gap-1">
                      <span>The Mutual</span>
                      <span className="text-xs font-normal text-accent">What You Get</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center font-semibold border-r">
                    <div className="flex flex-col items-center gap-1">
                      <span>Traditional Insurance</span>
                      <span className="text-xs font-normal text-muted-foreground">What You Miss</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center font-semibold">
                    <div className="flex flex-col items-center gap-1">
                      <span>Rideshare Clubs</span>
                      <span className="text-xs font-normal text-muted-foreground">What You Miss</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <ComparisonRow
                  aspect="Pricing Model"
                  mutual="Simple vehicle value-based"
                  mutualIcon={<Check className="h-5 w-5 text-accent" />}
                  traditional="Complex location-based, can be 6x higher in metro areas"
                  traditionalIcon={<X className="h-5 w-5 text-muted-foreground" />}
                  clubs="Variable based on repair network usage"
                  clubsIcon={<AlertTriangle className="h-5 w-5 text-accent" />}
                  highlight
                />
                <ComparisonRow
                  aspect="Pricing Transparency"
                  mutual="Fully transparent formula"
                  mutualIcon={<Check className="h-5 w-5 text-accent" />}
                  traditional="Hidden variables (age, gender, postcode)"
                  traditionalIcon={<X className="h-5 w-5 text-muted-foreground" />}
                  clubs="Opaque fee structures"
                  clubsIcon={<X className="h-5 w-5 text-muted-foreground" />}
                  highlight
                />
                <ComparisonRow
                  aspect="Location Fairness"
                  mutual="Same price everywhere"
                  mutualIcon={<Check className="h-5 w-5 text-accent" />}
                  traditional="High penalties for certain suburbs"
                  traditionalIcon={<X className="h-5 w-5 text-muted-foreground" />}
                  clubs="Varies by location"
                  clubsIcon={<AlertTriangle className="h-5 w-5 text-accent" />}
                  highlight
                />
                <ComparisonRow
                  aspect="Claims Control"
                  mutual="Your choice of repairer"
                  mutualIcon={<Check className="h-5 w-5 text-accent" />}
                  traditional="Insurer steers repairs to network shops"
                  traditionalIcon={<X className="h-5 w-5 text-muted-foreground" />}
                  clubs="Required to use affiliated repairers"
                  clubsIcon={<X className="h-5 w-5 text-muted-foreground" />}
                  highlight
                />
                <ComparisonRow
                  aspect="Cash Settlement"
                  mutual="Standard for at-fault claims"
                  mutualIcon={<Check className="h-5 w-5 text-accent" />}
                  traditional="Rarely offered"
                  traditionalIcon={<X className="h-5 w-5 text-muted-foreground" />}
                  clubs="Non-existent"
                  clubsIcon={<X className="h-5 w-5 text-muted-foreground" />}
                  highlight
                />
                <ComparisonRow
                  aspect="Repair Management"
                  mutual="You control your repairs"
                  mutualIcon={<Check className="h-5 w-5 text-accent" />}
                  traditional="Insurer controls, causes delays"
                  traditionalIcon={<X className="h-5 w-5 text-muted-foreground" />}
                  clubs="Club controls, earns from claims"
                  clubsIcon={<X className="h-5 w-5 text-muted-foreground" />}
                  highlight
                />
                <ComparisonRow
                  aspect="Regulation"
                  mutual="Fully regulated & AFCA member"
                  mutualIcon={<Check className="h-5 w-5 text-accent" />}
                  traditional="ASIC regulated, AFCA member"
                  traditionalIcon={<Check className="h-5 w-5 text-accent" />}
                  clubs="Not ASIC regulated, not AFCA member"
                  clubsIcon={<X className="h-5 w-5 text-muted-foreground" />}
                  clubsWarning
                  highlight
                />
                <ComparisonRow
                  aspect="Dispute Resolution"
                  mutual="Internal process + AFCA protection"
                  mutualIcon={<Check className="h-5 w-5 text-accent" />}
                  traditional="AFCA available"
                  traditionalIcon={<Check className="h-5 w-5 text-accent" />}
                  clubs="Limited customer recourse"
                  clubsIcon={<X className="h-5 w-5 text-muted-foreground" />}
                  clubsWarning
                  highlight
                />
                <ComparisonRow
                  aspect="Typical Claim Time"
                  mutual="5-10 days average"
                  mutualIcon={<Check className="h-5 w-5 text-accent" />}
                  traditional="15-30+ days (repair management delays)"
                  traditionalIcon={<X className="h-5 w-5 text-muted-foreground" />}
                  clubs="20-40+ days (network conflicts)"
                  clubsIcon={<X className="h-5 w-5 text-muted-foreground" />}
                  highlight
                />
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Horizontal Scroll View */}
      <div className="md:hidden overflow-x-auto -mx-4 px-4">
        <div className="min-w-[640px]">
          <Card className="border-2">
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold border-r">Aspect</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold border-r bg-accent/10">
                      <div className="flex flex-col items-center gap-1">
                        <span>The Mutual</span>
                        <span className="text-xs font-normal text-accent">What You Get</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold border-r">
                      <div className="flex flex-col items-center gap-1">
                        <span>Traditional</span>
                        <span className="text-xs font-normal text-muted-foreground">What You Miss</span>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      <div className="flex flex-col items-center gap-1">
                        <span>Clubs</span>
                        <span className="text-xs font-normal text-muted-foreground">What You Miss</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <MobileComparisonRow
                    aspect="Pricing Model"
                    mutual="Simple vehicle value-based"
                    mutualIcon={<Check className="h-4 w-4 text-accent" />}
                    traditional="Complex location-based, can be 6x higher in metro areas"
                    traditionalIcon={<X className="h-4 w-4 text-muted-foreground" />}
                    clubs="Variable based on repair network usage"
                    clubsIcon={<AlertTriangle className="h-4 w-4 text-accent" />}
                  />
                  <MobileComparisonRow
                    aspect="Pricing Transparency"
                    mutual="Fully transparent formula"
                    mutualIcon={<Check className="h-4 w-4 text-accent" />}
                    traditional="Hidden variables (age, gender, postcode)"
                    traditionalIcon={<X className="h-4 w-4 text-muted-foreground" />}
                    clubs="Opaque fee structures"
                    clubsIcon={<X className="h-4 w-4 text-muted-foreground" />}
                  />
                  <MobileComparisonRow
                    aspect="Location Fairness"
                    mutual="Same price everywhere"
                    mutualIcon={<Check className="h-4 w-4 text-accent" />}
                    traditional="High penalties for certain suburbs"
                    traditionalIcon={<X className="h-4 w-4 text-muted-foreground" />}
                    clubs="Varies by location"
                    clubsIcon={<AlertTriangle className="h-4 w-4 text-accent" />}
                  />
                  <MobileComparisonRow
                    aspect="Claims Control"
                    mutual="Your choice of repairer"
                    mutualIcon={<Check className="h-4 w-4 text-accent" />}
                    traditional="Insurer steers repairs to network shops"
                    traditionalIcon={<X className="h-4 w-4 text-muted-foreground" />}
                    clubs="Required to use affiliated repairers"
                    clubsIcon={<X className="h-4 w-4 text-muted-foreground" />}
                  />
                  <MobileComparisonRow
                    aspect="Cash Settlement"
                    mutual="Standard for at-fault claims"
                    mutualIcon={<Check className="h-4 w-4 text-accent" />}
                    traditional="Rarely offered"
                    traditionalIcon={<X className="h-4 w-4 text-muted-foreground" />}
                    clubs="Non-existent"
                    clubsIcon={<X className="h-4 w-4 text-muted-foreground" />}
                  />
                  <MobileComparisonRow
                    aspect="Repair Management"
                    mutual="You control your repairs"
                    mutualIcon={<Check className="h-4 w-4 text-accent" />}
                    traditional="Insurer controls, causes delays"
                    traditionalIcon={<X className="h-4 w-4 text-muted-foreground" />}
                    clubs="Club controls, earns from claims"
                    clubsIcon={<X className="h-4 w-4 text-muted-foreground" />}
                  />
                  <MobileComparisonRow
                    aspect="Regulation"
                    mutual="Fully regulated & AFCA member"
                    mutualIcon={<Check className="h-4 w-4 text-accent" />}
                    traditional="ASIC regulated, AFCA member"
                    traditionalIcon={<Check className="h-4 w-4 text-accent" />}
                    clubs="Not ASIC regulated, not AFCA member"
                    clubsIcon={<X className="h-4 w-4 text-muted-foreground" />}
                    clubsWarning
                  />
                  <MobileComparisonRow
                    aspect="Dispute Resolution"
                    mutual="Internal process + AFCA protection"
                    mutualIcon={<Check className="h-4 w-4 text-accent" />}
                    traditional="AFCA available"
                    traditionalIcon={<Check className="h-4 w-4 text-accent" />}
                    clubs="Limited customer recourse"
                    clubsIcon={<X className="h-4 w-4 text-muted-foreground" />}
                    clubsWarning
                  />
                  <MobileComparisonRow
                    aspect="Typical Claim Time"
                    mutual="5-10 days average"
                    mutualIcon={<Check className="h-4 w-4 text-accent" />}
                    traditional="15-30+ days (repair management delays)"
                    traditionalIcon={<X className="h-4 w-4 text-muted-foreground" />}
                    clubs="20-40+ days (network conflicts)"
                    clubsIcon={<X className="h-4 w-4 text-muted-foreground" />}
                  />
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface ComparisonRowProps {
  aspect: string;
  traditional: string;
  traditionalIcon?: React.ReactNode;
  clubs: string;
  clubsIcon?: React.ReactNode;
  clubsWarning?: boolean;
  mutual: string;
  mutualIcon?: React.ReactNode;
  highlight?: boolean;
}

const ComparisonRow = ({ 
  aspect, 
  traditional, 
  traditionalIcon,
  clubs, 
  clubsIcon,
  clubsWarning,
  mutual, 
  mutualIcon,
  highlight 
}: ComparisonRowProps) => (
  <tr className={highlight ? "hover:bg-muted/30 transition-colors" : ""}>
    <td className="px-6 py-4 font-medium border-r">{aspect}</td>
    <td className="px-6 py-4 text-center border-r bg-accent/5">
      <div className="flex items-center justify-center gap-2">
        {mutualIcon}
        <span className="text-sm font-semibold">{mutual}</span>
      </div>
    </td>
    <td className="px-6 py-4 text-center border-r">
      <div className="flex items-center justify-center gap-2">
        {traditionalIcon}
        <span className="text-sm">{traditional}</span>
      </div>
    </td>
    <td className={`px-6 py-4 text-center ${clubsWarning ? 'bg-accent/10 dark:bg-accent/5' : ''}`}>
      <div className="flex items-center justify-center gap-2">
        {clubsIcon}
        <span className="text-sm">{clubs}</span>
      </div>
    </td>
  </tr>
);

interface MobileComparisonRowProps {
  aspect: string;
  mutual: string;
  mutualIcon?: React.ReactNode;
  traditional: string;
  traditionalIcon?: React.ReactNode;
  clubs: string;
  clubsIcon?: React.ReactNode;
  clubsWarning?: boolean;
}

const MobileComparisonRow = ({ 
  aspect, 
  mutual,
  mutualIcon,
  traditional, 
  traditionalIcon,
  clubs, 
  clubsIcon,
  clubsWarning
}: MobileComparisonRowProps) => (
  <tr className="hover:bg-muted/30 transition-colors">
    <td className="px-4 py-3 text-xs font-medium border-r">{aspect}</td>
    <td className="px-4 py-3 text-center border-r bg-accent/5">
      <div className="flex items-center justify-center gap-1">
        {mutualIcon}
        <span className="text-xs font-semibold">{mutual}</span>
      </div>
    </td>
    <td className="px-4 py-3 text-center border-r">
      <div className="flex items-center justify-center gap-1">
        {traditionalIcon}
        <span className="text-xs">{traditional}</span>
      </div>
    </td>
    <td className={`px-4 py-3 text-center ${clubsWarning ? 'bg-accent/10 dark:bg-accent/5' : ''}`}>
      <div className="flex items-center justify-center gap-1">
        {clubsIcon}
        <span className="text-xs">{clubs}</span>
      </div>
    </td>
  </tr>
);
