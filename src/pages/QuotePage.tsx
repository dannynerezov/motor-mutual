import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertCircle, ArrowLeft, Loader2, CheckCircle, XCircle, FileCode, ChevronDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DriverCard } from "@/components/DriverCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactBrokerDialog } from "@/components/ContactBrokerDialog";
import { QuoteGenerationOverlay } from "@/components/QuoteGenerationOverlay";
import { QuoteErrorDialog } from "@/components/QuoteErrorDialog";
import { PayloadInspector } from "@/components/PayloadInspector";
import { useSuncorpQuote } from "@/hooks/useSuncorpQuote";
import { usePricingScheme } from "@/hooks/usePricingScheme";
import { getDefaultPolicyStartDate } from "@/lib/thirdPartyBulkLogic";
import { toast } from "sonner";
import watermarkLogo from "@/assets/mcm-logo-small-watermark.webp";

interface Quote {
  id: string;
  quote_number: string;
  total_base_price: number;
  total_final_price: number;
  status: string;
  pricing_scheme_id: string | null;
  vehicle_value: number;
  third_party_quote_number?: string | null;
  third_party_base_premium?: number | null;
  third_party_stamp_duty?: number | null;
  third_party_gst?: number | null;
  third_party_total_premium?: number | null;
  pricing_schemes?: {
    scheme_number: number;
    valid_from: string;
    floor_price: number;
    floor_point: number;
    ceiling_price: number;
    ceiling_point: number;
  };
}

interface Vehicle {
  id: string;
  registration_number: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  vehicle_nvic: string | null;
  vehicle_variant: string | null;
  vehicle_value: number;
  selected_coverage_value: number;
  vehicle_image_url: string | null;
  trade_low_price: number | null;
  retail_price: number | null;
}

interface NamedDriver {
  id: string;
  driver_name?: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  claims_count: number;
  address_line1?: string;
  address_unit_type?: string;
  address_unit_number?: string;
  address_street_number?: string;
  address_street_name?: string;
  address_street_type?: string;
  address_suburb?: string;
  address_state?: string;
  address_postcode?: string;
  address_lurn?: string;
  address_latitude?: string;
  address_longitude?: string;
}

interface SuncorpQuoteDetails {
  id: string;
  quote_id: string;
  suncorp_quote_number: string;
  policy_start_date: string;
  policy_expiry_date: string;
  market_value: number;
  sum_insured_type: string;
  annual_premium: number;
  annual_base_premium: number;
  annual_stamp_duty: number;
  annual_fsl: number;
  annual_gst: number;
  street_name: string;
  street_number: string;
  suburb: string;
  state: string;
  postcode: string;
  primary_usage: string;
  km_per_year: string;
  cover_type: string;
  standard_excess: number;
  has_fire_and_theft: boolean;
  has_rejected_insurance_or_claims: boolean;
  has_criminal_history: boolean;
  created_at: string;
}

const QuotePage = () => {
  const { quoteId } = useParams();
  const navigate = useNavigate();
  const { generateQuote, isGenerating } = useSuncorpQuote();
  const { calculatePrice } = usePricingScheme();
  const [showContactDialog, setShowContactDialog] = useState(false);
  
  const [quote, setQuote] = useState<Quote | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [namedDrivers, setNamedDrivers] = useState<NamedDriver[]>([]);
  const [totalClaimsCount, setTotalClaimsCount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [showClaimsError, setShowClaimsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialDriverEnsured, setInitialDriverEnsured] = useState(false);
  const [suncorpDetails, setSuncorpDetails] = useState<SuncorpQuoteDetails | null>(null);

  // Stepped flow state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedValue, setSelectedValue] = useState(0);

  // Quote generation states
  const [quoteGenerated, setQuoteGenerated] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showPayloadDialog, setShowPayloadDialog] = useState(false);
  const [actualSentPayload, setActualSentPayload] = useState<any>(null);
  const [errorDetails, setErrorDetails] = useState({
    error: "",
    requestPayload: null,
    responseData: null,
  });

  useEffect(() => {
    if (quoteId) {
      loadQuoteData();
    }
  }, [quoteId]);

  useEffect(() => {
    if (quote && vehicles[0]) {
      // Initialize selected value from vehicle market value
      setSelectedValue(vehicles[0].selected_coverage_value || vehicles[0].vehicle_value);
      calculateFinalPrice();
      setQuoteGenerated(!!quote.third_party_quote_number);
    }
  }, [namedDrivers, quote, vehicles]);

  // Auto-create first driver on page load
  useEffect(() => {
    if (!loading && quoteId && !initialDriverEnsured && namedDrivers.length === 0) {
      handleAddDriver().finally(() => setInitialDriverEnsured(true));
    }
  }, [loading, quoteId, initialDriverEnsured, namedDrivers.length]);

  const loadQuoteData = async () => {
    try {
      const { data: quoteData, error: quoteError } = await supabase
        .from("quotes")
        .select(`
          *,
          pricing_schemes (
            scheme_number,
            valid_from,
            floor_price,
            floor_point,
            ceiling_price,
            ceiling_point
          )
        `)
        .eq("id", quoteId)
        .maybeSingle();

      if (quoteError) throw quoteError;
      setQuote(quoteData);

      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from("quote_vehicles")
        .select("*")
        .eq("quote_id", quoteId);

      if (vehiclesError) throw vehiclesError;
      setVehicles(vehiclesData || []);

      const { data: driversData, error: driversError } = await supabase
        .from("named_drivers")
        .select("*")
        .eq("quote_id", quoteId);

      if (driversError) throw driversError;
      setNamedDrivers(driversData || []);

      const { data: suncorpData, error: suncorpError } = await supabase
        .from("suncorp_quote_details")
        .select("*")
        .eq("quote_id", quoteId)
        .maybeSingle();

      if (suncorpError && suncorpError.code !== 'PGRST116') {
        console.error("Error loading Suncorp details:", suncorpError);
      } else if (suncorpData) {
        setSuncorpDetails(suncorpData);
      }
    } catch (error) {
      console.error("Error loading quote:", error);
      toast.error("Failed to load quote data");
    } finally {
      setLoading(false);
    }
  };

  const calculateFinalPrice = () => {
    if (!quote) return;

    const basePrice = calculatePrice(selectedValue);
    const totalClaims = namedDrivers.reduce((sum, driver) => sum + (driver.claims_count || 0), 0);
    setTotalClaimsCount(totalClaims);

    const claimsCount = Math.min(totalClaims, 3);
    const loadingPercentage = claimsCount * 0.3;
    const loading = basePrice * loadingPercentage;
    const final = basePrice + loading;

    setFinalPrice(final);

    if (totalClaims >= 4) {
      setShowClaimsError(true);
    } else {
      setShowClaimsError(false);
    }
  };

  const handleAddDriver = async () => {
    try {
      const { data, error } = await supabase
        .from("named_drivers")
        .insert({
          quote_id: quoteId,
          first_name: null,
          last_name: null,
          gender: null,
          date_of_birth: '2000-01-01',
          claims_count: 0,
        })
        .select()
        .single();

      if (error) throw error;
      setNamedDrivers([...namedDrivers, data]);
    } catch (error) {
      console.error("Error adding driver:", error);
      toast.error("Failed to add driver");
    }
  };

  const handleDriverUpdate = async (id: string, field: string, value: any) => {
    const previousDrivers = namedDrivers;
    setNamedDrivers(prev =>
      prev.map((driver) =>
        driver.id === id ? { ...driver, [field]: value } : driver
      )
    );

    try {
      const { error } = await supabase
        .from("named_drivers")
        .update({ [field]: value })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating driver:", error);
      setNamedDrivers(previousDrivers);
      toast.error("Failed to update driver");
    }
  };

  const handleDriverUpdateMany = async (id: string, updates: Record<string, any>) => {
    const previousDrivers = namedDrivers;
    setNamedDrivers(prev =>
      prev.map((driver) =>
        driver.id === id ? { ...driver, ...updates } : driver
      )
    );

    try {
      const { error } = await supabase
        .from("named_drivers")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error batch updating driver:", error);
      setNamedDrivers(previousDrivers);
      toast.error("Failed to update driver");
    }
  };

  const handleValueChange = async (values: number[]) => {
    const newValue = values[0];
    setSelectedValue(newValue);
    
    // Recalculate price
    const newPrice = calculatePrice(newValue);
    setFinalPrice(newPrice);

    // Update vehicle in database
    if (vehicles[0]) {
      try {
        const { error } = await supabase
          .from("quote_vehicles")
          .update({ selected_coverage_value: newValue })
          .eq("id", vehicles[0].id);

        if (error) throw error;
      } catch (error) {
        console.error("Error updating vehicle value:", error);
      }
    }
  };

  const handleRecalculateQuote = async () => {
    if (!vehicles[0] || !namedDrivers[0]) {
      toast.error("Missing vehicle or driver information");
      return;
    }

    const driver = namedDrivers[0];

    if (!driver.first_name || !driver.last_name || !driver.date_of_birth || 
        !driver.gender || !driver.address_suburb || !driver.address_state || 
        !driver.address_postcode) {
      toast.error("Please complete all driver details before generating quote");
      return;
    }

    const missingFields = [];
    if (!driver.address_suburb) missingFields.push('suburb');
    if (!driver.address_state) missingFields.push('state');
    if (!driver.address_postcode) missingFields.push('postcode');
    if (!driver.address_line1) missingFields.push('address_line1');
    if (!driver.address_lurn) missingFields.push('LURN (address validation)');
    
    if (missingFields.length > 0) {
      console.error('[QuotePage] Missing address fields:', missingFields);
      toast.error('Address is incomplete. Please select and validate an address from suggestions.');
      return;
    }

    const policyStartDate = getDefaultPolicyStartDate();

    const result = await generateQuote(
      {
        registration_number: vehicles[0].registration_number,
        vehicle_make: vehicles[0].vehicle_make,
        vehicle_model: vehicles[0].vehicle_model,
        vehicle_year: vehicles[0].vehicle_year,
        vehicle_nvic: vehicles[0].vehicle_nvic,
        vehicle_value: selectedValue,
        vehicle_variant: vehicles[0].vehicle_variant || '',
      },
      {
        first_name: driver.first_name,
        last_name: driver.last_name,
        gender: driver.gender,
        date_of_birth: driver.date_of_birth,
        address_line1: driver.address_line1 || "",
        address_unit_type: driver.address_unit_type,
        address_unit_number: driver.address_unit_number,
        address_street_number: driver.address_street_number || "",
        address_street_name: driver.address_street_name || "",
        address_street_type: driver.address_street_type || "",
        address_suburb: driver.address_suburb || "",
        address_state: driver.address_state || "",
        address_postcode: driver.address_postcode || "",
        address_lurn: driver.address_lurn || "",
        address_latitude: driver.address_latitude,
        address_longitude: driver.address_longitude,
        address_gnaf_data: (quote as any)?.address_gnaf_data || null,
      },
      policyStartDate,
      quoteId!
    );

    if (result.success) {
      setActualSentPayload(result.sentPayload);
      
      try {
        const { error } = await supabase
          .from("quotes")
          .update({
            third_party_quote_number: result.quoteNumber,
            third_party_base_premium: result.basePremium,
            third_party_stamp_duty: result.stampDuty,
            third_party_gst: result.gst,
            third_party_total_premium: result.totalPremium,
            third_party_api_request_payload: result.requestPayload,
            third_party_api_response_data: result.responseData,
          })
          .eq("id", quoteId);

        if (error) throw error;

        await loadQuoteData();
        setQuoteGenerated(true);
        toast.success(`Third party quote generated: ${result.quoteNumber}`);
      } catch (error) {
        console.error("Error saving quote:", error);
        toast.error("Failed to save third party quote");
      }
    } else {
      setErrorDetails({
        error: result.error || "Unknown error",
        requestPayload: result.requestPayload || null,
        responseData: result.responseData || null,
      });
      setShowErrorDialog(true);
    }
  };

  const isStep1Complete = selectedValue > 0;
  const isStep2Complete = namedDrivers[0] && namedDrivers[0].address_lurn;
  const isStep3Complete = namedDrivers[0] && namedDrivers[0].first_name && namedDrivers[0].last_name && namedDrivers[0].date_of_birth && namedDrivers[0].gender;
  const isStep4Complete = true; // Policy date always has default
  
  const canProceedToStep2 = isStep1Complete;
  const canProceedToStep3 = isStep2Complete;
  const canProceedToStep4 = isStep3Complete;
  const canGenerateQuote = isStep1Complete && isStep2Complete && isStep3Complete && isStep4Complete;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!quote || vehicles.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Quote Not Found</h1>
          <p className="text-muted-foreground mb-6">We couldn't find the quote you're looking for.</p>
          <Button onClick={() => navigate("/")}>Return Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const vehicle = vehicles[0];
  const driver = namedDrivers[0];
  const tradeLow = vehicle.trade_low_price || vehicle.vehicle_value * 0.8;
  const retail = vehicle.retail_price || vehicle.vehicle_value * 1.2;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                step === currentStep
                  ? 'bg-primary text-primary-foreground font-bold scale-110'
                  : step < currentStep
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Display */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
                <img src={watermarkLogo} alt="" className="w-40 h-40 object-contain" />
              </div>
              
              <CardHeader>
                <CardTitle className="text-2xl">Your Vehicle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-start">
                  {vehicle.vehicle_image_url && (
                    <img
                      src={vehicle.vehicle_image_url}
                      alt={`${vehicle.vehicle_make} ${vehicle.vehicle_model}`}
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">
                      {vehicle.vehicle_year} {vehicle.vehicle_make} {vehicle.vehicle_model}
                    </h3>
                    <p className="text-muted-foreground">{vehicle.registration_number}</p>
                    {vehicle.vehicle_variant && (
                      <p className="text-sm text-muted-foreground">{vehicle.vehicle_variant}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 1: Vehicle Valuation */}
            {currentStep >= 1 && (
              <Card className="relative overflow-hidden">
                <div className="absolute top-4 right-4 opacity-8 pointer-events-none">
                  <img src={watermarkLogo} alt="" className="w-16 h-16 object-contain" />
                </div>
                
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Step 1: Vehicle Valuation</CardTitle>
                    {isStep1Complete && <Badge variant="default">Complete</Badge>}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">Trade Low</p>
                      <p className="text-lg font-bold">${Math.round(tradeLow).toLocaleString()}</p>
                    </div>
                    <div className="text-center p-3 bg-primary/10 rounded-lg border-2 border-primary">
                      <p className="text-xs text-muted-foreground">Market Value</p>
                      <p className="text-lg font-bold text-primary">${vehicle.vehicle_value.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">Retail</p>
                      <p className="text-lg font-bold">${Math.round(retail).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Selected Coverage Value</Label>
                      <Badge variant="outline" className="text-lg">${selectedValue.toLocaleString()}</Badge>
                    </div>
                    
                    <Slider
                      min={Math.round(tradeLow)}
                      max={Math.round(retail)}
                      step={100}
                      value={[selectedValue]}
                      onValueChange={handleValueChange}
                      className="w-full"
                    />
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>${Math.round(tradeLow).toLocaleString()}</span>
                      <span>${Math.round(retail).toLocaleString()}</span>
                    </div>
                  </div>

                  {canProceedToStep2 && currentStep === 1 && (
                    <Button
                      onClick={() => setCurrentStep(2)}
                      className="w-full"
                      size="lg"
                    >
                      Continue to Driver Address
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Driver Address */}
            {currentStep >= 2 && driver && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Step 2: Driver Address</CardTitle>
                    {isStep2Complete && <Badge variant="default">Complete</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DriverCard
                    driver={driver}
                    index={0}
                    onUpdate={handleDriverUpdate}
                    onUpdateMany={handleDriverUpdateMany}
                    showOnlyAddress
                  />

                  <div className="flex gap-3">
                    {currentStep === 2 && (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                    )}
                    {canProceedToStep3 && currentStep === 2 && (
                      <Button
                        onClick={() => setCurrentStep(3)}
                        className="flex-1"
                      >
                        Continue to Personal Details
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Personal Details */}
            {currentStep >= 3 && driver && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Step 3: Personal Details</CardTitle>
                    {isStep3Complete && <Badge variant="default">Complete</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DriverCard
                    driver={driver}
                    index={0}
                    onUpdate={handleDriverUpdate}
                    onUpdateMany={handleDriverUpdateMany}
                    showOnlyPersonal
                  />

                  <div className="flex gap-3">
                    {currentStep === 3 && (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(2)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                    )}
                    {canProceedToStep4 && currentStep === 3 && (
                      <Button
                        onClick={() => setCurrentStep(4)}
                        className="flex-1"
                      >
                        Continue to Policy Date
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Policy Start Date */}
            {currentStep >= 4 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Step 4: Policy Start Date</CardTitle>
                    {isStep4Complete && <Badge variant="default">Complete</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Policy will start on:</p>
                    <p className="text-xl font-bold">{new Date(getDefaultPolicyStartDate()).toLocaleDateString('en-AU')}</p>
                    <p className="text-xs text-muted-foreground mt-2">Default: Tomorrow at 12:01 AM</p>
                  </div>

                  <div className="flex gap-3">
                    {currentStep === 4 && (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(3)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                    )}
                    {currentStep === 4 && (
                      <Button
                        onClick={() => setCurrentStep(5)}
                        className="flex-1"
                      >
                        Continue to Quote Generation
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Generate Quote */}
            {currentStep >= 5 && (
              <Card>
                <CardHeader>
                  <CardTitle>Step 5: Generate Your Quote</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!quoteGenerated ? (
                    <>
                      <p className="text-muted-foreground">
                        All information is complete. Click below to get your third-party quote and see the final pricing.
                      </p>
                      
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentStep(4)}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={handleRecalculateQuote}
                          disabled={!canGenerateQuote || isGenerating}
                          className="flex-1"
                          size="lg"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            "Generate Quote"
                          )}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <p className="font-semibold">Quote Generated Successfully!</p>
                      </div>
                      <p className="text-muted-foreground">View the complete pricing breakdown in the sidebar.</p>
                      <Button
                        onClick={() => setShowContactDialog(true)}
                        size="lg"
                        className="w-full"
                      >
                        Contact Broker to Continue
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-4 relative overflow-hidden">
              {/* Watermark */}
              <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
                <img src={watermarkLogo} alt="" className="w-24 h-24 object-contain" />
              </div>

              <CardHeader>
                <CardTitle>Your Quote</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                {/* MCM Membership Price */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">MCM Membership Price</p>
                  <div className="text-3xl font-bold text-primary">
                    ${finalPrice.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">per year</p>
                </div>

                {totalClaimsCount > 0 && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                      Claims Loading Applied
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      {Math.min(totalClaimsCount, 3)} claim(s) × 30% = +{Math.min(totalClaimsCount * 30, 90)}%
                    </p>
                  </div>
                )}

                <Separator />

                {/* Third Party Section */}
                {suncorpDetails && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Third Party (Suncorp) Quote</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Base Premium</span>
                          <span className="font-semibold">${suncorpDetails.annual_base_premium?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Stamp Duty</span>
                          <span className="font-semibold">${suncorpDetails.annual_stamp_duty?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>FSL</span>
                          <span className="font-semibold">${suncorpDetails.annual_fsl?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>GST</span>
                          <span className="font-semibold">${suncorpDetails.annual_gst?.toFixed(2) || '0.00'}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-base">
                          <span className="font-semibold">Third Party Total</span>
                          <span className="font-bold">${suncorpDetails.annual_premium?.toFixed(2) || '0.00'}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Combined Total */}
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Combined Annual Premium</p>
                      <div className="text-2xl font-bold">
                        ${(finalPrice + (suncorpDetails.annual_premium || 0)).toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        MCM + Third Party comprehensive coverage
                      </p>
                    </div>

                    {/* Policy Details Collapsible */}
                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-semibold">
                        <span>Policy Details</span>
                        <ChevronDown className="w-4 h-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-3 space-y-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Quote Number</p>
                          <p className="font-mono text-xs">{suncorpDetails.suncorp_quote_number}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Cover Type</p>
                          <p>{suncorpDetails.cover_type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Policy Period</p>
                          <p>{new Date(suncorpDetails.policy_start_date).toLocaleDateString()} - {new Date(suncorpDetails.policy_expiry_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Risk Address</p>
                          <p>{suncorpDetails.street_number} {suncorpDetails.street_name}, {suncorpDetails.suburb} {suncorpDetails.state} {suncorpDetails.postcode}</p>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </>
                )}

                {quoteGenerated && (
                  <Button
                    onClick={() => setShowContactDialog(true)}
                    size="lg"
                    className="w-full"
                  >
                    Contact Broker
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />

      {/* Dialogs */}
      <QuoteGenerationOverlay isVisible={isGenerating} />
      <ContactBrokerDialog open={showContactDialog} onOpenChange={setShowContactDialog} />
      <QuoteErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        error={errorDetails.error}
        requestPayload={errorDetails.requestPayload}
        responseData={errorDetails.responseData}
      />
      <PayloadInspector
        open={showPayloadDialog}
        onOpenChange={setShowPayloadDialog}
        payload={actualSentPayload}
      />
    </div>
  );
};

export default QuotePage;