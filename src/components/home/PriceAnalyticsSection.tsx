import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const dataByMake = [
  { label: "Toyota Camry", market: 2850, mutual: 1890 },
  { label: "Hyundai Tucson", market: 3100, mutual: 2150 },
  { label: "Kia Sportage", market: 2700, mutual: 1750 },
  { label: "Mazda CX-5", market: 3200, mutual: 2280 },
  { label: "Nissan X-Trail", market: 2950, mutual: 2050 },
];

const dataByValue = [
  { label: "$10k–$15k", market: 1800, mutual: 1200 },
  { label: "$15k–$25k", market: 2400, mutual: 1650 },
  { label: "$25k–$35k", market: 3100, mutual: 2100 },
  { label: "$35k–$50k", market: 3800, mutual: 2600 },
  { label: "$50k+", market: 4500, mutual: 3100 },
];

const dataByState = [
  { label: "NSW", market: 3000, mutual: 2050 },
  { label: "VIC", market: 2900, mutual: 1980 },
  { label: "QLD", market: 2600, mutual: 1780 },
  { label: "SA", market: 2450, mutual: 1700 },
  { label: "WA", market: 2700, mutual: 1850 },
];

const tabs = [
  { value: "make", label: "By Make", data: dataByMake },
  { value: "value", label: "By Value", data: dataByValue },
  { value: "state", label: "By State", data: dataByState },
];

const BarChart = ({ data }: { data: typeof dataByMake }) => {
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

export const PriceAnalyticsSection = () => {
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
                  <BarChart data={tab.data} />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
