import { useState, useEffect } from "react";
import { QuoteApplicationFormData } from "@/types/quoteApplication";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  formData: QuoteApplicationFormData;
  updateField: (field: keyof QuoteApplicationFormData, value: string) => void;
}

interface Claim {
  type: string;
  month: string;
  year: string;
}

const CLAIM_TYPES = [
  "At fault with excess",
  "Other excess claim",
  "No excess claim",
  "Windscreen",
  "Natural hazard",
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function YesNo({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-3">
      <Label className="text-base">{label} <span className="text-destructive">*</span></Label>
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="grid grid-cols-2 gap-3">
          {["No", "Yes"].map((opt) => (
            <div
              key={opt}
              className={`flex items-center justify-center border-2 rounded-lg p-4 cursor-pointer transition-all ${
                value === opt ? "border-primary bg-primary/10 text-primary font-medium" : "border-border bg-muted/30 hover:bg-muted"
              }`}
              onClick={() => onChange(opt)}
            >
              <RadioGroupItem value={opt} className="sr-only" />
              <Label className="cursor-pointer w-full text-center font-normal">{opt}</Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}

export function Step3DrivingHistory({ formData, updateField }: Props) {
  const showIntlDetails = formData.international_license === "Yes";

  const [claims, setClaims] = useState<Claim[]>(() => {
    try {
      const parsed = JSON.parse(formData.claims_list || "[]");
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [];
    } catch { return []; }
  });

  useEffect(() => {
    updateField("claims_list", JSON.stringify(claims));
    updateField("claims_count", String(claims.length));
  }, [claims]);

  useEffect(() => {
    if (formData.claims_made === "Yes" && claims.length === 0) {
      setClaims([{ type: "", month: "", year: "" }]);
    }
    if (formData.claims_made === "No") {
      setClaims([]);
    }
  }, [formData.claims_made]);

  const addClaim = () => {
    if (claims.length >= 3) {
      toast.error("Maximum of 3 claims allowed");
      return;
    }
    setClaims([...claims, { type: "", month: "", year: "" }]);
  };

  const removeClaim = (index: number) => {
    setClaims(claims.filter((_, i) => i !== index));
  };

  const updateClaim = (index: number, field: keyof Claim, value: string) => {
    const updated = [...claims];
    updated[index] = { ...updated[index], [field]: value };
    setClaims(updated);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => String(currentYear - i));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-muted px-4 py-3 -mx-4 md:-mx-6 border-l-4 border-primary">
        <h2 className="text-xl font-medium">Driving History</h2>
      </div>

      <YesNo label="Will any driver operate holding ONLY an International Driver's Licence?" value={formData.international_license} onChange={(v) => updateField("international_license", v)} />

      {showIntlDetails && (
        <>
          <YesNo label="Does the vehicle's owner drive their car?" value={formData.owner_drives} onChange={(v) => updateField("owner_drives", v)} />
          <div className="space-y-2 animate-in fade-in duration-300">
            <Label>Years holding International Licence? <span className="text-destructive">*</span></Label>
            <Input type="number" placeholder="Years" min="0" value={formData.international_years} onChange={(e) => updateField("international_years", e.target.value)} />
          </div>
        </>
      )}

      <YesNo label="Any demerit points in the last three years?" value={formData.demerit_points} onChange={(v) => updateField("demerit_points", v)} />

      <div className="space-y-3">
        <Label className="text-base">Main driver's current licence type? <span className="text-destructive">*</span></Label>
        <RadioGroup value={formData.license_type} onValueChange={(val) => updateField("license_type", val)}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {["Full", "P1", "P2", "Learner"].map((opt) => (
              <div
                key={opt}
                className={`flex items-center justify-center border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  formData.license_type === opt ? "border-primary bg-primary/10 text-primary font-medium" : "border-border bg-muted/30 hover:bg-muted"
                }`}
                onClick={() => updateField("license_type", opt)}
              >
                <RadioGroupItem value={opt} className="sr-only" />
                <Label className="cursor-pointer w-full text-center font-normal">{opt}</Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      <YesNo label="Any car insurance claims in the last 5 years?" value={formData.claims_made} onChange={(v) => updateField("claims_made", v)} />

      {formData.claims_made === "Yes" && (
        <div className="space-y-4 animate-in fade-in duration-300 border border-border rounded-lg p-4 bg-muted/20">
          <Label className="text-base font-semibold">Claims Details (max 3)</Label>
          {claims.map((claim, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-end p-3 bg-card border border-border rounded-lg">
              <div className="flex-1 space-y-1 w-full">
                <Label className="text-xs text-muted-foreground">Claim Type</Label>
                <Select value={claim.type} onValueChange={(v) => updateClaim(index, "type", v)}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {CLAIM_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Month</Label>
                <Select value={claim.month} onValueChange={(v) => updateClaim(index, "month", v)}>
                  <SelectTrigger className="w-20"><SelectValue placeholder="Mon" /></SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Year</Label>
                <Select value={claim.year} onValueChange={(v) => updateClaim(index, "year", v)}>
                  <SelectTrigger className="w-24"><SelectValue placeholder="Year" /></SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeClaim(index)} className="text-destructive hover:text-destructive shrink-0">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {claims.length < 3 && (
            <Button variant="outline" size="sm" onClick={addClaim} className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add Another Claim
            </Button>
          )}
        </div>
      )}

      <YesNo label="Have you or any driver been declared bankrupt or insolvent?" value={formData.bankruptcy} onChange={(v) => updateField("bankruptcy", v)} />
      <YesNo label="Has your licence been suspended or cancelled in the last 5 years?" value={formData.license_suspended} onChange={(v) => updateField("license_suspended", v)} />
      <YesNo label="Any criminal offences or pending charges?" value={formData.criminal_offences} onChange={(v) => updateField("criminal_offences", v)} />
      <YesNo label="Has any insurance been declined, cancelled or had special conditions imposed?" value={formData.insurance_declined} onChange={(v) => updateField("insurance_declined", v)} />
      <YesNo label="Has any claim been denied due to fraud?" value={formData.claim_denied_fraud} onChange={(v) => updateField("claim_denied_fraud", v)} />
    </div>
  );
}
