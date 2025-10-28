import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VehicleData {
  registration_number: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  vehicle_nvic: string | null;
  vehicle_value?: number;  // ✅ Market value for sumInsured
  vehicle_variant?: string;  // ✅ Variant for vehicleInfo
}

interface DriverData {
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  address_line1: string;
  address_unit_type?: string;
  address_unit_number?: string;
  address_street_number: string;
  address_street_name: string;
  address_street_type: string;
  address_suburb: string;
  address_state: string;
  address_postcode: string;
  address_lurn?: string;
  address_latitude?: string;
  address_longitude?: string;
  address_gnaf_data?: any;
}

interface SuncorpQuoteResult {
  success: boolean;
  quoteNumber?: string;
  basePremium?: number;
  stampDuty?: number;
  gst?: number;
  totalPremium?: number;
  requestPayload?: any;
  responseData?: any;
  error?: string;
}

export const useSuncorpQuote = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Generate quote using dedicated backend function
   */
  const generateQuote = async (
    vehicle: VehicleData,
    driver: DriverData,
    policyStartDate: string
  ): Promise<SuncorpQuoteResult> => {
    setIsGenerating(true);

    try {
      console.log('[Quote Generation] Starting quote via suncorp-single-quote function');
      console.log('[Quote Generation] Vehicle:', `${vehicle.vehicle_year} ${vehicle.vehicle_make} ${vehicle.vehicle_model}`);
      console.log('[Quote Generation] Driver:', `${driver.first_name} ${driver.last_name}`);
      console.log('[Quote Generation] Address:', `${driver.address_suburb}, ${driver.address_state} ${driver.address_postcode}`);
      console.log('[Quote Generation] LURN present:', !!driver.address_lurn);

      const { data, error } = await supabase.functions.invoke('suncorp-single-quote', {
        body: {
          vehicle: {
            registration_number: vehicle.registration_number,
            vehicle_make: vehicle.vehicle_make,
            vehicle_model: vehicle.vehicle_model,
            vehicle_year: vehicle.vehicle_year,
            vehicle_nvic: vehicle.vehicle_nvic,
            vehicle_value: vehicle.vehicle_value,  // ✅ Pass market value
            vehicle_variant: vehicle.vehicle_variant,  // ✅ Pass variant
          },
          driver: {
            first_name: driver.first_name,
            last_name: driver.last_name,
            gender: driver.gender,
            date_of_birth: driver.date_of_birth,
            address_line1: driver.address_line1,
            address_unit_type: driver.address_unit_type,
            address_unit_number: driver.address_unit_number,
            address_street_number: driver.address_street_number,
            address_street_name: driver.address_street_name,
            address_street_type: driver.address_street_type,
            address_suburb: driver.address_suburb,
            address_state: driver.address_state,
            address_postcode: driver.address_postcode,
            address_lurn: driver.address_lurn,
            address_latitude: driver.address_latitude,
            address_longitude: driver.address_longitude,
            address_gnaf_data: driver.address_gnaf_data,
          },
          policyStartDate,
        },
      });

      if (error) {
        console.error('[Quote Generation] ❌ Edge function error:', error);
        return {
          success: false,
          error: error.message || 'Quote generation failed',
          requestPayload: null,
          responseData: null,
        };
      }

      if (!data?.success) {
        console.error('[Quote Generation] ❌ Quote failed:', data?.error);
        return {
          success: false,
          error: data?.error || 'Quote generation failed',
          requestPayload: data?.requestPayload || null,
          responseData: data?.responseData || null,
        };
      }

      console.log('[Quote Generation] ✅ Quote generated successfully!');
      console.log('[Quote Generation] Quote Number:', data.quoteNumber);
      console.log('[Quote Generation] Total Premium: $', data.totalPremium);

      return {
        success: true,
        quoteNumber: data.quoteNumber,
        basePremium: parseFloat(data.basePremium || '0'),
        stampDuty: parseFloat(data.stampDuty || '0'),
        gst: parseFloat(data.gst || '0'),
        totalPremium: parseFloat(data.totalPremium || '0'),
        requestPayload: data.requestPayload,
        responseData: data.responseData,
      };
    } catch (error: any) {
      console.error('[Quote Generation] ❌ Fatal error:', error);

      return {
        success: false,
        error: error.message || 'Failed to generate quote',
        requestPayload: null,
        responseData: null,
      };
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateQuote,
    isGenerating,
  };
};
