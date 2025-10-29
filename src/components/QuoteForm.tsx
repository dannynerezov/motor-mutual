import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, Car, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { usePricingScheme } from "@/hooks/usePricingScheme";
import { ManualQuoteRequestDialog } from "@/components/ManualQuoteRequestDialog";
import watermarkLogo from "@/assets/mcm-logo-small-watermark.webp";

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
  const [isLoading, setIsLoading] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("");
  const [showManualQuoteDialog, setShowManualQuoteDialog] = useState(false);
  const [lookupErrorMessage, setLookupErrorMessage] = useState("");

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


  const handleFindVehicle = async () => {
    if (!registration || !selectedState) {
      toast.error("Please enter registration number and select a state");
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Lookup vehicle
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

      // Step 2: Create quote and redirect immediately
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
        state: selectedState,
        postcode: "0000",
      };

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

        // Create quote
        const { data: quoteData, error: quoteError } = await supabase
          .from("quotes")
          .insert({
            customer_id: customerId,
            quote_reference: `QT-${Date.now()}`,
            registration_number: registration.toUpperCase(),
            vehicle_make: data.vehicleDetails.make,
            vehicle_model: data.vehicleDetails.family,
            vehicle_year: data.vehicleDetails.year,
            vehicle_nvic: data.vehicleDetails.nvic || null,
            vehicle_value: initialValue,
            membership_price: calculatedPrice,
            total_base_price: calculatedPrice,
            total_final_price: calculatedPrice,
            status: "pending",
            pricing_scheme_id: activeScheme?.id || null,
          } as any)
          .select()
          .single();

        if (quoteError) throw quoteError;
        quoteId = quoteData.id;

        // Insert vehicle with valuation data
        const { error: vehicleError } = await supabase
          .from("quote_vehicles")
          .insert({
            quote_id: quoteId,
            registration_number: registration.toUpperCase(),
            vehicle_make: data.vehicleDetails.make,
            vehicle_model: data.vehicleDetails.family,
            vehicle_year: data.vehicleDetails.year,
            vehicle_nvic: data.vehicleDetails.nvic || null,
            vehicle_variant: data.vehicleDetails.variant || null,
            vehicle_value: initialValue,
            selected_coverage_value: initialValue,
            vehicle_image_url: data.imageUrl || null,
            base_price: calculatedPrice,
            trade_low_price: data.vehicleValueInfo.tradeLowPrice,
            retail_price: data.vehicleValueInfo.retailPrice,
            state_of_registration: selectedState,
            vehicle_desc1: data.vehicleDetails.description1 || data.vehicleDetails.variant || null,
            vehicle_desc2: data.vehicleDetails.description2 || null,
            vehicle_series: data.vehicleDetails.series || null,
            vehicle_body_style: data.vehicleDetails.bodyStyle || null,
            vehicle_transmission: data.vehicleDetails.transmissionDescription || null,
            vehicle_fuel_type: data.vehicleDetails.fuelType || null,
          });

        if (vehicleError) throw vehicleError;

      } catch (clientError: any) {
        console.error("Client-side quote creation failed:", clientError);
        throw clientError;
      }

      toast.success("Quote created successfully!");
      navigate(`/quote/${quoteId}`);
    } catch (error: any) {
      console.error('Vehicle lookup error:', error);
      
      // Store error message and open dialog instead of showing toast
      setLookupErrorMessage(error.message || "Vehicle lookup failed");
      setShowManualQuoteDialog(true);
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

  return (
    <Card className="w-full max-w-4xl mx-auto p-8 bg-gradient-to-br from-card via-card to-accent/5 backdrop-blur-xl border-2 border-primary/30 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 relative overflow-hidden">
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-accent/30 rounded-tl-2xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-accent/30 rounded-br-2xl pointer-events-none"></div>
      
      <div className="space-y-6 relative">
        <div className="text-center mb-10">
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
        </div>

        {/* Vehicle Entry Section */}
        <div className="space-y-6">
          <div className="space-y-2 relative">
            <label className="flex items-center gap-2 text-base font-semibold">
              <Car className="w-5 h-5 text-accent animate-pulse" />
              Vehicle Registration Number
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
            <Button
              onClick={handleFindVehicle}
              disabled={isLoading || !registration || !selectedState}
              className="w-full bg-gradient-to-r from-accent via-primary to-accent hover:from-accent/90 hover:via-primary/90 hover:to-accent/90 text-white font-bold py-8 text-xl transition-all hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed animate-in fade-in scale-in-95 duration-500 delay-500 relative overflow-hidden group"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              {isLoading ? (
                <span className="flex items-center gap-3 relative z-10">
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating your quote...
                </span>
              ) : (
                <span className="flex items-center gap-3 relative z-10">
                  <Car className="w-6 h-6" />
                  Get My Quote
                </span>
              )}
            </Button>
            
            {/* Pulsing ring around button when ready */}
            {registration && selectedState && !isLoading && (
              <div className="absolute inset-0 rounded-md border-4 border-accent animate-ping opacity-20 pointer-events-none"></div>
            )}
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

          {/* Manual Quote Request Dialog */}
          <ManualQuoteRequestDialog
            open={showManualQuoteDialog}
            onOpenChange={setShowManualQuoteDialog}
            registrationNumber={registration}
            state={selectedState}
            errorMessage={lookupErrorMessage}
          />
        </div>
      </div>
    </Card>
  );
};
