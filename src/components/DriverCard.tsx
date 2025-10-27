import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle, ChevronDown } from "lucide-react";
import { AddressAutosuggest } from "@/components/AddressAutosuggest";
import { EnhancedDatePicker } from "@/components/EnhancedDatePicker";
import { useSuncorpQuote } from "@/hooks/useSuncorpQuote";
import { getDefaultPolicyStartDate } from "@/lib/thirdPartyBulkLogic";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

interface DriverCardProps {
  driver: NamedDriver;
  onUpdate: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
  vehicleData?: {
    registration_number: string;
    vehicle_make: string;
    vehicle_model: string;
    vehicle_year: number;
    vehicle_nvic: string | null;
  };
  onQuoteGenerated?: (quoteData: any) => void;
}

export const DriverCard = ({
  driver,
  onUpdate,
  onRemove,
  vehicleData,
  onQuoteGenerated,
}: DriverCardProps) => {
  const { generateQuote, isGenerating } = useSuncorpQuote();

  // Validation errors
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [dobError, setDobError] = useState<string>("");

  // Section state
  const [nameSection, setNameSection] = useState(true);
  const [dobSection, setDobSection] = useState(false);
  const [genderSection, setGenderSection] = useState(false);
  const [claimsSection, setClaimsSection] = useState(false);
  const [addressSection, setAddressSection] = useState(false);

  // Validate first name
  useEffect(() => {
    if (driver.first_name && driver.first_name.trim() !== "") {
      const namePattern = /^[A-Za-z\s'-]+$/;
      if (!namePattern.test(driver.first_name)) {
        setFirstNameError("Only letters, spaces, hyphens and apostrophes allowed");
      } else if (driver.first_name.length < 2) {
        setFirstNameError("First name must be at least 2 characters");
      } else if (driver.first_name.length > 50) {
        setFirstNameError("First name must be less than 50 characters");
      } else {
        setFirstNameError("");
      }
    } else {
      setFirstNameError("");
    }
  }, [driver.first_name]);

  // Validate last name
  useEffect(() => {
    if (driver.last_name && driver.last_name.trim() !== "") {
      const namePattern = /^[A-Za-z\s'-]+$/;
      if (!namePattern.test(driver.last_name)) {
        setLastNameError("Only letters, spaces, hyphens and apostrophes allowed");
      } else if (driver.last_name.length < 2) {
        setLastNameError("Last name must be at least 2 characters");
      } else if (driver.last_name.length > 50) {
        setLastNameError("Last name must be less than 50 characters");
      } else {
        setLastNameError("");
      }
    } else {
      setLastNameError("");
    }
  }, [driver.last_name]);

  // Validate date of birth
  useEffect(() => {
    if (driver.date_of_birth) {
      const dob = new Date(driver.date_of_birth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        const adjustedAge = age - 1;
        if (adjustedAge < 18) {
          setDobError("Driver must be at least 18 years old");
        } else if (adjustedAge > 99) {
          setDobError("Driver must be under 100 years old");
        } else {
          setDobError("");
        }
      } else {
        if (age < 18) {
          setDobError("Driver must be at least 18 years old");
        } else if (age > 99) {
          setDobError("Driver must be under 100 years old");
        } else {
          setDobError("");
        }
      }
    }
  }, [driver.date_of_birth]);

  // Auto-expand sections
  useEffect(() => {
    if (driver.first_name && driver.last_name && !firstNameError && !lastNameError) {
      setDobSection(true);
    }
  }, [driver.first_name, driver.last_name, firstNameError, lastNameError]);

  useEffect(() => {
    if (driver.date_of_birth && !dobError) {
      setGenderSection(true);
    }
  }, [driver.date_of_birth, dobError]);

  useEffect(() => {
    if (driver.gender) {
      setClaimsSection(true);
    }
  }, [driver.gender]);

  useEffect(() => {
    if (driver.claims_count !== undefined) {
      setAddressSection(true);
    }
  }, [driver.claims_count]);

  // Generate quote when driver details are complete
  useEffect(() => {
    const shouldGenerateQuote =
      driver.first_name &&
      driver.last_name &&
      driver.date_of_birth &&
      driver.gender &&
      driver.claims_count !== undefined &&
      driver.address_suburb &&
      driver.address_state &&
      driver.address_postcode &&
      vehicleData &&
      !firstNameError &&
      !lastNameError &&
      !dobError &&
      !isGenerating;

    if (shouldGenerateQuote) {
      handleGenerateQuote();
    }
  }, [
    driver.first_name,
    driver.last_name,
    driver.date_of_birth,
    driver.gender,
    driver.claims_count,
    driver.address_suburb,
    driver.address_state,
    driver.address_postcode,
    vehicleData,
    firstNameError,
    lastNameError,
    dobError,
  ]);

  const handleAddressSelect = (address: {
    addressLine1: string;
    suburb: string;
    state: string;
    postcode: string;
    unitType?: string;
    unitNumber?: string;
    streetNumber?: string;
    streetName?: string;
    streetType?: string;
  }) => {
    onUpdate(driver.id, "address_line1", address.addressLine1);
    onUpdate(driver.id, "address_suburb", address.suburb);
    onUpdate(driver.id, "address_state", address.state);
    onUpdate(driver.id, "address_postcode", address.postcode);
    onUpdate(driver.id, "address_unit_type", address.unitType || null);
    onUpdate(driver.id, "address_unit_number", address.unitNumber || null);
    onUpdate(driver.id, "address_street_number", address.streetNumber || null);
    onUpdate(driver.id, "address_street_name", address.streetName || null);
    onUpdate(driver.id, "address_street_type", address.streetType || null);
    onUpdate(driver.id, "address_lurn", null);
    onUpdate(driver.id, "address_latitude", null);
    onUpdate(driver.id, "address_longitude", null);
  };

  const handleGenerateQuote = async () => {
    if (!vehicleData || !onQuoteGenerated) return;

    const policyStartDate = getDefaultPolicyStartDate();

    const result = await generateQuote(vehicleData, {
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
    }, policyStartDate);

    if (result.success) {
      onQuoteGenerated(result);
    } else {
      toast.error(`Failed to generate third party quote: ${result.error}`);
    }
  };

  // Completion checks
  const nameComplete = driver.first_name && driver.last_name && !firstNameError && !lastNameError;
  const dobComplete = driver.date_of_birth && !dobError;
  const genderComplete = driver.gender;
  const claimsComplete = true; // Always has default
  const addressComplete = driver.address_suburb && driver.address_state && driver.address_postcode;
  const isComplete = nameComplete && dobComplete && genderComplete && claimsComplete && addressComplete;

  return (
    <Card className="border-muted overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Driver Details</CardTitle>
          {isComplete && (
            <Badge variant="default" className="animate-scale-in">
              <CheckCircle className="w-3 h-3 mr-1" />
              Complete
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-0 p-0">
        {/* Step 1: Name */}
        <Collapsible open={nameSection} onOpenChange={setNameSection}>
          <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                1
              </div>
              <span className="font-medium">Full Name</span>
            </div>
            {nameComplete ? (
              <CheckCircle className="w-5 h-5 text-primary" />
            ) : (
              <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform", nameSection && "rotate-180")} />
            )}
          </CollapsibleTrigger>

          <CollapsibleContent className="px-6 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">First Name</Label>
                <Input
                  value={driver.first_name || ""}
                  onChange={(e) => onUpdate(driver.id, "first_name", e.target.value)}
                  placeholder="John"
                  className={cn(
                    "transition-all duration-200",
                    firstNameError ? "border-destructive focus-visible:ring-destructive" : ""
                  )}
                />
                {firstNameError && (
                  <p className="text-xs text-destructive animate-fade-up">{firstNameError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Last Name</Label>
                <Input
                  value={driver.last_name || ""}
                  onChange={(e) => onUpdate(driver.id, "last_name", e.target.value)}
                  placeholder="Smith"
                  className={cn(
                    "transition-all duration-200",
                    lastNameError ? "border-destructive focus-visible:ring-destructive" : ""
                  )}
                />
                {lastNameError && (
                  <p className="text-xs text-destructive animate-fade-up">{lastNameError}</p>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Step 2: Date of Birth */}
        <Collapsible open={dobSection} onOpenChange={setDobSection}>
          <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                2
              </div>
              <span className="font-medium">Date of Birth</span>
            </div>
            {dobComplete ? (
              <CheckCircle className="w-5 h-5 text-primary" />
            ) : (
              <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform", dobSection && "rotate-180")} />
            )}
          </CollapsibleTrigger>

          <CollapsibleContent className="px-6 pb-4">
            <div className="pt-2">
              <Label className="text-xs text-muted-foreground mb-2 block">Select your date of birth</Label>
              <EnhancedDatePicker
                value={driver.date_of_birth ? new Date(driver.date_of_birth) : undefined}
                onChange={(date) => {
                  if (!date) return;
                  onUpdate(driver.id, "date_of_birth", date.toISOString().split("T")[0]);
                }}
                placeholder="DD/MM/YYYY"
                minAge={18}
                maxAge={99}
              />
              {dobError && (
                <p className="text-xs text-destructive mt-2 animate-fade-up">{dobError}</p>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Step 3: Gender */}
        <Collapsible open={genderSection} onOpenChange={setGenderSection}>
          <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                3
              </div>
              <span className="font-medium">Gender</span>
            </div>
            {genderComplete ? (
              <CheckCircle className="w-5 h-5 text-primary" />
            ) : (
              <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform", genderSection && "rotate-180")} />
            )}
          </CollapsibleTrigger>

          <CollapsibleContent className="px-6 pb-4">
            <div className="pt-2">
              <Label className="text-xs text-muted-foreground mb-2 block">Select your gender</Label>
              <Select value={driver.gender || ""} onValueChange={(value) => onUpdate(driver.id, "gender", value)}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Step 4: Claims */}
        <Collapsible open={claimsSection} onOpenChange={setClaimsSection}>
          <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                4
              </div>
              <span className="font-medium">Claims History</span>
            </div>
            {claimsComplete ? (
              <CheckCircle className="w-5 h-5 text-primary" />
            ) : (
              <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform", claimsSection && "rotate-180")} />
            )}
          </CollapsibleTrigger>

          <CollapsibleContent className="px-6 pb-4">
            <div className="pt-2">
              <Label className="text-xs text-muted-foreground mb-2 block">Claims in last 5 years</Label>
              <Select
                value={driver.claims_count?.toString() || "0"}
                onValueChange={(value) => onUpdate(driver.id, "claims_count", parseInt(value))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="0">0 Claims</SelectItem>
                  <SelectItem value="1">1 Claim</SelectItem>
                  <SelectItem value="2">2 Claims</SelectItem>
                  <SelectItem value="3">3 Claims</SelectItem>
                  <SelectItem value="4">4+ Claims</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Step 5: Address */}
        <Collapsible open={addressSection} onOpenChange={setAddressSection}>
          <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                5
              </div>
              <span className="font-medium">Overnight Parking Address</span>
            </div>
            {addressComplete ? (
              <CheckCircle className="w-5 h-5 text-primary" />
            ) : (
              <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform", addressSection && "rotate-180")} />
            )}
          </CollapsibleTrigger>

          <CollapsibleContent className="px-6 pb-4">
            <div className="pt-2">
              <Label className="text-xs text-muted-foreground mb-2 block">Start typing your address</Label>
              <AddressAutosuggest
                onAddressSelect={handleAddressSelect}
                selectedAddress={
                  driver.address_line1
                    ? {
                        addressLine1: driver.address_line1,
                        suburb: driver.address_suburb || "",
                        state: driver.address_state || "",
                        postcode: driver.address_postcode || "",
                      }
                    : null
                }
                disabled={isGenerating}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>

      <CardFooter className="bg-muted/30 border-t px-6 py-4">
        {isGenerating ? (
          <div className="flex items-center gap-2 text-sm text-accent w-full justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating third party quote...</span>
          </div>
        ) : (
          <Button variant="destructive" onClick={() => onRemove(driver.id)} className="w-full" size="sm">
            Remove Driver
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
