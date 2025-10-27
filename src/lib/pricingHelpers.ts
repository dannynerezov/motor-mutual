import { PricingScheme, calculateBasePremium } from "@/lib/pricingCalculator";

export function calculatePercentagePosition(
  vehicleValue: number,
  scheme: PricingScheme | null
): number {
  if (!scheme) return 0;
  
  const range = scheme.ceiling_point - scheme.floor_point;
  const position = vehicleValue - scheme.floor_point;
  return Math.min(100, Math.max(0, (position / range) * 100));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function getPremiumColor(percentage: number): string {
  if (percentage < 33) return 'text-green-600 dark:text-green-500';
  if (percentage < 66) return 'text-blue-600 dark:text-blue-500';
  return 'text-orange-600 dark:text-orange-500';
}

export function getProgressBarColor(percentage: number): string {
  if (percentage < 33) return 'from-green-500 to-green-600';
  if (percentage < 66) return 'from-blue-500 to-blue-600';
  return 'from-orange-500 to-orange-600';
}

export function generateCalculationExample(
  vehicleValue: number,
  premium: number,
  scheme: PricingScheme | null
): {
  calculation: string;
  explanation: string;
  valueUp10: { value: number; premium: number; change: number };
  valueDown10: { value: number; premium: number; change: number };
} | null {
  if (!scheme) return null;

  // Calculate slope (rate per dollar)
  const slope = (scheme.ceiling_price - scheme.floor_price) / 
                (scheme.ceiling_point - scheme.floor_point);
  const intercept = scheme.floor_price - (slope * scheme.floor_point);
  
  // Format calculation showing the actual numbers
  const calculation = `$${premium.toFixed(2)} = (${slope.toFixed(6)} × $${vehicleValue.toLocaleString()}) + $${intercept.toFixed(2)}`;
  
  // Simple explanation
  const explanation = `Rate: $${(slope * 1000).toFixed(2)} per $1,000 of vehicle value`;
  
  // Calculate 10% up
  const valueUp = Math.round(vehicleValue * 1.1);
  const premiumUp = calculateBasePremium(valueUp, scheme);
  const changeUp = premiumUp - premium;
  
  // Calculate 10% down
  const valueDown = Math.round(vehicleValue * 0.9);
  const premiumDown = calculateBasePremium(valueDown, scheme);
  const changeDown = premiumDown - premium;
  
  return {
    calculation,
    explanation,
    valueUp10: {
      value: valueUp,
      premium: premiumUp,
      change: changeUp
    },
    valueDown10: {
      value: valueDown,
      premium: premiumDown,
      change: changeDown
    }
  };
}
