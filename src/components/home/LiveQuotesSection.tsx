import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TrendingDown, Database, BarChart3, Shield, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface QuoteRow {
  deal_id: string;
  created_at: string;
  comp_benchmark_price: number | null;
  comp_total_annual: number | null;
  mutual_target_price: number | null;
  vehicle_state: string | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  vehicle_year: string | null;
}

const PAGE_SIZE = 20;

export const LiveQuotesSection = () => {
  const [data, setData] = useState<QuoteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [makeFilter, setMakeFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: quotes, error } = await supabase
        .from("mutual_quotes")
        .select("deal_id, created_at, comp_benchmark_price, comp_total_annual, mutual_target_price, vehicle_state, vehicle_make, vehicle_model, vehicle_year")
        .not("tppd_winning_quote_ref", "is", null)
        .order("created_at", { ascending: false })
        .limit(500);

      if (!error && quotes) {
        setData(quotes as QuoteRow[]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return data.filter((q) => {
      if (stateFilter !== "all" && q.vehicle_state !== stateFilter) return false;
      if (makeFilter !== "all" && q.vehicle_make?.toLowerCase() !== makeFilter) return false;
      return true;
    });
  }, [data, stateFilter, makeFilter]);

  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const makes = useMemo(() => [...new Set(data.map((q) => q.vehicle_make).filter(Boolean))].sort() as string[], [data]);
  const states = useMemo(() => [...new Set(data.map((q) => q.vehicle_state).filter(Boolean))].sort() as string[], [data]);

  const stats = useMemo(() => {
    const withPrices = data.filter((q) => {
      const benchmark = q.comp_benchmark_price ?? q.comp_total_annual;
      return benchmark && q.mutual_target_price;
    });
    const savings = withPrices.map((q) => {
      const benchmark = (q.comp_benchmark_price ?? q.comp_total_annual) as number;
      return benchmark - (q.mutual_target_price as number);
    });
    const avgSaving = savings.length > 0 ? savings.reduce((a, b) => a + b, 0) / savings.length : 0;
    const belowMarket = withPrices.filter((q) => {
      const benchmark = (q.comp_benchmark_price ?? q.comp_total_annual) as number;
      return (q.mutual_target_price as number) < benchmark;
    }).length;
    const belowPct = withPrices.length > 0 ? Math.round((belowMarket / withPrices.length) * 100) : 0;

    return [
      { icon: Database, label: "Quotes Compared", value: data.length.toLocaleString() },
      { icon: TrendingDown, label: "Avg Annual Saving", value: `$${Math.round(avgSaving).toLocaleString()}` },
      { icon: BarChart3, label: "Below Market Rate", value: `${belowPct}%` },
      { icon: Shield, label: "APRA Cover Included", value: "100%" },
    ];
  }, [data]);

  const getBenchmark = (q: QuoteRow) => q.comp_benchmark_price ?? q.comp_total_annual ?? 0;
  const getSaving = (q: QuoteRow) => getBenchmark(q) - (q.mutual_target_price ?? 0);

  return (
    <section id="live-quotes" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-accent text-accent">
            Live Data — Updated Daily
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Live Market Comparisons</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real comparisons showing how The Mutual's pricing stacks up against the market
          </p>
          {stats[2] && (
            <p className="mt-3 text-sm font-semibold text-accent">
              The Mutual beat the market in {stats[2].value} of comparisons
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <Select value={makeFilter} onValueChange={(v) => { setMakeFilter(v); setPage(0); }}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Filter by make" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Makes</SelectItem>
              {makes.map((m) => <SelectItem key={m} value={m.toLowerCase()}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={stateFilter} onValueChange={(v) => { setStateFilter(v); setPage(0); }}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Filter by state" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card className="border-2 mb-8 max-w-6xl mx-auto">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-accent mr-2" />
                <span className="text-muted-foreground">Loading quotes...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Date</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead className="text-right">Market Price</TableHead>
                     <TableHead className="text-right font-bold text-accent">The Mutual's Price</TableHead>
                     <TableHead className="text-right">Annual Saving</TableHead>
                    <TableHead>Ref#</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((q) => (
                    <TableRow key={q.deal_id}>
                      <TableCell className="text-muted-foreground text-sm">
                        {q.created_at ? format(new Date(q.created_at), "dd MMM yyyy") : "—"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {[q.vehicle_year, q.vehicle_make, q.vehicle_model].filter(Boolean).join(" ") || "—"}
                      </TableCell>
                      <TableCell>
                        {q.vehicle_state ? <Badge variant="secondary" className="text-xs">{q.vehicle_state}</Badge> : "—"}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        ${getBenchmark(q).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </TableCell>
                      <TableCell className="text-right font-bold text-accent">
                        ${(q.mutual_target_price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-accent/10 text-accent border-accent/30 hover:bg-accent/20">
                          −${getSaving(q).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs font-mono">
                        {q.deal_id || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {paged.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        {data.length === 0
                          ? "No completed quotes available yet. Data syncs daily."
                          : "No matching quotes found. Try adjusting filters."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mb-12">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <span className="text-sm text-muted-foreground">Page {page + 1} of {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

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
