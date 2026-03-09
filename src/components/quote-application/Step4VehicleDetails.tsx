import { useState } from "react";
import { QuoteApplicationFormData } from "@/types/quoteApplication";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { Search, Car, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Props {
  formData: QuoteApplicationFormData;
  updateField: (field: keyof QuoteApplicationFormData, value: string) => void;
}

const STATES = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"];

interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  variant?: string;
  bodyStyle?: string;
  transmission?: string;
  series?: string;
  nvic?: string;
  imageUrl?: string;
  desc1?: string;
  desc2?: string;
  marketValue?: number;
  tradeValue?: number;
  retailValue?: number;
}

const FUN_FACTS: Record<string, string[]> = {
  Toyota: ["🏆 Toyota is the world's largest automaker by volume", "🔧 Known for legendary reliability & resale value"],
  Hyundai: ["🇰🇷 Hyundai means 'modernity' in Korean", "📈 Fastest growing car brand in Australia"],
  Kia: ["🎨 Kia's design chief was poached from Audi", "⚡ Major investment in electric vehicles"],
  BMW: ["🏎️ BMW stands for Bayerische Motoren Werke", "🔵 The logo represents a spinning propeller"],
  Mercedes: ["⭐ The three-pointed star represents land, sea & air", "🏁 Invented the first automobile in 1886"],
  Mazda: ["🔴 Named after Ahura Mazda, the Zoroastrian god of wisdom", "🔄 Pioneers of the rotary engine"],
  Nissan: ["🗾 Nissan means 'born of the sun'", "🚗 The GT-R is nicknamed 'Godzilla'"],
  Ford: ["🇺🇸 Henry Ford popularised the assembly line", "🐎 The Mustang is the best-selling sports car ever"],
  Suzuki: ["🏍️ Started as a loom manufacturer in 1909", "🌏 The Swift is one of the world's best-selling cars"],
  default: ["🚗 Every car has a unique story", "🔑 Your vehicle is about to get great coverage"],
};

function getFactsForMake(make: string): string[] {
  const key = Object.keys(FUN_FACTS).find(k => make.toLowerCase().includes(k.toLowerCase()));
  return FUN_FACTS[key || "default"];
}

export function Step4VehicleDetails({ formData, updateField }: Props) {
  const [isLooking, setIsLooking] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);

  const handleLookup = async () => {
    if (!formData.vehicle_registration || !formData.vehicle_state) {
      toast.error("Please enter registration and select state first");
      return;
    }

    setIsLooking(true);
    setLookupError(null);
    setVehicleInfo(null);

    try {
      const { data, error } = await supabase.functions.invoke("suncorp-proxy", {
        body: {
          action: "vehicleLookup",
          registrationNumber: formData.vehicle_registration,
          state: formData.vehicle_state,
        },
      });

      if (error) throw error;

      if (data?.success && data.data) {
        const v = data.data;
        const vehicles = v.vehicles || v.vehicleList || [v];
        const vehicle = vehicles[0] || v;
        
        const nvic = vehicle.nvic || vehicle.nvicCode || "";
        const make = vehicle.make || vehicle.vehicleMake || "";
        const model = vehicle.model || vehicle.vehicleModel || "";
        const year = vehicle.year || vehicle.vehicleYear || vehicle.manufactureYear || "";
        const variant = vehicle.variant || vehicle.vehicleVariant || "";
        const bodyStyle = vehicle.bodyStyle || vehicle.vehicleBodyStyle || "";
        const transmission = vehicle.transmission || "";
        const series = vehicle.series || "";
        const desc1 = vehicle.description1 || vehicle.desc1 || vehicle.vehicleDescription || "";
        const desc2 = vehicle.description2 || vehicle.desc2 || "";
        const marketValue = vehicle.marketValue || vehicle.averageMarketValue || null;
        const tradeValue = vehicle.tradeLowPrice || vehicle.tradeValue || null;
        const retailValue = vehicle.retailPrice || vehicle.retailValue || null;
        
        const imageUrl = nvic 
          ? `https://resource.digitalasset.suncorp.com.au/image/upload/b_white,c_pad,f_auto,q_auto,h_200,w_300/v1/suncorp/cars/${nvic}.png`
          : "";

        const info: VehicleInfo = {
          make, model, year: Number(year), variant, bodyStyle, transmission, series, nvic,
          imageUrl, desc1, desc2, marketValue, tradeValue, retailValue,
        };

        setVehicleInfo(info);
        updateField("vehicle_make", make);
        updateField("vehicle_model", model);
        updateField("vehicle_year", String(year));
        updateField("vehicle_nvic", nvic);
        updateField("vehicle_variant", variant);
        updateField("vehicle_body_style", bodyStyle);
        updateField("vehicle_transmission", transmission);
        updateField("vehicle_series", series);
        updateField("vehicle_description", desc1 || `${year} ${make} ${model}`);
        updateField("vehicle_image_url", imageUrl);
        updateField("vehicle_identification_method", "rego_lookup");
        if (marketValue) updateField("market_value", String(marketValue));
        if (tradeValue) updateField("trade_value", String(tradeValue));
        if (retailValue) updateField("retail_value", String(retailValue));

        toast.success(`Found: ${year} ${make} ${model}`);
      } else {
        throw new Error(data?.error || "Vehicle not found");
      }
    } catch (err: any) {
      console.error("Vehicle lookup error:", err);
      setLookupError(err.message || "Could not find vehicle. You can enter details manually.");
    } finally {
      setIsLooking(false);
    }
  };

  const facts = vehicleInfo ? getFactsForMake(vehicleInfo.make) : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-muted px-4 py-3 -mx-4 md:-mx-6 border-l-4 border-primary">
        <h2 className="text-xl font-medium">Vehicle Details</h2>
      </div>

      {/* Rego + State + Lookup */}
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

      <Button
        onClick={handleLookup}
        disabled={isLooking || !formData.vehicle_registration || !formData.vehicle_state}
        className="w-full h-12 text-base"
      >
        {isLooking ? (
          <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Looking up vehicle...</span>
        ) : (
          <span className="flex items-center gap-2"><Search className="w-5 h-5" /> Look Up Vehicle</span>
        )}
      </Button>

      {/* Vehicle found card */}
      {vehicleInfo && (
        <div className="border-2 border-primary/30 rounded-lg overflow-hidden bg-card animate-in fade-in duration-500">
          <div className="bg-primary/5 p-4 flex items-start gap-4">
            {vehicleInfo.imageUrl && (
              <img
                src={vehicleInfo.imageUrl}
                alt={`${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`}
                className="w-36 h-24 object-contain rounded bg-white"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Car className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">{vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}</h3>
              </div>
              {vehicleInfo.variant && <p className="text-sm text-muted-foreground">{vehicleInfo.variant}</p>}
              {vehicleInfo.desc1 && <p className="text-sm text-muted-foreground">{vehicleInfo.desc1}</p>}
              <div className="flex flex-wrap gap-2 mt-2">
                {vehicleInfo.bodyStyle && <span className="text-xs bg-muted px-2 py-1 rounded">{vehicleInfo.bodyStyle}</span>}
                {vehicleInfo.transmission && <span className="text-xs bg-muted px-2 py-1 rounded">{vehicleInfo.transmission}</span>}
                {vehicleInfo.series && <span className="text-xs bg-muted px-2 py-1 rounded">Series: {vehicleInfo.series}</span>}
              </div>
            </div>
          </div>

          {/* Fun facts */}
          {facts.length > 0 && (
            <div className="px-4 py-3 border-t border-border bg-accent/5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">Did you know?</span>
              </div>
              {facts.map((fact, i) => (
                <p key={i} className="text-sm text-muted-foreground">{fact}</p>
              ))}
            </div>
          )}

          {/* Values */}
          {(vehicleInfo.marketValue || vehicleInfo.tradeValue || vehicleInfo.retailValue) && (
            <div className="px-4 py-3 border-t border-border grid grid-cols-3 gap-2 text-center">
              {vehicleInfo.marketValue && (
                <div>
                  <p className="text-xs text-muted-foreground">Market</p>
                  <p className="font-semibold text-sm">${vehicleInfo.marketValue.toLocaleString()}</p>
                </div>
              )}
              {vehicleInfo.tradeValue && (
                <div>
                  <p className="text-xs text-muted-foreground">Trade</p>
                  <p className="font-semibold text-sm">${vehicleInfo.tradeValue.toLocaleString()}</p>
                </div>
              )}
              {vehicleInfo.retailValue && (
                <div>
                  <p className="text-xs text-muted-foreground">Retail</p>
                  <p className="font-semibold text-sm">${vehicleInfo.retailValue.toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Lookup error */}
      {lookupError && (
        <div className="border border-destructive/30 bg-destructive/5 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-destructive">{lookupError}</p>
            <Button variant="link" className="text-sm p-0 h-auto mt-1" onClick={() => setManualMode(true)}>
              Enter details manually →
            </Button>
          </div>
        </div>
      )}

      {/* Manual entry fallback */}
      {(manualMode || vehicleInfo) && !vehicleInfo && (
        <div className="space-y-4 animate-in fade-in duration-300">
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
              <Label>Vehicle Description</Label>
              <Input placeholder="e.g., 2020 Toyota Camry Ascent" value={formData.vehicle_description} onChange={(e) => updateField("vehicle_description", e.target.value)} />
            </div>
          </div>
        </div>
      )}

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
  );
}
