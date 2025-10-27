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

/**
 * Validates quote payload before sending to edge function
 */
const validateQuotePayload = (payload: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Required fields
  const requiredFields = [
    'registrationNumber', 'registrationState', 'vehicleYear',
    'vehicleFamily', 'vehicleMake', 'primaryDriverFirstName',
    'primaryDriverLastName', 'primaryDriverGender', 'primaryDriverDateOfBirth',
    'riskAddressStreetNumber', 'riskAddressStreetName', 'riskAddressStreetType',
    'riskAddressSuburb', 'riskAddressState', 'riskAddressPostcode',
    'riskAddressLurn', 'policyStartDate', 'primaryUsage', 'coverType'
  ];
  
  for (const field of requiredFields) {
    if (!payload[field] || payload[field] === '') {
      errors.push(`Missing or empty: ${field}`);
    }
  }
  
  // Date format validation (dd/mm/yyyy)
  if (payload.primaryDriverDateOfBirth && !/^\d{2}\/\d{2}\/\d{4}$/.test(payload.primaryDriverDateOfBirth)) {
    errors.push(`Invalid date format for primaryDriverDateOfBirth: ${payload.primaryDriverDateOfBirth} (expected dd/mm/yyyy)`);
  }
  
  // Gender validation
  if (payload.primaryDriverGender && !['M', 'F'].includes(payload.primaryDriverGender)) {
    errors.push(`Invalid gender: ${payload.primaryDriverGender} (expected M or F)`);
  }
  
  // Vehicle year validation
  if (payload.vehicleYear && !/^\d{4}$/.test(payload.vehicleYear)) {
    errors.push(`Invalid vehicle year: ${payload.vehicleYear}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

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
          console.log(`[useSuncorpQuote] ========================================`);
          console.log(`[useSuncorpQuote] Attempt ${i + 1}/${attempts.length} for Suncorp quote generation`);
          
          // Log payload before validation
          console.log(`[useSuncorpQuote] Payload before validation:`, JSON.stringify(attempts[i], null, 2));
          
          // Validate payload
          const validation = validateQuotePayload(attempts[i]);
          if (!validation.valid) {
            console.error(`[useSuncorpQuote] ❌ Payload validation failed:`, validation.errors);
            throw new Error(`Payload validation failed: ${validation.errors.join(', ')}`);
          }
          console.log(`[useSuncorpQuote] ✓ Payload validation passed`);
          
          // Log key fields being sent
          console.log(`[useSuncorpQuote] Key fields:`, {
            registration: attempts[i].registrationNumber,
            vehicle: `${attempts[i].vehicleYear} ${attempts[i].vehicleMake} ${attempts[i].vehicleFamily}`,
            driver: `${attempts[i].primaryDriverFirstName} ${attempts[i].primaryDriverLastName}`,
            dob: attempts[i].primaryDriverDateOfBirth,
            gender: attempts[i].primaryDriverGender,
            address: `${attempts[i].riskAddressStreetNumber} ${attempts[i].riskAddressStreetName} ${attempts[i].riskAddressStreetType}, ${attempts[i].riskAddressSuburb} ${attempts[i].riskAddressState} ${attempts[i].riskAddressPostcode}`,
            policyStart: attempts[i].policyStartDate,
            carPurchaseField: attempts[i].carPurchaseIn13Months || 'omitted'
          });
          
          console.log(`[useSuncorpQuote] Invoking suncorp-proxy edge function...`);

          const { data, error } = await supabase.functions.invoke('suncorp-proxy', {
            body: {
              action: 'createQuote',
              quotePayload: attempts[i]
            }
          });

          if (error) {
            console.error(`[useSuncorpQuote] ❌ Edge function invocation error:`, error);
            throw error;
          }

          console.log(`[useSuncorpQuote] Edge function response:`, data);

          if (data.success && data.quoteNumber) {
            console.log(`[useSuncorpQuote] ✅ Quote generated successfully!`);
            console.log(`[useSuncorpQuote] Quote Number: ${data.quoteNumber}`);
            console.log(`[useSuncorpQuote] Base Premium: $${data.basePremium}`);
            console.log(`[useSuncorpQuote] Total Premium: $${data.totalPremium}`);
            
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
            console.error(`[useSuncorpQuote] ❌ Quote generation failed:`, data.error || 'Unknown error');
            throw new Error(data.error || 'Quote generation failed');
          }
        } catch (err: any) {
          console.error(`[useSuncorpQuote] ❌ Attempt ${i + 1} failed:`, err.message || err);
          lastError = err;
          
          // If not last attempt, continue to next
          if (i < attempts.length - 1) {
            console.log(`[useSuncorpQuote] 🔄 Retrying with different parameters...`);
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
