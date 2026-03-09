import { QuoteApplicationFormData } from "@/types/quoteApplication";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, ExternalLink } from "lucide-react";

interface Props {
  formData: QuoteApplicationFormData;
  updateField: (field: keyof QuoteApplicationFormData, value: string) => void;
}

export function Step7TermsSignature({ formData, updateField }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-muted px-4 py-3 -mx-4 md:-mx-6 border-l-4 border-primary">
        <h2 className="text-xl font-medium">Broker Appointment</h2>
      </div>

      <div className="bg-muted/50 border border-border rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-semibold mb-2">Important Information</p>
          <p className="text-muted-foreground">
            Your privacy is important to us. We collect your information to obtain insurance quotations on your behalf.
            By proceeding, you agree to our terms and authorize us to arrange insurance for you.
          </p>
        </div>
      </div>

      <div className="bg-card border-2 border-border rounded-lg p-5">
        <h3 className="font-semibold text-lg mb-3">Declaration</h3>
        <p className="text-muted-foreground leading-relaxed">
          I appoint MCM as my insurance broker as per the terms at{" "}
          <span className="font-medium text-foreground">mcm.com.au/terms</span>
        </p>
        <a
          href="https://mcm.com.au/terms/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
        >
          View Full Terms & Conditions
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-4 border rounded-lg">
          <Checkbox
            id="privacy"
            checked={formData.privacy_accepted === "Accepted"}
            onCheckedChange={(checked) => updateField("privacy_accepted", checked ? "Accepted" : "")}
          />
          <div className="flex-1">
            <Label htmlFor="privacy" className="cursor-pointer">
              <span className="font-semibold">Privacy Policy</span>
              <p className="text-sm text-muted-foreground mt-1">
                We may store your information for the purpose of obtaining you insurance quotations, as per our Privacy Policy.
              </p>
            </Label>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 border rounded-lg">
          <Checkbox
            id="broker-terms"
            checked={formData.broker_terms_accepted === "Accepted"}
            onCheckedChange={(checked) => updateField("broker_terms_accepted", checked ? "Accepted" : "")}
          />
          <div className="flex-1">
            <Label htmlFor="broker-terms" className="cursor-pointer">
              <span className="font-semibold">Broker Appointment Terms</span>
              <p className="text-sm text-muted-foreground mt-1">
                I agree for MCM to arrange insurance for me, and I accept the terms of the appointment.
              </p>
            </Label>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 border rounded-lg">
          <Checkbox
            id="home-insurance"
            checked={formData.home_insurance_opt_in === "Yes"}
            onCheckedChange={(checked) => updateField("home_insurance_opt_in", checked ? "Yes" : "")}
          />
          <div className="flex-1">
            <Label htmlFor="home-insurance" className="cursor-pointer">
              <span className="font-semibold">Home Insurance (Optional)</span>
              <p className="text-sm text-muted-foreground mt-1">
                I'd like to receive information about home insurance options.
              </p>
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
