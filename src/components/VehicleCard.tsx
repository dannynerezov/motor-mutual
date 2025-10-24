import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface VehicleDetails {
  year: number;
  make: string;
  family: string;
  variant: string;
  series: string;
  nvic: string;
  bodyStyle: string;
  doors: number;
  transmissionDescription: string;
  fuelType: string;
}

interface VehicleValueInfo {
  tradeLowPrice: number;
  tradePrice: number;
  retailPrice: number;
  marketValue: number;
  kilometers: number;
}

interface VehicleData {
  vehicleDetails: VehicleDetails;
  vehicleValueInfo: VehicleValueInfo;
  imageUrl?: string | null;
}

export interface Vehicle {
  id: string;
  registration: string;
  state: string;
  vehicleData: VehicleData;
  selectedValue: number;
  membershipPrice: number;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  index: number;
  onValueChange: (id: string, value: number) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

export const VehicleCard = ({ vehicle, index, onValueChange, onRemove, canRemove }: VehicleCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const percentageChange = ((vehicle.selectedValue - vehicle.vehicleData.vehicleValueInfo.marketValue) / vehicle.vehicleData.vehicleValueInfo.marketValue) * 100;

  return (
    <Card className="p-3 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/30">
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-muted-foreground">VEHICLE {index + 1}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs font-mono text-muted-foreground">{vehicle.registration}</span>
            </div>
            <h4 className="text-lg font-bold">
              {vehicle.vehicleData.vehicleDetails.year} {vehicle.vehicleData.vehicleDetails.make} {vehicle.vehicleData.vehicleDetails.family}
            </h4>
            <p className="text-sm text-muted-foreground">
              {vehicle.vehicleData.vehicleDetails.variant}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            {canRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(vehicle.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Collapsed View - Price Summary with Slider */}
        {!isExpanded && (
          <div className="space-y-2 border-t border-border/30 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Coverage</p>
                <p className="text-base font-bold">${vehicle.selectedValue.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Base Price</p>
                <p className="text-base font-bold text-accent">${vehicle.membershipPrice.toFixed(2)}</p>
              </div>
            </div>
            {/* Compact Slider */}
            <div className="px-1">
              <Slider
                value={[vehicle.selectedValue]}
                onValueChange={(value) => onValueChange(vehicle.id, value[0])}
                min={vehicle.vehicleData.vehicleValueInfo.tradeLowPrice}
                max={Math.min(vehicle.vehicleData.vehicleValueInfo.retailPrice, 99999.99)}
                step={100}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                <span>${vehicle.vehicleData.vehicleValueInfo.tradeLowPrice.toLocaleString()}</span>
                <span>${Math.min(vehicle.vehicleData.vehicleValueInfo.retailPrice, 99999.99).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Expanded View - Compact Two-Column Layout */}
        {isExpanded && (
          <div className="grid grid-cols-5 gap-3 border-t border-border/30 pt-2">
            {/* Left Column: Image + Specs */}
            <div className="col-span-2 space-y-2">
              {vehicle.vehicleData.imageUrl && (
                <div className="bg-card/50 rounded-lg p-2 backdrop-blur-sm">
                  <img 
                    src={vehicle.vehicleData.imageUrl} 
                    alt={`${vehicle.vehicleData.vehicleDetails.year} ${vehicle.vehicleData.vehicleDetails.make}`}
                    className="w-full h-20 object-contain rounded"
                    onError={(e) => e.currentTarget.style.display = 'none'}
                  />
                </div>
              )}
              {/* Quick Specs */}
              <div className="text-xs space-y-0.5 text-muted-foreground">
                <p><span className="font-medium">Body:</span> {vehicle.vehicleData.vehicleDetails.bodyStyle}</p>
                <p><span className="font-medium">Doors:</span> {vehicle.vehicleData.vehicleDetails.doors}</p>
                <p><span className="font-medium">Trans:</span> {vehicle.vehicleData.vehicleDetails.transmissionDescription}</p>
              </div>
            </div>

            {/* Right Column: Valuation */}
            <div className="col-span-3 space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-semibold text-accent">Coverage Value</h5>
                {vehicle.vehicleData.vehicleValueInfo.retailPrice > 99999.99 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground cursor-help">
                          <AlertCircle className="w-3 h-3" />
                          Limit
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">Coverage up to $100,000</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>

              {/* Reference Values - Compact */}
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <div className="text-center p-1.5 bg-muted/30 rounded">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Trade Low</p>
                  <p className="font-semibold text-xs">${vehicle.vehicleData.vehicleValueInfo.tradeLowPrice.toLocaleString()}</p>
                </div>
                <div className="text-center p-1.5 bg-primary/10 rounded border border-primary/30">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Market</p>
                  <p className="font-semibold text-xs text-primary">${vehicle.vehicleData.vehicleValueInfo.marketValue.toLocaleString()}</p>
                </div>
                <div className="text-center p-1.5 bg-muted/30 rounded">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Retail</p>
                  <p className="font-semibold text-xs">${Math.min(vehicle.vehicleData.vehicleValueInfo.retailPrice, 99999.99).toLocaleString()}</p>
                </div>
              </div>

              {/* Current Selection - Compact */}
              <div className="text-center py-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-accent/20">
                <p className="text-[10px] text-muted-foreground mb-0.5">Selected Coverage</p>
                <div className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ${vehicle.selectedValue.toLocaleString()}
                </div>
                {percentageChange !== 0 && (
                  <p className={`text-[10px] mt-0.5 ${percentageChange > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                    {percentageChange > 0 ? '↑' : '↓'} {Math.abs(percentageChange).toFixed(1)}% from market
                  </p>
                )}
              </div>

              {/* Slider */}
              <div className="px-1">
                <Slider
                  value={[vehicle.selectedValue]}
                  onValueChange={(value) => onValueChange(vehicle.id, value[0])}
                  min={vehicle.vehicleData.vehicleValueInfo.tradeLowPrice}
                  max={Math.min(vehicle.vehicleData.vehicleValueInfo.retailPrice, 99999.99)}
                  step={100}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                  <span>${vehicle.vehicleData.vehicleValueInfo.tradeLowPrice.toLocaleString()}</span>
                  <span>${Math.min(vehicle.vehicleData.vehicleValueInfo.retailPrice, 99999.99).toLocaleString()}</span>
                </div>
              </div>

              {/* Price Display */}
              <div className="flex items-center justify-between pt-1.5 border-t border-border/30">
                <span className="text-xs text-muted-foreground">Base Price:</span>
                <span className="text-lg font-bold text-accent">${vehicle.membershipPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
