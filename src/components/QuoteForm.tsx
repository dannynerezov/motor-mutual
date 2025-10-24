import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Shield, Car, MapPin, Calculator } from "lucide-react";
import { toast } from "sonner";

export const QuoteForm = () => {
  const [registration, setRegistration] = useState("");
  const [address, setAddress] = useState("");
  const [vehicleValue, setVehicleValue] = useState<number | null>(null);
  const [membershipPrice, setMembershipPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateMembershipPrice = (value: number): number => {
    if (value <= 10000) {
      return 500;
    } else if (value >= 100000) {
      return 2500;
    } else {
      // Linear calculation between $10,000 and $100,000
      const range = 100000 - 10000;
      const priceRange = 2500 - 500;
      const valueAboveMin = value - 10000;
      return 500 + (valueAboveMin / range) * priceRange;
    }
  };

  const handleGetQuote = async () => {
    if (!registration || !address) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Integrate Suncorp API for vehicle lookup
      // For now, simulate with mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock vehicle value for demonstration
      const mockVehicleValue = 45000;
      const calculatedPrice = calculateMembershipPrice(mockVehicleValue);

      setVehicleValue(mockVehicleValue);
      setMembershipPrice(calculatedPrice);

      toast.success("Quote calculated successfully!");
    } catch (error) {
      toast.error("Failed to generate quote. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-8 bg-card/95 backdrop-blur-xl border-border/50 shadow-strong">
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4">
            <Calculator className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Get Your Rideshare Quote
          </h2>
          <p className="text-muted-foreground mt-2">
            Protect your business on wheels with coverage built for rideshare drivers
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Car className="w-4 h-4 text-accent" />
              Vehicle Registration
            </label>
            <Input
              placeholder="e.g., ABC123"
              value={registration}
              onChange={(e) => setRegistration(e.target.value.toUpperCase())}
              className="border-border/50 bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="w-4 h-4 text-accent" />
              Your Address
            </label>
            <Input
              placeholder="Start typing your address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border-border/50 bg-background/50"
            />
          </div>
        </div>

        <Button
          onClick={handleGetQuote}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold py-6 text-lg transition-all hover:shadow-glow"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Calculating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Get My Quote
            </span>
          )}
        </Button>

        {vehicleValue !== null && membershipPrice !== null && (
          <Card className="p-6 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Your Quote is Ready!</h3>
                <p className="text-sm text-muted-foreground">
                  Vehicle value: ${vehicleValue.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="bg-card/50 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground">Annual Membership Price:</span>
                <div className="text-right">
                  <span className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    ${membershipPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">per year</span>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Card>
  );
};
