import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Search, Car, User, Shield, FileText, CheckCircle, Loader2 } from "lucide-react";
import { format, addYears, parse } from "date-fns";

interface FormData {
  form1: any;
  form2: any;
  form3: any;
}

const RetrieveQuotePage = () => {
  const [quoteNumber, setQuoteNumber] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [binding, setBinding] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [bound, setBound] = useState(false);
  const [membershipNumber, setMembershipNumber] = useState("");

  const handleLookup = async () => {
    if (!quoteNumber.trim() || !dobDay || !dobMonth || !dobYear) {
      toast({ title: "Missing fields", description: "Please enter quote number and date of birth.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setFormData(null);
    setBound(false);

    try {
      // Find form1 by quote_number
      const { data: form1Data, error: form1Error } = await supabase
        .from("form1_submissions")
        .select("*")
        .eq("quote_number", quoteNumber.trim())
        .maybeSingle();

      if (form1Error || !form1Data) {
        toast({ title: "Quote not found", description: "No quote found with that number.", variant: "destructive" });
        setLoading(false);
        return;
      }

      // Find form2 linked to form1
      const { data: form2Data } = await supabase
        .from("form2_submissions")
        .select("*")
        .eq("form1_submission_id", form1Data.id)
        .maybeSingle();

      if (!form2Data) {
        toast({ title: "Incomplete quote", description: "No vehicle/driver details found for this quote.", variant: "destructive" });
        setLoading(false);
        return;
      }

      // Verify DOB
      const enteredDob = `${dobDay.padStart(2, "0")}/${dobMonth.padStart(2, "0")}/${dobYear}`;
      const storedDob = `${form2Data.dob_day?.padStart(2, "0")}/${form2Data.dob_month?.padStart(2, "0")}/${form2Data.dob_year}`;
      
      if (enteredDob !== storedDob) {
        toast({ title: "Verification failed", description: "Date of birth does not match our records.", variant: "destructive" });
        setLoading(false);
        return;
      }

      // Find form3 linked to form2
      const { data: form3Data } = await supabase
        .from("form3_submissions")
        .select("*")
        .eq("form2_submission_id", form2Data.id)
        .maybeSingle();

      // Check if already bound
      const { data: existingMembership } = await supabase
        .from("memberships")
        .select("membership_number")
        .eq("quote_number", quoteNumber.trim())
        .maybeSingle();

      if (existingMembership) {
        setBound(true);
        setMembershipNumber(existingMembership.membership_number);
      }

      setFormData({ form1: form1Data, form2: form2Data, form3: form3Data });
    } catch (err) {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleBind = async () => {
    if (!formData?.form3) {
      toast({ title: "Cannot bind", description: "Form 3 (pricing) data is required to bind membership.", variant: "destructive" });
      return;
    }

    setBinding(true);
    try {
      // Generate membership number via DB function
      const { data: memNumData } = await supabase.rpc("generate_membership_number");
      const memNumber = memNumData || `MCMPOL${format(new Date(), "ddMMyyyy")}10001`;

      // Parse start date from form3
      let startDate = new Date();
      if (formData.form3.policy_start_date) {
        try {
          startDate = new Date(formData.form3.policy_start_date);
          if (isNaN(startDate.getTime())) startDate = new Date();
        } catch { startDate = new Date(); }
      }
      const endDate = addYears(startDate, 1);

      const { data, error } = await supabase
        .from("memberships")
        .insert({
          form1_submission_id: formData.form1.id,
          form2_submission_id: formData.form2.id,
          form3_submission_id: formData.form3.id,
          membership_number: memNumber,
          member_first_name: formData.form2.first_name || formData.form1.first_name || "",
          member_last_name: formData.form2.last_name || formData.form1.last_name || "",
          member_email: formData.form2.email || formData.form1.email,
          member_phone: formData.form2.phone || formData.form1.phone,
          member_address: formData.form2.address,
          member_dob: `${formData.form2.dob_day}/${formData.form2.dob_month}/${formData.form2.dob_year}`,
          quote_number: quoteNumber.trim(),
          deal_id: formData.form1.deal_id,
          vehicle_registration: formData.form2.vehicle_registration,
          vehicle_make: formData.form2.vehicle_make,
          vehicle_model: formData.form2.vehicle_model,
          vehicle_year: formData.form2.vehicle_year,
          vehicle_description: formData.form2.vehicle_description,
          coverage_level: formData.form2.coverage_level,
          base_premium: formData.form3.base_premium,
          total_annual_premium: formData.form3.total_annual_premium,
          total_monthly_premium: formData.form3.total_monthly_premium,
          membership_start_date: startDate.toISOString(),
          membership_end_date: endDate.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setBound(true);
      setMembershipNumber(memNumber);
      toast({ title: "Membership Bound!", description: `Membership ${memNumber} created successfully.` });
    } catch (err: any) {
      toast({ title: "Binding failed", description: err.message || "Could not create membership.", variant: "destructive" });
    } finally {
      setBinding(false);
    }
  };

  const InfoRow = ({ label, value }: { label: string; value: any }) => (
    value ? (
      <div className="flex justify-between py-1.5 border-b border-border/50 last:border-0">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{String(value)}</span>
      </div>
    ) : null
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">Retrieve Quote</h1>
        <p className="text-muted-foreground mb-8">Enter your quote number and date of birth to retrieve your quote details.</p>

        {/* Lookup Form */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="quoteNumber">Quote Number</Label>
                <Input
                  id="quoteNumber"
                  placeholder="e.g. MCM202603108704"
                  value={quoteNumber}
                  onChange={(e) => setQuoteNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <div className="flex gap-2">
                  <Input placeholder="DD" value={dobDay} onChange={(e) => setDobDay(e.target.value)} maxLength={2} className="w-16 text-center" />
                  <Input placeholder="MM" value={dobMonth} onChange={(e) => setDobMonth(e.target.value)} maxLength={2} className="w-16 text-center" />
                  <Input placeholder="YYYY" value={dobYear} onChange={(e) => setDobYear(e.target.value)} maxLength={4} className="flex-1 text-center" />
                </div>
              </div>
            </div>
            <Button onClick={handleLookup} disabled={loading} className="mt-4 w-full md:w-auto">
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Search className="mr-2 h-4 w-4" />}
              Retrieve Quote
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {formData && (
          <div className="space-y-6 animate-in fade-in-50 duration-500">
            {/* Status Banner */}
            {bound && (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
                <div>
                  <p className="font-semibold text-emerald-800 dark:text-emerald-200">Membership Bound</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">Membership Number: <span className="font-mono font-bold">{membershipNumber}</span></p>
                </div>
              </div>
            )}

            {/* Form 1 - Customer & Enquiry */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Customer Details</CardTitle>
                    <CardDescription>Form 1 — Quote Enquiry</CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-auto">{formData.form1.quote_number}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <InfoRow label="Name" value={`${formData.form1.first_name || ""} ${formData.form1.last_name || ""}`} />
                <InfoRow label="Email" value={formData.form1.email} />
                <InfoRow label="Phone" value={formData.form1.phone} />
                <InfoRow label="Insurance Type" value={formData.form1.insurance_type} />
                <InfoRow label="Channel" value={formData.form1.channel} />
                <InfoRow label="Deal ID" value={formData.form1.deal_id} />
                <InfoRow label="Status" value={formData.form1.submission_status} />
                <InfoRow label="Created" value={formData.form1.created_at ? format(new Date(formData.form1.created_at), "dd/MM/yyyy HH:mm") : null} />
              </CardContent>
            </Card>

            {/* Form 2 - Vehicle & Driver */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <Car className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Vehicle & Driver</CardTitle>
                    <CardDescription>Form 2 — Application Details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Vehicle</p>
                <InfoRow label="Registration" value={formData.form2.vehicle_registration} />
                <InfoRow label="State" value={formData.form2.vehicle_state} />
                <InfoRow label="Vehicle" value={`${formData.form2.vehicle_year || ""} ${formData.form2.vehicle_make || ""} ${formData.form2.vehicle_model || ""}`} />
                <InfoRow label="Variant" value={formData.form2.vehicle_variant} />
                <InfoRow label="Body Style" value={formData.form2.vehicle_body_style} />
                <InfoRow label="Transmission" value={formData.form2.vehicle_transmission} />
                <InfoRow label="Usage" value={formData.form2.vehicle_usage} />
                <InfoRow label="KM/Year" value={formData.form2.km_per_year} />

                <Separator className="my-4" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Driver</p>
                <InfoRow label="Name" value={`${formData.form2.first_name || ""} ${formData.form2.last_name || ""}`} />
                <InfoRow label="DOB" value={`${formData.form2.dob_day}/${formData.form2.dob_month}/${formData.form2.dob_year}`} />
                <InfoRow label="Gender" value={formData.form2.gender} />
                <InfoRow label="Address" value={formData.form2.address} />
                <InfoRow label="License Type" value={formData.form2.license_type} />
                <InfoRow label="Demerit Points" value={formData.form2.demerit_points} />
                <InfoRow label="Claims Made" value={formData.form2.claims_made} />
                <InfoRow label="Coverage Level" value={formData.form2.coverage_level} />
                <InfoRow label="Excess Level" value={formData.form2.excess_level} />
              </CardContent>
            </Card>

            {/* Form 3 - Pricing */}
            {formData.form3 && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Pricing & Coverage</CardTitle>
                      <CardDescription>Form 3 — Quote Pricing</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">MCM Membership</p>
                  <InfoRow label="Base Premium" value={formData.form3.base_premium ? `$${Number(formData.form3.base_premium).toFixed(2)}` : null} />
                  <InfoRow label="Stamp Duty" value={formData.form3.stamp_duty ? `$${Number(formData.form3.stamp_duty).toFixed(2)}` : "$0.00"} />
                  <InfoRow label="Fire Levy" value={formData.form3.fire_levy ? `$${Number(formData.form3.fire_levy).toFixed(2)}` : "$0.00"} />
                  <InfoRow label="GST" value={formData.form3.gst ? `$${Number(formData.form3.gst).toFixed(2)}` : "$0.00"} />
                  <InfoRow label="Total Annual" value={formData.form3.total_annual_premium ? `$${Number(formData.form3.total_annual_premium).toFixed(2)}` : null} />
                  <InfoRow label="Total Monthly" value={formData.form3.total_monthly_premium ? `$${Number(formData.form3.total_monthly_premium).toFixed(2)}` : null} />
                  <InfoRow label="Policy Start" value={formData.form3.policy_start_date} />

                  {formData.form3.uw_name && (
                    <>
                      <Separator className="my-4" />
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Underwriter</p>
                      <InfoRow label="Underwriter" value={formData.form3.uw_name} />
                      <InfoRow label="UW Quote #" value={formData.form3.uw_quote_number} />
                      <InfoRow label="UW Base Premium" value={formData.form3.uw_base_premium ? `$${Number(formData.form3.uw_base_premium).toFixed(2)}` : null} />
                      <InfoRow label="UW Stamp Duty" value={formData.form3.uw_stamp_duty ? `$${Number(formData.form3.uw_stamp_duty).toFixed(2)}` : null} />
                      <InfoRow label="UW Fire Levy" value={formData.form3.uw_fire_levy ? `$${Number(formData.form3.uw_fire_levy).toFixed(2)}` : null} />
                      <InfoRow label="UW GST" value={formData.form3.uw_gst ? `$${Number(formData.form3.uw_gst).toFixed(2)}` : null} />
                      <InfoRow label="UW Total" value={formData.form3.uw_total_premium ? `$${Number(formData.form3.uw_total_premium).toFixed(2)}` : null} />
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Bind Button */}
            {!bound && formData.form3 && (
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="pt-6 text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-foreground mb-2">Ready to Bind Membership</h3>
                  <p className="text-muted-foreground mb-4">
                    Create a new Motor Cover Mutual membership for {formData.form2.first_name} {formData.form2.last_name}.
                  </p>
                  <Button onClick={handleBind} disabled={binding} size="lg" className="px-8">
                    {binding ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                    Proceed to Bind Membership
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default RetrieveQuotePage;
