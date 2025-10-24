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

interface NamedDriver {
  id: string;
  driver_name?: string; // Keep for backward compatibility
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  claims_count: number;
}

interface DriverCardProps {
  driver: NamedDriver;
  onUpdate: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
}

export const DriverCard = ({ driver, onUpdate, onRemove }: DriverCardProps) => {
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [dobError, setDobError] = useState<string>("");

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
            onChange={(date) => 
              onUpdate(driver.id, "date_of_birth", date ? date.toISOString().split('T')[0] : "")
            }
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

        <Button
          variant="destructive"
          onClick={() => onRemove(driver.id)}
          className="w-full"
        >
          Remove Driver
        </Button>
      </CardContent>
    </Card>
  );
};