import { ShieldCheck, Clock, DollarSign, Car, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const ReliabilitySection = () => {
  return (
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 border border-accent/30 rounded-full text-sm font-medium text-accent mb-6">
          <ShieldCheck className="h-4 w-4" />
          Reliability
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Reliable, Fast Claims You Can Count On
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Focus on claims outcomes, not repair management
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Not-At-Fault Claims */}
        <Card className="border-2 hover:shadow-strong transition-shadow">
          <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/20 dark:bg-primary/30">
                <Car className="h-6 w-6 text-primary dark:text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Not Your Fault?</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-lg font-semibold">
              We Keep You Driving Through Our Accident Management Partners
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span>Claims processed through at-fault party's insurance</span>
              </li>
              <li className="flex items-start gap-3">
                <Car className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span>Replacement vehicle provided while yours is repaired</span>
              </li>
              <li className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span>No excess, no impact on your claims history</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span>Professional management from start to finish</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* At-Fault / Single Vehicle Claims */}
        <Card className="border-2 hover:shadow-strong transition-shadow">
          <CardHeader className="bg-gradient-to-br from-accent/10 to-accent/5 dark:from-accent/20 dark:to-accent/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/20 dark:bg-accent/30">
                <DollarSign className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-2xl">At Fault or Single Vehicle?</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-lg font-semibold">
              Cash Settlement Gives You Control
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span><strong>You decide:</strong> Repair or don't repair your vehicle</span>
              </li>
              <li className="flex items-start gap-3">
                <Car className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span>Choose your own repairer, no steering to networks</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span>Fast resolution - typically 5-10 business days</span>
              </li>
              <li className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span>No repair management delays or disputes</span>
              </li>
            </ul>
            <div className="pt-2 text-sm text-muted-foreground">
              <p>Applies to: Flood, hailstorm, theft, malicious damage, at-fault collisions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card className="mb-12 border-2">
        <CardHeader className="bg-muted/30 text-center">
          <CardTitle className="text-2xl">Typical Claim Resolution Timeline</CardTitle>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-accent hidden md:block" />
            
            {/* Timeline steps */}
            <div className="grid md:grid-cols-4 gap-6 relative">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4 relative z-10">
                  1
                </div>
                <h4 className="font-semibold mb-2">Day 1</h4>
                <p className="text-sm text-muted-foreground">Submit Claim</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4 relative z-10">
                  2-3
                </div>
                <h4 className="font-semibold mb-2">Days 2-3</h4>
                <p className="text-sm text-muted-foreground">Assessment Complete</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4 relative z-10">
                  5-7
                </div>
                <h4 className="font-semibold mb-2">Days 5-7</h4>
                <p className="text-sm text-muted-foreground">Settlement Agreed</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4 relative z-10">
                  ✓
                </div>
                <h4 className="font-semibold mb-2">Days 7-10</h4>
                <p className="text-sm text-muted-foreground">Payment Issued</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Compare:</strong> Traditional insurers typically take 15-30+ days due to repair management delays
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="text-center space-y-6">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">
            Want to See the Full Claims Process?
          </h3>
          <p className="text-lg text-muted-foreground mb-6">
            Learn more about how we achieve fast, reliable claims settlement through careful accident management and member control
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/claims">
            <Button size="lg" className="text-lg px-8 group">
              See Full Claims Process
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/claims#comparison">
            <Button size="lg" variant="outline" className="text-lg px-8">
              View Claims Comparison
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
