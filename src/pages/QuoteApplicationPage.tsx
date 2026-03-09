import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Send, Shield } from "lucide-react";
import { QuoteApplicationFormData, INITIAL_FORM_DATA } from "@/types/quoteApplication";
import { Step1VehicleUsage } from "@/components/quote-application/Step1VehicleUsage";
import { Step2ContactDetails } from "@/components/quote-application/Step2ContactDetails";
import { Step3DrivingHistory } from "@/components/quote-application/Step3DrivingHistory";
import { Step4VehicleDetails } from "@/components/quote-application/Step4VehicleDetails";
import { Step5VehicleUsageDetails } from "@/components/quote-application/Step5VehicleUsageDetails";
import { Step6CoverOptions } from "@/components/quote-application/Step6CoverOptions";
import { Step7TermsSignature } from "@/components/quote-application/Step7TermsSignature";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const STEP_TITLES = [
  "Vehicle Usage",
  "Contact Details",
  "Driving History",
  "Vehicle Details",
  "Usage Details",
  "Cover Options",
  "Terms & Signature",
];

const QuoteApplicationPage = () => {
  const { form1Id } = useParams<{ form1Id: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<QuoteApplicationFormData>(INITIAL_FORM_DATA);
  const [quoteNumber, setQuoteNumber] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!form1Id) return;
    const fetchForm1 = async () => {
      const { data, error } = await supabase
        .from("form1_submissions")
        .select("first_name, last_name, phone, email, quote_number")
        .eq("id", form1Id)
        .single();

      if (error || !data) {
        toast.error("Could not load your quote. Please try again.");
        navigate("/");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        phone: data.phone || "",
        email: data.email || "",
      }));
      setQuoteNumber(data.quote_number || "");
      setIsLoading(false);
    };
    fetchForm1();
  }, [form1Id, navigate]);

  const updateField = (field: keyof QuoteApplicationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < STEP_TITLES.length - 1) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("form2_submissions").insert({
        ...formData,
        is_rented: formData.is_rented === "Yes" ? true : formData.is_rented === "No" ? false : null,
        is_delivery: formData.is_delivery === "Yes" ? true : formData.is_delivery === "No" ? false : null,
        is_rideshare: formData.is_rideshare === "Yes" ? true : formData.is_rideshare === "No" ? false : null,
        is_refrigerated: formData.is_refrigerated === "Yes" ? true : formData.is_refrigerated === "No" ? false : null,
        is_vehicle_unregistered: formData.is_vehicle_unregistered === "Yes" ? true : formData.is_vehicle_unregistered === "No" ? false : null,
        privacy_accepted: formData.privacy_accepted === "Accepted" ? true : false,
        broker_terms_accepted: formData.broker_terms_accepted === "Accepted" ? true : false,
        home_insurance_opt_in: formData.home_insurance_opt_in === "Yes" ? true : false,
        market_value: formData.market_value ? parseFloat(formData.market_value) : null,
        trade_value: formData.trade_value ? parseFloat(formData.trade_value) : null,
        retail_value: formData.retail_value ? parseFloat(formData.retail_value) : null,
        agreed_value: formData.agreed_value ? parseFloat(formData.agreed_value) : null,
        submission_status: "received",
        user_agent: navigator.userAgent,
      });

      if (error) throw error;

      toast.success("Application submitted successfully! We'll be in touch shortly.");
      navigate("/");
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressValue = ((currentStep + 1) / STEP_TITLES.length) * 100;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your quote...</p>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    const props = { formData, updateField };
    switch (currentStep) {
      case 0: return <Step1VehicleUsage {...props} />;
      case 1: return <Step2ContactDetails {...props} />;
      case 2: return <Step3DrivingHistory {...props} />;
      case 3: return <Step4VehicleDetails {...props} />;
      case 4: return <Step5VehicleUsageDetails {...props} />;
      case 5: return <Step6CoverOptions {...props} />;
      case 6: return <Step7TermsSignature {...props} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8">
        {/* Quote Header */}
        <div className="bg-card border-2 border-primary/30 rounded-lg p-4 mb-6 text-center shadow-sm">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-primary" />
            <p className="text-lg font-bold text-primary">
              {quoteNumber || "Quote Pending"}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {formData.vehicle_usage || "Rideshare"} Insurance Application
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {STEP_TITLES.length}</span>
            <span>{STEP_TITLES[currentStep]}</span>
          </div>
          <Progress value={progressValue} className="h-2" />
          <div className="flex justify-between">
            {STEP_TITLES.map((title, i) => (
              <button
                key={i}
                onClick={() => i < currentStep && setCurrentStep(i)}
                className={`text-xs px-1 py-0.5 rounded transition-colors ${
                  i === currentStep
                    ? "text-primary font-semibold"
                    : i < currentStep
                    ? "text-primary/60 hover:text-primary cursor-pointer"
                    : "text-muted-foreground/50"
                }`}
                disabled={i > currentStep}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-sm mb-6">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < STEP_TITLES.length - 1 ? (
            <Button onClick={handleNext} className="px-6 bg-primary hover:bg-primary/90">
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 bg-accent hover:bg-accent/90"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Submit Application
                </span>
              )}
            </Button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuoteApplicationPage;
