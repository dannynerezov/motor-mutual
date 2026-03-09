import { QuoteApplicationFormData } from "@/types/quoteApplication";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Props {
  formData: QuoteApplicationFormData;
  updateField: (field: keyof QuoteApplicationFormData, value: string) => void;
}

const VEHICLE_USAGE_OPTIONS = [
  "Private",
  "Rideshare",
  "Taxi",
  "Courier Delivery",
  "Rental Usage",
  "Business (Non-Passenger Transport)",
];

const BUSINESS_USAGE_OPTIONS = [
  "On road professional", "Salesperson", "Tradesperson", "Courier",
  "Delivery driver", "Driver education", "Hire", "Courtesy",
  "Car Sharing", "Taxi", "Racing / Sporting events", "Removalist",
];

function RadioOption({ value, selected, onClick, label }: { value: string; selected: boolean; onClick: () => void; label?: string }) {
  return (
    <div
      className={`flex items-center justify-center border-2 rounded-lg p-4 cursor-pointer transition-all ${
        selected ? "border-primary bg-primary/10 text-primary font-medium" : "border-border bg-muted/30 hover:bg-muted"
      }`}
      onClick={onClick}
    >
      <RadioGroupItem value={value} id={`usage-${value}`} className="sr-only" />
      <Label htmlFor={`usage-${value}`} className="cursor-pointer w-full text-center font-normal text-sm">
        {label || value}
      </Label>
    </div>
  );
}

export function Step1VehicleUsage({ formData, updateField }: Props) {
  const showDelivery = formData.vehicle_usage === "Courier Delivery";
  const showRideshare = formData.vehicle_usage === "Rideshare";
  const showBusiness = formData.vehicle_usage === "Business (Non-Passenger Transport)";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-muted px-4 py-3 -mx-4 md:-mx-6 border-l-4 border-primary">
        <h2 className="text-xl font-medium">Vehicle Usage</h2>
      </div>

      <div className="space-y-3">
        <Label className="text-base">How is your car used? <span className="text-destructive">*</span></Label>
        <RadioGroup value={formData.vehicle_usage} onValueChange={(val) => updateField("vehicle_usage", val)}>
          <div className="grid grid-cols-2 gap-3">
            {VEHICLE_USAGE_OPTIONS.map((opt) => (
              <RadioOption
                key={opt}
                value={opt}
                selected={formData.vehicle_usage === opt}
                onClick={() => updateField("vehicle_usage", opt)}
                label={opt === "Business (Non-Passenger Transport)" ? "Business (Non-Passenger)" : opt}
              />
            ))}
          </div>
        </RadioGroup>
      </div>

      {showBusiness && (
        <div className="space-y-3 animate-in fade-in duration-300">
          <Label className="text-base">Primary business use? <span className="text-destructive">*</span></Label>
          <RadioGroup value={formData.business_usage_type} onValueChange={(val) => updateField("business_usage_type", val)}>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {BUSINESS_USAGE_OPTIONS.map((opt) => (
                <RadioOption key={opt} value={opt} selected={formData.business_usage_type === opt} onClick={() => updateField("business_usage_type", opt)} />
              ))}
            </div>
          </RadioGroup>
        </div>
      )}

      {(showDelivery || showRideshare) && (
        <div className="space-y-3 animate-in fade-in duration-300">
          <Label className="text-base">Is the vehicle being used for food delivery? <span className="text-destructive">*</span></Label>
          <RadioGroup value={formData.is_delivery} onValueChange={(val) => updateField("is_delivery", val)}>
            <div className="grid grid-cols-2 gap-3">
              {["No", "Yes"].map((opt) => (
                <RadioOption key={opt} value={opt} selected={formData.is_delivery === opt} onClick={() => updateField("is_delivery", opt)} />
              ))}
            </div>
          </RadioGroup>
        </div>
      )}

      {showRideshare && (
        <div className="space-y-3 animate-in fade-in duration-300">
          <Label className="text-base">Is the vehicle being rented out to anyone? <span className="text-destructive">*</span></Label>
          <RadioGroup value={formData.is_rented} onValueChange={(val) => updateField("is_rented", val)}>
            <div className="grid grid-cols-2 gap-3">
              {["No", "Yes"].map((opt) => (
                <RadioOption key={opt} value={opt} selected={formData.is_rented === opt} onClick={() => updateField("is_rented", opt)} />
              ))}
            </div>
          </RadioGroup>
        </div>
      )}

      {showDelivery && (
        <div className="space-y-3 animate-in fade-in duration-300">
          <Label className="text-base">Is your vehicle refrigerated? <span className="text-destructive">*</span></Label>
          <RadioGroup value={formData.is_refrigerated} onValueChange={(val) => updateField("is_refrigerated", val)}>
            <div className="grid grid-cols-2 gap-3">
              {["No", "Yes"].map((opt) => (
                <RadioOption key={opt} value={opt} selected={formData.is_refrigerated === opt} onClick={() => updateField("is_refrigerated", opt)} />
              ))}
            </div>
          </RadioGroup>
        </div>
      )}

      {((showDelivery && formData.is_delivery === "Yes") || (showRideshare && formData.is_delivery === "Yes")) && (
        <div className="space-y-3 animate-in fade-in duration-300">
          <Label className="text-base">How many hours per week do you deliver food? <span className="text-destructive">*</span></Label>
          <RadioGroup value={formData.food_delivery_hours} onValueChange={(val) => updateField("food_delivery_hours", val)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["Less than 10hrs per week", "More than 10hrs per week"].map((opt) => (
                <RadioOption key={opt} value={opt} selected={formData.food_delivery_hours === opt} onClick={() => updateField("food_delivery_hours", opt)} />
              ))}
            </div>
          </RadioGroup>
        </div>
      )}
    </div>
  );
}
