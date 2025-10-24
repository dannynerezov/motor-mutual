import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Database, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

export const SummaryStatsCard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["pricing-summary-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_pricing_summary_stats" as any);
      
      if (error) {
        // Fallback to manual calculation if function doesn't exist
        const { data: allData, error: fallbackError } = await supabase
          .from("insurance_pricing_data")
          .select("index_value")
          .not("index_value", "is", null);

        if (fallbackError) throw fallbackError;

        const indices = allData
          .map((d) => parseFloat(d.index_value || "0"))
          .filter((v) => !isNaN(v) && v > 0);

        if (indices.length === 0) {
          return {
            total_locations: 0,
            avg_index: 0,
            min_index: 0,
            max_index: 0,
            median_index: 0,
            std_dev: 0,
          };
        }

        indices.sort((a, b) => a - b);
        const sum = indices.reduce((a, b) => a + b, 0);
        const avg = sum / indices.length;
        const median = indices[Math.floor(indices.length / 2)];
        const variance = indices.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / indices.length;
        const stdDev = Math.sqrt(variance);

        return {
          total_locations: indices.length,
          avg_index: avg,
          min_index: Math.min(...indices),
          max_index: Math.max(...indices),
          median_index: median,
          std_dev: stdDev,
        };
      }

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Locations",
      value: stats?.total_locations?.toLocaleString() || "0",
      icon: Database,
    },
    {
      title: "Average Index",
      value: stats?.avg_index?.toFixed(2) || "0",
      icon: BarChart3,
    },
    {
      title: "Median Index",
      value: stats?.median_index?.toFixed(2) || "0",
      icon: BarChart3,
    },
    {
      title: "Cheapest (Min)",
      value: stats?.min_index?.toFixed(2) || "0",
      icon: TrendingDown,
    },
    {
      title: "Most Expensive (Max)",
      value: stats?.max_index?.toFixed(2) || "0",
      icon: TrendingUp,
    },
    {
      title: "Std Deviation",
      value: stats?.std_dev?.toFixed(2) || "0",
      icon: BarChart3,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
