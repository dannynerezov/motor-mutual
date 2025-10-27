import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { shouldIncludeCarPurchaseField, convertDateFormat, convertGenderFormat } from '@/lib/thirdPartyBulkLogic';
import { toast } from 'sonner';

interface VehicleData {
  registration_number: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  vehicle_nvic: string | null;
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
  address_lurn: string;
  address_latitude?: string;
  address_longitude?: string;
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

  const generateQuote = async (
    vehicle: VehicleData,
    driver: DriverData,
    policyStartDate: string
  ): Promise<SuncorpQuoteResult> => {
    setIsGenerating(true);

    try {
      const vehicleYear = vehicle.vehicle_year.toString();
      const includeCarPurchase = shouldIncludeCarPurchaseField(vehicleYear);

      // Build the base payload
      const basePayload = {
        registrationNumber: vehicle.registration_number,
        registrationState: driver.address_state,
        vehicleYear: vehicleYear,
        vehicleFamily: vehicle.vehicle_model,
        vehicleMake: vehicle.vehicle_make,
        primaryDriverFirstName: driver.first_name,
        primaryDriverLastName: driver.last_name,
        primaryDriverGender: convertGenderFormat(driver.gender),
        primaryDriverDateOfBirth: convertDateFormat(driver.date_of_birth),
        riskAddressUnitType: driver.address_unit_type || '',
        riskAddressUnitNumber: driver.address_unit_number || '',
        riskAddressStreetNumber: driver.address_street_number,
        riskAddressStreetName: driver.address_street_name,
        riskAddressStreetType: driver.address_street_type,
        riskAddressSuburb: driver.address_suburb,
        riskAddressState: driver.address_state,
        riskAddressPostcode: driver.address_postcode,
        riskAddressLurn: driver.address_lurn,
        riskAddressLatitude: driver.address_latitude || '',
        riskAddressLongitude: driver.address_longitude || '',
        policyStartDate: policyStartDate,
        primaryUsage: 'RIDE_SHARE',
        coverType: 'THIRD_PARTY',
      };

      // Smart bidirectional retry strategy
      const attempts = includeCarPurchase 
        ? [
            { ...basePayload, carPurchaseIn13Months: 'NO' },
            { ...basePayload, carPurchaseIn13Months: 'YES' },
            { ...basePayload } // Omit field
          ]
        : [{ ...basePayload }];

      let lastError: any = null;

      for (let i = 0; i < attempts.length; i++) {
        try {
          console.log(`Attempt ${i + 1}/${attempts.length} for Suncorp quote generation`);

          const { data, error } = await supabase.functions.invoke('suncorp-proxy', {
            body: {
              action: 'createQuote',
              parameters: attempts[i]
            }
          });

          if (error) throw error;

          if (data.success && data.quoteNumber) {
            console.log('Suncorp quote generated successfully:', data.quoteNumber);
            
            return {
              success: true,
              quoteNumber: data.quoteNumber,
              basePremium: parseFloat(data.basePremium || '0'),
              stampDuty: parseFloat(data.stampDuty || '0'),
              gst: parseFloat(data.gst || '0'),
              totalPremium: parseFloat(data.totalPremium || '0'),
              requestPayload: attempts[i],
              responseData: data,
            };
          } else {
            throw new Error(data.error || 'Quote generation failed');
          }
        } catch (err: any) {
          console.error(`Attempt ${i + 1} failed:`, err);
          lastError = err;
          
          // If not last attempt, continue to next
          if (i < attempts.length - 1) {
            console.log('Retrying with different parameters...');
            continue;
          }
        }
      }

      // All attempts failed
      throw lastError || new Error('All quote generation attempts failed');

    } catch (error: any) {
      console.error('Suncorp quote generation error:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to generate quote',
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
