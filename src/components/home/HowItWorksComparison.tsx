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
          See how we compare on the factors that matter most to rideshare drivers
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
                  <th className="px-6 py-4 text-center font-semibold border-r">Traditional Insurance</th>
                  <th className="px-6 py-4 text-center font-semibold border-r">Rideshare Clubs</th>
                  <th className="px-6 py-4 text-center font-semibold bg-accent/10">The Mutual</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <ComparisonRow
                  aspect="Pricing Model"
                  traditional="Complex location-based, can be 6x higher in metro areas"
                  traditionalIcon={<X className="h-5 w-5 text-red-600" />}
                  clubs="Variable based on repair network usage"
                  clubsIcon={<AlertTriangle className="h-5 w-5 text-orange-500" />}
                  mutual="Simple vehicle value-based"
                  mutualIcon={<Check className="h-5 w-5 text-green-600" />}
                  highlight
                />
                <ComparisonRow
                  aspect="Pricing Transparency"
                  traditional="Hidden variables (age, gender, postcode)"
                  traditionalIcon={<X className="h-5 w-5 text-red-600" />}
                  clubs="Opaque fee structures"
                  clubsIcon={<X className="h-5 w-5 text-red-600" />}
                  mutual="Fully transparent formula"
                  mutualIcon={<Check className="h-5 w-5 text-green-600" />}
                  highlight
                />
                <ComparisonRow
                  aspect="Location Fairness"
                  traditional="High penalties for certain suburbs"
                  traditionalIcon={<X className="h-5 w-5 text-red-600" />}
                  clubs="Varies by location"
                  clubsIcon={<AlertTriangle className="h-5 w-5 text-orange-500" />}
                  mutual="Same price everywhere"
                  mutualIcon={<Check className="h-5 w-5 text-green-600" />}
                  highlight
                />
                <ComparisonRow
                  aspect="Claims Control"
                  traditional="Insurer steers repairs to network shops"
                  traditionalIcon={<X className="h-5 w-5 text-red-600" />}
                  clubs="Required to use affiliated repairers"
                  clubsIcon={<X className="h-5 w-5 text-red-600" />}
                  mutual="Your choice of repairer"
                  mutualIcon={<Check className="h-5 w-5 text-green-600" />}
                  highlight
                />
                <ComparisonRow
                  aspect="Cash Settlement"
                  traditional="Rarely offered"
                  traditionalIcon={<X className="h-5 w-5 text-red-600" />}
                  clubs="Non-existent"
                  clubsIcon={<X className="h-5 w-5 text-red-600" />}
                  mutual="Standard for at-fault claims"
                  mutualIcon={<Check className="h-5 w-5 text-green-600" />}
                  highlight
                />
                <ComparisonRow
                  aspect="Repair Management"
                  traditional="Insurer controls, causes delays"
                  traditionalIcon={<X className="h-5 w-5 text-red-600" />}
                  clubs="Club controls, earns from claims"
                  clubsIcon={<X className="h-5 w-5 text-red-600" />}
                  mutual="You control your repairs"
                  mutualIcon={<Check className="h-5 w-5 text-green-600" />}
                  highlight
                />
                <ComparisonRow
                  aspect="Regulation"
                  traditional="ASIC regulated, AFCA member"
                  traditionalIcon={<Check className="h-5 w-5 text-green-600" />}
                  clubs="Not ASIC regulated, not AFCA member"
                  clubsIcon={<X className="h-5 w-5 text-red-600" />}
                  clubsWarning
                  mutual="Fully regulated & AFCA member"
                  mutualIcon={<Check className="h-5 w-5 text-green-600" />}
                  highlight
                />
                <ComparisonRow
                  aspect="Dispute Resolution"
                  traditional="AFCA available"
                  traditionalIcon={<Check className="h-5 w-5 text-green-600" />}
                  clubs="Limited customer recourse"
                  clubsIcon={<X className="h-5 w-5 text-red-600" />}
                  clubsWarning
                  mutual="Internal process + AFCA protection"
                  mutualIcon={<Check className="h-5 w-5 text-green-600" />}
                  highlight
                />
                <ComparisonRow
                  aspect="Typical Claim Time"
                  traditional="15-30+ days (repair management delays)"
                  traditionalIcon={<X className="h-5 w-5 text-red-600" />}
                  clubs="20-40+ days (network conflicts)"
                  clubsIcon={<X className="h-5 w-5 text-red-600" />}
                  mutual="5-10 days average"
                  mutualIcon={<Check className="h-5 w-5 text-green-600" />}
                  highlight
                />
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Accordion View */}
      <div className="md:hidden space-y-4">
        <MobileComparisonCard
          aspect="Pricing Model"
          traditional="Complex location-based, can be 6x higher in metro areas"
          clubs="Variable based on repair network usage"
          mutual="Simple vehicle value-based"
        />
        <MobileComparisonCard
          aspect="Pricing Transparency"
          traditional="Hidden variables (age, gender, postcode)"
          clubs="Opaque fee structures"
          mutual="Fully transparent formula"
        />
        <MobileComparisonCard
          aspect="Location Fairness"
          traditional="High penalties for certain suburbs"
          clubs="Varies by location"
          mutual="Same price everywhere"
        />
        <MobileComparisonCard
          aspect="Claims Control"
          traditional="Insurer steers repairs to network shops"
          clubs="Required to use affiliated repairers"
          mutual="Your choice of repairer"
        />
        <MobileComparisonCard
          aspect="Cash Settlement"
          traditional="Rarely offered"
          clubs="Non-existent"
          mutual="Standard for at-fault claims"
        />
        <MobileComparisonCard
          aspect="Repair Management"
          traditional="Insurer controls, causes delays"
          clubs="Club controls, earns from claims"
          mutual="You control your repairs"
        />
        <MobileComparisonCard
          aspect="Regulation"
          traditional="ASIC regulated, AFCA member"
          clubs="⚠️ Not ASIC regulated, not AFCA member"
          mutual="Fully regulated & AFCA member"
          clubsWarning
        />
        <MobileComparisonCard
          aspect="Dispute Resolution"
          traditional="AFCA available"
          clubs="⚠️ Limited customer recourse"
          mutual="Internal process + AFCA protection"
          clubsWarning
        />
        <MobileComparisonCard
          aspect="Typical Claim Time"
          traditional="15-30+ days (repair management delays)"
          clubs="20-40+ days (network conflicts)"
          mutual="5-10 days average"
        />
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
    <td className="px-6 py-4 text-center border-r">
      <div className="flex items-center justify-center gap-2">
        {traditionalIcon}
        <span className="text-sm">{traditional}</span>
      </div>
    </td>
    <td className={`px-6 py-4 text-center border-r ${clubsWarning ? 'bg-orange-50/50 dark:bg-orange-950/20' : ''}`}>
      <div className="flex items-center justify-center gap-2">
        {clubsIcon}
        <span className="text-sm">{clubs}</span>
      </div>
    </td>
    <td className="px-6 py-4 text-center bg-accent/5">
      <div className="flex items-center justify-center gap-2">
        {mutualIcon}
        <span className="text-sm font-semibold">{mutual}</span>
      </div>
    </td>
  </tr>
);

interface MobileComparisonCardProps {
  aspect: string;
  traditional: string;
  clubs: string;
  mutual: string;
  clubsWarning?: boolean;
}

const MobileComparisonCard = ({ aspect, traditional, clubs, mutual, clubsWarning }: MobileComparisonCardProps) => (
  <Card className="border-2">
    <CardHeader className="bg-muted/30">
      <CardTitle className="text-lg">{aspect}</CardTitle>
    </CardHeader>
    <CardContent className="pt-4 space-y-4">
      <div className="flex items-start gap-2">
        <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-sm">Traditional Insurance</p>
          <p className="text-sm text-muted-foreground">{traditional}</p>
        </div>
      </div>
      <div className={`flex items-start gap-2 ${clubsWarning ? 'p-3 rounded-lg bg-orange-50/50 dark:bg-orange-950/20' : ''}`}>
        <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-sm">Rideshare Clubs</p>
          <p className="text-sm text-muted-foreground">{clubs}</p>
        </div>
      </div>
      <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50/50 dark:bg-green-950/20">
        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-sm">The Mutual</p>
          <p className="text-sm font-semibold">{mutual}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);
