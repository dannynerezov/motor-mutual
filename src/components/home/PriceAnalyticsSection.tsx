import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

type ChartItem = { label: string; market: number; mutual: number };

const VALUE_RANGES = [
  { label: "$10k–$15k", min: 10000, max: 15000 },
  { label: "$15k–$25k", min: 15000, max: 25000 },
  { label: "$25k–$35k", min: 25000, max: 35000 },
  { label: "$35k–$50k", min: 35000, max: 50000 },
  { label: "$50k+", min: 50000, max: Infinity },
];

const BarChart = ({ data }: { data: ChartItem[] }) => {
  const maxVal = Math.max(...data.flatMap((d) => [d.market, d.mutual]));

  return (
    <div className="space-y-5">
      {data.map((item) => (
        <div key={item.label} className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{item.label}</span>
            <span className="text-muted-foreground text-xs">
              Save ${(item.market - item.mutual).toLocaleString()}/yr
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div
                className="h-6 rounded bg-muted-foreground/20 transition-all duration-500"
                style={{ width: `${(item.market / maxVal) * 100}%` }}
              />
              <span className="text-xs text-muted-foreground whitespace-nowrap">${item.market.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="h-6 rounded bg-accent transition-all duration-500"
                style={{ width: `${(item.mutual / maxVal) * 100}%` }}
              />
              <span className="text-xs font-semibold text-accent whitespace-nowrap">${item.mutual.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
      <div className="flex items-center gap-6 pt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-muted-foreground/20" />
          <span>Market Average</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-accent" />
          <span>Mutual Price</span>
        </div>
      </div>
    </div>
  );
};

type QuoteRow = {
  comp_benchmark_price: number | null;
  mutual_target_price: number | null;
  vehicle_make: string | null;
  vehicle_state: string | null;
  vehicle_value: number | null;
};

function aggregateByKey(rows: QuoteRow[], keyFn: (r: QuoteRow) => string | null): ChartItem[] {
  const groups: Record<string, { marketSum: number; mutualSum: number; count: number }> = {};
  for (const r of rows) {
    if (r.comp_benchmark_price == null || r.mutual_target_price == null) continue;
    const key = keyFn(r);
    if (!key) continue;
    if (!groups[key]) groups[key] = { marketSum: 0, mutualSum: 0, count: 0 };
    groups[key].marketSum += r.comp_benchmark_price;
    groups[key].mutualSum += r.mutual_target_price;
    groups[key].count++;
  }
  return Object.entries(groups)
    .filter(([, v]) => v.count >= 2)
    .map(([label, v]) => ({
      label,
      market: Math.round(v.marketSum / v.count),
      mutual: Math.round(v.mutualSum / v.count),
    }));
}

export const PriceAnalyticsSection = () => {
  const [dataByMake, setDataByMake] = useState<ChartItem[]>([]);
  const [dataByValue, setDataByValue] = useState<ChartItem[]>([]);
  const [dataByState, setDataByState] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("mutual_quotes")
        .select("comp_benchmark_price, mutual_target_price, vehicle_make, vehicle_state, vehicle_value")
        .not("comp_benchmark_price", "is", null)
        .not("mutual_target_price", "is", null);

      if (error || !data) {
        setLoading(false);
        return;
      }

      const rows = data as QuoteRow[];

      // By Make — top 5 by count
      const byMake = aggregateByKey(rows, (r) => r.vehicle_make?.trim() || null);
      byMake.sort((a, b) => b.market - a.market);
      setDataByMake(byMake.slice(0, 5));

      // By Value
      const byValue: ChartItem[] = [];
      for (const range of VALUE_RANGES) {
        const filtered = rows.filter(
          (r) => r.vehicle_value != null && r.vehicle_value >= range.min && r.vehicle_value < range.max
        );
        if (filtered.length < 2) continue;
        const marketAvg = Math.round(filtered.reduce((s, r) => s + (r.comp_benchmark_price ?? 0), 0) / filtered.length);
        const mutualAvg = Math.round(filtered.reduce((s, r) => s + (r.mutual_target_price ?? 0), 0) / filtered.length);
        byValue.push({ label: range.label, market: marketAvg, mutual: mutualAvg });
      }
      setDataByValue(byValue);

      // By State
      const byState = aggregateByKey(rows, (r) => r.vehicle_state?.trim().toUpperCase() || null);
      byState.sort((a, b) => b.market - a.market);
      setDataByState(byState);

      setLoading(false);
    };
    fetchData();
  }, []);

  const tabs = [
    { value: "make", label: "By Make", data: dataByMake },
    { value: "value", label: "By Value", data: dataByValue },
    { value: "state", label: "By State", data: dataByState },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Price Analytics
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how our pricing compares across different vehicles, values, and states
          </p>
        </div>

        <Card className="max-w-3xl mx-auto border-2">
          <CardContent className="p-6 md:p-8">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-48 w-full" />
              </div>
            ) : (
              <Tabs defaultValue="make">
                <TabsList className="mb-8 w-full justify-start">
                  {tabs.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {tabs.map((tab) => (
                  <TabsContent key={tab.value} value={tab.value}>
                    {tab.data.length > 0 ? (
                      <BarChart data={tab.data} />
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Not enough data available yet for this view.
                      </p>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
