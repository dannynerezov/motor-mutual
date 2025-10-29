import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getPremiumColor, getProgressBarColor, calculatePercentagePosition, generateCalculationExample } from "@/lib/pricingHelpers";
import { DisplayVehicle } from "@/types/databaseVehicle";

interface VehiclePricingCardProps {
  vehicle: DisplayVehicle;
  scheme: any;
  isActive: boolean;
}

export function VehiclePricingCard({ vehicle, scheme, isActive }: VehiclePricingCardProps) {
  const [displayedPremium, setDisplayedPremium] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const [imageError, setImageError] = useState(false);
  const premium = vehicle.premium;
  const percentage = calculatePercentagePosition(vehicle.value, scheme);
  const calculationExample = generateCalculationExample(vehicle.value, premium, scheme);

  useEffect(() => {
    if (!isActive) return;

    // Reset for animation
    setDisplayedPremium(0);
    setProgressWidth(0);

    // Animate premium counter
    let start = 0;
    const end = premium;
    const duration = 1500;
    const increment = end / (duration / 16);
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        setDisplayedPremium(end);
        clearInterval(timer);
      } else {
        start += increment;
        setDisplayedPremium(Math.min(Math.floor(start), end));
      }
    }, 16);

    // Animate progress bar
    const progressTimer = setTimeout(() => {
      setProgressWidth(percentage);
    }, 300);

    return () => {
      clearInterval(timer);
      clearTimeout(progressTimer);
    };
  }, [premium, isActive, percentage]);

  return (
    <Card className="overflow-hidden border-2 shadow-xl hover:shadow-2xl transition-all duration-300 bg-card">
      <CardContent className="p-0">
        {/* Vehicle Image */}
        <div className="relative aspect-video md:aspect-video overflow-hidden bg-muted" style={{ aspectRatio: '16/9' }}>
          {!imageError ? (
            <img
              src={vehicle.image}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover transition-all duration-700 ease-out"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'scale(1)' : 'scale(1.05)'
              }}
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <p className="text-sm text-muted-foreground">Image unavailable</p>
            </div>
          )}
          <Badge className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-xs">
            {vehicle.state} {vehicle.registrationNumber}
          </Badge>
        </div>

        {/* Vehicle Details */}
        <div className="p-4 md:p-6 lg:p-8 space-y-3 md:space-y-6">
          {/* Vehicle Name & Value */}
          <div className="space-y-1 md:space-y-2">
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-primary leading-tight">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            {vehicle.series && (
              <p className="text-xs md:text-sm font-medium text-muted-foreground">
                {vehicle.series}
              </p>
            )}
            <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
              Market Value: {formatCurrency(vehicle.value)}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground italic line-clamp-2">
              {vehicle.description}
            </p>
          </div>

          {/* Premium Display with Calculation */}
          <div className="space-y-2 md:space-y-4 py-3 md:py-4 px-3 md:px-6 bg-accent/5 rounded-lg border border-border">
            <div className="space-y-0.5 md:space-y-1">
              <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Your Base Premium
              </p>
              <div className={`text-2xl md:text-4xl lg:text-5xl font-bold transition-all duration-300 ${getPremiumColor(percentage)}`}>
                {formatCurrency(displayedPremium)}
                <span className="text-sm md:text-lg text-muted-foreground ml-1 md:ml-2">/ year</span>
              </div>
            </div>

            {/* Calculation Explanation */}
            {calculationExample && (
              <div 
                className="border-t border-border/50 pt-2 md:pt-4 space-y-2 md:space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300"
                role="region"
                aria-label="Premium calculation breakdown"
              >
                <div className="space-y-0.5 md:space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    How We Calculated This
                  </p>
                  <div className="font-mono text-xs md:text-sm text-primary bg-background/50 px-2 md:px-3 py-1.5 md:py-2 rounded border border-border/30 overflow-x-auto">
                    {calculationExample.calculation}
                  </div>
                  <p className="text-xs text-muted-foreground italic hidden md:block">
                    {calculationExample.explanation}
                  </p>
                </div>

                {/* Value Change Scenarios */}
                <div 
                  className="grid grid-cols-2 gap-1.5 md:gap-2"
                  role="list"
                  aria-label="Value change scenarios"
                >
                  {/* If value goes DOWN 10% */}
                  <div 
                    className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-2 md:p-3 space-y-0.5 md:space-y-1"
                    role="listitem"
                    aria-label="10% decrease scenario"
                  >
                    <div className="flex items-center gap-0.5 md:gap-1">
                      <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                        📉 -10%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground hidden md:block">
                      {formatCurrency(calculationExample.valueDown10.value)}
                    </p>
                    <p className="text-xs md:text-sm font-bold text-green-700 dark:text-green-400">
                      {formatCurrency(calculationExample.valueDown10.premium)}/yr
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-500">
                      Save {formatCurrency(Math.abs(calculationExample.valueDown10.change))}
                    </p>
                  </div>

                  {/* If value goes UP 10% */}
                  <div 
                    className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg p-2 md:p-3 space-y-0.5 md:space-y-1"
                    role="listitem"
                    aria-label="10% increase scenario"
                  >
                    <div className="flex items-center gap-0.5 md:gap-1">
                      <span className="text-xs font-semibold text-orange-700 dark:text-orange-400">
                        📈 +10%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground hidden md:block">
                      {formatCurrency(calculationExample.valueUp10.value)}
                    </p>
                    <p className="text-xs md:text-sm font-bold text-orange-700 dark:text-orange-400">
                      {formatCurrency(calculationExample.valueUp10.premium)}/yr
                    </p>
                    <p className="text-xs text-orange-600 dark:text-orange-500">
                      +{formatCurrency(calculationExample.valueUp10.change)}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-center text-muted-foreground italic pt-0.5 md:pt-1 hidden md:block">
                  See how transparent linear pricing works? Same formula for everyone.
                </p>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-1 md:space-y-2">
            <div className="flex items-center justify-between text-xs md:text-sm">
              <span className="text-muted-foreground">Pricing Curve</span>
              <span className="font-semibold text-primary">{Math.round(percentage)}%</span>
            </div>
            <div className="h-2 md:h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getProgressBarColor(percentage)} transition-all duration-1200 ease-out`}
                style={{ width: `${progressWidth}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
