import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  shouldIncludeCarPurchaseField, 
  convertDateFormat, 
  convertGenderFormat,
  getStampDutyModalByState,
  mapUnitTypeToCode,
  type AustralianState
} from '@/lib/thirdPartyBulkLogic';

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

interface VehicleLookupResult {
  nvic: string;
  year: string;
  make: string;
  family: string;
  variant: string;
  newCarPrice: number;
}

interface AddressValidationResult {
  addressId: string;
  postcode: string;
  suburb: string;
  state: string;
  addressQualityLevel: string;
  geocodedNationalAddressFileData: any;
  pointLevelCoordinates: any;
  structuredStreetAddress: any;
}

export const useSuncorpQuote = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Step 1: Lookup vehicle details via Suncorp API
   */
  const lookupVehicle = async (
    registrationNumber: string,
    state: string
  ): Promise<VehicleLookupResult> => {
    console.log(`[Vehicle Lookup] Starting lookup for ${registrationNumber} (${state})`);
    
    const { data, error } = await supabase.functions.invoke('suncorp-proxy', {
      body: {
        action: 'vehicleLookup',
        registrationNumber,
        state
      }
    });

    if (error) {
      console.error('[Vehicle Lookup] Error:', error);
      throw new Error(`Vehicle lookup failed: ${error.message}`);
    }

    if (!data?.success || !data?.vehicle) {
      console.error('[Vehicle Lookup] Failed:', data);
      throw new Error(data?.error || 'Vehicle lookup failed');
    }

    const vehicle = data.vehicle;
    console.log(`[Vehicle Lookup] Success:`, {
      nvic: vehicle.nvic,
      year: vehicle.year,
      make: vehicle.make,
      family: vehicle.family,
      newCarPrice: vehicle.newCarPrice
    });

    return {
      nvic: vehicle.nvic,
      year: vehicle.year,
      make: vehicle.make,
      family: vehicle.family,
      variant: vehicle.variant || '',
      newCarPrice: parseFloat(vehicle.newCarPrice || '0')
    };
  };

  /**
   * Step 2: Validate address via Suncorp API
   */
  const validateAddress = async (
    addressLine: string,
    state: string
  ): Promise<AddressValidationResult> => {
    console.log(`[Address Validation] Starting validation for: ${addressLine}`);

    // Step 2a: Address search (use same shape as bulk flow)
    const { data: searchData, error: searchError } = await supabase.functions.invoke('suncorp-proxy', {
      body: {
        action: 'addressSearch',
        query: addressLine,
      }
    });

    if (searchError || !searchData?.success) {
      console.error('[Address Search] Error:', searchError || searchData);
      throw new Error('Address search failed');
    }

    const suggestions = searchData?.data?.data || [];
    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      console.error('[Address Search] No suggestions returned');
      throw new Error('No address suggestions found');
    }

    const suggestion = suggestions[0];
    const broken = suggestion.addressInBrokenDownForm || {};

    // Build addressLine1 including unit if present
    let addressLine1: string;
    if (broken.unitNumber) {
      addressLine1 = `${broken.unitNumber}/${broken.streetNumber} ${broken.streetName} ${broken.streetType}`.trim();
    } else {
      addressLine1 = `${broken.streetNumber} ${broken.streetName} ${broken.streetType}`.trim();
    }

    console.log('[Address Search] Using suggestion:', {
      addressLine1,
      suburb: suggestion.suburb,
      state: suggestion.state,
      postcode: suggestion.postcode,
    });

    // Step 2b: Address validate (structured address payload)
    const { data: validateData, error: validateError } = await supabase.functions.invoke('suncorp-proxy', {
      body: {
        action: 'addressValidate',
        address: {
          country: 'AUS',
          suburb: suggestion.suburb,
          postcode: suggestion.postcode,
          state: suggestion.state,
          addressInFreeForm: {
            addressLine1,
          },
        },
      },
    });

    if (validateError || !validateData?.success) {
      console.error('[Address Validate] Error:', validateError || validateData);
      throw new Error('Address validation failed');
    }

    const matched = validateData?.data?.matchedAddress;
    if (!matched) {
      console.error('[Address Validate] No matchedAddress in response', validateData);
      throw new Error('No matched address in validation response');
    }

    console.log('[Address Validation] Success:', {
      suburb: matched.suburb,
      postcode: matched.postcode,
      quality: matched.addressQualityLevel,
      lurn: `${matched.addressId?.substring(0, 30)}...`,
    });

    return {
      addressId: matched.addressId,
      postcode: matched.postcode,
      suburb: matched.suburb,
      state: matched.state,
      addressQualityLevel: matched.addressQualityLevel,
      geocodedNationalAddressFileData: matched.geocodedNationalAddressFileData,
      pointLevelCoordinates: matched.pointLevelCoordinates,
      structuredStreetAddress: matched.addressInBrokenDownForm,
    };
  };

  /**
   * Main quote generation function following bulk page pattern
   */
  const generateQuote = async (
    vehicle: VehicleData,
    driver: DriverData,
    policyStartDate: string
  ): Promise<SuncorpQuoteResult> => {
    setIsGenerating(true);

    try {
      console.log('[Quote Generation] ========================================');
      console.log('[Quote Generation] Starting quote generation process');
      
      // Step 1: Vehicle lookup (if NVIC not available)
      let vehicleDetails: VehicleLookupResult;
      if (vehicle.vehicle_nvic) {
        console.log('[Quote Generation] Using existing vehicle data (NVIC available)');
        vehicleDetails = {
          nvic: vehicle.vehicle_nvic,
          year: vehicle.vehicle_year.toString(),
          make: vehicle.vehicle_make,
          family: vehicle.vehicle_model,
          variant: '',
          newCarPrice: 0 // Will use market value if needed
        };
      } else {
        console.log('[Quote Generation] Performing vehicle lookup...');
        vehicleDetails = await lookupVehicle(
          vehicle.registration_number,
          driver.address_state
        );
      }

      // Step 2: Address validation
      console.log('[Quote Generation] Validating address...');
      const addressData = await validateAddress(
        driver.address_line1,
        driver.address_state
      );

      // Step 3: Build quote payload
      console.log('[Quote Generation] Building quote payload...');
      
      const dob = convertDateFormat(driver.date_of_birth);
      const gender = convertGenderFormat(driver.gender);
      const showStampDutyModal = getStampDutyModalByState(driver.address_state as AustralianState);
      const includeCarPurchase = shouldIncludeCarPurchaseField(vehicleDetails.year);

      console.log('[Quote Generation] Converted values:', {
        dob,
        gender,
        showStampDutyModal,
        includeCarPurchase
      });

      // Build vehicle details with conditional carPurchaseIn13Months
      const vehiclePayload: any = {
        isRoadworthy: true,
        hasAccessoryAndModification: false,
        nvic: vehicleDetails.nvic,
        highPerformance: null,
        hasDamage: false,
        financed: false,
        usage: {
          primaryUsage: 'RIDE_SHARE',
          businessType: '',
          extraQuestions: {},
          showStampDutyModal
        },
        kmPerYear: '05',
        vehicleInfo: {
          year: vehicleDetails.year,
          make: vehicleDetails.make,
          family: vehicleDetails.family,
          variant: vehicleDetails.variant
        },
        peakHourDriving: false,
        daysUsed: 'A',
        daytimeParked: {
          indicator: 'S',
          suburb: null,
          postcode: null
        }
      };

      // Conditionally add carPurchaseIn13Months for 2024-2025 vehicles
      if (includeCarPurchase) {
        vehiclePayload.carPurchaseIn13Months = false;
        console.log('[Quote Generation] Including carPurchaseIn13Months: false (2024-2025 vehicle)');
      } else {
        console.log('[Quote Generation] Omitting carPurchaseIn13Months (2023 or older vehicle)');
      }

      // Build full quote payload
      const quotePayload = {
        quoteDetails: {
          policyStartDate,
          acceptDutyOfDisclosure: true,
          currentInsurer: 'TGSH',
          sumInsured: {
            marketValue: vehicleDetails.newCarPrice,
            agreedValue: 0,
            sumInsuredType: 'Agreed Value'
          },
          campaignCode: '',
          hasFamilyPolicy: false,
          hasMultiplePolicies: true
        },
        vehicleDetails: vehiclePayload,
        coverDetails: {
          coverType: 'THIRD_PARTY',
          hasWindscreenExcessWaiver: false,
          hasHireCarLimited: false,
          hasRoadAssist: false,
          hasFireAndTheft: false,
          standardExcess: null,
          voluntaryExcess: null
        },
        riskAddress: {
          postcode: addressData.postcode,
          suburb: addressData.suburb.toUpperCase(),
          state: addressData.state,
          lurn: addressData.addressId,
          lurnScale: String(addressData.addressQualityLevel),
          geocodedNationalAddressFileData: addressData.geocodedNationalAddressFileData || {},
          pointLevelCoordinates: addressData.pointLevelCoordinates || {},
          spatialReferenceId: 4283,
          matchStatus: 'HAPPY',
          structuredStreetAddress: {
            unitNumber: addressData.structuredStreetAddress?.unitNumber || driver.address_unit_number || undefined,
            unitCode: (addressData.structuredStreetAddress?.unitNumber || driver.address_unit_number)
              ? mapUnitTypeToCode(addressData.structuredStreetAddress?.unitType || driver.address_unit_type) || 'U'
              : undefined,
            streetName: addressData.structuredStreetAddress?.streetName || driver.address_street_name || '',
            streetNumber1: addressData.structuredStreetAddress?.streetNumber1 || 
                          addressData.structuredStreetAddress?.streetNumber || 
                          driver.address_street_number || '',
            streetTypeCode: addressData.structuredStreetAddress?.streetType || 
                           (addressData.structuredStreetAddress as any)?.streetTypeCode || 
                           driver.address_street_type || ''
          }
        },
        driverDetails: {
          mainDriver: {
            dateOfBirth: dob,
            gender,
            hasClaimOccurrences: false,
            claimOccurrences: []
          },
          additionalDrivers: []
        },
        policyHolderDetails: {
          hasRejectedInsuranceOrClaims: false,
          hasCriminalHistory: false
        }
      };

      console.log('[Quote Generation] Quote payload built:', {
        vehicle: `${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.family}`,
        nvic: vehicleDetails.nvic,
        driver: `${driver.first_name} ${driver.last_name}`,
        address: `${addressData.suburb}, ${addressData.state} ${addressData.postcode}`,
        lurnLast15: addressData.addressId?.substring(addressData.addressId.length - 15)
      });

      // Step 4: Send quote request with smart retry
      console.log('[Quote Generation] Sending quote request (attempt 1)...');
      
      let { data, error } = await supabase.functions.invoke('suncorp-proxy', {
        body: {
          action: 'createQuote',
          quotePayload
        }
      });

      // Smart bidirectional retry logic for 2024-2025 vehicles
      if ((error || !data?.success) && includeCarPurchase) {
        const errorMsg = error?.message || data?.error || JSON.stringify(error || data);
        console.log('[Quote Generation] First attempt failed, trying retry strategies...');
        console.log('[Quote Generation] Error:', errorMsg);

        // Retry 1: Try with carPurchaseIn13Months = true
        console.log('[Quote Generation] Retry 1: Setting carPurchaseIn13Months = true');
        const retryPayload1 = {
          ...quotePayload,
          vehicleDetails: {
            ...quotePayload.vehicleDetails,
            carPurchaseIn13Months: true
          }
        };

        const retry1 = await supabase.functions.invoke('suncorp-proxy', {
          body: {
            action: 'createQuote',
            quotePayload: retryPayload1
          }
        });

        if (retry1.data?.success) {
          data = retry1.data;
          error = null;
          console.log('[Quote Generation] ✅ Retry 1 succeeded with carPurchaseIn13Months = true');
        } else {
          // Retry 2: Try without carPurchaseIn13Months field
          console.log('[Quote Generation] Retry 2: Omitting carPurchaseIn13Months field');
          const { carPurchaseIn13Months, ...vehicleDetailsWithoutField } = quotePayload.vehicleDetails;
          const retryPayload2 = {
            ...quotePayload,
            vehicleDetails: vehicleDetailsWithoutField
          };

          const retry2 = await supabase.functions.invoke('suncorp-proxy', {
            body: {
              action: 'createQuote',
              quotePayload: retryPayload2
            }
          });

          if (retry2.data?.success) {
            data = retry2.data;
            error = null;
            console.log('[Quote Generation] ✅ Retry 2 succeeded without carPurchaseIn13Months');
          } else {
            error = retry2.error;
            data = retry2.data;
          }
        }
      }

      // Step 5: Handle response
      if (error) {
        console.error('[Quote Generation] ❌ Edge function error:', error);
        throw new Error(error.message || 'Quote generation failed');
      }

      if (!data?.success) {
        console.error('[Quote Generation] ❌ Quote failed:', data?.error);
        throw new Error(data?.error || 'Quote generation failed');
      }

      console.log('[Quote Generation] ✅ Quote generated successfully!');
      console.log('[Quote Generation] Quote Number:', data.quoteNumber);
      console.log('[Quote Generation] Base Premium: $', data.basePremium);
      console.log('[Quote Generation] Total Premium: $', data.totalPremium);

      return {
        success: true,
        quoteNumber: data.quoteNumber,
        basePremium: parseFloat(data.basePremium || '0'),
        stampDuty: parseFloat(data.stampDuty || '0'),
        gst: parseFloat(data.gst || '0'),
        totalPremium: parseFloat(data.totalPremium || '0'),
        requestPayload: quotePayload,
        responseData: data,
      };

    } catch (error: any) {
      console.error('[Quote Generation] ❌ Fatal error:', error);
      
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
