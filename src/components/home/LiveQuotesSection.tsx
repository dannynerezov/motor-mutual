import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingDown, Database, BarChart3, Shield } from "lucide-react";

const mockQuotes = [
  { vehicle: "2022 Toyota Camry", state: "NSW", market: 2850, mutual: 1890, saving: 960 },
  { vehicle: "2021 Hyundai Tucson", state: "VIC", market: 3100, mutual: 2150, saving: 950 },
  { vehicle: "2020 Kia Sportage", state: "QLD", market: 2700, mutual: 1750, saving: 950 },
  { vehicle: "2023 Mazda CX-5", state: "SA", market: 3200, mutual: 2280, saving: 920 },
  { vehicle: "2019 Toyota Corolla", state: "WA", market: 2200, mutual: 1450, saving: 750 },
  { vehicle: "2021 Nissan X-Trail", state: "NSW", market: 2950, mutual: 2050, saving: 900 },
];

const stats = [
  { icon: Database, label: "Quotes Compared", value: "12,847" },
  { icon: TrendingDown, label: "Avg Annual Saving", value: "$905" },
  { icon: BarChart3, label: "Below Market Rate", value: "94%" },
  { icon: Shield, label: "APRA Cover Included", value: "100%" },
];

export const LiveQuotesSection = () => {
  const [makeFilter, setMakeFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");

  const filtered = mockQuotes.filter((q) => {
    if (stateFilter !== "all" && q.state !== stateFilter) return false;
    if (makeFilter !== "all" && !q.vehicle.toLowerCase().includes(makeFilter)) return false;
    return true;
  });

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-accent text-accent">
            Live Data — Updated Daily
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Live Quotes Database
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real comparisons showing how our pricing stacks up against the market
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <Select value={makeFilter} onValueChange={setMakeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by make" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Makes</SelectItem>
              <SelectItem value="toyota">Toyota</SelectItem>
              <SelectItem value="hyundai">Hyundai</SelectItem>
              <SelectItem value="kia">Kia</SelectItem>
              <SelectItem value="mazda">Mazda</SelectItem>
              <SelectItem value="nissan">Nissan</SelectItem>
            </SelectContent>
          </Select>
          <Select value={stateFilter} onValueChange={setStateFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              <SelectItem value="NSW">NSW</SelectItem>
              <SelectItem value="VIC">VIC</SelectItem>
              <SelectItem value="QLD">QLD</SelectItem>
              <SelectItem value="SA">SA</SelectItem>
              <SelectItem value="WA">WA</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card className="border-2 mb-12 max-w-5xl mx-auto">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Vehicle</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead className="text-right">Market Price</TableHead>
                  <TableHead className="text-right font-bold text-accent">Mutual Price</TableHead>
                  <TableHead className="text-right">Annual Saving</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((q, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{q.vehicle}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">{q.state}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground line-through">${q.market.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-bold text-accent">${q.mutual.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-accent/10 text-accent border-accent/30 hover:bg-accent/20">
                        −${q.saving.toLocaleString()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No matching quotes found. Try adjusting filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center border-2 hover:border-accent/30 transition-colors">
              <CardContent className="p-5">
                <stat.icon className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
