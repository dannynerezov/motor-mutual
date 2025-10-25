import { Award, TrendingUp, TrendingDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StateStats } from "./PricingExplorerWidget";

type StateSelectorProps = {
  stateStats: StateStats[];
  onSelectState: (state: string) => void;
};

const getRankingBadge = (ranking: number) => {
  if (ranking === 1) return <Badge className="bg-green-500 text-white">Most Affordable</Badge>;
  if (ranking === 2) return <Badge className="bg-green-400 text-white">2nd Most Affordable</Badge>;
  if (ranking === 3) return <Badge className="bg-green-300 text-white">3rd Most Affordable</Badge>;
  return <Badge variant="outline">#{ranking}</Badge>;
};

const getIndexColor = (avgIndex: number) => {
  if (avgIndex < 150) return "text-green-600 dark:text-green-400";
  if (avgIndex < 250) return "text-yellow-600 dark:text-yellow-400";
  if (avgIndex < 400) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
};

export const StateSelector = ({ stateStats, onSelectState }: StateSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          Select Your State
        </h2>
        <p className="text-muted-foreground">
          Explore insurance pricing across {stateStats.length} Australian states and territories
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stateStats.map((state) => (
          <Button
            key={state.state}
            variant="outline"
            className="h-auto p-6 flex flex-col items-start gap-3 hover:shadow-lg transition-all hover:scale-105 hover:border-primary"
            onClick={() => onSelectState(state.state)}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-2xl font-bold">{state.state}</span>
              {getRankingBadge(state.ranking)}
            </div>

            <div className="w-full space-y-2 text-left">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Average Index:</span>
                <span className={`font-bold text-lg ${getIndexColor(state.avg_index)}`}>
                  {state.avg_index.toFixed(1)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Range:</span>
                <span className="font-medium">
                  {state.min_index.toFixed(0)} - {state.max_index.toFixed(0)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Suburbs:</span>
                <span className="font-medium">{state.suburb_count.toLocaleString()}</span>
              </div>
            </div>

            <div className="w-full pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
              {state.ranking <= 3 ? (
                <span className="flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  Below average cost
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Above average cost
                </span>
              )}
              <Award className="h-4 w-4" />
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};
