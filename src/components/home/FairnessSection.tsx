import { Scale, MapPin, CheckCircle, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompactPricingWidget } from "./CompactPricingWidget";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const FairnessSection = () => {
  return (
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 border border-accent/30 rounded-full text-sm font-medium text-accent mb-6">
          <Scale className="h-4 w-4" />
          Fairness
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
  );
};
