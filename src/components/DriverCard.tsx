import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

interface NamedDriver {
  id: string;
  driver_name: string;
  date_of_birth: string;
  claims_count: number;
}

interface DriverCardProps {
  driver: NamedDriver;
  onUpdate: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
}

export const DriverCard = ({ driver, onUpdate, onRemove }: DriverCardProps) => {
  const [nameError, setNameError] = useState("");
  const [dobError, setDobError] = useState("");

  // Validate driver name
  useEffect(() => {
    if (driver.driver_name && driver.driver_name.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
    } else {
      setNameError("");
    }
  }, [driver.driver_name]);

  // Validate date of birth
  useEffect(() => {
    if (driver.date_of_birth) {
      const today = new Date();
      const dob = new Date(driver.date_of_birth);
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
    <Card className={nameError || dobError ? "border-destructive" : ""}>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor={`name-${driver.id}`}>Driver Name *</Label>
            <Input
              id={`name-${driver.id}`}
              value={driver.driver_name}
              onChange={(e) => onUpdate(driver.id, "driver_name", e.target.value)}
              placeholder="Enter full name"
              className={nameError ? "border-destructive" : ""}
            />
            {nameError && (
              <p className="text-xs text-destructive mt-1">{nameError}</p>
            )}
          </div>
          <div>
            <Label htmlFor={`dob-${driver.id}`}>Date of Birth *</Label>
            <Input
              id={`dob-${driver.id}`}
              type="date"
              value={driver.date_of_birth}
              onChange={(e) => onUpdate(driver.id, "date_of_birth", e.target.value)}
              className={dobError ? "border-destructive" : ""}
            />
            {dobError && (
              <p className="text-xs text-destructive mt-1">{dobError}</p>
            )}
          </div>
          <div>
            <Label htmlFor={`claims-${driver.id}`}>Claims (Last 3 Years)</Label>
            <Select
              value={driver.claims_count?.toString()}
              onValueChange={(value) =>
                onUpdate(driver.id, "claims_count", parseInt(value))
              }
            >
              <SelectTrigger id={`claims-${driver.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 Claims</SelectItem>
                <SelectItem value="1">1 Claim</SelectItem>
                <SelectItem value="2">2 Claims</SelectItem>
                <SelectItem value="3">3 Claims</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-4 text-destructive hover:text-destructive"
          onClick={() => onRemove(driver.id)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Remove Driver
        </Button>
      </CardContent>
    </Card>
  );
};
