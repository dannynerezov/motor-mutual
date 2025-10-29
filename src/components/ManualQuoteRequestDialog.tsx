import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AlertCircle, Info, Car, User, Loader2, Send } from "lucide-react";

interface ManualQuoteRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registrationNumber: string;
  state: string;
  errorMessage?: string;
}

export const ManualQuoteRequestDialog = ({ 
  open, 
  onOpenChange, 
  registrationNumber, 
  state,
  errorMessage 
}: ManualQuoteRequestDialogProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [vinNumber, setVinNumber] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("manual_quote_requests")
        .insert({
          customer_first_name: firstName,
          customer_last_name: lastName,
          customer_email: email,
          customer_phone: phone || null,
          registration_number: registrationNumber,
          state_of_registration: state,
          vin_number: vinNumber || null,
          vehicle_make: vehicleMake || null,
          vehicle_model: vehicleModel || null,
          vehicle_year: vehicleYear ? parseInt(vehicleYear) : null,
          additional_vehicle_info: additionalInfo || null,
          error_message: errorMessage || "Vehicle lookup failed",
          status: "pending"
        });

      if (error) throw error;

      toast.success("Manual quote request submitted! We'll contact you within 24 hours.");
      onOpenChange(false);
      
      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setVinNumber("");
      setVehicleMake("");
      setVehicleModel("");
      setVehicleYear("");
      setAdditionalInfo("");

    } catch (error: any) {
      console.error("Failed to submit manual quote request:", error);
      toast.error("Failed to submit request. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertCircle className="w-6 h-6 text-amber-600" />
            We Need a Little More Information
          </DialogTitle>
          <DialogDescription className="space-y-2 pt-2">
            <p className="text-base">
              We were unable to automatically identify your vehicle with the information provided.
            </p>
            <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
                <strong>No problem!</strong> Complete the form below and we'll manually process your quote request within 24 hours.
              </AlertDescription>
            </Alert>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Vehicle Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Car className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Vehicle Information</h3>
            </div>

            {/* Read-only fields showing what was already entered */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
              <div>
                <Label className="text-xs text-muted-foreground">Registration Number</Label>
                <p className="font-mono font-bold">{registrationNumber}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">State</Label>
                <p className="font-bold">{state}</p>
              </div>
            </div>

            {/* Additional vehicle details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="vinNumber">VIN Number (Optional)</Label>
                <Input
                  id="vinNumber"
                  value={vinNumber}
                  onChange={(e) => setVinNumber(e.target.value.toUpperCase())}
                  placeholder="e.g., 1HGBH41JXMN109186"
                  maxLength={17}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  17-character Vehicle Identification Number
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="vehicleMake">Make (Optional)</Label>
                  <Input
                    id="vehicleMake"
                    value={vehicleMake}
                    onChange={(e) => setVehicleMake(e.target.value)}
                    placeholder="e.g., Toyota"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleModel">Model (Optional)</Label>
                  <Input
                    id="vehicleModel"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    placeholder="e.g., Camry"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleYear">Year (Optional)</Label>
                  <Input
                    id="vehicleYear"
                    type="number"
                    value={vehicleYear}
                    onChange={(e) => setVehicleYear(e.target.value)}
                    placeholder="e.g., 2020"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="additionalInfo">Additional Vehicle Information (Optional)</Label>
                <Textarea
                  id="additionalInfo"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Any other details that might help us identify your vehicle (color, trim level, modifications, etc.)"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <User className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Your Contact Information</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Smith"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.smith@example.com"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                We'll send your quote to this email address
              </p>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0412 345 678"
              />
              <p className="text-xs text-muted-foreground mt-1">
                For faster contact if needed
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Request
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
