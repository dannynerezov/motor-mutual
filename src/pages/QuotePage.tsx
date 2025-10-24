import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Info, Plus, ArrowLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DriverCard } from "@/components/DriverCard";
import { useToast } from "@/hooks/use-toast";

interface Quote {
  id: string;
  quote_number: string;
  total_base_price: number;
  total_final_price: number;
  status: string;
}

interface Vehicle {
  id: string;
  registration_number: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  selected_coverage_value: number;
  vehicle_image_url: string | null;
}

interface NamedDriver {
  id: string;
  driver_name: string;
  date_of_birth: string;
  claims_count: number;
}

const QuotePage = () => {
  const { quoteId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [quote, setQuote] = useState<Quote | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [namedDrivers, setNamedDrivers] = useState<NamedDriver[]>([]);
  const [totalClaimsCount, setTotalClaimsCount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [showClaimsError, setShowClaimsError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (quoteId) {
      loadQuoteData();
    }
  }, [quoteId]);

  useEffect(() => {
    if (quote) {
      calculateFinalPrice();
    }
  }, [namedDrivers, quote]);

  const loadQuoteData = async () => {
    try {
      // Load quote
      const { data: quoteData, error: quoteError } = await supabase
        .from("quotes")
        .select("*")
        .eq("id", quoteId)
        .single();

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
      toast({
        title: "Error",
        description: "Failed to load quote data",
        variant: "destructive",
      });
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
          driver_name: "",
          date_of_birth: new Date().toISOString().split("T")[0],
          claims_count: 0,
        })
        .select()
        .single();

      if (error) throw error;
      setNamedDrivers([...namedDrivers, data]);
    } catch (error) {
      console.error("Error adding driver:", error);
      toast({
        title: "Error",
        description: "Failed to add driver",
        variant: "destructive",
      });
    }
  };

  const handleDriverUpdate = async (id: string, field: string, value: any) => {
    try {
      const { error } = await supabase
        .from("named_drivers")
        .update({ [field]: value })
        .eq("id", id);

      if (error) throw error;

      setNamedDrivers(
        namedDrivers.map((driver) =>
          driver.id === id ? { ...driver, [field]: value } : driver
        )
      );
    } catch (error) {
      console.error("Error updating driver:", error);
      toast({
        title: "Error",
        description: "Failed to update driver",
        variant: "destructive",
      });
    }
  };

  const handleDriverRemove = async (id: string) => {
    try {
      const { error } = await supabase
        .from("named_drivers")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setNamedDrivers(namedDrivers.filter((driver) => driver.id !== id));
    } catch (error) {
      console.error("Error removing driver:", error);
      toast({
        title: "Error",
        description: "Failed to remove driver",
        variant: "destructive",
      });
    }
  };

  const handleProceedToPayment = () => {
    toast({
      title: "Coming Soon",
      description: "Payment integration will be available soon",
    });
  };

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Back Navigation */}
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")} 
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Vehicle Selection
            </Button>

            {/* Quote Number Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Quote Number</p>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {quote.quote_number}
                    </h1>
                  </div>
                  <Badge variant="outline">Draft</Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Welcome Alert */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Complete Your Quote</AlertTitle>
              <AlertDescription>
                Add named drivers below to finalize your quote. Your pricing will update based on claims history.
              </AlertDescription>
            </Alert>

            {/* Vehicle Details */}
            <Card>
              <CardHeader>
                <CardTitle>Your Vehicles</CardTitle>
              </CardHeader>
              <CardContent>
                {vehicles.map((vehicle, index) => (
                  <div
                    key={vehicle.id}
                    className="border-b last:border-b-0 pb-4 mb-4 last:mb-0"
                  >
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

            {/* Named Drivers Section */}
            <Card>
              <CardHeader>
                <CardTitle>Named Drivers</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Add drivers to avoid penalty excess. All valid licence holders
                  are covered, but unnamed drivers incur additional excess.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {namedDrivers.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg bg-muted/20">
                    <Plus className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Add Named Drivers</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                      Include drivers to avoid penalty excess. All valid licence holders are covered, 
                      but unnamed drivers incur additional excess.
                    </p>
                    <Button onClick={handleAddDriver} size="lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Driver
                    </Button>
                  </div>
                ) : (
                  <>
                    {namedDrivers.map((driver) => (
                      <DriverCard
                        key={driver.id}
                        driver={driver}
                        onUpdate={handleDriverUpdate}
                        onRemove={handleDriverRemove}
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

                    <Button variant="outline" onClick={handleAddDriver}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Another Driver
                    </Button>
                  </>
                )}

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Membership covers all drivers holding a valid licence, but
                    penalty excess applies for unnamed drivers.
                  </AlertDescription>
                </Alert>
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
                <div>
                  <p className="text-sm text-muted-foreground">Base Price</p>
                  <p className="text-2xl font-bold">
                    ${quote.total_base_price?.toLocaleString() || "0"}
                  </p>
                </div>

                {totalClaimsCount > 0 && (
                  <div className="border-t pt-4">
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
                    <p className="text-lg font-semibold text-orange-600">
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

                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Total Annual Price
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    ${finalPrice.toLocaleString()}
                  </p>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  disabled={showClaimsError}
                  onClick={handleProceedToPayment}
                >
                  Proceed to Payment
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  This is an indicative price. Final price confirmed after
                  acceptance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePage;
