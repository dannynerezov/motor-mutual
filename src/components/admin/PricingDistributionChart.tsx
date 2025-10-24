import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const getIndexColor = (range: string) => {
  if (range.includes("100-150")) return "hsl(var(--chart-1))";
  if (range.includes("151-250")) return "hsl(var(--chart-2))";
  if (range.includes("251-400")) return "hsl(var(--chart-3))";
  return "hsl(var(--chart-4))";
};

export const PricingDistributionChart = () => {
  const { data: distribution, isLoading } = useQuery({
    queryKey: ["pricing-distribution"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insurance_pricing_data")
        .select("index_value")
        .not("index_value", "is", null);

      if (error) throw error;

      const indices = data
        .map((d) => parseFloat(d.index_value || "0"))
        .filter((v) => !isNaN(v) && v > 0);

      // Create histogram buckets
      const buckets = [
        { range: "100-150", label: "Affordable", min: 100, max: 150, count: 0 },
        { range: "151-250", label: "Moderate", min: 151, max: 250, count: 0 },
        { range: "251-400", label: "Expensive", min: 251, max: 400, count: 0 },
        { range: "401+", label: "Very Expensive", min: 401, max: Infinity, count: 0 },
      ];

      indices.forEach((index) => {
        const bucket = buckets.find((b) => index >= b.min && index <= b.max);
        if (bucket) bucket.count++;
      });

      const total = indices.length;
      return buckets.map((b) => ({
        ...b,
        percentage: ((b.count / total) * 100).toFixed(1),
      }));
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
        <CardTitle>Index Distribution Analysis</CardTitle>
        <CardDescription>
          Distribution of locations across pricing index ranges
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distribution}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="range" className="text-xs" />
              <YAxis className="text-xs" label={{ value: "Number of Locations", angle: -90, position: "insideLeft" }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border rounded-lg p-3 shadow-lg">
                        <p className="font-semibold">{data.label}</p>
                        <p className="text-sm">Range: {data.range}</p>
                        <p className="text-sm">Locations: {data.count.toLocaleString()}</p>
                        <p className="text-sm">Percentage: {data.percentage}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {distribution?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getIndexColor(entry.range)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {distribution?.map((bucket) => (
            <div key={bucket.range} className="text-center p-4 rounded-lg border">
              <div className="text-2xl font-bold">{bucket.count.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{bucket.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{bucket.percentage}%</div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Understanding the Distribution</h4>
          <div className="text-sm space-y-1 text-muted-foreground">
            <p>• <strong>Affordable (100-150)</strong>: Locations where premiums are 0-50% above base price</p>
            <p>• <strong>Moderate (151-250)</strong>: Premiums are 51-150% above base price</p>
            <p>• <strong>Expensive (251-400)</strong>: Premiums are 151-300% above base price</p>
            <p>• <strong>Very Expensive (401+)</strong>: Premiums are over 300% above base price</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
