import { PricingScheme } from "@/lib/pricingCalculator";

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
