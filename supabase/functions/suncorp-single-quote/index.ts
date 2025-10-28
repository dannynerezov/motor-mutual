import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUNCORP_BASE_URL = 'https://api.suncorp.com.au';
const VEHICLE_AUTH_TOKEN = Deno.env.get('SUNCORP_VEHICLE_AUTH_TOKEN');
const API_TOKEN = Deno.env.get('SUNCORP_API_TOKEN');

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { vehicle, driver, policyStartDate } = body;

    console.log('[SingleQuote] Starting quote generation for:', {
      registration: vehicle.registration_number,
      vehicle: `${vehicle.vehicle_year} ${vehicle.vehicle_make} ${vehicle.vehicle_model}`,
      driver: `${driver.first_name} ${driver.last_name}`,
      suburb: driver.address_suburb,
      state: driver.address_state,
    });

    // Step 1: Vehicle lookup if NVIC missing
    let nvic = vehicle.vehicle_nvic;
    let vehicleYear = vehicle.vehicle_year.toString();
    let vehicleMake = vehicle.vehicle_make;
    let vehicleFamily = vehicle.vehicle_model;
    let vehicleVariant = '';

    if (!nvic) {
      console.log('[SingleQuote] Looking up vehicle by registration...');
      const vehicleLookupResponse = await fetch(
        `${SUNCORP_BASE_URL}/vehicle/vehicle/vehicledetails`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${VEHICLE_AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            registrationNumber: vehicle.registration_number,
            state: driver.address_state,
          }),
        }
      );

      if (!vehicleLookupResponse.ok) {
        throw new Error(`Vehicle lookup failed: ${vehicleLookupResponse.status}`);
      }

      const vehicleData = await vehicleLookupResponse.json();
      nvic = vehicleData.nvic;
      vehicleYear = vehicleData.year;
      vehicleMake = vehicleData.make;
      vehicleFamily = vehicleData.family;
      vehicleVariant = vehicleData.variant || '';

      console.log('[SingleQuote] Vehicle lookup success:', { nvic, vehicleYear, vehicleMake, vehicleFamily });
    }

    // Validate required address fields before continuing
    const requiredAddressFields = {
      address_line1: driver.address_line1,
      address_suburb: driver.address_suburb,
      address_state: driver.address_state,
      address_postcode: driver.address_postcode,
      address_lurn: driver.address_lurn
    };

    const missingFields = Object.entries(requiredAddressFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      console.error('[SingleQuote] Missing required address fields:', {
        missing: missingFields,
        received: requiredAddressFields
      });
      
      return new Response(
        JSON.stringify({
          success: false,
          error: `Missing required address fields: ${missingFields.join(', ')}`,
          details: {
            missingFields,
            receivedAddressData: requiredAddressFields
          }
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('[SingleQuote] Address validation passed - all fields present');

    // Step 2: Address search + validate
    console.log('[SingleQuote] Searching address...');
    console.log('[SingleQuote] Address input:', {
      line1: driver.address_line1,
      suburb: driver.address_suburb,
      state: driver.address_state,
      postcode: driver.address_postcode,
    });
    
    const addressSearchResponse = await fetch(
      `${SUNCORP_BASE_URL}/address-search-service/address/suggestions/v1?isRiskAddress=true&q=${encodeURIComponent(driver.address_line1)}`,
      {
        headers: {
          'x-api-key': API_TOKEN || '',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!addressSearchResponse.ok) {
      throw new Error(`Address search failed: ${addressSearchResponse.status}`);
    }

    const searchData = await addressSearchResponse.json();
    const suggestions = searchData?.data || [];
    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      throw new Error('No address suggestions found');
    }

    const suggestion = suggestions[0];
    const broken = suggestion.addressInBrokenDownForm || {};

    let addressLine1: string;
    if (broken.unitNumber || driver.address_unit_number) {
      const unit = broken.unitNumber || driver.address_unit_number;
      addressLine1 = `${unit}/${broken.streetNumber || driver.address_street_number} ${broken.streetName || driver.address_street_name} ${broken.streetType || driver.address_street_type}`.trim();
    } else {
      addressLine1 = `${broken.streetNumber || driver.address_street_number} ${broken.streetName || driver.address_street_name} ${broken.streetType || driver.address_street_type}`.trim();
    }

    console.log('[SingleQuote] Validating address:', addressLine1);
    
    let validateData;
    try {
      const addressValidateResponse = await fetch(
        `${SUNCORP_BASE_URL}/address-search-service/address/find/v3`,
        {
          method: 'POST',
          headers: {
            'x-api-key': API_TOKEN || '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            country: 'AUS',
            suburb: suggestion.suburb,
            postcode: suggestion.postcode,
            state: suggestion.state,
            addressInFreeForm: { addressLine1 },
          }),
        }
      );

      if (!addressValidateResponse.ok) {
        const errorBody = await addressValidateResponse.text();
        console.error('[SingleQuote] Address validation failed:', {
          status: addressValidateResponse.status,
          statusText: addressValidateResponse.statusText,
          body: errorBody,
          requestBody: {
            country: 'AUS',
            suburb: suggestion.suburb,
            postcode: suggestion.postcode,
            state: suggestion.state,
            addressInFreeForm: { addressLine1 },
          },
        });
        throw new Error(`Address validation failed: ${addressValidateResponse.status}`);
      }

      validateData = await addressValidateResponse.json();
    } catch (error) {
      console.error('[SingleQuote] Address validation exception:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Address validation failed: ${errorMessage}`);
    }

    const matched = validateData?.matchedAddress;
    if (!matched) {
      throw new Error('No matched address in validation response');
    }

    console.log('[SingleQuote] Address validated:', {
      lurn: matched.addressId?.substring(0, 30) + '...',
      quality: matched.addressQualityLevel,
    });

    // Step 3: Build quote payload
    const convertDateFormat = (dateString: string): string => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const convertGender = (gender: string): string => {
      return gender.toLowerCase() === 'male' ? 'M' : 'F';
    };

    const mapUnitType = (type?: string): string => {
      if (!type) return 'U';
      const mapping: Record<string, string> = {
        'apartment': 'APT',
        'unit': 'U',
        'flat': 'F',
        'suite': 'SE',
        'level': 'L',
      };
      return mapping[type.toLowerCase()] || 'U';
    };

    const getStampDutyModal = (state: string): boolean => {
      return ['NSW', 'VIC', 'QLD', 'WA', 'SA'].includes(state);
    };

    const shouldIncludeCarPurchase = (year: string): boolean => {
      const yearNum = parseInt(year);
      return yearNum >= 2024 && yearNum <= 2025;
    };

    const dob = convertDateFormat(driver.date_of_birth);
    const gender = convertGender(driver.gender);
    const showStampDutyModal = getStampDutyModal(driver.address_state);
    const includeCarPurchase = shouldIncludeCarPurchase(vehicleYear);

    const vehiclePayload: any = {
      isRoadworthy: true,
      hasAccessoryAndModification: false,
      nvic,
      highPerformance: null,
      hasDamage: false,
      financed: false,
      usage: {
        primaryUsage: 'RIDE_SHARE',
        businessType: '',
        extraQuestions: {},
        showStampDutyModal,
      },
      kmPerYear: '05',
      vehicleInfo: {
        year: vehicleYear,
        make: vehicleMake,
        family: vehicleFamily,
        variant: vehicleVariant,
      },
      peakHourDriving: false,
      daysUsed: 'A',
      daytimeParked: {
        indicator: 'S',
        suburb: null,
        postcode: null,
      },
    };

    if (includeCarPurchase) {
      vehiclePayload.carPurchaseIn13Months = false;
    }

    const quotePayload = {
      quoteDetails: {
        policyStartDate,
        acceptDutyOfDisclosure: true,
        currentInsurer: 'TGSH',
        sumInsured: {
          marketValue: 0,
          agreedValue: 0,
          sumInsuredType: 'Agreed Value',
        },
        campaignCode: '',
        hasFamilyPolicy: false,
        hasMultiplePolicies: true,
      },
      vehicleDetails: vehiclePayload,
      coverDetails: {
        coverType: 'THIRD_PARTY',
        hasWindscreenExcessWaiver: false,
        hasHireCarLimited: false,
        hasRoadAssist: false,
        hasFireAndTheft: false,
        standardExcess: null,
        voluntaryExcess: null,
      },
      riskAddress: {
        postcode: matched.postcode,
        suburb: matched.suburb.toUpperCase(),
        state: matched.state,
        lurn: matched.addressId,
        lurnScale: String(matched.addressQualityLevel),
        geocodedNationalAddressFileData: matched.geocodedNationalAddressFileData || {},
        pointLevelCoordinates: matched.pointLevelCoordinates || {},
        spatialReferenceId: 4283,
        matchStatus: 'HAPPY',
        structuredStreetAddress: {
          unitNumber: matched.addressInBrokenDownForm?.unitNumber || driver.address_unit_number || undefined,
          unitCode: (matched.addressInBrokenDownForm?.unitNumber || driver.address_unit_number)
            ? mapUnitType(matched.addressInBrokenDownForm?.unitType || driver.address_unit_type)
            : undefined,
          streetName: matched.addressInBrokenDownForm?.streetName || driver.address_street_name || '',
          streetNumber1: matched.addressInBrokenDownForm?.streetNumber1 || 
                        matched.addressInBrokenDownForm?.streetNumber || 
                        driver.address_street_number || '',
          streetTypeCode: matched.addressInBrokenDownForm?.streetType || 
                         driver.address_street_type || '',
        },
      },
      driverDetails: {
        mainDriver: {
          dateOfBirth: dob,
          gender,
          hasClaimOccurrences: false,
          claimOccurrences: [],
        },
        additionalDrivers: [],
      },
      policyHolderDetails: {
        hasRejectedInsuranceOrClaims: false,
        hasCriminalHistory: false,
      },
    };

    console.log('[SingleQuote] Payload built, size:', JSON.stringify(quotePayload).length);

    // Step 4: Create quote with smart retry
    const createQuote = async (payload: any): Promise<Response> => {
      return await fetch(
        `${SUNCORP_BASE_URL}/pi-motor-quote-api/api/v1/insurance/motor/brands/sun/quotes`,
        {
          method: 'POST',
          headers: {
            'x-api-key': API_TOKEN || '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );
    };

    console.log('[SingleQuote] Attempt 1: Sending quote request...');
    let quoteResponse = await createQuote(quotePayload);

    // Smart retry for 2024-2025 vehicles
    if (!quoteResponse.ok && includeCarPurchase) {
      console.log('[SingleQuote] Attempt 1 failed, retrying with carPurchaseIn13Months = true');
      const retryPayload1 = {
        ...quotePayload,
        vehicleDetails: {
          ...quotePayload.vehicleDetails,
          carPurchaseIn13Months: true,
        },
      };
      quoteResponse = await createQuote(retryPayload1);

      if (!quoteResponse.ok) {
        console.log('[SingleQuote] Attempt 2 failed, retrying without carPurchaseIn13Months');
        const { carPurchaseIn13Months, ...vehicleWithoutField } = quotePayload.vehicleDetails;
        const retryPayload2 = {
          ...quotePayload,
          vehicleDetails: vehicleWithoutField,
        };
        quoteResponse = await createQuote(retryPayload2);
      }
    }

    const quoteData = await quoteResponse.json();

    if (!quoteResponse.ok) {
      console.error('[SingleQuote] Quote creation failed:', quoteResponse.status, quoteData);
      return new Response(
        JSON.stringify({
          success: false,
          error: quoteData?.errorKey || `Quote creation failed: ${quoteResponse.status}`,
          requestPayload: quotePayload,
          responseData: quoteData,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('[SingleQuote] Success! Quote:', quoteData.quoteNumber);

    return new Response(
      JSON.stringify({
        success: true,
        quoteNumber: quoteData.quoteNumber,
        basePremium: quoteData.basePremium,
        stampDuty: quoteData.stampDuty,
        gst: quoteData.gst,
        totalPremium: quoteData.totalPremium,
        requestPayload: quotePayload,
        responseData: quoteData,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('[SingleQuote] Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error',
        requestPayload: null,
        responseData: null,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
