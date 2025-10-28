import { Scale, MapPin, CheckCircle, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompactPricingWidget } from "./CompactPricingWidget";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const FairnessSection = () => {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-background via-accent/[0.01] to-background">
      {/* Massive Watermark Background */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <div className="text-[15vw] font-black text-accent/[0.03] uppercase tracking-tighter rotate-[-2deg] whitespace-nowrap">
          Fairness
        </div>
      </div>

      {/* Background Synonyms - Stylized & barely visible */}
      <div className="absolute top-16 left-8 text-4xl text-gray-300/20 dark:text-gray-700/25 font-black uppercase tracking-wider rotate-[-2deg] pointer-events-none select-none" style={{ userSelect: 'none' }} aria-hidden="true">
        EK-wi-tee
      </div>
      <div className="absolute top-32 right-12 text-3xl text-gray-300/20 dark:text-gray-700/25 font-black rotate-[1deg] pointer-events-none select-none" style={{ userSelect: 'none' }} aria-hidden="true">
        JUS-tis
      </div>
      <div className="absolute top-1/4 left-1/4 text-5xl text-gray-300/20 dark:text-gray-700/25 font-black italic rotate-[-1deg] pointer-events-none select-none" style={{ userSelect: 'none' }} aria-hidden="true">
        im-pahr-shee-AL-i-tee
      </div>
      <div className="absolute bottom-40 left-16 text-4xl text-gray-300/20 dark:text-gray-700/25 font-black uppercase italic rotate-[2deg] pointer-events-none select-none" style={{ userSelect: 'none' }} aria-hidden="true">
        EE-vun-HAN-did-ness
      </div>
      <div className="absolute top-2/3 right-1/4 text-3xl text-gray-300/20 dark:text-gray-700/25 font-black rotate-[-2deg] pointer-events-none select-none" style={{ userSelect: 'none' }} aria-hidden="true">
        ih-gal-i-TAIR-ee-uh-niz-um
      </div>
      <div className="absolute bottom-24 right-20 text-4xl text-gray-300/20 dark:text-gray-700/25 font-black italic rotate-[1deg] pointer-events-none select-none" style={{ userSelect: 'none' }} aria-hidden="true">
        ob-jek-TIV-i-tee
      </div>
      <div className="absolute top-48 left-1/3 text-5xl text-gray-300/20 dark:text-gray-700/25 font-black uppercase rotate-[-1deg] pointer-events-none select-none" style={{ userSelect: 'none' }} aria-hidden="true">
        noo-TRAL-i-tee
      </div>
      <div className="absolute bottom-1/3 right-1/3 text-6xl text-gray-300/20 dark:text-gray-700/25 font-black italic rotate-[2deg] pointer-events-none select-none" style={{ userSelect: 'none' }} aria-hidden="true">
        ih-KWOL-i-tee
      </div>
      <div className="absolute top-1/3 right-16 text-3xl text-gray-300/20 dark:text-gray-700/25 font-black uppercase italic rotate-[-1deg] pointer-events-none select-none" style={{ userSelect: 'none' }} aria-hidden="true">
        BAL-uns
      </div>
      <div className="absolute bottom-48 left-1/4 text-4xl text-gray-300/20 dark:text-gray-700/25 font-black rotate-[1deg] pointer-events-none select-none" style={{ userSelect: 'none' }} aria-hidden="true">
        ek-wi-tuh-BIL-i-tee
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-accent/10 backdrop-blur-md border-2 border-accent/40 rounded-full text-lg md:text-xl font-bold text-accent mb-6 shadow-lg hover:shadow-accent/20 transition-all duration-300 animate-pulse [animation-duration:3s]">
            <Scale className="h-6 w-6" />
            <span className="tracking-wide">FAIRNESS</span>
          </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Fair Prices for Everyone, Everywhere
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Your location shouldn't determine what you pay
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Problem Statement */}
        <Card className="border-2 border-muted bg-muted/30 dark:border-muted dark:bg-muted/10">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-muted dark:bg-muted/50">
                <TrendingDown className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl">The Problem with Traditional Insurance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">
              Traditional insurance prices policies based on your postcode, resulting in price variations of <strong>up to 600%</strong> between suburbs.
            </p>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>Some metropolitan areas: 6x higher premiums</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>Same car, same driver, different suburb = drastically different price</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>Many locations become uninsurable or prohibitively expensive</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solution Statement */}
        <Card className="border-2 border-primary/30 bg-primary/5 dark:border-primary/50 dark:bg-primary/10">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/20 dark:bg-accent/30">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-2xl">The Mutual Solution</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">
              The Mutual uses <strong>location-independent pricing</strong>. Whether you live in the most expensive suburb or the cheapest, your base membership price is the same.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-accent">
                <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="font-medium">Same pricing formula for all postcodes</span>
              </div>
              <div className="flex items-start gap-2 text-accent">
                <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="font-medium">No suburb penalties</span>
              </div>
              <div className="flex items-start gap-2 text-accent">
                <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="font-medium">Fair treatment regardless of location</span>
              </div>
              <div className="flex items-start gap-2 text-accent">
                <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="font-medium">Transparent, predictable costs</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compact Pricing Widget */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-2">
            See How Location Affects Traditional Insurance Prices
          </h3>
          <p className="text-lg text-muted-foreground">
            Explore pricing differences across Australian states - then see why we do it differently
          </p>
        </div>
        
        <CompactPricingWidget />

        <div className="text-center">
          <Link to="/widget">
            <Button size="lg" className="text-lg px-8">
              Explore Full Price Data by Suburb
            </Button>
          </Link>
        </div>
      </div>
      </div>
    </section>
  );
};
