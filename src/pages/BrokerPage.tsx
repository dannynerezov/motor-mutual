import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Phone, MapPin, ExternalLink, ArrowRight, Star, Lock, CheckCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import nationalCoverLogo from "@/assets/national-cover-logo.png";

interface BrokerState {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

const StarRating = () => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
    ))}
  </div>
);

const reviews = [
  {
    name: "Sarah M.",
    text: "Incredibly smooth process. National Cover made switching rideshare insurance painless — had my policy sorted within 24 hours.",
    date: "2 weeks ago",
  },
  {
    name: "James T.",
    text: "Best price I found for rideshare cover. The team was super helpful and explained everything clearly. Highly recommend.",
    date: "1 month ago",
  },
  {
    name: "Priya K.",
    text: "Professional and responsive. They found me a better deal than my previous insurer and the claims process is straightforward.",
    date: "3 weeks ago",
  },
];

const BrokerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as BrokerState | null;

  useEffect(() => {
    if (!state) {
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

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

      {/* Hero Band */}
      <section className="relative overflow-hidden bg-primary py-16 md:py-20">
        {/* Decorative orbs */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(16 85% 55%) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, hsl(210 58% 50%) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center px-4 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full border border-accent/40">
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-accent">Your Appointed Broker</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight">
            You're in good hands with{" "}
            <span className="text-accent">National Cover</span>
          </h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            National Cover is the appointed insurance broker and scheme manager for Motor Cover Mutual, handling all policy quotes, binding, and ongoing administration on behalf of members.
          </p>
        </div>
      </section>

      <main className="flex-1 px-4">
        {/* Elevated Broker Card */}
        <Card className="max-w-3xl mx-auto -mt-10 relative z-20 p-0 overflow-hidden shadow-lg animate-fade-up">
          <div className="p-6 md:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="shrink-0 bg-card rounded-xl p-4 shadow-sm border border-border">
                <img
                  src={nationalCoverLogo}
                  alt="National Cover Pty Ltd logo"
                  className="h-14 md:h-18 w-auto object-contain"
                />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <h2 className="text-xl font-bold text-foreground">National Cover Pty Ltd</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Licensed insurance brokerage specialising in motor vehicle cover across Australia. As the scheme manager for Motor Cover Mutual, National Cover ensures every member receives competitive, transparent quotes backed by APRA-regulated underwriters.
                </p>
              </div>
            </div>

            {/* Regulation tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                <CheckCircle className="w-3 h-3" /> ABN 74 639 621 480
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700 border border-blue-500/20">
                <Shield className="w-3 h-3" /> AFSL Representative
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
                <Shield className="w-3 h-3" /> AFCA Member
              </span>
            </div>
          </div>

          {/* Contact grid */}
          <div className="border-t border-border grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="p-5 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Contact</p>
              <a href="tel:0753460149" className="flex items-center gap-2 text-sm text-foreground hover:text-accent transition-colors">
                <Phone className="w-4 h-4 text-accent" /> 07 5346 0149
              </a>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                <span>298 Musgrave Road, Coopers Plains QLD 4108</span>
              </div>
            </div>
            <div className="p-5 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Website</p>
              <a
                href="https://nationalcover.com.au"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
              >
                nationalcover.com.au <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <p className="text-xs text-muted-foreground">
                Visit for more information about services and policies.
              </p>
            </div>
          </div>
        </Card>

        {/* Reviews Section */}
        <div className="max-w-3xl mx-auto mt-10 space-y-6 animate-fade-up" style={{ animationDelay: "0.15s" }}>
          {/* Rating summary */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black text-foreground">5.0</span>
              <div className="space-y-1">
                <StarRating />
                <p className="text-xs text-muted-foreground">Based on 120+ Google reviews</p>
              </div>
            </div>
          </div>

          {/* Review cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.map((review, i) => (
              <Card key={i} className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center text-sm font-bold text-accent">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{review.name}</p>
                    <p className="text-[10px] text-muted-foreground">{review.date}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
              </Card>
            ))}
          </div>

          {/* Birdeye widget */}
          <div id="bf-revz-widget-9876543213011151831216912" className="min-h-[80px]" />
        </div>

        {/* Security bar */}
        <div className="max-w-3xl mx-auto mt-8 animate-fade-up" style={{ animationDelay: "0.25s" }}>
          <div className="flex items-center gap-3 px-5 py-3 rounded-lg bg-blue-500/5 border border-blue-500/15">
            <Lock className="w-4 h-4 text-blue-600 shrink-0" />
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Your details will be securely passed to National Cover to begin your rideshare insurance quote. <strong>No spam — ever.</strong>
            </p>
          </div>
        </div>

        {/* Dark CTA Block */}
        <div className="max-w-3xl mx-auto mt-8 mb-12 rounded-2xl bg-primary p-8 md:p-10 text-center space-y-6 animate-fade-up" style={{ animationDelay: "0.35s" }}>
          <p className="text-primary-foreground/80 text-lg">
            Ready to get your rideshare insurance sorted?
          </p>
          <Button
            onClick={handleProceed}
            className="px-10 py-7 text-lg font-bold rounded-full bg-accent hover:bg-accent/90 text-accent-foreground transition-all hover:shadow-xl hover:scale-[1.02] group"
          >
            <span className="flex items-center gap-3">
              Proceed to National Cover
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>

          {/* Trust row */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-primary-foreground/50">
            {["AFCA supervised", "No obligation quote", "256-bit encrypted", "Response within 2 hrs"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3" /> {item}
              </span>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BrokerPage;
