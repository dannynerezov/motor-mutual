import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { CheckCircle, ChevronDown } from "lucide-react";
import { AddressAutosuggest } from "@/components/AddressAutosuggest";
import { EnhancedDatePicker } from "@/components/EnhancedDatePicker";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
}

export const DriverCard = ({
  driver,
  onUpdate,
}: DriverCardProps) => {
  // Local state for name fields
  const [localFirstName, setLocalFirstName] = useState(driver.first_name || "");
  const [localLastName, setLocalLastName] = useState(driver.last_name || "");

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

  // Initialize local state only when driver.id changes (prevents overwriting during typing)
  useEffect(() => {
    setLocalFirstName(driver.first_name || "");
    setLocalLastName(driver.last_name || "");
  }, [driver.id]);

  // Validate first name
  useEffect(() => {
    if (localFirstName && localFirstName.trim() !== "") {
      const namePattern = /^[A-Za-z\s'-]+$/;
      if (!namePattern.test(localFirstName)) {
        setFirstNameError("Only letters, spaces, hyphens and apostrophes allowed");
      } else if (localFirstName.length < 2) {
        setFirstNameError("First name must be at least 2 characters");
      } else if (localFirstName.length > 50) {
        setFirstNameError("First name must be less than 50 characters");
      } else {
        setFirstNameError("");
      }
    } else {
      setFirstNameError("");
    }
  }, [localFirstName]);

  // Validate last name
  useEffect(() => {
    if (localLastName && localLastName.trim() !== "") {
      const namePattern = /^[A-Za-z\s'-]+$/;
      if (!namePattern.test(localLastName)) {
        setLastNameError("Only letters, spaces, hyphens and apostrophes allowed");
      } else if (localLastName.length < 2) {
        setLastNameError("Last name must be at least 2 characters");
      } else if (localLastName.length > 50) {
        setLastNameError("Last name must be less than 50 characters");
      } else {
        setLastNameError("");
      }
    } else {
      setLastNameError("");
    }
  }, [localLastName]);

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
    if (localFirstName && localLastName && !firstNameError && !lastNameError) {
      setDobSection(true);
    }
  }, [localFirstName, localLastName, firstNameError, lastNameError]);

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

  const handleAddressSelect = async (address: {
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
    console.debug('[DriverCard] Address selected from suggestions:', address);

    // Update critical fields first for immediate completion detection
    onUpdate(driver.id, "address_suburb", address.suburb);
    onUpdate(driver.id, "address_state", address.state);
    onUpdate(driver.id, "address_postcode", address.postcode);
    onUpdate(driver.id, "address_line1", address.addressLine1);
    onUpdate(driver.id, "address_unit_type", address.unitType || null);
    onUpdate(driver.id, "address_unit_number", address.unitNumber || null);
    onUpdate(driver.id, "address_street_number", address.streetNumber || null);
    onUpdate(driver.id, "address_street_name", address.streetName || null);
    onUpdate(driver.id, "address_street_type", address.streetType || null);
    onUpdate(driver.id, "address_lurn", null);
    onUpdate(driver.id, "address_latitude", null);
    onUpdate(driver.id, "address_longitude", null);

    // Immediately validate address to capture LURN
    try {
      const { data: validateData, error: validateError } = await supabase.functions.invoke('suncorp-proxy', {
        body: {
          action: 'addressValidate',
          address: {
            country: 'AUS',
            suburb: address.suburb,
            postcode: address.postcode,
            state: address.state,
            addressInFreeForm: {
              addressLine1: address.addressLine1,
            },
          },
        },
      });

      if (validateError || !validateData?.success) {
        const msg = validateData?.error || validateError?.message || 'Address validation failed';
        console.error('[DriverCard] Address validate error:', msg, validateData);
        toast.error('Address validation failed. Please refine your selection.');
        return;
      }

      const matched = validateData.data?.matchedAddress;
      if (!matched) {
        console.warn('[DriverCard] No matchedAddress returned from validate');
        toast.error('Could not confirm address. Please try again.');
        return;
      }

      const lurn = matched.addressId as string;
      const lat = matched.pointLevelCoordinates?.latitude?.toString() || null;
      const lng = matched.pointLevelCoordinates?.longitude?.toString() || null;

      onUpdate(driver.id, 'address_lurn', lurn);
      if (lat) onUpdate(driver.id, 'address_latitude', lat);
      if (lng) onUpdate(driver.id, 'address_longitude', lng);

      console.debug('[DriverCard] Address validated. LURN (last 8):', lurn?.slice(-8));
      toast.success('Address validated');
    } catch (err: any) {
      console.error('[DriverCard] Unexpected error validating address:', err);
      toast.error('Unexpected error validating address');
    }
  };

  // Completion checks
  const nameComplete = localFirstName && localLastName && !firstNameError && !lastNameError;
  const dobComplete = driver.date_of_birth && !dobError;
  const genderComplete = driver.gender;
  const claimsComplete = true; // Always has default
  const addressComplete = driver.address_suburb && driver.address_state && driver.address_postcode;
  const isComplete = nameComplete && dobComplete && genderComplete && claimsComplete && addressComplete;

  return (
    <Card className="border-muted overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Primary Driver Details</CardTitle>
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
                  value={localFirstName}
                  onChange={(e) => setLocalFirstName(e.target.value)}
                  onBlur={() => {
                    if (!firstNameError && localFirstName !== driver.first_name) {
                      onUpdate(driver.id, "first_name", localFirstName);
                    }
                  }}
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
                  value={localLastName}
                  onChange={(e) => setLocalLastName(e.target.value)}
                  onBlur={() => {
                    if (!lastNameError && localLastName !== driver.last_name) {
                      onUpdate(driver.id, "last_name", localLastName);
                    }
                  }}
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
            <div className="pt-2 space-y-2">
              <AddressAutosuggest
                onAddressSelect={handleAddressSelect}
                selectedAddress={driver.address_line1 ? {
                  addressLine1: driver.address_line1,
                  suburb: driver.address_suburb || "",
                  state: driver.address_state || "",
                  postcode: driver.address_postcode || "",
                  unitType: driver.address_unit_type,
                  unitNumber: driver.address_unit_number,
                  streetNumber: driver.address_street_number,
                  streetName: driver.address_street_name,
                  streetType: driver.address_street_type,
                } : null}
              />

              {/* Address debug/completion status */}
              <div className="text-xs text-muted-foreground flex items-center gap-3">
                <span>
                  Selected: {driver.address_line1 && driver.address_suburb && driver.address_state && driver.address_postcode ? 'Yes' : 'No'}
                </span>
                <span>
                  Validated: {driver.address_lurn ? `Yes (…${driver.address_lurn.slice(-6)})` : 'No'}
                </span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>

      <CardFooter className="bg-muted/30 border-t px-6 py-4">
        {isComplete ? (
          <p className="text-sm text-muted-foreground w-full text-center">
            All details complete. Click "Recalculate Quote" to update pricing.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground w-full text-center">
            Please complete all sections above
          </p>
        )}
      </CardFooter>
    </Card>
  );
};
