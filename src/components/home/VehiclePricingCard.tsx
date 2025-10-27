import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, getPremiumColor, getProgressBarColor, calculatePercentagePosition } from "@/lib/pricingHelpers";
import { VehicleExample } from "@/data/vehicleExamples";

interface VehiclePricingCardProps {
  vehicle: VehicleExample;
  premium: number;
  scheme: any;
  isActive: boolean;
}

export function VehiclePricingCard({ vehicle, premium, scheme, isActive }: VehiclePricingCardProps) {
  const [displayedPremium, setDisplayedPremium] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const percentage = calculatePercentagePosition(vehicle.value, scheme);

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
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={vehicle.image}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover transition-all duration-700 ease-out"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'scale(1)' : 'scale(1.05)'
            }}
            loading="lazy"
          />
        </div>

        {/* Vehicle Details */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Vehicle Name & Value */}
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-bold text-primary">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-lg text-muted-foreground">
              Vehicle Value: {formatCurrency(vehicle.value)}
            </p>
            <p className="text-sm text-muted-foreground italic">
              {vehicle.description}
            </p>
          </div>

          {/* Premium Display */}
          <div className="space-y-3 py-4 px-6 bg-accent/5 rounded-lg border border-border">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Your Base Premium
            </p>
            <div className={`text-4xl md:text-5xl font-bold transition-all duration-300 ${getPremiumColor(percentage)}`}>
              {formatCurrency(displayedPremium)}
              <span className="text-lg text-muted-foreground ml-2">/ year</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Position on Pricing Curve</span>
              <span className="font-semibold text-primary">{Math.round(percentage)}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
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
