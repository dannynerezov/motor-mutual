import { Badge } from "@/components/ui/badge";
import { StateStats } from "./PricingExplorerWidget";

type StateSelectorProps = {
  stateStats: StateStats[];
  onSelectState: (state: string) => void;
};

const getRankingBadge = (ranking: number) => {
  if (ranking === 1) return <Badge className="bg-green-500 hover:bg-green-600 text-white border-0">🥇 Most Affordable</Badge>;
  if (ranking === 2) return <Badge className="bg-green-400 hover:bg-green-500 text-white border-0">🥈 2nd</Badge>;
  if (ranking === 3) return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-0">🥉 3rd</Badge>;
  return <Badge variant="outline" className="font-semibold">#{ranking}</Badge>;
};

const getIndexColor = (avgIndex: number) => {
  if (avgIndex < 150) return "text-green-600 dark:text-green-400";
  if (avgIndex < 250) return "text-yellow-600 dark:text-yellow-400";
  if (avgIndex < 400) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
};

export const StateSelector = ({ stateStats, onSelectState }: StateSelectorProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Select Your State
        </h2>
        <p className="text-muted-foreground text-base md:text-lg">
          Compare insurance costs across Australia
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stateStats.map((state) => (
          <button
            key={state.state}
            onClick={() => onSelectState(state.state)}
            className="group relative p-6 rounded-2xl border-2 border-border hover:border-accent bg-card hover:bg-gradient-to-br hover:from-accent/5 hover:to-primary/5 transition-all duration-300 text-left shadow-soft hover:shadow-medium hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Ranking Badge - Top Left */}
            <div className="absolute top-4 left-4">
              {getRankingBadge(state.ranking)}
            </div>

            {/* State Name & Average Index */}
            <div className="flex justify-between items-start mt-8 mb-4">
              <h3 className="text-2xl md:text-3xl font-bold group-hover:text-accent transition-colors">
                {state.state}
              </h3>
              <div className="text-right">
                <div className={`text-3xl md:text-4xl font-bold ${getIndexColor(state.avg_index)}`}>
                  {state.avg_index.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">avg index</div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-background/50 rounded-lg p-3 border">
                <div className="text-xs text-muted-foreground mb-1">Cheapest</div>
                <div className="font-semibold text-green-600 dark:text-green-400">
                  {state.min_index.toFixed(1)}
                </div>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border">
                <div className="text-xs text-muted-foreground mb-1">Expensive</div>
                <div className="font-semibold text-orange-600 dark:text-orange-400">
                  {state.max_index.toFixed(1)}
                </div>
              </div>
            </div>

            {/* Suburb Count */}
            <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Suburbs analyzed</span>
              <span className="font-semibold">{state.suburb_count.toLocaleString()}</span>
            </div>

            {/* Hover Arrow */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
