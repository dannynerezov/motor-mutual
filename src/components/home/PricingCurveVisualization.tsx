import { vehicleExamples } from "@/data/vehicleExamples";
import { calculatePercentagePosition } from "@/lib/pricingHelpers";

interface PricingCurveVisualizationProps {
  currentVehicleId: number;
  vehiclesWithPremiums: Array<{ id: number; value: number; premium: number }>;
  scheme: any;
}

export function PricingCurveVisualization({ 
  currentVehicleId, 
  vehiclesWithPremiums,
  scheme 
}: PricingCurveVisualizationProps) {
  // Sort vehicles by value for proper curve display
  const sortedVehicles = [...vehiclesWithPremiums].sort((a, b) => a.value - b.value);
  
  return (
    <div className="bg-card border-2 border-border rounded-lg p-6 md:p-8">
      <h4 className="text-lg font-bold text-center mb-6 text-primary">
        All 9 Vehicles on Our Pricing Curve
      </h4>
      
      {/* Desktop: Horizontal curve */}
      <div className="hidden md:block">
        <div className="relative h-32">
          {/* Curve line */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <path
              d="M 0 90 Q 150 70, 300 60 T 600 50 T 900 45 L 900 45"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="2"
              className="opacity-40"
            />
          </svg>
          
          {/* Vehicle dots */}
          <div className="absolute inset-0">
            {sortedVehicles.map((vehicle, index) => {
              const xPosition = (index / (sortedVehicles.length - 1)) * 100;
              const isCurrent = vehicle.id === currentVehicleId;
              
              return (
                <div
                  key={vehicle.id}
                  className="absolute transition-all duration-300"
                  style={{
                    left: `${xPosition}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div
                    className={`rounded-full transition-all duration-300 ${
                      isCurrent
                        ? 'w-6 h-6 bg-accent shadow-lg animate-pulse ring-4 ring-accent/30'
                        : 'w-3 h-3 bg-primary/40 hover:bg-primary/60 hover:scale-150'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Labels */}
        <div className="flex justify-between mt-4 text-xs text-muted-foreground">
          <span>Lower Value</span>
          <span>Higher Value</span>
        </div>
      </div>
      
      {/* Mobile: Vertical linear view */}
      <div className="md:hidden space-y-2">
        {sortedVehicles.map((vehicle) => {
          const isCurrent = vehicle.id === currentVehicleId;
          const vehicleInfo = vehicleExamples.find(v => v.id === vehicle.id);
          const percentage = calculatePercentagePosition(vehicle.value, scheme);
          
          return (
            <div
              key={vehicle.id}
              className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300 ${
                isCurrent ? 'bg-accent/10 border border-accent' : 'border border-transparent'
              }`}
            >
              <div
                className={`rounded-full transition-all duration-300 ${
                  isCurrent
                    ? 'w-4 h-4 bg-accent animate-pulse'
                    : 'w-2 h-2 bg-primary/40'
                }`}
              />
              <div className="flex-1 flex items-center justify-between">
                <span className={`text-sm ${isCurrent ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                  {vehicleInfo?.year} {vehicleInfo?.make}
                </span>
                <span className={`text-xs ${isCurrent ? 'text-accent font-semibold' : 'text-muted-foreground'}`}>
                  {Math.round(percentage)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      <p className="text-center text-xs text-muted-foreground mt-4">
        Each dot represents one of our example vehicles positioned on the transparent pricing curve
      </p>
    </div>
  );
}
