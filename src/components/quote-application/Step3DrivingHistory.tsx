import { QuoteApplicationFormData } from "@/types/quoteApplication";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Props {
  formData: QuoteApplicationFormData;
  updateField: (field: keyof QuoteApplicationFormData, value: string) => void;
}

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
        <div className="space-y-2 animate-in fade-in duration-300">
          <Label>Number of claims</Label>
          <Input type="number" min="1" max="10" value={formData.claims_count} onChange={(e) => updateField("claims_count", e.target.value)} />
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
