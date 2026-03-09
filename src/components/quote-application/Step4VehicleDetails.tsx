import { QuoteApplicationFormData } from "@/types/quoteApplication";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Props {
  formData: QuoteApplicationFormData;
  updateField: (field: keyof QuoteApplicationFormData, value: string) => void;
}

const STATES = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"];

export function Step4VehicleDetails({ formData, updateField }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-muted px-4 py-3 -mx-4 md:-mx-6 border-l-4 border-primary">
        <h2 className="text-xl font-medium">Vehicle Details</h2>
      </div>

      <div className="space-y-2">
        <Label>Vehicle Registration (Number Plate) <span className="text-destructive">*</span></Label>
        <Input
          placeholder="e.g., ABC123"
          value={formData.vehicle_registration}
          onChange={(e) => updateField("vehicle_registration", e.target.value.toUpperCase())}
          className="uppercase font-mono font-semibold text-lg h-12"
          maxLength={10}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-base">State <span className="text-destructive">*</span></Label>
        <RadioGroup value={formData.vehicle_state} onValueChange={(val) => updateField("vehicle_state", val)}>
          <div className="grid grid-cols-4 gap-3">
            {STATES.map((state) => (
              <div
                key={state}
                className={`flex items-center justify-center border-2 rounded-lg p-3 cursor-pointer transition-all ${
                  formData.vehicle_state === state ? "border-primary bg-primary/10 text-primary font-medium" : "border-border bg-muted/30 hover:bg-muted"
                }`}
                onClick={() => updateField("vehicle_state", state)}
              >
                <RadioGroupItem value={state} className="sr-only" />
                <Label className="cursor-pointer font-medium text-sm">{state}</Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Vehicle Make <span className="text-destructive">*</span></Label>
          <Input placeholder="e.g., Toyota" value={formData.vehicle_make} onChange={(e) => updateField("vehicle_make", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Vehicle Model <span className="text-destructive">*</span></Label>
          <Input placeholder="e.g., Camry" value={formData.vehicle_model} onChange={(e) => updateField("vehicle_model", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Vehicle Year <span className="text-destructive">*</span></Label>
          <Input type="number" placeholder="e.g., 2020" min="1980" max="2026" value={formData.vehicle_year} onChange={(e) => updateField("vehicle_year", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>H Plate?</Label>
          <RadioGroup value={formData.h_plate} onValueChange={(val) => updateField("h_plate", val)}>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {["No", "Yes"].map((opt) => (
                <div
                  key={opt}
                  className={`flex items-center justify-center border-2 rounded-lg p-2.5 cursor-pointer transition-all text-sm ${
                    formData.h_plate === opt ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted/30 hover:bg-muted"
                  }`}
                  onClick={() => updateField("h_plate", opt)}
                >
                  <RadioGroupItem value={opt} className="sr-only" />
                  <Label className="cursor-pointer">{opt}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Vehicle Description</Label>
        <Input placeholder="e.g., 2020 Toyota Camry Ascent" value={formData.vehicle_description} onChange={(e) => updateField("vehicle_description", e.target.value)} />
      </div>
    </div>
  );
}
