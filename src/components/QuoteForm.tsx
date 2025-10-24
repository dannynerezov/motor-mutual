import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, Car, Calculator, AlertCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { VehicleCard, Vehicle } from "./VehicleCard";

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
  tradeLowPrice: number;
  tradePrice: number;
  retailPrice: number;
  marketValue: number;
  kilometers: number;
}

interface VehicleData {
  vehicleDetails: VehicleDetails;
  vehicleValueInfo: VehicleValueInfo;
  imageUrl?: string | null;
}

export const QuoteForm = () => {
  const navigate = useNavigate();
  const [registration, setRegistration] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [vinNumber, setVinNumber] = useState("");
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);

  const calculateMembershipPrice = (value: number): number => {
    if (value <= 10000) {
      return 500;
    } else if (value >= 100000) {
      return 2500;
    } else {
      const range = 100000 - 10000;
      const priceRange = 2500 - 500;
      const valueAboveMin = value - 10000;
      return 500 + (valueAboveMin / range) * priceRange;
    }
  };

  const calculateFleetDiscount = (vehicleCount: number): number => {
    if (vehicleCount === 1) return 0;
    if (vehicleCount >= 2 && vehicleCount <= 4) return 0.05;
    if (vehicleCount >= 5 && vehicleCount <= 9) return 0.10;
    if (vehicleCount >= 10 && vehicleCount <= 20) return 0.15;
    return 0;
  };

  const getTotalBasePrice = (): number => {
    return vehicles.reduce((sum, v) => sum + v.membershipPrice, 0);
  };

  const getFleetDiscountAmount = (): number => {
    const basePrice = getTotalBasePrice();
    const discount = calculateFleetDiscount(vehicles.length);
    return basePrice * discount;
  };

  const getTotalWithDiscount = (): number => {
    return getTotalBasePrice() - getFleetDiscountAmount();
  };

  const handleFindVehicle = async () => {
    if (!registration || !selectedState) {
      toast.error("Please enter registration number and select a state");
      return;
    }

    // Check for duplicate registration
    if (vehicles.some(v => v.registration === registration.toUpperCase())) {
      toast.error("This vehicle has already been added");
      return;
    }

    // Check vehicle limit
    if (vehicles.length >= 20) {
      toast.error("Maximum 20 vehicles allowed per quote");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('vehicle-lookup', {
        body: {
          registrationNumber: registration.toUpperCase(),
          state: selectedState,
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      const initialValue = data.vehicleValueInfo.marketValue;
      const calculatedPrice = calculateMembershipPrice(initialValue);

      const newVehicle: Vehicle = {
        id: `${Date.now()}-${Math.random()}`,
        registration: registration.toUpperCase(),
        state: selectedState,
        vehicleData: data,
        selectedValue: initialValue,
        membershipPrice: calculatedPrice,
      };

      setVehicles([...vehicles, newVehicle]);
      setRegistration("");
      setShowAddVehicle(false);
      toast.success("Vehicle added successfully!");
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
  };

  const handleValueChange = (id: string, newValue: number) => {
    setVehicles(vehicles.map(v => {
      if (v.id === id) {
        const newPrice = calculateMembershipPrice(newValue);
        return { ...v, selectedValue: newValue, membershipPrice: newPrice };
      }
      return v;
    }));
  };

  const handleRemoveVehicle = (id: string) => {
    if (vehicles.length === 1) {
      toast.error("You must have at least one vehicle");
      return;
    }
    setVehicles(vehicles.filter(v => v.id !== id));
    toast.success("Vehicle removed");
  };

  const handleSeePrice = async () => {
    if (vehicles.length === 0) {
      toast.error("Please add at least one vehicle");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create customer
      const { data: customerData, error: customerError } = await supabase
        .from("customers")
        .insert({
          first_name: "Guest",
          last_name: "User",
          email: "guest@example.com",
          phone: "0000000000",
          address_line1: "TBD",
          city: "TBD",
          state: vehicles[0].state,
          postcode: "0000",
        })
        .select()
        .single();

      if (customerError) throw customerError;

      const totalBase = getTotalBasePrice();
      const totalFinal = getTotalWithDiscount();
      const firstVehicle = vehicles[0];

      // Create quote with all required fields
      const { data: quoteData, error: quoteError } = await supabase
        .from("quotes")
        .insert({
          customer_id: customerData.id,
          quote_reference: `QT-${Date.now()}`,
          registration_number: firstVehicle.registration,
          vehicle_make: firstVehicle.vehicleData.vehicleDetails.make,
          vehicle_model: firstVehicle.vehicleData.vehicleDetails.family,
          vehicle_year: firstVehicle.vehicleData.vehicleDetails.year,
          vehicle_nvic: firstVehicle.vehicleData.vehicleDetails.nvic || null,
          vehicle_value: firstVehicle.vehicleData.vehicleValueInfo.marketValue,
          membership_price: firstVehicle.membershipPrice,
          total_base_price: totalBase,
          total_final_price: totalFinal,
          status: "pending",
        } as any)
        .select()
        .single();

      if (quoteError) throw quoteError;

      // Insert all vehicles
      const vehicleInserts = vehicles.map(v => ({
        quote_id: quoteData.id,
        registration_number: v.registration,
        vehicle_make: v.vehicleData.vehicleDetails.make,
        vehicle_model: v.vehicleData.vehicleDetails.family,
        vehicle_year: v.vehicleData.vehicleDetails.year,
        vehicle_nvic: v.vehicleData.vehicleDetails.nvic || null,
        vehicle_value: v.vehicleData.vehicleValueInfo.marketValue,
        selected_coverage_value: v.selectedValue,
        vehicle_image_url: v.vehicleData.imageUrl || null,
        base_price: v.membershipPrice,
      }));

      const { error: vehicleError } = await supabase
        .from("quote_vehicles")
        .insert(vehicleInserts);

      if (vehicleError) throw vehicleError;

      toast.success("Quote created successfully!");
      navigate(`/quote/${quoteData.id}`);
    } catch (error: any) {
      console.error("Error creating quote:", error);
      toast.error(error.message || "Failed to create quote. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const discount = calculateFleetDiscount(vehicles.length);
  const discountPercentage = discount * 100;

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

        {/* Vehicle Entry Section */}
        {(vehicles.length === 0 || showAddVehicle) && (
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

            <div className="flex gap-2">
              <Button
                onClick={handleFindVehicle}
                disabled={isLoading || !registration || !selectedState}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold py-6 text-lg transition-all hover:shadow-glow"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Finding vehicle...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    {vehicles.length === 0 ? 'Find My Car' : 'Add Vehicle'}
                  </span>
                )}
              </Button>
              {vehicles.length > 0 && showAddVehicle && (
                <Button
                  onClick={() => {
                    setShowAddVehicle(false);
                    setRegistration("");
                    setSelectedState("");
                  }}
                  variant="outline"
                  className="py-6"
                >
                  Cancel
                </Button>
              )}
            </div>

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
        )}

        {/* Vehicle List */}
        {vehicles.length > 0 && (
          <div className="space-y-4">
            {/* Vehicle Counter & Fleet Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Your Vehicles</h3>
                <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'}
                </span>
                {discountPercentage > 0 && (
                  <span className="text-sm bg-green-500/10 text-green-600 px-2 py-1 rounded-full font-semibold">
                    {discountPercentage}% Fleet Discount
                  </span>
                )}
              </div>
              {!showAddVehicle && vehicles.length < 20 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowAddVehicle(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Another Vehicle
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Add up to 20 vehicles. Fleet discounts: 2-4 vehicles (5%), 5-9 (10%), 10-20 (15%)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {/* Vehicle Cards */}
            <div className="space-y-3">
              {vehicles.map((vehicle, index) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  index={index}
                  onValueChange={handleValueChange}
                  onRemove={handleRemoveVehicle}
                  canRemove={vehicles.length > 1}
                />
              ))}
            </div>

            {/* Continue Button */}
            <Button
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold py-6 text-lg"
              onClick={handleSeePrice}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creating quote...
                </span>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
