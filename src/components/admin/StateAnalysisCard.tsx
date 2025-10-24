import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const getIndexColor = (index: number) => {
  if (index <= 150) return "hsl(var(--chart-1))"; // Green
  if (index <= 250) return "hsl(var(--chart-2))"; // Yellow
  if (index <= 400) return "hsl(var(--chart-3))"; // Orange
  return "hsl(var(--chart-4))"; // Red
};

export const StateAnalysisCard = () => {
  const { data: stateData, isLoading } = useQuery({
    queryKey: ["state-analysis"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insurance_pricing_data")
        .select("state, index_value")
        .not("index_value", "is", null);

      if (error) throw error;

      // Group by state and calculate statistics
      const stateGroups = data.reduce((acc: any, row) => {
        const state = row.state;
        const index = parseFloat(row.index_value || "0");
        
        if (!acc[state]) {
          acc[state] = { indices: [], count: 0 };
        }
        
        acc[state].indices.push(index);
        acc[state].count++;
        
        return acc;
      }, {});

      return Object.entries(stateGroups).map(([state, group]: [string, any]) => {
        const indices = group.indices;
        const avg = indices.reduce((a: number, b: number) => a + b, 0) / indices.length;
        const min = Math.min(...indices);
        const max = Math.max(...indices);

        return {
          state,
          avg_index: parseFloat(avg.toFixed(2)),
          min_index: parseFloat(min.toFixed(2)),
          max_index: parseFloat(max.toFixed(2)),
          location_count: group.count,
        };
      }).sort((a, b) => b.avg_index - a.avg_index);
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>State-Level Analysis</CardTitle>
        <CardDescription>
          Average insurance pricing index by state. Lower values indicate more affordable locations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stateData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="state" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border rounded-lg p-3 shadow-lg">
                        <p className="font-semibold">{data.state}</p>
                        <p className="text-sm">Avg Index: {data.avg_index}</p>
                        <p className="text-sm">Range: {data.min_index} - {data.max_index}</p>
                        <p className="text-sm">Locations: {data.location_count}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Base $1000 premium = ${((data.avg_index / 100) * 1000).toFixed(0)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="avg_index" radius={[8, 8, 0, 0]}>
                {stateData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getIndexColor(entry.avg_index)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Most Affordable States</h4>
            <div className="space-y-2">
              {stateData?.slice(-3).reverse().map((state) => (
                <div key={state.state} className="flex justify-between text-sm">
                  <span>{state.state}</span>
                  <span className="font-medium">{state.avg_index}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Most Expensive States</h4>
            <div className="space-y-2">
              {stateData?.slice(0, 3).map((state) => (
                <div key={state.state} className="flex justify-between text-sm">
                  <span>{state.state}</span>
                  <span className="font-medium">{state.avg_index}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
