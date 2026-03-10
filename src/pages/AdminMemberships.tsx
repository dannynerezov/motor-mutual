import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Award, Download, Eye, RefreshCw } from "lucide-react";
import fullLogo from "@/assets/mcm-logo-new-large-stylised.webp";

const AdminMemberships = () => {
  const [memberships, setMemberships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMembership, setSelectedMembership] = useState<any>(null);

  const fetchMemberships = async () => {
    const { data } = await supabase
      .from("memberships")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    setMemberships(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMemberships();
    const interval = setInterval(fetchMemberships, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Memberships</h1>
            <p className="text-muted-foreground">Manage bound memberships and generate certificates</p>
          </div>
          <Button variant="outline" onClick={fetchMemberships}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" /> All Memberships
              <Badge variant="secondary" className="ml-2">{memberships.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground py-8 text-center">Loading...</p>
            ) : memberships.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No memberships yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Membership #</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Premium</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Certificate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memberships.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-mono text-xs">{m.membership_number}</TableCell>
                      <TableCell>{m.member_first_name} {m.member_last_name}</TableCell>
                      <TableCell>{m.vehicle_year} {m.vehicle_make} {m.vehicle_model}</TableCell>
                      <TableCell>{m.base_premium ? `$${Number(m.base_premium).toFixed(2)}` : "—"}</TableCell>
                      <TableCell className="text-xs">
                        {m.membership_start_date ? format(new Date(m.membership_start_date), "dd/MM/yyyy") : "—"} →{" "}
                        {m.membership_end_date ? format(new Date(m.membership_end_date), "dd/MM/yyyy") : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={m.status === "active" ? "default" : "secondary"}>{m.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedMembership(m)}>
                              <Eye className="mr-1 h-3 w-3" /> View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
                            <MembershipCertificate membership={m} />
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

const MembershipCertificate = ({ membership }: { membership: any }) => {
  const certRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContents = certRef.current?.innerHTML;
    if (!printContents) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <html>
        <head>
          <title>MCM Membership Certificate</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; }
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          </style>
        </head>
        <body onload="window.print(); window.close();">${printContents}</body>
      </html>
    `);
    w.document.close();
  };

  const startDate = membership.membership_start_date ? format(new Date(membership.membership_start_date), "do MMMM yyyy") : "—";
  const endDate = membership.membership_end_date ? format(new Date(membership.membership_end_date), "do MMMM yyyy") : "—";

  return (
    <div>
      <div ref={certRef}>
        <div style={{
          background: "linear-gradient(135deg, hsl(210, 58%, 15%) 0%, hsl(210, 48%, 25%) 40%, hsl(210, 38%, 32%) 100%)",
          padding: "48px 40px",
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Inter', sans-serif",
        }}>
          {/* Decorative elements */}
          <div style={{
            position: "absolute", top: 0, right: 0, width: "300px", height: "300px",
            background: "radial-gradient(circle, hsla(16, 85%, 55%, 0.15) 0%, transparent 70%)",
            borderRadius: "50%", transform: "translate(100px, -100px)"
          }} />
          <div style={{
            position: "absolute", bottom: 0, left: 0, width: "200px", height: "200px",
            background: "radial-gradient(circle, hsla(210, 58%, 50%, 0.1) 0%, transparent 70%)",
            borderRadius: "50%", transform: "translate(-60px, 60px)"
          }} />

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "36px", position: "relative", zIndex: 1 }}>
            <img src={fullLogo} alt="Motor Cover Mutual" style={{ height: "56px", margin: "0 auto 16px" }} />
            <div style={{
              fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 700,
              color: "hsl(0, 0%, 95%)", letterSpacing: "3px", textTransform: "uppercase"
            }}>
              Certificate of Membership
            </div>
            <div style={{
              width: "80px", height: "3px", margin: "12px auto 0",
              background: "linear-gradient(90deg, transparent, hsl(16, 85%, 55%), transparent)"
            }} />
          </div>

          {/* Membership Number */}
          <div style={{
            textAlign: "center", marginBottom: "32px", position: "relative", zIndex: 1
          }}>
            <div style={{ fontSize: "11px", color: "hsl(210, 20%, 65%)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>
              Membership Number
            </div>
            <div style={{
              fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 600,
              color: "hsl(16, 85%, 55%)", letterSpacing: "2px"
            }}>
              {membership.membership_number}
            </div>
          </div>

          {/* Member Info */}
          <div style={{
            background: "hsla(0, 0%, 100%, 0.06)", borderRadius: "12px",
            padding: "24px 32px", marginBottom: "24px", position: "relative", zIndex: 1,
            border: "1px solid hsla(0, 0%, 100%, 0.08)"
          }}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", color: "hsl(210, 20%, 65%)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>
                This certifies that
              </div>
              <div style={{
                fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 700,
                color: "hsl(0, 0%, 98%)"
              }}>
                {membership.member_first_name} {membership.member_last_name}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <CertField label="Vehicle" value={`${membership.vehicle_year || ""} ${membership.vehicle_make || ""} ${membership.vehicle_model || ""}`} />
              <CertField label="Registration" value={membership.vehicle_registration} />
              <CertField label="Membership Start" value={startDate} />
              <CertField label="Membership End" value={endDate} />
              <CertField label="Annual Premium" value={membership.base_premium ? `$${Number(membership.base_premium).toFixed(2)}` : "—"} />
              <CertField label="Quote Reference" value={membership.quote_number} />
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: "11px", color: "hsl(210, 20%, 60%)", lineHeight: "1.6" }}>
              Motor Cover Mutual — Fair. Transparent. Reliable.<br />
              This certificate confirms active membership and coverage as per the Product Disclosure Statement.
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 24px", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <Button variant="outline" onClick={handlePrint}>
          <Download className="mr-2 h-4 w-4" /> Print / Save PDF
        </Button>
      </div>
    </div>
  );
};

const CertField = ({ label, value }: { label: string; value: string | null }) => (
  <div>
    <div style={{ fontSize: "10px", color: "hsl(210, 20%, 60%)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "2px" }}>
      {label}
    </div>
    <div style={{ fontSize: "14px", color: "hsl(0, 0%, 92%)", fontWeight: 500 }}>
      {value || "—"}
    </div>
  </div>
);

export default AdminMemberships;
