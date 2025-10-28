import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertCircle, Info, ArrowLeft, Loader2, CheckCircle, XCircle, FileCode, ChevronDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DriverCard } from "@/components/DriverCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactBrokerDialog } from "@/components/ContactBrokerDialog";
import { QuoteGenerationOverlay } from "@/components/QuoteGenerationOverlay";
import { QuoteErrorDialog } from "@/components/QuoteErrorDialog";
import { useSuncorpQuote } from "@/hooks/useSuncorpQuote";
import { getDefaultPolicyStartDate } from "@/lib/thirdPartyBulkLogic";
import { toast } from "sonner";

interface Quote {
  id: string;
  quote_number: string;
  total_base_price: number;
  total_final_price: number;
  status: string;
  pricing_scheme_id: string | null;
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
  selected_coverage_value: number;
  vehicle_image_url: string | null;
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

const QuotePage = () => {
  const { quoteId } = useParams();
  const navigate = useNavigate();
  const { generateQuote, isGenerating } = useSuncorpQuote();
  const [showContactDialog, setShowContactDialog] = useState(false);
  
  const [quote, setQuote] = useState<Quote | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [namedDrivers, setNamedDrivers] = useState<NamedDriver[]>([]);
  const [totalClaimsCount, setTotalClaimsCount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [showClaimsError, setShowClaimsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialDriverEnsured, setInitialDriverEnsured] = useState(false);

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

  useEffect(() => {
    if (quote) {
      calculateFinalPrice();
      // Check if third party quote already exists
      setQuoteGenerated(!!quote.third_party_quote_number);
    }
  }, [namedDrivers, quote]);

  // Auto-create first driver on page load (single driver only)
  useEffect(() => {
    if (!loading && quoteId && !initialDriverEnsured && namedDrivers.length === 0) {
      handleAddDriver().finally(() => setInitialDriverEnsured(true));
    }
  }, [loading, quoteId, initialDriverEnsured, namedDrivers.length]);

  const loadQuoteData = async () => {
    try {
      // Load quote
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

      // Load vehicles
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from("quote_vehicles")
        .select("*")
        .eq("quote_id", quoteId);

      if (vehiclesError) throw vehiclesError;
      setVehicles(vehiclesData || []);

      // Load named drivers
      const { data: driversData, error: driversError } = await supabase
        .from("named_drivers")
        .select("*")
        .eq("quote_id", quoteId);

      if (driversError) throw driversError;
      setNamedDrivers(driversData || []);
    } catch (error) {
      console.error("Error loading quote:", error);
      toast.error("Failed to load quote data");
    } finally {
      setLoading(false);
    }
  };

  const calculateFinalPrice = () => {
    if (!quote) return;

    const basePrice = quote.total_base_price || 0;
    const totalClaims = namedDrivers.reduce((sum, driver) => sum + (driver.claims_count || 0), 0);
    setTotalClaimsCount(totalClaims);

    // 30% loading per claim, max 3 claims
    const claimsCount = Math.min(totalClaims, 3);
    const loadingPercentage = claimsCount * 0.3;
    const loading = basePrice * loadingPercentage;
    const final = basePrice + loading;

    setFinalPrice(final);

    // Check if too many claims
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
    // Optimistic update: Update UI immediately with functional state update
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
      // Revert on failure
      setNamedDrivers(previousDrivers);
      toast.error("Failed to update driver");
    }
  };

  const handleDriverUpdateMany = async (id: string, updates: Record<string, any>) => {
    // Batch update multiple fields at once with functional state update
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
      // Revert on failure
      setNamedDrivers(previousDrivers);
      toast.error("Failed to update driver");
    }
  };

  const handleRecalculateQuote = async () => {
    if (!vehicles[0] || !namedDrivers[0]) {
      toast.error("Missing vehicle or driver information");
      return;
    }

    const driver = namedDrivers[0];

    // Validate driver is complete
    if (!driver.first_name || !driver.last_name || !driver.date_of_birth || 
        !driver.gender || !driver.address_suburb || !driver.address_state || 
        !driver.address_postcode) {
      toast.error("Please complete all driver details before generating quote");
      return;
    }

    // Guardrail: Check required address fields
    const missingFields = [];
    if (!driver.address_suburb) missingFields.push('suburb');
    if (!driver.address_state) missingFields.push('state');
    if (!driver.address_postcode) missingFields.push('postcode');
    if (!driver.address_line1) missingFields.push('address_line1');
    
    if (missingFields.length > 0) {
      console.error('[QuotePage] Missing address fields:', missingFields);
      toast.error('Address is incomplete. Please select an address from suggestions.');
      return;
    }

    console.assert(!!driver.address_suburb && !!driver.address_state && !!driver.address_postcode,
      '[QuotePage] Invariant: Address fields should be present before quote generation');

    const policyStartDate = getDefaultPolicyStartDate();

    const result = await generateQuote(
      {
        registration_number: vehicles[0].registration_number,
        vehicle_make: vehicles[0].vehicle_make,
        vehicle_model: vehicles[0].vehicle_model,
        vehicle_year: vehicles[0].vehicle_year,
        vehicle_nvic: vehicles[0].vehicle_nvic,
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
      },
      policyStartDate
    );

    if (result.success) {
      // Save to database
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

        // Reload quote data
        await loadQuoteData();
        setQuoteGenerated(true);
        toast.success(`Third party quote generated: ${result.quoteNumber}`);
      } catch (error) {
        console.error("Error saving quote:", error);
        toast.error("Failed to save third party quote");
      }
    } else {
      // Show error dialog
      setErrorDetails({
        error: result.error || "Unknown error",
        requestPayload: result.requestPayload || null,
        responseData: result.responseData || null,
      });
      setShowErrorDialog(true);
    }
  };

  // Check if driver is complete
  const isDriverComplete = namedDrivers[0] && 
    namedDrivers[0].first_name && 
    namedDrivers[0].last_name && 
    namedDrivers[0].date_of_birth && 
    namedDrivers[0].gender && 
    namedDrivers[0].address_suburb && 
    namedDrivers[0].address_state && 
    namedDrivers[0].address_postcode &&
    namedDrivers[0].address_lurn; // Require LURN now

  // Payload readiness checks
  const buildPayloadPreview = () => {
    if (!namedDrivers[0] || !vehicles[0]) return null;
    return {
      vehicle: {
        registration_number: vehicles[0].registration_number,
        vehicle_make: vehicles[0].vehicle_make,
        vehicle_model: vehicles[0].vehicle_model,
        vehicle_year: vehicles[0].vehicle_year,
        vehicle_nvic: vehicles[0].vehicle_nvic || null,
      },
      driver: {
        first_name: namedDrivers[0].first_name || null,
        last_name: namedDrivers[0].last_name || null,
        gender: namedDrivers[0].gender || null,
        date_of_birth: namedDrivers[0].date_of_birth || null,
        address_line1: namedDrivers[0].address_line1 || null,
        address_unit_type: namedDrivers[0].address_unit_type,
        address_unit_number: namedDrivers[0].address_unit_number,
        address_street_number: namedDrivers[0].address_street_number || null,
        address_street_name: namedDrivers[0].address_street_name || null,
        address_street_type: namedDrivers[0].address_street_type || null,
        address_suburb: namedDrivers[0].address_suburb || null,
        address_state: namedDrivers[0].address_state || null,
        address_postcode: namedDrivers[0].address_postcode || null,
      },
      policyStartDate: policyStartDate,
    };
  };

  const getMissingFields = (): string[] => {
    const missing: string[] = [];
    if (!vehicles[0]) {
      missing.push('Vehicle');
      return missing;
    }
    if (!namedDrivers[0]) {
      missing.push('Driver');
      return missing;
    }
    const driver = namedDrivers[0];
    if (!driver.first_name) missing.push('First Name');
    if (!driver.last_name) missing.push('Last Name');
    if (!driver.date_of_birth) missing.push('Date of Birth');
    if (!driver.gender) missing.push('Gender');
    if (!driver.address_lurn) missing.push('Validated Address');
    if (!policyStartDate) missing.push('Policy Start Date');
    return missing;
  };

  const isPayloadReady = () => {
    return vehicles[0] && namedDrivers[0] && 
      namedDrivers[0].first_name && 
      namedDrivers[0].last_name && 
      namedDrivers[0].date_of_birth && 
      namedDrivers[0].gender && 
      namedDrivers[0].address_lurn && 
      policyStartDate;
  };

  // Debug completion status (temporary)
  if (namedDrivers[0] && !isDriverComplete) {
    const missing = [];
    if (!namedDrivers[0].first_name) missing.push('first_name');
    if (!namedDrivers[0].last_name) missing.push('last_name');
    if (!namedDrivers[0].date_of_birth) missing.push('date_of_birth');
    if (!namedDrivers[0].gender) missing.push('gender');
    if (!namedDrivers[0].address_suburb) missing.push('address_suburb');
    if (!namedDrivers[0].address_state) missing.push('address_state');
    if (!namedDrivers[0].address_postcode) missing.push('address_postcode');
    if (!namedDrivers[0].address_lurn) missing.push('address_lurn');
    if (missing.length > 0) {
      console.debug('Driver incomplete, missing:', missing.join(', '));
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading quote...</p>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Quote not found</p>
            <Button className="w-full mt-4" onClick={() => navigate("/")}>
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate completion progress for the interactive section
  const getDriverCompletion = (driver: NamedDriver) => {
    const steps = [
      driver.first_name && driver.last_name,
      driver.date_of_birth,
      driver.gender,
      true, // claims always has default
      driver.address_suburb && driver.address_state && driver.address_postcode,
    ];
    return steps.filter(Boolean).length;
  };

  const totalSteps = 5;
  const completedSteps = namedDrivers[0] ? getDriverCompletion(namedDrivers[0]) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Loading Overlay */}
      <QuoteGenerationOverlay isVisible={isGenerating} />

      {/* Error Dialog */}
      <QuoteErrorDialog
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        error={errorDetails.error}
        requestPayload={errorDetails.requestPayload}
        responseData={errorDetails.responseData}
      />
      
      {/* Header Bar - Above Grid */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="w-fit">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Vehicle Selection
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Quote Number</p>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {quote.quote_number}
                </h1>
              </div>
              <Badge variant="outline" className="text-base md:text-lg px-3 md:px-4 py-1">Draft</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interactive Progress Alert */}
            {namedDrivers.length > 0 && (
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer" />
                
                <CardContent className="pt-6 relative z-10">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Info className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Complete Your Quote</h3>
                      <p className="text-sm text-muted-foreground">
                        Fill in driver details below. Click "Recalculate Quote" when complete to get third-party pricing.
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
                        style={{ width: `${totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      {completedSteps} of {totalSteps} steps completed
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Vehicle Details */}
            <Card>
              <CardHeader>
                <CardTitle>Your Vehicle</CardTitle>
              </CardHeader>
              <CardContent>
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Rego</p>
                        <p className="font-semibold">
                          {vehicle.registration_number}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Make/Model
                        </p>
                        <p className="font-semibold">
                          {vehicle.vehicle_make} {vehicle.vehicle_model}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Year</p>
                        <p className="font-semibold">{vehicle.vehicle_year}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Sum Covered
                        </p>
                        <p className="font-semibold">
                          ${vehicle.selected_coverage_value.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Primary Driver Section */}
            <Card>
              <CardHeader>
                <CardTitle>Primary Driver</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Complete all driver details to generate your third-party property damage quote.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {namedDrivers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading driver form...</p>
                  </div>
                ) : (
                  <>
                    {namedDrivers.map((driver) => (
                      <DriverCard
                        key={driver.id}
                        driver={driver}
                        onUpdate={handleDriverUpdate}
                        onUpdateMany={handleDriverUpdateMany}
                      />
                    ))}

                    {showClaimsError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Unable to Provide Cover</AlertTitle>
                        <AlertDescription>
                          Memberships cannot be offered to drivers with 4 or more
                          claims in the last 3 years.
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Membership covers all drivers holding a valid licence, but
                    penalty excess applies for unnamed drivers.
                  </AlertDescription>
                </Alert>

                {/* API Payload Review Section */}
                {namedDrivers.length > 0 && (
                  <Card className="border-blue-200 bg-blue-50/50 mt-6">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileCode className="w-5 h-5" />
                        API Request Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Readiness Checklist */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Payload Readiness</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            {vehicles[0] ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                            <span>Vehicle Data</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {namedDrivers[0]?.address_lurn ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                            <span>Address LURN</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {namedDrivers[0]?.first_name && namedDrivers[0]?.last_name ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                            <span>Driver Name</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {namedDrivers[0]?.date_of_birth ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                            <span>Date of Birth</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {namedDrivers[0]?.gender ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                            <span>Gender</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {policyStartDate ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                            <span>Policy Start Date</span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Payload Preview (Collapsible) */}
                      <Collapsible>
                        <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:underline">
                          <ChevronDown className="w-4 h-4" />
                          View JSON Payload
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <pre className="mt-2 p-3 bg-gray-900 text-green-400 rounded text-xs overflow-x-auto max-h-64">
                            {JSON.stringify(buildPayloadPreview(), null, 2)}
                          </pre>
                        </CollapsibleContent>
                      </Collapsible>

                      {/* Status Message */}
                      {isPayloadReady() ? (
                        <Alert className="bg-green-100 border-green-600">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <AlertDescription>
                            Payload is ready. You can click "Recalculate Quote" to send the API request.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Alert className="bg-amber-100 border-amber-600">
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                          <AlertDescription>
                            Please complete all required fields above before generating a quote.
                            {getMissingFields().length > 0 && (
                              <span className="block mt-1 font-medium">
                                Missing: {getMissingFields().join(', ')}
                              </span>
                            )}
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Price Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Your Membership</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* MCM Mutual Membership Section */}
                <div className="pb-4 border-b">
                  <h3 className="text-lg font-semibold mb-3">MCM Rideshare Coverage</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Base Premium</p>
                      <p className="font-semibold">
                        ${quote.total_base_price?.toLocaleString() || "0"}
                      </p>
                    </div>

                    {totalClaimsCount > 0 && (
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">
                            Claims Loading ({totalClaimsCount}{" "}
                            {totalClaimsCount === 1 ? "claim" : "claims"})
                          </p>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-3 h-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">Each claim adds 30% to base price (maximum 3 claims counted)</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <p className="font-semibold text-orange-600">
                          +$
                          {(
                            ((quote.total_base_price || 0) *
                              0.3 *
                              Math.min(totalClaimsCount, 3))
                          ).toLocaleString()}
                        </p>
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-between pt-2">
                      <p className="font-bold">Total MCM Premium</p>
                      <p className="text-xl font-bold text-primary">
                        ${finalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Third Party Section - Only show if quote generated */}
                {quote.third_party_quote_number && (
                  <div className="pb-4 border-b">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">Third Party Property Damage</h3>
                      <Badge variant="outline" className="text-xs">
                        {quote.third_party_quote_number}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <p className="text-muted-foreground">Base Premium</p>
                        <p>${quote.third_party_base_premium?.toFixed(2) || "0.00"}</p>
                      </div>
                      <div className="flex justify-between text-sm">
                        <p className="text-muted-foreground">Stamp Duty</p>
                        <p>${quote.third_party_stamp_duty?.toFixed(2) || "0.00"}</p>
                      </div>
                      <div className="flex justify-between text-sm">
                        <p className="text-muted-foreground">GST</p>
                        <p>${quote.third_party_gst?.toFixed(2) || "0.00"}</p>
                      </div>

                      <Separator />

                      <div className="flex justify-between pt-2">
                        <p className="font-bold">Total Third Party</p>
                        <p className="text-xl font-bold text-accent">
                          ${quote.third_party_total_premium?.toFixed(2) || "0.00"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Combined Total */}
                {quote.third_party_quote_number && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Combined Annual Premium</span>
                      <span className="text-3xl font-bold text-primary">
                        ${(finalPrice + (quote.third_party_total_premium || 0)).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      MCM ${finalPrice.toFixed(2)} + Third Party ${quote.third_party_total_premium?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                )}

                <Separator />

                {/* Recalculate Quote Button - Show if form complete but not yet quoted */}
                {isDriverComplete && !quoteGenerated && (
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={handleRecalculateQuote}
                    disabled={isGenerating || showClaimsError}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      'Recalculate Quote'
                    )}
                  </Button>
                )}

                {/* Contact Broker Button - Only show after quote generated */}
                {quoteGenerated && (
                  <Button 
                    size="lg" 
                    className="w-full"
                    disabled={showClaimsError}
                    onClick={() => setShowContactDialog(true)}
                  >
                    Contact Broker to Buy
                  </Button>
                )}

                {/* Pricing Scheme Info - Collapsible */}
                {quote.pricing_schemes && (
                  <Collapsible className="mt-4">
                    <CollapsibleTrigger className="flex items-center gap-2 w-full text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Info className="w-4 h-4" />
                      <span>Pricing Details</span>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3">
                      <div className="text-xs bg-muted/30 rounded-lg p-3 space-y-1">
                        <p className="font-semibold">
                          Pricing Scheme #{quote.pricing_schemes.scheme_number}
                        </p>
                        <p className="text-muted-foreground">
                          Active from {new Date(quote.pricing_schemes.valid_from).toLocaleDateString('en-AU')}
                        </p>
                        <p className="font-mono text-xs mt-2">
                          Base: ${quote.pricing_schemes.floor_price} + linear adjustment up to ${quote.pricing_schemes.ceiling_price}
                        </p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                <p className="text-xs text-muted-foreground text-center">
                  This is an indicative price. Final price confirmed after
                  acceptance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <ContactBrokerDialog 
        open={showContactDialog} 
        onOpenChange={setShowContactDialog} 
      />
      
      <Footer />
    </div>
  );
};

export default QuotePage;
