import { QuoteApplicationFormData } from "@/types/quoteApplication";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressAutosuggest } from "@/components/AddressAutosuggest";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  formData: QuoteApplicationFormData;
  updateField: (field: keyof QuoteApplicationFormData, value: string) => void;
}

export function Step2ContactDetails({ formData, updateField }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-muted px-4 py-3 -mx-4 md:-mx-6 border-l-4 border-primary">
        <h2 className="text-xl font-medium">Contact Details</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Your Name <span className="text-destructive">*</span></Label>
          <Input placeholder="First Name" value={formData.first_name} onChange={(e) => updateField("first_name", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label className="opacity-0">Last</Label>
          <Input placeholder="Last Name" value={formData.last_name} onChange={(e) => updateField("last_name", e.target.value)} />
        </div>
      </div>

      {/* Gender + DOB on same row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Your Gender <span className="text-destructive">*</span></Label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => updateField("gender", "Male")}
              className={`flex-1 flex items-center justify-center gap-2 border-2 rounded-lg p-3 transition-all ${
                formData.gender === "Male"
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border bg-muted/30 hover:bg-muted text-foreground"
              }`}
            >
              <span className="text-xl">♂</span>
              <span className="text-sm font-medium">Male</span>
            </button>
            <button
              type="button"
              onClick={() => updateField("gender", "Female")}
              className={`flex-1 flex items-center justify-center gap-2 border-2 rounded-lg p-3 transition-all ${
                formData.gender === "Female"
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border bg-muted/30 hover:bg-muted text-foreground"
              }`}
            >
              <span className="text-xl">♀</span>
              <span className="text-sm font-medium">Female</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Date of Birth <span className="text-destructive">*</span></Label>
          <div className="flex gap-2 items-center">
            <Input placeholder="DD" type="number" min="1" max="31" value={formData.dob_day} onChange={(e) => updateField("dob_day", e.target.value)} className="w-16 text-center" />
            <span className="text-muted-foreground">/</span>
            <Input placeholder="MM" type="number" min="1" max="12" value={formData.dob_month} onChange={(e) => updateField("dob_month", e.target.value)} className="w-16 text-center" />
            <span className="text-muted-foreground">/</span>
            <Input placeholder="YYYY" type="number" min="1900" max="2008" value={formData.dob_year} onChange={(e) => updateField("dob_year", e.target.value)} className="w-24 text-center" />
          </div>
        </div>
      </div>

      {/* Address with Suncorp autosuggest */}
      <AddressAutosuggest
        onAddressSelect={(addr) => {
          const fullAddress = `${addr.addressLine1}, ${addr.suburb}, ${addr.state} ${addr.postcode}`;
          updateField("address", fullAddress);
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Contact Number <span className="text-destructive">*</span></Label>
          <Input type="tel" placeholder="04## ### ###" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Email Address <span className="text-destructive">*</span></Label>
          <Input type="email" placeholder="example@example.com" value={formData.email} onChange={(e) => updateField("email", e.target.value)} />
        </div>
      </div>
    </div>
  );
}
