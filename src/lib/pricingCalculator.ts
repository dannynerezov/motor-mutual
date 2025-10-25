export interface PricingScheme {
  floor_price: number;
  floor_point: number;
  ceiling_price: number;
  ceiling_point: number;
}

/**
 * Calculate base premium based on vehicle value using linear interpolation
 * Formula from Excel model:
 * - Below floor point: use floor price
 * - Between floor and ceiling: linear interpolation
 * - At or above ceiling: vehicle not eligible
 */
export function calculateBasePremium(
  vehicleValue: number, 
  scheme: PricingScheme
): number {
  // Below or at floor point: use floor price
  if (vehicleValue <= scheme.floor_point) {
    return scheme.floor_price;
  }
  
  // At or above ceiling point: vehicle not eligible
  if (vehicleValue >= scheme.ceiling_point) {
    throw new Error(
      `Vehicles valued at $${scheme.ceiling_point.toLocaleString()} or more are not eligible`
    );
  }
  
  // Between floor and ceiling: linear interpolation
  // slope = (ceiling_price - floor_price) / (ceiling_point - floor_point)
  const slope = (scheme.ceiling_price - scheme.floor_price) / 
                (scheme.ceiling_point - scheme.floor_point);
  
  const basePremium = scheme.floor_price + 
                      (slope * (vehicleValue - scheme.floor_point));
  
  return Math.round(basePremium * 100) / 100; // Round to 2 decimals
}

/**
 * Generate the straight-line equation for the pricing scheme
 * Format: Base Premium = mx + b
 */
export function generatePricingEquation(scheme: PricingScheme): string {
  const slope = (scheme.ceiling_price - scheme.floor_price) / 
                (scheme.ceiling_point - scheme.floor_point);
  
  const intercept = scheme.floor_price - (slope * scheme.floor_point);
  
  const slopeStr = slope.toFixed(6);
  const interceptStr = Math.abs(intercept).toFixed(2);
  
  // Format: y = mx + b
  if (intercept >= 0) {
    return `Base Premium = ${slopeStr} × Vehicle Value + ${interceptStr}`;
  } else {
    return `Base Premium = ${slopeStr} × Vehicle Value - ${interceptStr}`;
  }
}

/**
 * Generate pricing data points for charting
 * Creates points at specified increment from startValue to endValue
 */
export function generatePricingDataPoints(
  scheme: PricingScheme,
  startValue: number = 0,
  endValue: number = 100000,
  increment: number = 500
): Array<{ vehicleValue: number; basePremium: number }> {
  const dataPoints: Array<{ vehicleValue: number; basePremium: number }> = [];
  
  for (let value = startValue; value <= endValue; value += increment) {
    try {
      const premium = calculateBasePremium(value, scheme);
      dataPoints.push({
        vehicleValue: value,
        basePremium: premium
      });
    } catch (error) {
      // Stop at ceiling point
      break;
    }
  }
  
  return dataPoints;
}

/**
 * Calculate summary statistics for a pricing scheme
 */
export function getPricingStats(scheme: PricingScheme) {
  const minPremium = scheme.floor_price;
  const maxPremium = scheme.ceiling_price;
  
  // Calculate average premium across the range
  const dataPoints = generatePricingDataPoints(scheme);
  const avgPremium = dataPoints.reduce((sum, pt) => sum + pt.basePremium, 0) / dataPoints.length;
  
  // Rate of increase per $1,000
  const slope = (scheme.ceiling_price - scheme.floor_price) / 
                (scheme.ceiling_point - scheme.floor_point);
  const ratePerThousand = slope * 1000;
  
  return {
    minPremium,
    maxPremium,
    avgPremium: Math.round(avgPremium * 100) / 100,
    ratePerThousand: Math.round(ratePerThousand * 100) / 100
  };
}
