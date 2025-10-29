import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type ColumnType = 'mutual' | 'traditional' | 'clubs';

export const HowItWorksComparison = () => {
  const [activeColumn, setActiveColumn] = useState<ColumnType>('mutual');
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

      {/* Mobile Carousel View */}
      <div className="md:hidden relative">
        {/* Column Badge */}
        <div className="flex justify-center mb-4">
          <div className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
            activeColumn === 'mutual' 
              ? 'bg-accent text-accent-foreground' 
              : activeColumn === 'traditional'
              ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
              : 'bg-muted text-muted-foreground'
          }`}>
            {activeColumn === 'mutual' && '🏆 The Mutual - What You Get'}
            {activeColumn === 'traditional' && 'Traditional Insurance - What You Miss'}
            {activeColumn === 'clubs' && 'Rideshare Clubs - What You Miss'}
          </div>
        </div>

        <Card className="border-2">
          <CardContent className="p-0">
            <div className="grid grid-cols-[100px_1fr]">
              {/* Frozen Aspect Column */}
              <div className="sticky left-0 bg-muted/50 border-r-2 z-10">
                <div className="px-3 py-4 text-xs font-semibold border-b">Aspect</div>
                <MobileAspectCell text="Pricing Model" />
                <MobileAspectCell text="Pricing Transparency" />
                <MobileAspectCell text="Location Fairness" />
                <MobileAspectCell text="Claims Control" />
                <MobileAspectCell text="Cash Settlement" />
                <MobileAspectCell text="Repair Management" />
                <MobileAspectCell text="Regulation" />
                <MobileAspectCell text="Dispute Resolution" />
                <MobileAspectCell text="Typical Claim Time" />
              </div>

              {/* Active Content Column */}
              <div className={`transition-colors duration-300 ${
                activeColumn === 'mutual' ? 'bg-accent/5' : ''
              }`}>
                <div className="px-3 py-4 text-xs font-semibold text-center border-b">
                  {activeColumn === 'mutual' && 'The Mutual'}
                  {activeColumn === 'traditional' && 'Traditional'}
                  {activeColumn === 'clubs' && 'Clubs'}
                </div>
                
                {/* Content based on active column */}
                {activeColumn === 'mutual' && (
                  <>
                    <MobileContentCell icon={<Check className="h-4 w-4 text-accent" />} text="Simple vehicle value-based" />
                    <MobileContentCell icon={<Check className="h-4 w-4 text-accent" />} text="Fully transparent formula" />
                    <MobileContentCell icon={<Check className="h-4 w-4 text-accent" />} text="Same price everywhere" />
                    <MobileContentCell icon={<Check className="h-4 w-4 text-accent" />} text="Your choice of repairer" />
                    <MobileContentCell icon={<Check className="h-4 w-4 text-accent" />} text="Standard for at-fault claims" />
                    <MobileContentCell icon={<Check className="h-4 w-4 text-accent" />} text="You control your repairs" />
                    <MobileContentCell icon={<Check className="h-4 w-4 text-accent" />} text="Fully regulated & AFCA member" />
                    <MobileContentCell icon={<Check className="h-4 w-4 text-accent" />} text="Internal process + AFCA protection" />
                    <MobileContentCell icon={<Check className="h-4 w-4 text-accent" />} text="5-10 days average" />
                  </>
                )}
                
                {activeColumn === 'traditional' && (
                  <>
                    <MobileContentCell icon={<X className="h-4 w-4 text-muted-foreground" />} text="Complex location-based, can be 6x higher in metro areas" />
                    <MobileContentCell icon={<X className="h-4 w-4 text-muted-foreground" />} text="Hidden variables (age, gender, postcode)" />
                    <MobileContentCell icon={<X className="h-4 w-4 text-muted-foreground" />} text="High penalties for certain suburbs" />
                    <MobileContentCell icon={<X className="h-4 w-4 text-muted-foreground" />} text="Insurer steers repairs to network shops" />
                    <MobileContentCell icon={<X className="h-4 w-4 text-muted-foreground" />} text="Rarely offered" />
                    <MobileContentCell icon={<X className="h-4 w-4 text-muted-foreground" />} text="Insurer controls, causes delays" />
                    <MobileContentCell icon={<Check className="h-4 w-4 text-accent" />} text="ASIC regulated, AFCA member" />
                    <MobileContentCell icon={<Check className="h-4 w-4 text-accent" />} text="AFCA available" />
                    <MobileContentCell icon={<X className="h-4 w-4 text-muted-foreground" />} text="15-30+ days (repair management delays)" />
                  </>
                )}
                
                {activeColumn === 'clubs' && (
                  <>
                    <MobileContentCell icon={<AlertTriangle className="h-4 w-4 text-accent" />} text="Variable based on repair network usage" />
                    <MobileContentCell icon={<X className="h-4 w-4 text-muted-foreground" />} text="Opaque fee structures" />
                    <MobileContentCell icon={<AlertTriangle className="h-4 w-4 text-accent" />} text="Varies by location" />
                    <MobileContentCell icon={<X className="h-4 w-4 text-muted-foreground" />} text="Required to use affiliated repairers" />
                    <MobileContentCell icon={<X className="h-4 w-4 text-muted-foreground" />} text="Non-existent" />
                    <MobileContentCell icon={<X className="h-4 w-4 text-muted-foreground" />} text="Club controls, earns from claims" />
                    <MobileContentCell icon={<X className="h-4 w-4 text-muted-foreground" />} text="Not ASIC regulated, not AFCA member" warning />
                    <MobileContentCell icon={<X className="h-4 w-4 text-muted-foreground" />} text="Limited customer recourse" warning />
                    <MobileContentCell icon={<X className="h-4 w-4 text-muted-foreground" />} text="20-40+ days (network conflicts)" />
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Arrows */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-card/95 backdrop-blur shadow-lg disabled:opacity-30"
          onClick={() => {
            if (activeColumn === 'traditional') setActiveColumn('mutual');
            else if (activeColumn === 'clubs') setActiveColumn('traditional');
          }}
          disabled={activeColumn === 'mutual'}
          aria-label="Previous comparison"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-card/95 backdrop-blur shadow-lg disabled:opacity-30"
          onClick={() => {
            if (activeColumn === 'mutual') setActiveColumn('traditional');
            else if (activeColumn === 'traditional') setActiveColumn('clubs');
          }}
          disabled={activeColumn === 'clubs'}
          aria-label="Next comparison"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            className={`transition-all duration-300 rounded-full ${
              activeColumn === 'mutual' ? 'w-6 h-2 bg-accent' : 'w-2 h-2 bg-muted hover:bg-muted-foreground/50'
            }`}
            onClick={() => setActiveColumn('mutual')}
            aria-label="View The Mutual"
          />
          <button
            className={`transition-all duration-300 rounded-full ${
              activeColumn === 'traditional' ? 'w-6 h-2 bg-accent' : 'w-2 h-2 bg-muted hover:bg-muted-foreground/50'
            }`}
            onClick={() => setActiveColumn('traditional')}
            aria-label="View Traditional Insurance"
          />
          <button
            className={`transition-all duration-300 rounded-full ${
              activeColumn === 'clubs' ? 'w-6 h-2 bg-accent' : 'w-2 h-2 bg-muted hover:bg-muted-foreground/50'
            }`}
            onClick={() => setActiveColumn('clubs')}
            aria-label="View Rideshare Clubs"
          />
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

// Mobile helper components for carousel view
const MobileAspectCell = ({ text }: { text: string }) => (
  <div className="px-3 py-4 text-xs font-medium border-b min-h-[60px] flex items-center">
    {text}
  </div>
);

const MobileContentCell = ({ icon, text, warning }: { icon: React.ReactNode; text: string; warning?: boolean }) => (
  <div className={`px-3 py-4 border-b min-h-[60px] flex items-center justify-center ${warning ? 'bg-accent/10 dark:bg-accent/5' : ''}`}>
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-xs">{text}</span>
    </div>
  </div>
);
