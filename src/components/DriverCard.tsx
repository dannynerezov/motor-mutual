import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { EnhancedDatePicker } from "./EnhancedDatePicker";
import { AddressAutosuggest } from "./AddressAutosuggest";
import { useSuncorpQuote } from "@/hooks/useSuncorpQuote";
import { getDefaultPolicyStartDate } from "@/lib/thirdPartyBulkLogic";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface NamedDriver {
  id: string;
  driver_name?: string; // Keep for backward compatibility
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

export const DriverCard = ({ driver, onUpdate, onRemove, vehicleData, onQuoteGenerated }: DriverCardProps) => {
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [dobError, setDobError] = useState<string>("");
  const { generateQuote, isGenerating } = useSuncorpQuote();

  // Validate first name
  useEffect(() => {
    if (!driver.first_name || driver.first_name.trim().length < 2) {
      setFirstNameError("First name must be at least 2 characters");
    } else {
      setFirstNameError("");
    }
  }, [driver.first_name]);

  // Validate last name
  useEffect(() => {
    if (!driver.last_name || driver.last_name.trim().length < 2) {
      setLastNameError("Last name must be at least 2 characters");
    } else {
      setLastNameError("");
    }
  }, [driver.last_name]);

  // Validate date of birth
  useEffect(() => {
    if (driver.date_of_birth) {
      const dob = new Date(driver.date_of_birth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      if (age < 18) {
        setDobError("Driver must be at least 18 years old");
      } else if (age > 99) {
        setDobError("Please enter a valid date of birth");
      } else {
        setDobError("");
      }
    }
  }, [driver.date_of_birth]);

  // Auto-generate Suncorp quote when all driver details are complete
  useEffect(() => {
    const isDriverComplete = 
      driver.first_name && 
      driver.first_name.trim().length >= 2 &&
      driver.last_name && 
      driver.last_name.trim().length >= 2 &&
      driver.gender &&
      driver.date_of_birth &&
      !dobError &&
      driver.address_suburb &&
      driver.address_state &&
      driver.address_postcode &&
      vehicleData &&
      onQuoteGenerated;

    if (isDriverComplete && !isGenerating) {
      handleGenerateQuote();
    }
  }, [
    driver.first_name,
    driver.last_name,
    driver.gender,
    driver.date_of_birth,
    driver.address_suburb,
    driver.address_state,
    driver.address_postcode,
    dobError,
  ]);

  const handleAddressSelect = (address: any) => {
    onUpdate(driver.id, "address_line1", address.addressLine1);
    onUpdate(driver.id, "address_suburb", address.suburb);
    onUpdate(driver.id, "address_state", address.state);
    onUpdate(driver.id, "address_postcode", address.postcode);
    onUpdate(driver.id, "address_lurn", null);
    onUpdate(driver.id, "address_latitude", null);
    onUpdate(driver.id, "address_longitude", null);
    onUpdate(driver.id, "address_unit_type", address.unitType || null);
    onUpdate(driver.id, "address_unit_number", address.unitNumber || null);
    onUpdate(driver.id, "address_street_number", address.streetNumber || null);
    onUpdate(driver.id, "address_street_name", address.streetName || null);
    onUpdate(driver.id, "address_street_type", address.streetType || null);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Driver Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`first-name-${driver.id}`}>First Name</Label>
            <Input
              id={`first-name-${driver.id}`}
              value={driver.first_name || ""}
              onChange={(e) => onUpdate(driver.id, "first_name", e.target.value)}
              placeholder="Enter first name"
              className={firstNameError ? "border-red-500" : ""}
            />
            {firstNameError && (
              <p className="text-sm text-red-500">{firstNameError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`last-name-${driver.id}`}>Last Name</Label>
            <Input
              id={`last-name-${driver.id}`}
              value={driver.last_name || ""}
              onChange={(e) => onUpdate(driver.id, "last_name", e.target.value)}
              placeholder="Enter last name"
              className={lastNameError ? "border-red-500" : ""}
            />
            {lastNameError && (
              <p className="text-sm text-red-500">{lastNameError}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`gender-${driver.id}`}>Gender</Label>
          <Select
            value={driver.gender || ""}
            onValueChange={(value) => onUpdate(driver.id, "gender", value)}
          >
            <SelectTrigger id={`gender-${driver.id}`} className="bg-background">
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

        <div className="space-y-2">
          <Label htmlFor={`dob-${driver.id}`}>Date of Birth</Label>
          <EnhancedDatePicker
            value={driver.date_of_birth ? new Date(driver.date_of_birth) : undefined}
            onChange={(date) => {
              if (!date) return;
              onUpdate(driver.id, "date_of_birth", date.toISOString().split('T')[0]);
            }}
            placeholder="Select date of birth"
            minAge={18}
            maxAge={99}
          />
          {dobError && (
            <p className="text-sm text-red-500">{dobError}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`claims-${driver.id}`}>Number of Claims (Last 5 Years)</Label>
          <Select
            value={driver.claims_count?.toString() || "0"}
            onValueChange={(value) =>
              onUpdate(driver.id, "claims_count", parseInt(value))
            }
          >
            <SelectTrigger id={`claims-${driver.id}`} className="bg-background">
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

        <AddressAutosuggest
          onAddressSelect={handleAddressSelect}
          selectedAddress={driver.address_suburb ? {
            addressLine1: driver.address_line1 || "",
            suburb: driver.address_suburb || "",
            state: driver.address_state || "",
            postcode: driver.address_postcode || "",
            unitType: driver.address_unit_type,
            unitNumber: driver.address_unit_number,
            streetNumber: driver.address_street_number,
            streetName: driver.address_street_name,
            streetType: driver.address_street_type,
            buildingName: undefined,
            country: 'AU',
          } : null}
          disabled={isGenerating}
        />

        {isGenerating && (
          <div className="flex items-center justify-center gap-2 p-4 bg-accent/10 rounded-lg border border-accent/30">
            <Loader2 className="w-5 h-5 animate-spin text-accent" />
            <span className="text-sm font-medium text-accent">Generating third party quote...</span>
          </div>
        )}

        <Button
          variant="destructive"
          onClick={() => onRemove(driver.id)}
          className="w-full"
          disabled={isGenerating}
        >
          Remove Driver
        </Button>
      </CardContent>
    </Card>
  );
};