import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search, X } from "lucide-react";

const AUTO_REFRESH_MS = 10000;

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-AU", { dateStyle: "short", timeStyle: "short" });
}

function truncId(id: string | null) {
  if (!id) return "—";
  return id.slice(0, 8) + "…";
}

const AdminSubmissions = () => {
  const [form1, setForm1] = useState<any[]>([]);
  const [form2, setForm2] = useState<any[]>([]);
  const [form3, setForm3] = useState<any[]>([]);
  const [form4, setForm4] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [searchInput, setSearchInput] = useState("");
  const [activeDealId, setActiveDealId] = useState("");

  const fetchAll = useCallback(async () => {
    const filter = activeDealId.trim();

    let q1 = supabase.from("form1_submissions").select("*").order("created_at", { ascending: false }).limit(100);
    let q2 = supabase.from("form2_submissions").select("*").order("created_at", { ascending: false }).limit(100);
    let q3 = supabase.from("form3_submissions").select("*").order("created_at", { ascending: false }).limit(100);
    let q4 = supabase.from("form4_submissions").select("*").order("created_at", { ascending: false }).limit(100);

    if (filter) {
      q1 = q1.ilike("deal_id", `%${filter}%`);
      q2 = q2.ilike("deal_id", `%${filter}%`);
      q3 = q3.ilike("deal_id", `%${filter}%`);
      q4 = q4.ilike("deal_id", `%${filter}%`);
    }

    const [r1, r2, r3, r4] = await Promise.all([q1, q2, q3, q4]);
    if (r1.data) setForm1(r1.data);
    if (r2.data) setForm2(r2.data);
    if (r3.data) setForm3(r3.data);
    if (r4.data) setForm4(r4.data);
    setLoading(false);
    setLastRefresh(new Date());
  }, [activeDealId]);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const handleSearch = () => {
    setActiveDealId(searchInput);
  };

  const handleClear = () => {
    setSearchInput("");
    setActiveDealId("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-1">Submissions Viewer</h1>
              <p className="text-muted-foreground text-sm">
                Auto-refreshes every 10s · Last: {lastRefresh.toLocaleTimeString("en-AU")}
              </p>
            </div>
            <RefreshCw
              className={`h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground transition ${loading ? "animate-spin" : ""}`}
              onClick={fetchAll}
            />
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Deal ID…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-9"
              />
            </div>
            <Button size="sm" onClick={handleSearch}>Search</Button>
            {activeDealId && (
              <Button size="sm" variant="ghost" onClick={handleClear}>
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
            )}
          </div>

          {activeDealId && (
            <div className="mb-4">
              <Badge variant="secondary" className="text-sm">
                Filtered: Deal ID contains "{activeDealId}"
              </Badge>
            </div>
          )}

          <Tabs defaultValue="form1">
            <TabsList className="mb-4">
              <TabsTrigger value="form1">
                Form 1 <Badge variant="secondary" className="ml-2">{form1.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="form2">
                Form 2 <Badge variant="secondary" className="ml-2">{form2.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="form3">
                Form 3 <Badge variant="secondary" className="ml-2">{form3.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="form4">
                Form 4 <Badge variant="secondary" className="ml-2">{form4.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="form1">
              <Card>
                <CardHeader><CardTitle>Form 1 — Initial Enquiry</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Deal ID</TableHead>
                        <TableHead>Quote #</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Channel</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {form1.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-mono text-xs">{truncId(r.id)}</TableCell>
                          <TableCell>{r.deal_id || "—"}</TableCell>
                          <TableCell className="font-mono">{r.quote_number || "—"}</TableCell>
                          <TableCell>{[r.first_name, r.last_name].filter(Boolean).join(" ") || "—"}</TableCell>
                          <TableCell>{r.email || "—"}</TableCell>
                          <TableCell>{r.insurance_type || "—"}</TableCell>
                          <TableCell>{r.channel || "—"}</TableCell>
                          <TableCell><Badge variant="outline">{r.submission_status || "—"}</Badge></TableCell>
                          <TableCell className="text-xs">{formatDate(r.created_at)}</TableCell>
                        </TableRow>
                      ))}
                      {form1.length === 0 && (
                        <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No records</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="form2">
              <Card>
                <CardHeader><CardTitle>Form 2 — Application Details</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Deal ID</TableHead>
                        <TableHead>Form 1 ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Rego</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {form2.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-mono text-xs">{truncId(r.id)}</TableCell>
                          <TableCell>{r.deal_id || "—"}</TableCell>
                          <TableCell className="font-mono text-xs">{truncId(r.form1_submission_id)}</TableCell>
                          <TableCell>{[r.first_name, r.last_name].filter(Boolean).join(" ") || "—"}</TableCell>
                          <TableCell className="font-mono">{r.vehicle_registration || "—"}</TableCell>
                          <TableCell>{[r.vehicle_make, r.vehicle_model].filter(Boolean).join(" ") || "—"}</TableCell>
                          <TableCell>{r.vehicle_year || "—"}</TableCell>
                          <TableCell><Badge variant="outline">{r.submission_status || "—"}</Badge></TableCell>
                          <TableCell className="text-xs">{formatDate(r.created_at)}</TableCell>
                        </TableRow>
                      ))}
                      {form2.length === 0 && (
                        <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No records</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="form3">
              <Card>
                <CardHeader><CardTitle>Form 3 — Quote / Pricing</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Deal ID</TableHead>
                        <TableHead>Form 2 ID</TableHead>
                        <TableHead>Base Premium</TableHead>
                        <TableHead>Total Annual</TableHead>
                        <TableHead>UW Name</TableHead>
                        <TableHead>UW Quote #</TableHead>
                        <TableHead>UW Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {form3.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-mono text-xs">{truncId(r.id)}</TableCell>
                          <TableCell>{r.deal_id || "—"}</TableCell>
                          <TableCell className="font-mono text-xs">{truncId(r.form2_submission_id)}</TableCell>
                          <TableCell>${Number(r.base_premium || 0).toFixed(2)}</TableCell>
                          <TableCell>${Number(r.total_annual_premium || 0).toFixed(2)}</TableCell>
                          <TableCell>{r.uw_name || "—"}</TableCell>
                          <TableCell className="font-mono">{r.uw_quote_number || "—"}</TableCell>
                          <TableCell>${Number(r.uw_total_premium || 0).toFixed(2)}</TableCell>
                          <TableCell><Badge variant="outline">{r.submission_status || "—"}</Badge></TableCell>
                          <TableCell className="text-xs">{formatDate(r.created_at)}</TableCell>
                        </TableRow>
                      ))}
                      {form3.length === 0 && (
                        <TableRow><TableCell colSpan={10} className="text-center text-muted-foreground py-8">No records</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="form4">
              <Card>
                <CardHeader><CardTitle>Form 4 — Confirmation</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Deal ID</TableHead>
                        <TableHead>Form 3 ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Rego</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Choice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {form4.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-mono text-xs">{truncId(r.id)}</TableCell>
                          <TableCell>{r.deal_id || "—"}</TableCell>
                          <TableCell className="font-mono text-xs">{truncId(r.form3_submission_id)}</TableCell>
                          <TableCell>{[r.customer_first_name, r.customer_last_name].filter(Boolean).join(" ") || "—"}</TableCell>
                          <TableCell className="font-mono">{r.vehicle_rego || "—"}</TableCell>
                          <TableCell>{r.payment_method || "—"}</TableCell>
                          <TableCell>{r.confirmation_choice || "—"}</TableCell>
                          <TableCell><Badge variant="outline">{r.submission_status || "—"}</Badge></TableCell>
                          <TableCell className="text-xs">{formatDate(r.created_at)}</TableCell>
                        </TableRow>
                      ))}
                      {form4.length === 0 && (
                        <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No records</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminSubmissions;
