import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useCallback } from 'react';

export type SortMode = 'random' | 'price-asc' | 'price-desc';

export interface DatabaseVehicle {
  id: string;
  state: string;
  registration_number: string;
  vehicle_make: string;
  vehicle_model: string | null;
  vehicle_year: number | null;
  vehicle_series: string | null;
  vehicle_variant: string | null;
  market_value: number | null;
  calculated_membership_price: number | null;
  vehicle_image_url: string;
}

interface UseRandomVehiclesOptions {
  count?: number;
  sortBy?: SortMode;
}

export const useRandomVehicles = ({ count = 3, sortBy = 'random' }: UseRandomVehiclesOptions = {}) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ['random-vehicles', count, sortBy, refreshKey],
    queryFn: async () => {
      let query = supabase
        .from('sample_vehicle_quotes')
        .select('id, state, registration_number, vehicle_make, vehicle_model, vehicle_year, vehicle_series, vehicle_variant, market_value, calculated_membership_price, vehicle_image_url')
        .eq('image_exists', true)
        .not('vehicle_image_url', 'is', null)
        .not('calculated_membership_price', 'is', null)
        .not('market_value', 'is', null);

      // Apply sorting
      if (sortBy === 'price-asc') {
        query = query.order('calculated_membership_price', { ascending: true });
      } else if (sortBy === 'price-desc') {
        query = query.order('calculated_membership_price', { ascending: false });
      }

      query = query.limit(count);

      const { data, error } = await query;

      if (error) throw error;

      // For random mode, shuffle the results
      if (sortBy === 'random' && data) {
        return data.sort(() => Math.random() - 0.5);
      }

      return data as DatabaseVehicle[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Get total count
  const { data: totalCount } = useQuery({
    queryKey: ['total-vehicles-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('sample_vehicle_quotes')
        .select('*', { count: 'exact', head: true })
        .eq('image_exists', true)
        .not('vehicle_image_url', 'is', null)
        .not('calculated_membership_price', 'is', null);

      if (error) throw error;
      return count || 0;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const refreshVehicles = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return {
    vehicles: data || [],
    totalCount: totalCount || 0,
    isLoading,
    error,
    refreshVehicles,
  };
};
