import { ArrowLeft, MapPin, TrendingUp, DollarSign, BarChart3, Info, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StateStats, SuburbData } from "./PricingExplorerWidget";

type SuburbDetailViewProps = {
  suburb: SuburbData;
  stateData: StateStats;
  onBack: () => void;
};

export const SuburbDetailView = ({ suburb, stateData, onBack }: SuburbDetailViewProps) => {
  const cheapestSuburb = stateData.cheapest_suburb!;
  const basePremium = 1000;
  
  // Calculate what it would cost in this suburb if the cheapest suburb costs $1000
  const relativeCost = (suburb.avg_index / cheapestSuburb.avg_index) * basePremium;
  const costDifference = relativeCost - basePremium;
  const percentageDifference = ((suburb.avg_index - cheapestSuburb.avg_index) / cheapestSuburb.avg_index) * 100;

  const isExpensive = suburb.avg_index > stateData.avg_index;
  const variability = suburb.max_index - suburb.min_index;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-3 md:gap-4">
        <button
          onClick={onBack}
          className="flex-shrink-0 mt-1 p-2 hover:bg-accent/10 rounded-xl transition-colors group border hover:border-accent"
          aria-label="Back to suburbs"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-5 w-5 text-accent flex-shrink-0" />
            <h2 className="text-2xl md:text-3xl font-bold truncate">{suburb.suburb}</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{suburb.postcode}</span>
            <span>•</span>
            <span>{stateData.state}</span>
          </div>
        </div>
        <Badge 
          variant="outline" 
          className={`text-lg md:text-xl px-3 md:px-4 py-2 font-bold flex-shrink-0 ${
            isExpensive 
              ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-500/10' 
              : 'border-green-500 text-green-600 dark:text-green-400 bg-green-500/10'
          }`}
        >
          {suburb.avg_index.toFixed(1)}
        </Badge>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <Card className="border-2 hover:shadow-medium transition-shadow">
          <CardContent className="p-4 md:p-5 text-center">
            <BarChart3 className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2 text-accent" />
            <div className="text-xs text-muted-foreground mb-1">Locations Analyzed</div>
            <div className="text-2xl md:text-3xl font-bold">{suburb.location_count}</div>
          </CardContent>
        </Card>
        <Card className="border-2 hover:shadow-medium transition-shadow">
          <CardContent className="p-4 md:p-5 text-center">
            <TrendingUp className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-2 text-accent" />
            <div className="text-xs text-muted-foreground mb-1">Index Range</div>
            <div className="text-2xl md:text-3xl font-bold">
              {suburb.min_index.toFixed(0)}-{suburb.max_index.toFixed(0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plain Language Explanation */}
      <Card className="bg-gradient-to-br from-accent/10 via-primary/5 to-accent/5 border-2 border-accent/30 shadow-medium">
        <CardContent className="p-5 md:p-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
            <div className="space-y-3 md:space-y-4">
              <h3 className="font-semibold text-lg md:text-xl">What This Means</h3>
              
              <p className="text-sm md:text-base leading-relaxed">
                An index value of <span className="font-bold text-accent text-lg">{suburb.avg_index.toFixed(1)}</span> means 
                that if a car was insured for <span className="font-bold">${basePremium.toLocaleString()}</span> in{' '}
                <span className="font-bold">{cheapestSuburb.suburb}</span> (the most affordable suburb in {stateData.state}), 
                it would cost approximately{' '}
                <span className="font-bold text-xl md:text-2xl text-accent">${relativeCost.toFixed(0)}</span> to 
                insure in {suburb.suburb}, all else being equal.
              </p>

              {suburb.suburb !== cheapestSuburb.suburb && (
                <>
                  <Separator className="my-3" />
                  <div className="space-y-2 bg-background/50 rounded-lg p-3 md:p-4 border">
                    <div className="flex items-center justify-between text-sm md:text-base">
                      <span className="text-muted-foreground">Cost difference:</span>
                      <span className={`font-bold text-lg ${costDifference > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                        {costDifference > 0 ? '+' : ''}{costDifference > 0 ? `$${costDifference.toFixed(0)}` : '$0'} ({percentageDifference > 0 ? '+' : ''}{percentageDifference.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg md:text-xl flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Detailed Analysis
        </h3>

        <Card className="border-2">
          <CardContent className="p-4 md:p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm md:text-base text-muted-foreground">Average Index</span>
              <span className="font-bold text-lg">{suburb.avg_index.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm md:text-base text-muted-foreground">Minimum Index</span>
              <span className="font-bold text-lg text-green-600 dark:text-green-400">{suburb.min_index.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm md:text-base text-muted-foreground">Maximum Index</span>
              <span className="font-bold text-lg text-red-600 dark:text-red-400">{suburb.max_index.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm md:text-base text-muted-foreground">Variability</span>
              <span className="font-bold text-lg">{variability.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-2 ${isExpensive ? 'border-orange-500/50 bg-orange-500/5' : 'border-green-500/50 bg-green-500/5'}`}>
          <CardContent className="p-4 md:p-5">
            <p className="text-sm md:text-base leading-relaxed">
              {isExpensive ? (
                <>
                  This suburb is <span className="font-bold text-orange-600 dark:text-orange-400">above average</span> for {stateData.state}, 
                  with an index <span className="font-bold">{((suburb.avg_index / stateData.avg_index - 1) * 100).toFixed(1)}% higher</span> than the state average of {stateData.avg_index.toFixed(1)}.
                </>
              ) : suburb.avg_index === cheapestSuburb.avg_index ? (
                <>
                  This is the <span className="font-bold text-green-600 dark:text-green-400 text-lg">most affordable</span> suburb 
                  in {stateData.state}! 🎉
                </>
              ) : (
                <>
                  This suburb is <span className="font-bold text-green-600 dark:text-green-400">below average</span> for {stateData.state}, 
                  with an index <span className="font-bold">{((1 - suburb.avg_index / stateData.avg_index) * 100).toFixed(1)}% lower</span> than the state average of {stateData.avg_index.toFixed(1)}.
                </>
              )}
            </p>
          </CardContent>
        </Card>

        {variability > 100 && (
          <Card className="bg-amber-500/10 border-2 border-amber-500/50">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm md:text-base">
                  <span className="font-semibold">High Variability:</span> This suburb shows significant price variation 
                  (range of {variability.toFixed(0)} points), meaning insurance costs can differ substantially between different streets or locations within this suburb.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
