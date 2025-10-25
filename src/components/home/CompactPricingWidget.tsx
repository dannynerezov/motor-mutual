import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown } from "lucide-react";

type SuburbData = {
  suburb: string;
  state: string;
  postcode: string;
  avg_index: number;
  min_index: number;
  max_index: number;
  location_count: number;
};

type StateStats = {
  state: string;
  avg_index: number;
  min_index: number;
  max_index: number;
  suburb_count: number;
  ranking: number;
};

export const CompactPricingWidget = () => {
  const { data: suburbData, isLoading } = useQuery({
    queryKey: ["compact-pricing-data"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        'get_suburb_pricing_analysis_paginated',
        { limit_rows: 1000, offset_rows: 0 }
      );

      if (error) throw error;
      if (!data || data.length === 0) return [];

      return data.map((row: any) => ({
        suburb: row.suburb,
        state: row.state,
        postcode: row.postcode,
        avg_index: parseFloat(row.avg_index),
        min_index: parseFloat(row.min_index),
        max_index: parseFloat(row.max_index),
        location_count: parseInt(row.location_count),
      }));
    },
  });

  const stateStats = useMemo<StateStats[]>(() => {
    if (!suburbData || suburbData.length === 0) return [];

    const stateGroups = suburbData.reduce((acc: Record<string, SuburbData[]>, suburb: SuburbData) => {
      if (!acc[suburb.state]) {
        acc[suburb.state] = [];
      }
      acc[suburb.state].push(suburb);
      return acc;
    }, {});

    const stats = Object.entries(stateGroups).map(([state, suburbs]) => {
      const avgIndex = suburbs.reduce((sum, s) => sum + s.avg_index, 0) / suburbs.length;
      const minIndex = Math.min(...suburbs.map(s => s.min_index));
      const maxIndex = Math.max(...suburbs.map(s => s.max_index));

      return {
        state,
        avg_index: avgIndex,
        min_index: minIndex,
        max_index: maxIndex,
        suburb_count: suburbs.length,
        ranking: 0,
      };
    });

    const sortedStats = stats.sort((a, b) => a.avg_index - b.avg_index);
    sortedStats.forEach((stat, index) => {
      stat.ranking = index + 1;
    });

    return sortedStats;
  }, [suburbData]);

  const topCheapest = stateStats.slice(0, 3);
  const topExpensive = stateStats.slice(-3).reverse();

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
              <div key={state.state} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">#{index + 1}</div>
                  <div>
                    <div className="font-semibold">{state.state}</div>
                    <div className="text-sm text-muted-foreground">{state.suburb_count} suburbs</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {state.avg_index.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Avg. Index</div>
                </div>
              </div>
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
              <div key={state.state} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">#{state.ranking}</div>
                  <div>
                    <div className="font-semibold">{state.state}</div>
                    <div className="text-sm text-muted-foreground">{state.suburb_count} suburbs</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">
                    {state.avg_index.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Avg. Index</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
