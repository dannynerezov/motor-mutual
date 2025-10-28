import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, Car, Calculator, AlertCircle, Plus, Info } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { VehicleCard, Vehicle } from "./VehicleCard";
import { usePricingScheme } from "@/hooks/usePricingScheme";

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
  const { activeScheme, calculatePrice, isLoading: schemeLoading } = usePricingScheme();
  const [registration, setRegistration] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [vinNumber, setVinNumber] = useState("");
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("");

  // Typewriter animation for placeholder
  useEffect(() => {
    const fullText = "Enter your rego number e.g., ABC123";
    let currentIndex = 0;
    let typingInterval: NodeJS.Timeout;
    
    const typeText = () => {
      typingInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setPlaceholderText(fullText.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => {
            currentIndex = 0;
            setPlaceholderText("");
            setTimeout(typeText, 100);
          }, 2000);
        }
      }, 80);
    };
    
    typeText();
    
    return () => clearInterval(typingInterval);
  }, []);

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
      const calculatedPrice = calculatePrice(initialValue);

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
        const newPrice = calculatePrice(newValue);
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
      // Generate or reuse guest email to avoid conflicts
      let guestEmail = localStorage.getItem("guestEmail");
      if (!guestEmail) {
        guestEmail = `guest+${Date.now()}@example.com`;
        localStorage.setItem("guestEmail", guestEmail);
      }

      const customerPayload = {
        first_name: "Guest",
        last_name: "User",
        email: guestEmail,
        phone: "0000000000",
        address_line1: "TBD",
        city: "TBD",
        state: vehicles[0].state,
        postcode: "0000",
      };

      // Try client-side flow first
      let customerId;
      let quoteId;

      try {
        // Find existing customer by email
        const { data: existingCustomer, error: selectError } = await supabase
          .from("customers")
          .select('*')
          .eq('email', guestEmail)
          .maybeSingle();

        if (selectError) throw selectError;

        if (existingCustomer) {
          customerId = existingCustomer.id;
        } else {
          // Create new customer
          const { data: newCustomer, error: insertError } = await supabase
            .from("customers")
            .insert([customerPayload])
            .select()
            .single();

          if (insertError) throw insertError;
          customerId = newCustomer.id;
        }

        const totalBase = getTotalBasePrice();
        const totalFinal = getTotalWithDiscount();
        const firstVehicle = vehicles[0];

        // Create quote
        const { data: quoteData, error: quoteError } = await supabase
          .from("quotes")
          .insert({
            customer_id: customerId,
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
            pricing_scheme_id: activeScheme?.id || null,
          } as any)
          .select()
          .single();

        if (quoteError) throw quoteError;
        quoteId = quoteData.id;

        // Insert all vehicles
        const vehicleInserts = vehicles.map(v => ({
          quote_id: quoteId,
          registration_number: v.registration,
          vehicle_make: v.vehicleData.vehicleDetails.make,
          vehicle_model: v.vehicleData.vehicleDetails.family,
          vehicle_year: v.vehicleData.vehicleDetails.year,
          vehicle_nvic: v.vehicleData.vehicleDetails.nvic || null,
          vehicle_variant: v.vehicleData.vehicleDetails.variant || null,
          vehicle_value: v.vehicleData.vehicleValueInfo.marketValue,
          selected_coverage_value: v.selectedValue,
          vehicle_image_url: v.vehicleData.imageUrl || null,
          base_price: v.membershipPrice,
        }));

        const { error: vehicleError } = await supabase
          .from("quote_vehicles")
          .insert(vehicleInserts);

        if (vehicleError) throw vehicleError;

      } catch (clientError: any) {
        console.error("Client-side quote creation failed, using backend fallback:", clientError);
        
        // Fallback to backend function
        const totalBase = getTotalBasePrice();
        const totalFinal = getTotalWithDiscount();
        const firstVehicle = vehicles[0];

        const { data, error: functionError } = await supabase.functions.invoke('create-quote', {
          body: {
            customer: customerPayload,
            vehicles: vehicles.map(v => ({
              registration: v.registration,
              make: v.vehicleData.vehicleDetails.make,
              model: v.vehicleData.vehicleDetails.family,
              year: v.vehicleData.vehicleDetails.year,
              nvic: v.vehicleData.vehicleDetails.nvic || null,
              value: v.vehicleData.vehicleValueInfo.marketValue,
              selectedValue: v.selectedValue,
              imageUrl: v.vehicleData.imageUrl || null,
              membershipPrice: v.membershipPrice,
            })),
            totals: {
              base: totalBase,
              final: totalFinal,
            },
            firstVehicle: {
              registration: firstVehicle.registration,
              make: firstVehicle.vehicleData.vehicleDetails.make,
              model: firstVehicle.vehicleData.vehicleDetails.family,
              year: firstVehicle.vehicleData.vehicleDetails.year,
              nvic: firstVehicle.vehicleData.vehicleDetails.nvic || null,
              value: firstVehicle.vehicleData.vehicleValueInfo.marketValue,
              membershipPrice: firstVehicle.membershipPrice,
            },
          }
        });

        if (functionError || !data?.success) {
          throw new Error(data?.error || functionError?.message || 'Backend fallback failed');
        }

        quoteId = data.quoteId;
      }

      toast.success("Quote created successfully!");
      navigate(`/quote/${quoteId}`);
    } catch (error: any) {
      console.error("Error creating quote:", error);
      toast.error("Unable to create quote at this time. Please try again shortly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const discount = calculateFleetDiscount(vehicles.length);
  const discountPercentage = discount * 100;

  return (
    <Card className="w-full max-w-4xl mx-auto p-8 bg-gradient-to-br from-card via-card to-accent/5 backdrop-blur-xl border-2 border-primary/30 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 relative overflow-hidden">
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-accent/30 rounded-tl-2xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-accent/30 rounded-br-2xl pointer-events-none"></div>
      
      <div className="space-y-6 relative">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-accent to-blue-500 mb-6 animate-in zoom-in-50 duration-700 shadow-lg">
            <Calculator className="w-10 h-10 text-primary-foreground animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-accent to-blue-600 bg-clip-text text-transparent animate-in fade-in slide-in-from-top-4 duration-700 mb-4">
            Get Your Rideshare Quote
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mt-3 animate-in fade-in slide-in-from-top-4 duration-700 delay-150">
            Protect your business on wheels with coverage built for rideshare drivers
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/30 animate-in fade-in scale-in-95 duration-700 delay-300">
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-accent">
              Quick • Simple • Transparent
            </span>
          </div>
          {activeScheme && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4 animate-in fade-in duration-700 delay-500">
              <Info className="w-4 h-4" />
              <span>
                Using Pricing Scheme #{activeScheme.scheme_number} 
                {' '}(Active since {new Date(activeScheme.valid_from).toLocaleDateString('en-AU', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })})
              </span>
            </div>
          )}
        </div>

        {/* Vehicle Entry Section */}
        {(vehicles.length === 0 || showAddVehicle) && (
          <div className="space-y-6">
            <div className="space-y-2 relative">
              <label className="flex items-center gap-2 text-base font-semibold">
                <Car className="w-5 h-5 text-accent animate-pulse" />
                Vehicle Registration Number
                <span className="text-xs text-muted-foreground font-normal">(Step 1 of 3)</span>
              </label>
              
              
              <Input
                placeholder={registration ? "" : placeholderText}
                value={registration}
                onChange={(e) => setRegistration(e.target.value.toUpperCase())}
                className="border-2 border-accent/50 bg-background text-center font-mono text-xl tracking-wider h-14 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all animate-in fade-in slide-in-from-top-4 duration-500"
                maxLength={8}
              />
              
              {/* Helper text when empty */}
              {!registration && (
                <p className="text-sm text-accent/70 flex items-center gap-2 animate-pulse">
                  <span className="inline-block w-2 h-2 bg-accent rounded-full"></span>
                  Enter your vehicle's registration number to begin
                </p>
              )}
            </div>

            <div className="space-y-3 relative">
              <label className="flex items-center gap-2 text-base font-semibold">
                State of Registration
                <span className="text-xs text-muted-foreground font-normal">(Step 2 of 3)</span>
              </label>
              
              <div className="grid grid-cols-4 gap-3 p-4 bg-muted/30 rounded-lg border-2 border-dashed border-accent/30 animate-in fade-in slide-in-from-top-4 duration-500 delay-300">
                {AUSTRALIAN_STATES.map((state) => (
                  <Button
                    key={state.code}
                    type="button"
                    variant={selectedState === state.code ? "default" : "outline"}
                    className={`h-12 text-base font-semibold transition-all duration-300 ${
                      selectedState === state.code 
                        ? "bg-gradient-to-r from-primary to-accent text-primary-foreground scale-110 shadow-lg"
                        : "hover:border-accent/50 hover:scale-105"
                    }`}
                    onClick={() => setSelectedState(state.code)}
                  >
                    {state.code}
                  </Button>
                ))}
              </div>
              
              {/* Helper text when state not selected */}
              {registration && !selectedState && (
                <p className="text-sm text-accent/70 flex items-center gap-2 animate-pulse">
                  <span className="inline-block w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                  Select your state of registration
                </p>
              )}
              
              {/* Confirmation text after state selection */}
              {selectedState && (
                <p className="text-sm text-accent/70 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                  <span className="inline-block w-2 h-2 bg-accent rounded-full"></span>
                  {AUSTRALIAN_STATES.find(s => s.code === selectedState)?.name} selected
                </p>
              )}
            </div>

            <div className="relative mt-6">
              <div className="flex gap-3">
                <Button
                  onClick={handleFindVehicle}
                  disabled={isLoading || !registration || !selectedState}
                  className="flex-1 bg-gradient-to-r from-accent via-primary to-accent hover:from-accent/90 hover:via-primary/90 hover:to-accent/90 text-white font-bold py-8 text-xl transition-all hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed animate-in fade-in scale-in-95 duration-500 delay-500 relative overflow-hidden group"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  
                  {isLoading ? (
                    <span className="flex items-center gap-3 relative z-10">
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      Finding your vehicle...
                    </span>
                  ) : (
                    <span className="flex items-center gap-3 relative z-10">
                      <Car className="w-6 h-6" />
                      {vehicles.length === 0 ? 'Find My Car' : 'Add Another Vehicle'}
                      {registration && selectedState && (
                        <span className="text-xs font-normal opacity-90">(Step 3 of 3)</span>
                      )}
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
                    className="py-8 px-6 text-base"
                  >
                    Cancel
                  </Button>
                )}
              </div>
              
              {/* Pulsing ring around button when ready */}
              {registration && selectedState && !isLoading && (
                <div className="absolute inset-0 rounded-md border-4 border-accent animate-ping opacity-20 pointer-events-none"></div>
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
                  <span className="text-sm bg-accent/10 text-accent px-2 py-1 rounded-full font-semibold">
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
