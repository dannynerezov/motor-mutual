import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PricingSchemeChart } from './PricingSchemeChart';
import { getPricingStats, PricingScheme, generatePricingEquation } from '@/lib/pricingCalculator';
import { Card, CardContent } from '@/components/ui/card';

interface PricingSchemeChartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scheme: PricingScheme & {
    scheme_number: number;
    valid_from: string;
  };
}

export function PricingSchemeChartModal({ 
  open, 
  onOpenChange, 
  scheme 
}: PricingSchemeChartModalProps) {
  const equation = generatePricingEquation(scheme);
  const stats = getPricingStats(scheme);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Pricing Scheme #{scheme.scheme_number} - Active from {new Date(scheme.valid_from).toLocaleDateString()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Equation Display */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">Straight-Line Equation</p>
                <p className="text-lg font-mono font-semibold">{equation}</p>
              </div>
            </CardContent>
          </Card>

          {/* Chart */}
          <Card>
            <CardContent className="pt-6">
              <PricingSchemeChart scheme={scheme} height={400} />
            </CardContent>
          </Card>

          {/* Summary Statistics */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold mb-4">Summary Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Minimum Premium</p>
                  <p className="text-lg font-semibold">${stats.minPremium.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">at floor point</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Maximum Premium</p>
                  <p className="text-lg font-semibold">${stats.maxPremium.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">at ceiling point</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Average Premium</p>
                  <p className="text-lg font-semibold">${stats.avgPremium.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">across range</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rate Increase</p>
                  <p className="text-lg font-semibold">${stats.ratePerThousand.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">per $1,000 value</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scheme Details */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold mb-4">Scheme Parameters</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Floor Price</p>
                  <p className="text-base font-semibold">${scheme.floor_price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Floor Point</p>
                  <p className="text-base font-semibold">${scheme.floor_point.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ceiling Price</p>
                  <p className="text-base font-semibold">${scheme.ceiling_price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ceiling Point</p>
                  <p className="text-base font-semibold">${scheme.ceiling_point.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
