import { useEffect } from "react";
import { QuoteApplicationFormData } from "@/types/quoteApplication";
import { Label } from "@/components/ui/label";
import { Car, CheckCircle2 } from "lucide-react";

interface Props {
  formData: QuoteApplicationFormData;
  updateField: (field: keyof QuoteApplicationFormData, value: string) => void;
  onAutoAdvance?: () => void;
}

const VEHICLE_USAGE_OPTIONS = [
  "Private",
  "Rideshare",
  "Taxi",
  "Courier Delivery",
  "Rental Usage",
  "Business (Non-Passenger Transport)",
];

export function Step1VehicleUsage({ formData, updateField, onAutoAdvance }: Props) {
  useEffect(() => {
    updateField("vehicle_usage", "Rideshare");
    updateField("is_rideshare", "Yes");
    const timer = setTimeout(() => {
      onAutoAdvance?.();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-muted px-4 py-3 -mx-4 md:-mx-6 border-l-4 border-primary">
        <h2 className="text-xl font-medium">Vehicle Usage</h2>
      </div>

      <div className="space-y-3">
        <Label className="text-base">How is your car used?</Label>
        <div className="grid grid-cols-2 gap-3">
          {VEHICLE_USAGE_OPTIONS.map((opt) => {
            const isRideshare = opt === "Rideshare";
            return (
              <div
                key={opt}
                className={`flex items-center justify-center border-2 rounded-lg p-4 transition-all ${
                  isRideshare
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border bg-muted/20 text-muted-foreground/40 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isRideshare && <CheckCircle2 className="w-4 h-4" />}
                  <Label className={`text-sm ${isRideshare ? "font-medium" : "font-normal"}`}>
                    {opt === "Business (Non-Passenger Transport)" ? "Business (Non-Passenger)" : opt}
                  </Label>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg animate-pulse">
        <Car className="w-5 h-5 text-primary" />
        <p className="text-sm text-primary font-medium">Rideshare selected — advancing to next step...</p>
      </div>
    </div>
  );
}
