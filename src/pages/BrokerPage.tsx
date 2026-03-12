import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Phone, MapPin, ExternalLink, ArrowRight, Star, Building2 } from "lucide-react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import nationalCoverLogo from "@/assets/national-cover-logo.png";

interface BrokerState {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

const BrokerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as BrokerState | null;

  useEffect(() => {
    if (!state) {
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

  // Birdeye Google Reviews widget
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://getbirdeye.com.au/embed/v7/169994241801236/11/9876543213011151831216912";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!state) return null;

  const handleProceed = () => {
    const params = new URLSearchParams({
      fname: state.firstName,
      lname: state.lastName,
      phone: state.phone,
      email: state.email,
      type: "Rideshare",
    });
    window.location.href = `https://nationalcover.com.au/quote?${params.toString()}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/30">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-accent">Your Appointed Broker</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              National Cover Pty Ltd
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              National Cover is the appointed insurance broker and scheme manager for Motor Cover Mutual, handling all policy quotes, binding, and ongoing administration on behalf of members.
            </p>
          </div>

          {/* Logo & About Card */}
          <Card className="p-6 md:p-8 border-2 border-primary/20">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="shrink-0 bg-white rounded-xl p-4 shadow-sm border border-border">
                <img
                  src={nationalCoverLogo}
                  alt="National Cover Pty Ltd logo"
                  className="h-16 md:h-20 w-auto object-contain"
                />
              </div>
              <div className="space-y-3 text-center md:text-left">
                <p className="text-foreground leading-relaxed">
                  National Cover Pty Ltd is a licensed insurance brokerage specialising in motor vehicle cover across Australia. As the scheme manager for Motor Cover Mutual, National Cover ensures every member receives competitive, transparent quotes backed by APRA-regulated underwriters.
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    ABN 74 639 621 480
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    Australian Financial Services Representative
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact & Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5 space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent" /> Contact
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="tel:0753460149" className="flex items-center gap-2 hover:text-accent transition-colors">
                  <Phone className="w-3.5 h-3.5" /> 07 5346 0149
                </a>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>298 Musgrave Road, Coopers Plains, QLD 4108</span>
                </div>
              </div>
            </Card>

            <Card className="p-5 space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-accent" /> Website
              </h3>
              <a
                href="https://nationalcover.com.au"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
              >
                nationalcover.com.au <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <p className="text-xs text-muted-foreground">
                Visit National Cover's website for more information about their services and policies.
              </p>
            </Card>
          </div>

          {/* Google Reviews Widget */}
          <Card className="p-5 space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Star className="w-4 h-4 text-accent" /> Customer Reviews
            </h3>
            <div id="bf-revz-widget-9876543213011151831216912" className="min-h-[120px]" />
          </Card>

          {/* CTA */}
          <div className="text-center space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Your details will be securely passed to National Cover to begin your rideshare insurance quote.
            </p>
            <Button
              onClick={handleProceed}
              className="w-full sm:w-auto px-10 py-7 text-lg font-bold bg-gradient-to-r from-accent via-primary to-accent hover:from-accent/90 hover:via-primary/90 hover:to-accent/90 text-white transition-all hover:shadow-2xl hover:scale-[1.02] group"
            >
              <span className="flex items-center gap-3">
                Proceed to National Cover
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BrokerPage;
