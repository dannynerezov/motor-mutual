import { QuoteApplicationFormData } from "@/types/quoteApplication";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Props {
  formData: QuoteApplicationFormData;
  updateField: (field: keyof QuoteApplicationFormData, value: string) => void;
}

function RadioGrid({ label, field, options, formData, updateField, cols = "grid-cols-2" }: {
  label: string; field: keyof QuoteApplicationFormData; options: string[]; formData: QuoteApplicationFormData; updateField: Props["updateField"]; cols?: string;
}) {
  return (
    <div className="space-y-3">
      <Label className="text-base">{label}</Label>
      <RadioGroup value={formData[field]} onValueChange={(val) => updateField(field, val)}>
        <div className={`grid ${cols} gap-3`}>
          {options.map((opt) => (
            <div
              key={opt}
              className={`flex items-center justify-center border-2 rounded-lg p-4 cursor-pointer transition-all ${
                formData[field] === opt ? "border-primary bg-primary/10 text-primary font-medium" : "border-border bg-muted/30 hover:bg-muted"
              }`}
              onClick={() => updateField(field, opt)}
            >
              <RadioGroupItem value={opt} className="sr-only" />
              <Label className="cursor-pointer w-full text-center font-normal text-sm">{opt}</Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}

export function Step5VehicleUsageDetails({ formData, updateField }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-muted px-4 py-3 -mx-4 md:-mx-6 border-l-4 border-primary">
        <h2 className="text-xl font-medium">Vehicle Usage Details</h2>
      </div>

      <RadioGrid label="Exclude drivers under 25?" field="exclude_under_25" options={["No", "Yes"]} formData={formData} updateField={updateField} />
      <RadioGrid label="Is the car used for ridesharing, car sharing or delivery?" field="rideshare_delivery" options={["No", "Yes"]} formData={formData} updateField={updateField} />
      <RadioGrid label="Is the car currently undamaged, roadworthy and registered?" field="undamaged_roadworthy" options={["No", "Yes"]} formData={formData} updateField={updateField} />
      <RadioGrid label="Days per week used for work or study?" field="days_per_week_work" options={["0 Days", "1-2 Days", "3-4 Days", "5+ Days"]} formData={formData} updateField={updateField} cols="grid-cols-4" />
      <RadioGrid label="Approximate kilometres driven each year?" field="km_per_year" options={["0 - 5000kms", "5000 - 10000kms", "10000 - 15000kms", "15000+ kms"]} formData={formData} updateField={updateField} />
      <RadioGrid label="Driven 3+ weekdays during peak times?" field="peak_times" options={["No", "Yes"]} formData={formData} updateField={updateField} />
      <RadioGrid label="Where is the vehicle usually parked overnight?" field="parking_location" options={["Garage", "Carport", "Driveway", "Street"]} formData={formData} updateField={updateField} cols="grid-cols-4" />
    </div>
  );
}
