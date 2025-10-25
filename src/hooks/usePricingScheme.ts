import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { calculateBasePremium } from '@/lib/pricingCalculator';

export const usePricingScheme = () => {
  const { data: activeScheme, isLoading, error } = useQuery({
    queryKey: ['active-pricing-scheme'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_schemes')
        .select('*')
        .eq('is_active', true)
        .order('valid_from', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error('No active pricing scheme found');
      
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
  });

  const calculatePrice = (vehicleValue: number): number => {
    if (!activeScheme) {
      console.warn('No active pricing scheme, using fallback');
      return 500; // Safe minimum
    }

    try {
      return calculateBasePremium(vehicleValue, {
        floor_price: activeScheme.floor_price,
        floor_point: activeScheme.floor_point,
        ceiling_price: activeScheme.ceiling_price,
        ceiling_point: activeScheme.ceiling_point,
      });
    } catch (error) {
      console.error('Price calculation error:', error);
      throw error;
    }
  };

  return {
    activeScheme,
    isLoading,
    error,
    calculatePrice,
  };
};
