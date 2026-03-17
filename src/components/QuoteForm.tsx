import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Shield, User, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const QuoteForm = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValidPhone = (val: string) => /^(04\d{8}|\+614\d{8})$/.test(val.replace(/\s/g, ''));
  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isFormValid = firstName.trim() && lastName.trim() && isValidPhone(phone) && isValidEmail(email);

  const handleSubmit = async () => {
    if (!isFormValid) {
      toast.error("Please fill in all fields correctly");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from("form1_submissions").insert({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        how_can: "new_quote",
        insurance_type: "rideshare",
        channel: "website",
        submission_status: "received",
        user_agent: navigator.userAgent,
      });

      if (error) throw error;
      navigate('/broker', { state: { firstName: firstName.trim(), lastName: lastName.trim(), phone: phone.trim(), email: email.trim().toLowerCase() } });
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-4 md:p-8 bg-gradient-to-br from-card via-card to-accent/5 backdrop-blur-xl border-2 border-primary/30 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 relative overflow-hidden">
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-accent/30 rounded-tl-2xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-accent/30 rounded-br-2xl pointer-events-none"></div>
      
      <div className="space-y-4 md:space-y-6 relative">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-accent to-blue-600 bg-clip-text text-transparent animate-in fade-in slide-in-from-top-4 duration-700 mb-2 md:mb-4">
            Get Your Rideshare Quote
          </h2>
          <p className="text-sm md:text-xl text-muted-foreground mt-2 md:mt-3 animate-in fade-in slide-in-from-top-4 duration-700 delay-150">
            Protect your business on wheels with coverage built for rideshare drivers
          </p>
          <div className="mt-2 md:mt-4 inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-accent/10 rounded-full border border-accent/30 animate-in fade-in scale-in-95 duration-700 delay-300">
            <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent" />
            <span className="text-xs md:text-sm font-semibold text-accent">
              Quick • Simple • Transparent
            </span>
          </div>
        </div>

        {/* Contact Fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <User className="w-4 h-4 text-accent" />
                First Name <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border-2 border-accent/50 bg-background h-12 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <User className="w-4 h-4 text-accent" />
                Last Name <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border-2 border-accent/50 bg-background h-12 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                maxLength={100}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <Phone className="w-4 h-4 text-accent" />
                Phone Number <span className="text-destructive">*</span>
              </label>
              <Input
                type="tel"
                placeholder="04XX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9+\s]/g, ''))}
                className="border-2 border-accent/50 bg-background h-12 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                maxLength={15}
              />
              {phone && !isValidPhone(phone) && (
                <p className="text-xs text-destructive">Enter a valid Australian mobile number</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <Mail className="w-4 h-4 text-accent" />
                Email Address <span className="text-destructive">*</span>
              </label>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-accent/50 bg-background h-12 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                maxLength={255}
              />
              {email && !isValidEmail(email) && (
                <p className="text-xs text-destructive">Enter a valid email address</p>
              )}
            </div>
          </div>
        </div>

        <div className="relative mt-6">
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !isFormValid}
            className="w-full bg-gradient-to-r from-accent via-primary to-accent hover:from-accent/90 hover:via-primary/90 hover:to-accent/90 text-white font-bold py-8 text-xl transition-all hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed animate-in fade-in scale-in-95 duration-500 delay-500 relative overflow-hidden group"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            {isLoading ? (
              <span className="flex items-center gap-3 relative z-10">
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              <span className="flex items-center gap-3 relative z-10">
                <Shield className="w-6 h-6" />
                Get My Quote
              </span>
            )}
          </Button>
          
          {isFormValid && !isLoading && (
            <div className="absolute inset-0 rounded-md border-4 border-accent animate-ping opacity-20 pointer-events-none"></div>
          )}
        </div>

        {/* Urgency line */}
        <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          <span className="text-xs md:text-sm">Rates reviewed daily — lock in today's price</span>
        </div>
      </div>
    </Card>
  );
};
