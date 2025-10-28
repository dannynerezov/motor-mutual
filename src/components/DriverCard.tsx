import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, ChevronDown, Lock, Edit2, AlertCircle } from "lucide-react";
import { AddressAutosuggest } from "@/components/AddressAutosuggest";
import { EnhancedDatePicker } from "@/components/EnhancedDatePicker";
import { AddressValidationDialog } from "@/components/AddressValidationDialog";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

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
  onUpdateMany: (id: string, updates: Record<string, any>) => void;
}

export const DriverCard = ({
  driver,
  onUpdate,
  onUpdateMany,
}: DriverCardProps) => {
  // Local state for name fields
  const [localFirstName, setLocalFirstName] = useState(driver.first_name || "");
  const [localLastName, setLocalLastName] = useState(driver.last_name || "");

  // Validation errors
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [dobError, setDobError] = useState<string>("");

  // Address lock and validation state
  const [addressLocked, setAddressLocked] = useState(false);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'searching' | 'found' | 'validating' | 'success' | 'error'>('idle');
  const [validationSearchResults, setValidationSearchResults] = useState<number>();
  const [validationError, setValidationError] = useState<string>();
  const [validationLogs, setValidationLogs] = useState<string[]>([]);
  const [validatedAddressDisplay, setValidatedAddressDisplay] = useState<{
    line1: string;
    suburb: string;
    state: string;
    postcode: string;
    lurn: string;
    quality: string;
  }>();

  // Section state (address first)
  const [addressSection, setAddressSection] = useState(true);
  const [nameSection, setNameSection] = useState(false);
  const [dobSection, setDobSection] = useState(false);
  const [genderSection, setGenderSection] = useState(false);
  const [claimsSection, setClaimsSection] = useState(false);

  // Initialize local state only when driver.id changes
  useEffect(() => {
    setLocalFirstName(driver.first_name || "");
    setLocalLastName(driver.last_name || "");
  }, [driver.id]);

  // Initialize address lock state from existing data
  useEffect(() => {
    if (driver.address_lurn && driver.address_suburb && driver.address_state && driver.address_postcode) {
      setAddressLocked(true);
      setValidatedAddressDisplay({
        line1: driver.address_line1 || '',
        suburb: driver.address_suburb,
        state: driver.address_state,
        postcode: driver.address_postcode,
        lurn: driver.address_lurn,
        quality: '1'
      });
    }
  }, []);

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

  // Progressive disclosure: Auto-expand next section when current is complete
  useEffect(() => {
    // Only show name section after address is locked
    if (addressLocked && !nameSection) {
      setNameSection(true);
    }
  }, [addressLocked]);

  useEffect(() => {
    if (localFirstName && localLastName && !firstNameError && !lastNameError && !dobSection) {
      setDobSection(true);
    }
  }, [localFirstName, localLastName, firstNameError, lastNameError]);

  useEffect(() => {
    if (driver.date_of_birth && !dobError && !genderSection) {
      setGenderSection(true);
    }
  }, [driver.date_of_birth, dobError]);

  useEffect(() => {
    if (driver.gender && !claimsSection) {
      setClaimsSection(true);
    }
  }, [driver.gender]);

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
    setValidationDialogOpen(true);
    setValidationStatus('searching');
    setValidationLogs([]);
    setValidationError(undefined);
    
    const log = (msg: string) => setValidationLogs(prev => [...prev, `[${new Date().toISOString().split('T')[1].slice(0, 8)}] ${msg}`]);
    
    log('[AddressAutosuggest] Address selected from dropdown');
    log(`Address: ${address.addressLine1}, ${address.suburb} ${address.state} ${address.postcode}`);
    
    setValidationStatus('found');
    setValidationSearchResults(1);
    
    // Batch update all address fields at once
    const addressUpdates = {
      address_line1: address.addressLine1,
      address_suburb: address.suburb,
      address_state: address.state,
      address_postcode: address.postcode,
      address_unit_type: address.unitType || null,
      address_unit_number: address.unitNumber || null,
      address_street_number: address.streetNumber || null,
      address_street_name: address.streetName || null,
      address_street_type: address.streetType || null,
      address_lurn: null,
      address_latitude: null,
      address_longitude: null
    };
    
    onUpdateMany(driver.id, addressUpdates);
    log('[DriverCard] Address fields updated (pre-validation)');

    // Validate immediately to get LURN
    setValidationStatus('validating');
    log('[DriverCard] Calling suncorp-proxy addressValidate...');
    
    try {
      const { data, error } = await supabase.functions.invoke('suncorp-proxy', {
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

      if (error || !data?.success) {
        const msg = data?.error || error?.message || 'Address validation failed';
        log(`[DriverCard] ❌ Validation failed: ${msg}`);
        setValidationStatus('error');
        setValidationError(`Address validation failed: ${msg}`);
        return;
      }

      const matched = data.data?.matchedAddress;
      if (!matched) {
        log('[DriverCard] ❌ No matched address in response');
        setValidationStatus('error');
        setValidationError('No matched address found in validation response');
        return;
      }

      const lurnFull = matched.addressId as string;
      const lat = matched.pointLevelCoordinates?.longLatLatitude?.toString() || null;
      const lng = matched.pointLevelCoordinates?.longLatLongitude?.toString() || null;
      
      log(`[DriverCard] ✓ Validated: LURN=****${lurnFull?.slice(-15)}`);
      log(`[DriverCard] ✓ Quality: ${matched.quality}`);
      log(`[DriverCard] ✓ Coordinates: ${lat}, ${lng}`);

      // Update with validation results
      onUpdateMany(driver.id, {
        address_lurn: lurnFull,
        address_latitude: lat,
        address_longitude: lng
      });

      setValidatedAddressDisplay({
        line1: address.addressLine1,
        suburb: address.suburb,
        state: address.state,
        postcode: address.postcode,
        lurn: lurnFull,
        quality: matched.quality || '1'
      });

      setValidationStatus('success');
      log('[DriverCard] ✓ Address validation complete');
      
      // Auto-lock after successful validation
      setTimeout(() => {
        setAddressLocked(true);
        setValidationDialogOpen(false);
      }, 1500);
    } catch (err: any) {
      log(`[DriverCard] ❌ Exception: ${err.message}`);
      setValidationStatus('error');
      setValidationError(`Address validation error: ${err.message}`);
    }
  };

  const handleUnlockAddress = () => {
    setAddressLocked(false);
    setValidatedAddressDisplay(undefined);
    onUpdateMany(driver.id, {
      address_line1: null,
      address_suburb: null,
      address_state: null,
      address_postcode: null,
      address_unit_type: null,
      address_unit_number: null,
      address_street_number: null,
      address_street_name: null,
      address_street_type: null,
      address_lurn: null,
      address_latitude: null,
      address_longitude: null
    });
  };

  // Completion checks
  const addressComplete = addressLocked && driver.address_lurn;
  const nameComplete = localFirstName && localLastName && !firstNameError && !lastNameError;
  const dobComplete = driver.date_of_birth && !dobError;
  const genderComplete = driver.gender;
  const claimsComplete = true; // Always has default
  const isComplete = addressComplete && nameComplete && dobComplete && genderComplete && claimsComplete;

  return (
    <>
      <Card className="border-muted min-h-[600px]">
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
          {/* Step 1: Overnight Parking Address (Primary Field) */}
          <Collapsible open={addressSection} onOpenChange={setAddressSection}>
            <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  1
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
              {!addressLocked ? (
                <div className="space-y-6 pt-2">
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-sm">
                      Enter the address where the vehicle is parked overnight. This is required for insurance risk assessment.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <Label htmlFor="address">Search Address</Label>
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
                          : undefined
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded-lg border-2 border-green-600 bg-green-50">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-900">Validated Address</span>
                        </div>
                        {validatedAddressDisplay && (
                          <div className="mt-2 space-y-1">
                            <p className="font-medium text-sm">{validatedAddressDisplay.line1}</p>
                            <p className="text-sm text-muted-foreground">
                              {validatedAddressDisplay.suburb}, {validatedAddressDisplay.state} {validatedAddressDisplay.postcode}
                            </p>
                            <p className="text-xs text-muted-foreground pt-2 border-t border-green-200 mt-2">
                              LURN: ****…{validatedAddressDisplay.lurn.slice(-8)}
                            </p>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleUnlockAddress}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        Change
                      </Button>
                    </div>
                  </div>
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Address verified and locked. Click "Change" to select a different address.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Step 2: Full Name (Only shown after address is locked) */}
          {addressLocked && (
            <>
              <Collapsible open={nameSection} onOpenChange={setNameSection}>
                <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      2
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

              {/* Step 3: Date of Birth */}
              <Collapsible open={dobSection} onOpenChange={setDobSection}>
                <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      3
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

              {/* Step 4: Gender */}
              <Collapsible open={genderSection} onOpenChange={setGenderSection}>
                <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      4
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

              {/* Step 5: Claims History */}
              <Collapsible open={claimsSection} onOpenChange={setClaimsSection}>
                <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      5
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
            </>
          )}
        </CardContent>
      </Card>

      <AddressValidationDialog
        open={validationDialogOpen}
        onOpenChange={setValidationDialogOpen}
        status={validationStatus}
        searchResults={validationSearchResults}
        validatedAddress={validatedAddressDisplay}
        error={validationError}
        logs={validationLogs}
      />
    </>
  );
};
