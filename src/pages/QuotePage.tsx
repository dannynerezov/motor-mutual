import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertCircle, ArrowLeft, Loader2, CheckCircle, XCircle, FileCode, ChevronDown, Info, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Sparkles, CheckCircle2, Car, Shield, Droplets, Cloud, Flame, Zap, AlertTriangle, CloudHail, CloudRain, ShieldCheck, ArrowRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DriverCard } from "@/components/DriverCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactBrokerDialog } from "@/components/ContactBrokerDialog";
import { QuoteGenerationOverlay } from "@/components/QuoteGenerationOverlay";
import { QuoteErrorDialog } from "@/components/QuoteErrorDialog";
import { useSuncorpQuote } from "@/hooks/useSuncorpQuote";
import { usePricingScheme } from "@/hooks/usePricingScheme";
import { getDefaultPolicyStartDate } from "@/lib/thirdPartyBulkLogic";
import { formatCurrency, generateCalculationExample } from "@/lib/pricingHelpers";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import watermarkLogo from "@/assets/mcm-logo-small-watermark.webp";
import { format, addDays } from "date-fns";

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
  state_of_registration?: string | null;
  vehicle_desc1?: string | null;
  vehicle_desc2?: string | null;
  vehicle_series?: string | null;
  vehicle_body_style?: string | null;
  vehicle_transmission?: string | null;
  vehicle_fuel_type?: string | null;
}

interface NamedDriver {
  id: string;
  driver_name?: string;
  first_name: string | null;
  last_name: string | null;
  gender: string | null;
  date_of_birth: string | null;
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
  const [membershipPrice, setMembershipPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [showClaimsError, setShowClaimsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialDriverEnsured, setInitialDriverEnsured] = useState(false);
  const [suncorpDetails, setSuncorpDetails] = useState<SuncorpQuoteDetails | null>(null);

  // Stepped flow state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedValue, setSelectedValue] = useState(0);
  const [policyStartDate, setPolicyStartDate] = useState<Date>();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  // Quote generation states
  const [quoteGenerated, setQuoteGenerated] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
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

  // Sync carousel with currentStep
  useEffect(() => {
    if (!carouselApi) return;
    
    carouselApi.on("select", () => {
      const index = carouselApi.selectedScrollSnap();
      setCurrentStep(index + 1);
    });
  }, [carouselApi]);

  // When currentStep changes programmatically, update carousel
  useEffect(() => {
    if (!carouselApi) return;
    carouselApi.scrollTo(currentStep - 1);
  }, [currentStep, carouselApi]);

  useEffect(() => {
    if (quote && vehicles[0]) {
      // Initialize selected value from vehicle market value
      setSelectedValue(vehicles[0].selected_coverage_value || vehicles[0].vehicle_value);
      const basePrice = calculatePrice(vehicles[0].selected_coverage_value || vehicles[0].vehicle_value);
      setMembershipPrice(basePrice);
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
          date_of_birth: null,
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
    setMembershipPrice(newPrice);
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

    const finalPolicyStartDate = policyStartDate 
      ? format(policyStartDate, 'yyyy-MM-dd')
      : getDefaultPolicyStartDate();

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
      finalPolicyStartDate,
      quoteId!
    );

    if (result.success) {
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

  // New 3-step completion logic
  const isStep1Complete = selectedValue > 0;
  const isStep2Complete = namedDrivers[0] && 
    namedDrivers[0].first_name && 
    namedDrivers[0].last_name && 
    namedDrivers[0].date_of_birth && 
    namedDrivers[0].gender && 
    namedDrivers[0].address_lurn;
  const isStep3Complete = !!policyStartDate;
  
  const canProceedToStep2 = isStep1Complete;
  const canProceedToStep3 = isStep2Complete;
  const canGenerateQuote = isStep1Complete && isStep2Complete && isStep3Complete;

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
  const hasGeneratedQuote = quoteGenerated;
  const quoteNumber = quote?.quote_number || "Pending";
  const tradeLow = vehicle.trade_low_price || vehicle.vehicle_value * 0.8;
  const retail = vehicle.retail_price || vehicle.vehicle_value * 1.2;

  // Calculate estimated price based on selected coverage
  const estimatedPrice = selectedValue ? calculatePrice(selectedValue) : membershipPrice;

  // Get calculation example
  const scheme = quote?.pricing_schemes ? {
    floor_price: quote.pricing_schemes.floor_price,
    floor_point: quote.pricing_schemes.floor_point,
    ceiling_price: quote.pricing_schemes.ceiling_price,
    ceiling_point: quote.pricing_schemes.ceiling_point,
  } : null;
  
  const calcExample = selectedValue && scheme ? 
    generateCalculationExample(selectedValue, estimatedPrice, scheme) : null;

  const coverageItems = [
    { icon: CheckCircle2, text: "Collision damage", color: "text-green-600" },
    { icon: Droplets, text: "Flood damage", color: "text-blue-600" },
    { icon: Cloud, text: "Hail damage", color: "text-purple-600" },
    { icon: Flame, text: "Fire damage", color: "text-red-600" },
    { icon: Zap, text: "Storm damage", color: "text-cyan-600" },
    { icon: AlertTriangle, text: "Theft", color: "text-orange-600" },
  ];

  const steps = [
    { number: 1, title: "Coverage Value", description: "Choose your protection level" },
    { number: 2, title: "Your Details", description: "Tell us about yourself" },
    { number: 3, title: "Start Date", description: "When to begin coverage" },
  ];

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

        {/* Progress Bar */}
        <div className="w-full mb-8">
          <div className="relative max-w-3xl mx-auto">
            {/* Progress bar background */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-muted rounded-full">
              {/* Active progress bar */}
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              />
            </div>
            
            {/* Step indicators */}
            <div className="relative flex justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  {/* Circle indicator */}
                  <div className={cn(
                    "w-10 h-10 rounded-full border-4 flex items-center justify-center",
                    "transition-all duration-300 bg-background z-10 font-semibold",
                    index + 1 < currentStep && "border-accent bg-accent text-white",
                    index + 1 === currentStep && "border-primary bg-primary text-white scale-110",
                    index + 1 > currentStep && "border-muted-foreground/30 text-muted-foreground"
                  )}>
                    {index + 1 < currentStep ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                  </div>
                  
                  {/* Step label */}
                  <div className="mt-2 text-center max-w-[150px]">
                    <p className={cn(
                      "text-sm font-semibold",
                      index + 1 === currentStep ? "text-primary" : "text-muted-foreground"
                    )}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 hidden md:block">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Carousel Container */}
            <Carousel
              setApi={setCarouselApi}
              opts={{
                align: "start",
                watchDrag: false,
              }}
              className="w-full"
            >
              <CarouselContent>
                {/* Step 1: Select Your Coverage Value */}
                <CarouselItem>
                  {vehicle && (
                    <Card className="shadow-2xl bg-gradient-to-br from-card via-card to-primary/5 border-2 border-primary/30 relative overflow-hidden min-h-[600px]">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full" />
                      
                      <CardHeader className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-primary font-bold">1</span>
                            </div>
                            <Badge variant="outline" className="text-xs">Step 1 of 3</Badge>
                          </div>
                          {isStep1Complete && <Badge variant="default">Complete</Badge>}
                        </div>
                        <CardTitle className="text-2xl">Select Your Coverage Value</CardTitle>
                        <CardDescription>
                          Adjust coverage for your {vehicle.vehicle_year} {vehicle.vehicle_make} {vehicle.vehicle_model}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <AlertTitle className="text-blue-900 dark:text-blue-100">About Coverage Value</AlertTitle>
                          <AlertDescription className="text-blue-700 dark:text-blue-300">
                            Your coverage value determines the maximum MCM will pay for total loss. 
                            Choose between {formatCurrency(tradeLow)} (Trade Low) and {formatCurrency(retail)} (Retail).
                          </AlertDescription>
                        </Alert>

                        {/* Vehicle Display */}
                        <div className={cn(
                          "p-6 bg-muted/30 rounded-xl border border-primary/20",
                          vehicle.vehicle_image_url ? "grid md:grid-cols-2 gap-6" : "flex flex-col items-center"
                        )}>
                          {vehicle.vehicle_image_url ? (
                            <div className="flex items-center justify-center">
                              <div className="w-full p-4 bg-background/50 rounded-lg border border-primary/20 shadow-lg">
                                <img
                                  src={vehicle.vehicle_image_url}
                                  alt={`${vehicle.vehicle_make} ${vehicle.vehicle_model}`}
                                  className="w-full h-auto object-contain rounded-lg"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="w-full flex items-center justify-center p-8 bg-background/50 rounded-lg border border-primary/20 mb-4">
                              <Car className="w-24 h-24 text-muted-foreground/30" />
                            </div>
                          )}
                          
                          <div className={cn("space-y-4", !vehicle.vehicle_image_url && "max-w-2xl w-full")}>
                            <div>
                              <h3 className="text-2xl font-bold">
                                {vehicle.vehicle_year} {vehicle.vehicle_make}
                              </h3>
                              <p className="text-xl text-muted-foreground">{vehicle.vehicle_model}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="p-3 bg-background/50 rounded-lg">
                                <p className="text-muted-foreground text-xs mb-1">Registration</p>
                                <p className="font-semibold">{vehicle.registration_number}</p>
                              </div>
                              {vehicle.state_of_registration && (
                                <div className="p-3 bg-background/50 rounded-lg">
                                  <p className="text-muted-foreground text-xs mb-1">State</p>
                                  <p className="font-semibold">{vehicle.state_of_registration}</p>
                                </div>
                              )}
                              {vehicle.vehicle_nvic && (
                                <div className="p-3 bg-background/50 rounded-lg">
                                  <p className="text-muted-foreground text-xs mb-1">NVIC</p>
                                  <Badge variant="secondary" className="font-mono text-xs">{vehicle.vehicle_nvic}</Badge>
                                </div>
                              )}
                            </div>
                            
                            {(vehicle.vehicle_desc1 || vehicle.vehicle_desc2) && (
                              <div className="space-y-1 pt-2 border-t border-border/50">
                                {vehicle.vehicle_desc1 && <p className="text-sm text-muted-foreground">{vehicle.vehicle_desc1}</p>}
                                {vehicle.vehicle_desc2 && <p className="text-sm text-muted-foreground">{vehicle.vehicle_desc2}</p>}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Label>Selected Coverage Value</Label>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger><Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <p>Range: {formatCurrency(tradeLow)} to {formatCurrency(retail)}<br/>
                                    Maximum payout for total loss. Higher coverage = higher premium.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <span className="text-2xl font-bold text-primary">{formatCurrency(selectedValue)}</span>
                          </div>
                          
                          <Slider
                            min={Math.round(tradeLow)}
                            max={Math.round(retail)}
                            step={100}
                            value={[selectedValue]}
                            onValueChange={handleValueChange}
                          />
                          
                          <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Estimated Premium</p>
                            <p className="text-3xl font-bold text-primary">{formatCurrency(membershipPrice)}</p>
                            <p className="text-xs text-muted-foreground mt-1">per year</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-8">
                          <Button 
                            size="lg" 
                            onClick={() => {
                              if (carouselApi) carouselApi.scrollNext();
                            }} 
                            disabled={!isStep1Complete} 
                            className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent"
                          >
                            Next: Your Details
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CarouselItem>

                {/* Step 2: Enter Your Details */}
                <CarouselItem>
                  {driver && (
                    <Card className="min-h-[600px]">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-primary font-bold">2</span>
                            </div>
                            <CardTitle>Enter Your Details</CardTitle>
                          </div>
                          {isStep2Complete && <Badge variant="default">Complete</Badge>}
                        </div>
                        <CardDescription>Step 2 of 3</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground mb-4">
                          Please provide your personal information and overnight parking address.
                        </p>

                        <DriverCard
                          driver={driver}
                          onUpdate={handleDriverUpdate}
                          onUpdateMany={handleDriverUpdateMany}
                        />

                        <div className="flex gap-3 mt-8">
                          <Button
                            variant="outline"
                            onClick={() => {
                              if (carouselApi) carouselApi.scrollPrev();
                            }}
                            className="flex-1"
                          >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Back
                          </Button>
                          {canProceedToStep3 && (
                            <Button
                              onClick={() => {
                                if (carouselApi) carouselApi.scrollNext();
                              }}
                              className="flex-1"
                            >
                              Next: Start Date
                              <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CarouselItem>

                {/* Step 3: Membership Start Date */}
                <CarouselItem>
                  <Card className="min-h-[600px]">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary font-bold">3</span>
                          </div>
                          <CardTitle>Membership Start Date</CardTitle>
                        </div>
                        {isStep3Complete && <Badge variant="default">Complete</Badge>}
                      </div>
                      <CardDescription>Step 3 of 3</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Select when your membership should begin (up to 28 days from today).
                      </p>

                      <div className="space-y-2">
                        <Label>Policy Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={`w-full justify-start text-left font-normal ${!policyStartDate && "text-muted-foreground"}`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {policyStartDate ? format(policyStartDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={policyStartDate}
                              onSelect={setPolicyStartDate}
                              disabled={(date) => 
                                date < new Date() || date > addDays(new Date(), 28)
                              }
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <p className="text-xs text-muted-foreground">
                          You can select any date from today up to 28 days in the future.
                        </p>
                      </div>

                      <div className="flex gap-3 mt-8">
                        <Button
                          variant="outline"
                          onClick={() => {
                            if (carouselApi) carouselApi.scrollPrev();
                          }}
                          className="flex-1"
                        >
                          <ChevronLeft className="w-4 h-4 mr-2" />
                          Back
                        </Button>
                        {isStep3Complete && !quoteGenerated && (
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
                              "Generate My Final Quote"
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              </CarouselContent>
            </Carousel>

            {/* Final CTA after Quote Generated */}
            {quoteGenerated && currentStep === 3 && (
              <Card className="border-green-600 bg-green-50 dark:bg-green-950">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
                    <CheckCircle className="w-6 h-6" />
                    Quote Generated Successfully!
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-green-900 dark:text-green-100">
                    Your comprehensive quote is ready. Review the pricing breakdown in the sidebar and contact our broker to proceed.
                  </p>
                  <Button
                    onClick={() => setShowContactDialog(true)}
                    size="lg"
                    className="w-full"
                  >
                    Contact Broker to Continue
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-4 relative overflow-hidden shadow-lg">
              {/* Watermark */}
              <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
                <img src={watermarkLogo} alt="" className="w-24 h-24 object-contain" />
              </div>

              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 relative z-10">
                {!quoteGenerated ? (
                  <div>
                    <CardTitle className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      Quote Number
                    </CardTitle>
                    {quote?.quote_number && (
                      <div className="text-3xl font-bold text-primary">
                        #{quote.quote_number}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      Your Quote
                    </CardTitle>
                    {quote?.quote_number && (
                      <Badge variant="outline" className="text-xs">
                        #{quote.quote_number}
                      </Badge>
                    )}
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6 pt-6 relative z-10">
                {!quoteGenerated ? (
                  <>
                    {/* Vehicle Info */}
                    {vehicle && (
                      <div className="p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg border border-border/50">
                        <p className="text-xs text-muted-foreground mb-2 font-medium">Loss or damage cover for</p>
                        <p className="font-bold text-lg text-foreground">{vehicle.registration_number}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {vehicle.vehicle_year} {vehicle.vehicle_make} {vehicle.vehicle_model}
                        </p>
                      </div>
                    )}
                    
                    {/* Estimated Price */}
                    {selectedValue > 0 && (
                      <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/30 shadow-sm">
                        <p className="text-sm text-muted-foreground mb-2 font-medium">Estimated Price</p>
                        <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          ${membershipPrice.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">per year</p>
                      </div>
                    )}
                    
                    {/* What's Covered */}
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-foreground">What's Covered:</p>
                      <div className="grid grid-cols-2 gap-2.5">
                        {[
                          { icon: CheckCircle2, text: "Collision damage", color: "text-green-600 dark:text-green-400" },
                          { icon: Droplets, text: "Flood damage", color: "text-blue-600 dark:text-blue-400" },
                          { icon: CloudHail, text: "Hail damage", color: "text-purple-600 dark:text-purple-400" },
                          { icon: Flame, text: "Fire damage", color: "text-red-600 dark:text-red-400" },
                          { icon: CloudRain, text: "Storm damage", color: "text-cyan-600 dark:text-cyan-400" },
                          { icon: AlertTriangle, text: "Theft", color: "text-orange-600 dark:text-orange-400" },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <item.icon className={`w-4 h-4 flex-shrink-0 ${item.color}`} />
                            <span className="text-foreground text-xs leading-tight">{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* MCM Coverage Explanation */}
                    {vehicle && selectedValue > 0 && (
                      <Alert className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800">
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertTitle className="text-blue-900 dark:text-blue-100 text-sm font-semibold">
                          MCM Membership Coverage
                        </AlertTitle>
                        <AlertDescription className="text-blue-700 dark:text-blue-300 text-xs mt-1">
                          Covers damage to your vehicle ({vehicle.registration_number}) while on rideshare duty. 
                          Maximum payout: ${formatCurrency(selectedValue)}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {/* Progress Indicator */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium">Quote Progress</span>
                        <span className="font-semibold">{currentStep}/3 steps</span>
                      </div>
                      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary via-primary/80 to-accent transition-all duration-500 ease-out"
                          style={{ width: `${(currentStep / 3) * 100}%` }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    {/* Header: Suncorp Quote Reference (Prominent) */}
                    {suncorpDetails?.suncorp_quote_number && (
                      <div className="p-3 bg-muted/30 rounded-md border">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">Underwriter Quote Reference</p>
                            <p className="font-mono text-sm font-bold mt-0.5">
                              {suncorpDetails.suncorp_quote_number}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">Suncorp</Badge>
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* INVOICE SECTION */}
                    <div className="space-y-3 text-sm">
                      {/* Line Item 1: MCM Membership */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-foreground font-medium">MCM Membership</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs" side="left">
                                <p className="text-xs font-semibold mb-1">Accidental Loss & Damage Cover</p>
                                <p className="text-xs mb-2">
                                  Protects {vehicle?.registration_number} while on rideshare duty against:
                                </p>
                                <ul className="text-xs space-y-0.5 list-disc list-inside">
                                  <li>Collision damage</li>
                                  <li>Theft and attempted theft</li>
                                  <li>Fire and explosion</li>
                                  <li>Storm, hail, flood damage</li>
                                  <li>Vandalism</li>
                                </ul>
                                <p className="text-xs mt-2 pt-2 border-t">
                                  <strong>Max payout:</strong> ${formatCurrency(selectedValue)}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <span className="font-semibold tabular-nums">
                          ${finalPrice.toFixed(2)}
                        </span>
                      </div>

                      {/* Claims Loading (if applicable) */}
                      {totalClaimsCount > 0 && (
                        <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-400 pl-6">
                          <span>Claims loading ({totalClaimsCount} × 30%)</span>
                          <span>+{Math.min(totalClaimsCount * 30, 90)}%</span>
                        </div>
                      )}

                      <Separator className="my-2" />

                      {/* Line Item 2: Third Party Reinsurance */}
                      {suncorpDetails && (
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-foreground font-medium">Third Party Reinsurance</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs" side="left">
                                    <p className="text-xs font-semibold mb-1">What This Covers</p>
                                    <p className="text-xs mb-2">
                                      Covers damage you cause to other vehicles, property (traffic lights, fences, buildings), and legal liability.
                                    </p>
                                    <p className="text-xs pt-2 border-t">
                                      <strong>Important:</strong> The Mutual does not set this price. Premium calculated by underwriter based on risk factors including overnight parking address, driving history, vehicle details, and claims experience.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <span className="font-semibold tabular-nums">
                              ${suncorpDetails.annual_premium?.toFixed(2) || '0.00'}
                            </span>
                          </div>

                          {/* Collapsible Breakdown */}
                          <Collapsible>
                            <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors pl-6">
                              <ChevronDown className="w-3 h-3" />
                              <span>View breakdown</span>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pl-6 pt-2 space-y-1.5 text-xs">
                              <div className="flex justify-between text-muted-foreground">
                                <span>Base Premium</span>
                                <span className="tabular-nums">${suncorpDetails.annual_base_premium?.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-muted-foreground">
                                <span>Stamp Duty</span>
                                <span className="tabular-nums">${suncorpDetails.annual_stamp_duty?.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-muted-foreground">
                                <span>Fire Services Levy</span>
                                <span className="tabular-nums">${suncorpDetails.annual_fsl?.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-muted-foreground">
                                <span>GST</span>
                                <span className="tabular-nums">${suncorpDetails.annual_gst?.toFixed(2)}</span>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      )}

                      <Separator className="my-3" />

                      {/* TOTAL - Large and Prominent */}
                      <div className="pt-2 pb-3 px-4 -mx-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-primary/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-foreground uppercase tracking-wide">
                              Total Annual Membership
                            </span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs" side="left">
                                  <p className="text-xs font-semibold mb-2">Complete Coverage Package</p>
                                  <div className="text-xs space-y-1 mb-2">
                                    <p><CheckCircle2 className="w-3 h-3 inline mr-1" />Damage to your vehicle</p>
                                    <p><CheckCircle2 className="w-3 h-3 inline mr-1" />Damage to other vehicles & property</p>
                                    <p><CheckCircle2 className="w-3 h-3 inline mr-1" />Legal liability coverage</p>
                                  </div>
                                  <p className="text-xs pt-2 border-t text-red-600 dark:text-red-400">
                                    <strong>Exclusions:</strong> CTP insurance and bodily injury to other drivers/pedestrians NOT covered. CTP must be obtained separately.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                        <div className="text-4xl font-bold text-primary tabular-nums">
                          ${(finalPrice + (suncorpDetails?.annual_premium || 0)).toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">per year</p>
                      </div>
                    </div>

                    <Separator />

                    {/* CTA Button */}
                    <Button
                      onClick={() => setShowContactDialog(true)}
                      size="lg"
                      className="w-full"
                    >
                      Contact Broker to Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
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
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        error={errorDetails.error}
        requestPayload={errorDetails.requestPayload}
        responseData={errorDetails.responseData}
      />
    </div>
  );
};

export default QuotePage;