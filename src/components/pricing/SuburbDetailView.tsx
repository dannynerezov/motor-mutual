import { ArrowLeft, MapPin, TrendingUp, DollarSign, BarChart3, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="mt-1">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">{suburb.suburb}</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{suburb.postcode}</span>
            <span>•</span>
            <span>{stateData.state}</span>
          </div>
        </div>
        <Badge 
          variant="outline" 
          className={`text-lg px-4 py-2 ${
            isExpensive 
              ? 'border-red-500 text-red-600 dark:text-red-400' 
              : 'border-green-500 text-green-600 dark:text-green-400'
          }`}
        >
          {suburb.avg_index.toFixed(1)}
        </Badge>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-2">
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-5 w-5 mx-auto mb-2 text-primary" />
            <div className="text-xs text-muted-foreground mb-1">Locations Analyzed</div>
            <div className="text-2xl font-bold">{suburb.location_count}</div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto mb-2 text-primary" />
            <div className="text-xs text-muted-foreground mb-1">Index Range</div>
            <div className="text-2xl font-bold">
              {suburb.min_index.toFixed(0)}-{suburb.max_index.toFixed(0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plain Language Explanation */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">What This Means</h3>
              
              <p className="text-sm leading-relaxed">
                An index value of <span className="font-bold text-primary">{suburb.avg_index.toFixed(1)}</span> means 
                that if a car was insured for <span className="font-bold">${basePremium.toLocaleString()}</span> in{' '}
                <span className="font-bold">{cheapestSuburb.suburb}</span> (the most affordable suburb in {stateData.state}), 
                it would cost approximately{' '}
                <span className="font-bold text-lg text-primary">${relativeCost.toFixed(0)}</span> to 
                insure in {suburb.suburb}, all else being equal.
              </p>

              {suburb.suburb !== cheapestSuburb.suburb && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Cost difference:</span>
                      <span className={`font-bold ${costDifference > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
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
        <h3 className="font-semibold flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Detailed Analysis
        </h3>

        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Index</span>
              <span className="font-bold">{suburb.avg_index.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Minimum Index</span>
              <span className="font-medium text-green-600 dark:text-green-400">{suburb.min_index.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Maximum Index</span>
              <span className="font-medium text-red-600 dark:text-red-400">{suburb.max_index.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Variability</span>
              <span className="font-medium">{variability.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className={isExpensive ? 'border-orange-500/50' : 'border-green-500/50'}>
          <CardContent className="p-4">
            <p className="text-sm">
              {isExpensive ? (
                <>
                  This suburb is <span className="font-bold">above average</span> for {stateData.state}, 
                  with an index {((suburb.avg_index / stateData.avg_index - 1) * 100).toFixed(1)}% higher 
                  than the state average of {stateData.avg_index.toFixed(1)}.
                </>
              ) : suburb.avg_index === cheapestSuburb.avg_index ? (
                <>
                  This is the <span className="font-bold text-green-600 dark:text-green-400">most affordable</span> suburb 
                  in {stateData.state}!
                </>
              ) : (
                <>
                  This suburb is <span className="font-bold">below average</span> for {stateData.state}, 
                  with an index {((1 - suburb.avg_index / stateData.avg_index) * 100).toFixed(1)}% lower 
                  than the state average of {stateData.avg_index.toFixed(1)}.
                </>
              )}
            </p>
          </CardContent>
        </Card>

        {variability > 100 && (
          <Card className="bg-amber-500/10 border-amber-500/50">
            <CardContent className="p-4">
              <p className="text-sm">
                <span className="font-semibold">Note:</span> This suburb shows high variability 
                (range of {variability.toFixed(0)} points), which means insurance costs can vary 
                significantly between different streets or locations within this suburb.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
