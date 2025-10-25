import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, ChevronRight } from "lucide-react";
import { CompactSuburbView } from "./CompactSuburbView";

type StateStats = {
  state: string;
  suburb_count: number;
  location_count: number;
  avg_index: number;
  min_index: number;
  max_index: number;
  ranking: number;
};

export const CompactPricingWidget = () => {
  const [currentView, setCurrentView] = useState<'states' | 'suburbs'>('states');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [viewContext, setViewContext] = useState<'cheapest' | 'expensive'>('cheapest');

  const { data: rawStateStats, isLoading } = useQuery({
    queryKey: ["state-pricing-data"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_state_pricing_analysis');

      if (error) throw error;
      if (!data || data.length === 0) return [];

      return data.map((row: any, index: number) => ({
        state: row.state,
        suburb_count: parseInt(row.suburb_count),
        location_count: parseInt(row.location_count),
        avg_index: parseFloat(row.avg_index),
        min_index: parseFloat(row.min_index),
        max_index: parseFloat(row.max_index),
        ranking: index + 1,
      }));
    },
  });

  const stateStats = rawStateStats || [];

  const topCheapest = stateStats.slice(0, 3);
  const topExpensive = stateStats.slice(-3).reverse();

  const handleStateClick = (state: string, context: 'cheapest' | 'expensive') => {
    setSelectedState(state);
    setViewContext(context);
    setCurrentView('suburbs');
  };

  const handleBack = () => {
    setCurrentView('states');
    setSelectedState(null);
  };

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {currentView === 'states' ? (
        <>
          {/* Cheapest States */}
          <Card className="border-2 border-green-200 bg-green-50/30 dark:border-green-900 dark:bg-green-950/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-green-600 dark:text-green-400" />
                <CardTitle className="text-xl">Cheapest States (Traditional Insurance)</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCheapest.map((state, index) => (
                  <button
                    key={state.state}
                    onClick={() => handleStateClick(state.state, 'cheapest')}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-background/50 border cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-all duration-200 group active:scale-[0.98]"
                    aria-label={`View cheapest suburbs in ${state.state}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">#{index + 1}</div>
                      <div className="text-left">
                        <div className="font-semibold">{state.state}</div>
                        <div className="text-sm text-muted-foreground">{state.suburb_count} suburbs</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          {state.avg_index.toFixed(1)}
                        </div>
                        <div className="text-xs text-muted-foreground">Avg. Index</div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Most Expensive States */}
          <Card className="border-2 border-red-200 bg-red-50/30 dark:border-red-900 dark:bg-red-950/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-red-600 dark:text-red-400" />
                <CardTitle className="text-xl">Most Expensive States (Traditional Insurance)</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topExpensive.map((state) => (
                  <button
                    key={state.state}
                    onClick={() => handleStateClick(state.state, 'expensive')}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-background/50 border cursor-pointer hover:scale-[1.02] hover:shadow-lg transition-all duration-200 group active:scale-[0.98]"
                    aria-label={`View most expensive suburbs in ${state.state}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">#{state.ranking}</div>
                      <div className="text-left">
                        <div className="font-semibold">{state.state}</div>
                        <div className="text-sm text-muted-foreground">{state.suburb_count} suburbs</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-600 dark:text-red-400">
                          {state.avg_index.toFixed(1)}
                        </div>
                        <div className="text-xs text-muted-foreground">Avg. Index</div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="md:col-span-2">
          <CompactSuburbView 
            state={selectedState!}
            context={viewContext}
            onBack={handleBack}
          />
        </div>
      )}
    </div>
  );
};
