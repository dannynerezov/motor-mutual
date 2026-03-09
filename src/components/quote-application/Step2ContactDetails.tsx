import { QuoteApplicationFormData } from "@/types/quoteApplication";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

      <div className="space-y-2">
        <Label>Your Gender <span className="text-destructive">*</span></Label>
        <Select value={formData.gender} onValueChange={(val) => updateField("gender", val)}>
          <SelectTrigger><SelectValue placeholder="Please Select" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Date of Birth <span className="text-destructive">*</span></Label>
        <div className="flex gap-2 items-center">
          <Input placeholder="DD" type="number" min="1" max="31" value={formData.dob_day} onChange={(e) => updateField("dob_day", e.target.value)} className="w-16" />
          <span className="text-muted-foreground">-</span>
          <Input placeholder="MM" type="number" min="1" max="12" value={formData.dob_month} onChange={(e) => updateField("dob_month", e.target.value)} className="w-16" />
          <span className="text-muted-foreground">-</span>
          <Input placeholder="YYYY" type="number" min="1900" max="2008" value={formData.dob_year} onChange={(e) => updateField("dob_year", e.target.value)} className="w-24" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Address <span className="text-destructive">*</span></Label>
        <Input placeholder="Start typing your address..." value={formData.address} onChange={(e) => updateField("address", e.target.value)} />
      </div>

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

      <div className="space-y-2">
        <Label>Housing Status</Label>
        <Select value={formData.housing_status} onValueChange={(val) => updateField("housing_status", val)}>
          <SelectTrigger><SelectValue placeholder="Please Select" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Own">Own</SelectItem>
            <SelectItem value="Rent">Rent</SelectItem>
            <SelectItem value="Live with others">Live with others</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
