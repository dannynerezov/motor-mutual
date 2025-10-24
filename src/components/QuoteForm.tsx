import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, Car, Calculator, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AUSTRALIAN_STATES = [
  { code: 'NSW', name: 'New South Wales' },
  { code: 'VIC', name: 'Victoria' },
  { code: 'QLD', name: 'Queensland' },
  { code: 'TAS', name: 'Tasmania' },
  { code: 'WA', name: 'Western Australia' },
  { code: 'SA', name: 'South Australia' },
  { code: 'ACT', name: 'Australian Capital Territory' },
  { code: 'NT', name: 'Northern Territory' },
];

interface VehicleDetails {
  year: number;
  make: string;
  family: string;
  variant: string;
  series: string;
  nvic: string;
  bodyStyle: string;
  doors: number;
  transmissionDescription: string;
  fuelType: string;
}

interface VehicleValueInfo {
  tradeLowPrice: number;    // Lower trade-in value
  tradePrice: number;       // Standard trade-in value
  retailPrice: number;      // Retail asking price
  marketValue: number;      // Current market value
  kilometers: number;
}

interface VehicleData {
  vehicleDetails: VehicleDetails;
  vehicleValueInfo: VehicleValueInfo;
  imageUrl?: string | null;
}

export const QuoteForm = () => {
  const [registration, setRegistration] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [vinNumber, setVinNumber] = useState("");
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [membershipPrice, setMembershipPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [percentageChange, setPercentageChange] = useState<number>(0);

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

  const handleFindVehicle = async () => {
    if (!registration || !selectedState) {
      toast.error("Please enter registration number and select a state");
      return;
    }

    setIsLoading(true);
    setVehicleData(null);
    setMembershipPrice(null);

    try {
      const { data, error } = await supabase.functions.invoke('vehicle-lookup', {
        body: {
          registrationNumber: registration.toUpperCase(),
          state: selectedState,
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setVehicleData(data);
      
      // Initialize selected value to market value
      const initialValue = data.vehicleValueInfo.marketValue;
      setSelectedValue(initialValue);
      setPercentageChange(0);
      
      const calculatedPrice = calculateMembershipPrice(initialValue);
      setMembershipPrice(calculatedPrice);

      toast.success("Vehicle found successfully!");
    } catch (error: any) {
      console.error('Vehicle lookup error:', error);
      toast.error(error.message || "Failed to find vehicle. Try manual entry with VIN.");
      setShowManualEntry(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualEntry = () => {
    if (!vinNumber) {
      toast.error("Please enter a VIN number");
      return;
    }
    toast.info("Manual VIN entry will be processed by our team");
    // TODO: Implement manual VIN processing workflow
  };

  const handleValueChange = (value: number[]) => {
    if (!vehicleData) return;
    
    const newValue = value[0];
    setSelectedValue(newValue);
    
    // Calculate percentage change from market value
    const marketValue = vehicleData.vehicleValueInfo.marketValue;
    const change = ((newValue - marketValue) / marketValue) * 100;
    setPercentageChange(change);
    
    // Recalculate membership price
    const newPrice = calculateMembershipPrice(newValue);
    setMembershipPrice(newPrice);
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

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Car className="w-4 h-4 text-accent" />
              Vehicle Registration Number
            </label>
            <Input
              placeholder="e.g., ABC123"
              value={registration}
              onChange={(e) => setRegistration(e.target.value.toUpperCase())}
              className="border-border/50 bg-background/50 text-center font-mono text-lg tracking-wider"
              maxLength={8}
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium">
              State of Registration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AUSTRALIAN_STATES.map((state) => (
                <Button
                  key={state.code}
                  type="button"
                  variant={selectedState === state.code ? "default" : "outline"}
                  className={selectedState === state.code 
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                    : "hover:border-accent/50"
                  }
                  onClick={() => setSelectedState(state.code)}
                >
                  {state.code}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleFindVehicle}
            disabled={isLoading || !registration || !selectedState}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold py-6 text-lg transition-all hover:shadow-glow"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Finding your car...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                Find My Car
              </span>
            )}
          </Button>

          {showManualEntry && (
            <Card className="p-4 bg-muted/50 border-muted-foreground/20 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-accent mt-0.5" />
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm">Can't find your vehicle?</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter your VIN number for manual processing
                    </p>
                  </div>
                  <Input
                    placeholder="Enter VIN number"
                    value={vinNumber}
                    onChange={(e) => setVinNumber(e.target.value.toUpperCase())}
                    className="text-sm"
                    maxLength={17}
                  />
                  <Button
                    onClick={handleManualEntry}
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    Submit VIN for Manual Processing
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {vehicleData && membershipPrice !== null && (
          <Card className="p-6 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
              {/* Header with Make, Model, Year */}
              <div className="text-center pb-4 border-b border-border/30">
                <h3 className="text-2xl font-bold">
                  {vehicleData.vehicleDetails.year} {vehicleData.vehicleDetails.make} {vehicleData.vehicleDetails.family}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {vehicleData.vehicleDetails.variant}
                </p>
              </div>

              {/* Vehicle Image and Key Details */}
              {vehicleData.imageUrl ? (
                <div className="bg-card/50 rounded-lg p-6 backdrop-blur-sm">
                  <div className="grid md:grid-cols-2 gap-6 items-center">
                    {/* Vehicle Image */}
                    <div className="flex justify-center">
                      <img 
                        src={vehicleData.imageUrl} 
                        alt={`${vehicleData.vehicleDetails.year} ${vehicleData.vehicleDetails.make} ${vehicleData.vehicleDetails.family}`}
                        className="max-w-full h-auto rounded-lg shadow-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    
                    {/* Key Vehicle Details */}
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-accent mb-4">Vehicle Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Make:</span>
                          <span className="font-medium">{vehicleData.vehicleDetails.make}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Model:</span>
                          <span className="font-medium">{vehicleData.vehicleDetails.family}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Year:</span>
                          <span className="font-medium">{vehicleData.vehicleDetails.year}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Body Style:</span>
                          <span className="font-medium">{vehicleData.vehicleDetails.bodyStyle}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-card/50 rounded-lg p-4 backdrop-blur-sm">
                  <h4 className="text-sm font-semibold text-accent mb-3">Vehicle Details</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Make:</span>
                      <span className="font-medium ml-2">{vehicleData.vehicleDetails.make}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Model:</span>
                      <span className="font-medium ml-2">{vehicleData.vehicleDetails.family}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Year:</span>
                      <span className="font-medium ml-2">{vehicleData.vehicleDetails.year}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Body Style:</span>
                      <span className="font-medium ml-2">{vehicleData.vehicleDetails.bodyStyle}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Select Your Value Covered - Interactive Slider */}
              <div className="bg-card/50 rounded-lg p-6 backdrop-blur-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-accent">Select Your Value Covered</h4>
                  {vehicleData.vehicleValueInfo.retailPrice > 99999.99 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground cursor-help">
                            <AlertCircle className="w-4 h-4" />
                            Coverage Limit
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Mutual only covers vehicles up to $100,000</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>

                {/* Reference Values Display */}
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="text-center p-2 bg-muted/30 rounded">
                    <p className="text-muted-foreground mb-1">Trade Low</p>
                    <p className="font-semibold">${vehicleData.vehicleValueInfo.tradeLowPrice.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-2 bg-primary/10 rounded border border-primary/30">
                    <p className="text-muted-foreground mb-1">Market Value</p>
                    <p className="font-semibold text-primary">${vehicleData.vehicleValueInfo.marketValue.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded">
                    <p className="text-muted-foreground mb-1">Retail Price</p>
                    <p className="font-semibold">${Math.min(vehicleData.vehicleValueInfo.retailPrice, 99999.99).toLocaleString()}</p>
                  </div>
                </div>

                {/* Current Selection Display with Percentage Change */}
                <div className="text-center py-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm text-muted-foreground mb-1">Your Selected Coverage</p>
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    ${selectedValue?.toLocaleString() || '0'}
                  </div>
                  {percentageChange !== 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className={`text-sm mt-2 cursor-help ${percentageChange > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                            {percentageChange > 0 ? '↑' : '↓'} {Math.abs(percentageChange).toFixed(1)}% from market value
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>This will {percentageChange > 0 ? 'increase' : 'decrease'} your premium by approximately {Math.abs(percentageChange).toFixed(1)}%</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>

                {/* Interactive Slider */}
                <div className="px-2 py-4">
                  <Slider
                    value={[selectedValue || vehicleData.vehicleValueInfo.marketValue]}
                    onValueChange={handleValueChange}
                    min={vehicleData.vehicleValueInfo.tradeLowPrice}
                    max={Math.min(vehicleData.vehicleValueInfo.retailPrice, 99999.99)}
                    step={100}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>${vehicleData.vehicleValueInfo.tradeLowPrice.toLocaleString()}</span>
                    <span>${Math.min(vehicleData.vehicleValueInfo.retailPrice, 99999.99).toLocaleString()}</span>
                  </div>
                </div>

                {/* Additional Context */}
                <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded">
                  <p className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Selecting a lower value reduces your premium but means you'll receive less in a total loss claim. 
                      Selecting a higher value increases protection but costs more.
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg p-6 text-center backdrop-blur-sm border border-accent/30">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Your Annual Membership Price</h4>
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ${membershipPrice.toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Based on selected coverage of ${selectedValue?.toLocaleString() || '0'}
                  {percentageChange !== 0 && (
                    <span className={percentageChange > 0 ? 'text-green-600' : 'text-orange-600'}>
                      {' '}({percentageChange > 0 ? '+' : ''}{percentageChange.toFixed(1)}% from market value)
                    </span>
                  )}
                </p>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold py-6 text-lg"
              >
                <Shield className="w-5 h-5 mr-2" />
                Continue to Purchase
              </Button>
            </div>
          </Card>
        )}
      </div>
    </Card>
  );
};
