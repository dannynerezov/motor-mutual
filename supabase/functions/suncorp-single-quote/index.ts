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

    console.log('[SingleQuote] Received vehicle data:', {
      nvic: vehicle.vehicle_nvic,
      variant: vehicle.vehicle_variant,
      value: vehicle.vehicle_value,
      make: vehicle.vehicle_make,
      model: vehicle.vehicle_model,
      year: vehicle.vehicle_year,
    });

    console.log('[SingleQuote] Starting quote generation for:', {
      registration: vehicle.registration_number,
      vehicle: `${vehicle.vehicle_year} ${vehicle.vehicle_make} ${vehicle.vehicle_model}`,
      driver: `${driver.first_name} ${driver.last_name}`,
      suburb: driver.address_suburb,
      state: driver.address_state,
    });

    // 📥 LOG INCOMING PAYLOAD
    console.log('[SingleQuote] 📥 INCOMING PAYLOAD:', JSON.stringify({
      vehicle: {
        registration: vehicle.registration_number,
        make: vehicle.vehicle_make,
        model: vehicle.vehicle_model,
        year: vehicle.vehicle_year,
        nvic_present: !!vehicle.vehicle_nvic,
        nvic_value: vehicle.vehicle_nvic || 'MISSING'
      },
      driver: {
        first_name: driver.first_name,
        last_name: driver.last_name,
        dob: driver.date_of_birth,
        gender: driver.gender,
        address_line1: driver.address_line1 || '❌ MISSING',
        address_suburb: driver.address_suburb || '❌ MISSING',
        address_state: driver.address_state || '❌ MISSING',
        address_postcode: driver.address_postcode || '❌ MISSING',
        address_lurn: driver.address_lurn ? driver.address_lurn.substring(0, 20) + '...' : '❌ MISSING',
        address_lurn_length: driver.address_lurn?.length || 0,
        address_latitude: driver.address_latitude || '❌ MISSING',
        address_longitude: driver.address_longitude || '❌ MISSING',
      },
      policyStartDate
    }, null, 2));

    // Step 1: Vehicle lookup if NVIC missing
    let nvic = vehicle.vehicle_nvic;
    let vehicleYear = vehicle.vehicle_year.toString();
    let vehicleMake = vehicle.vehicle_make;
    let vehicleFamily = vehicle.vehicle_model;
    let vehicleVariant = vehicle.vehicle_variant || '';  // ✅ Use variant from frontend if available

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

    // Step 2: Smart Address Validation - Only skip if BOTH lurn AND complete GNAF data present
    let validatedAddress: any;
    
    const hasCompleteGnafData = driver.address_gnaf_data && 
                                Object.keys(driver.address_gnaf_data).length > 5 &&
                                driver.address_gnaf_data.gnafSrid;
    
    if (driver.address_lurn && hasCompleteGnafData) {
      // Frontend already validated the address with complete GNAF data
      console.log('[SingleQuote] ✅ Using pre-validated address from frontend with complete GNAF data');
      console.log('[SingleQuote] GNAF data keys:', Object.keys(driver.address_gnaf_data).length);
      console.log('[SingleQuote] Has absStatisticalAreas:', !!driver.address_gnaf_data.absStatisticalAreas);
      if (driver.address_gnaf_data.absStatisticalAreas) {
        console.log('[SingleQuote] GNAF SA keys:', Object.keys(driver.address_gnaf_data.absStatisticalAreas));
      }
      console.log(`[SingleQuote] LURN: ${driver.address_lurn.substring(0, 30)}...`);
      console.log(`[SingleQuote] Coordinates from frontend: lat=${driver.address_latitude}, lng=${driver.address_longitude}`);
      
      validatedAddress = {
        lurn: driver.address_lurn,
        suburb: driver.address_suburb,
        postcode: driver.address_postcode,
        state: driver.address_state,
        latitude: driver.address_latitude,
        longitude: driver.address_longitude,
        geocodedNationalAddressFileData: driver.address_gnaf_data,
        structuredStreetAddress: {
          streetNumber1: driver.address_street_number,
          streetName: driver.address_street_name,
          streetTypeCode: driver.address_street_type,
          unitNumber: driver.address_unit_number,
          unitTypeCode: driver.address_unit_type
        }
      };
      
      console.log('[SingleQuote] Validated address object:', {
        hasLatitude: !!validatedAddress.latitude,
        hasLongitude: !!validatedAddress.longitude,
        latitude: validatedAddress.latitude,
        longitude: validatedAddress.longitude
      });
    } else {
      // Incomplete GNAF data or no LURN - perform full validation
      console.log('[SingleQuote] ⚠️ Incomplete GNAF data from frontend, performing full validation');
      console.log('[SingleQuote] Has LURN:', !!driver.address_lurn);
      console.log('[SingleQuote] Has complete GNAF data:', hasCompleteGnafData);
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
              address: {
                country: 'AUS',
                suburb: suggestion.suburb,
                postcode: suggestion.postcode,
                state: suggestion.state,
                addressInFreeForm: { addressLine1 },
              },
              expectedQualityLevels: ['1', '2', '3', '4', '5', '6'],
              addressSuggestionRequirements: {
                required: true,
                forAddressQualityLevels: ['3', '4', '5'],
                howMany: '10'
              }
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
              address: {
                country: 'AUS',
                suburb: suggestion.suburb,
                postcode: suggestion.postcode,
                state: suggestion.state,
                addressInFreeForm: { addressLine1 },
              }
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

    const gnafData = matched.geocodedNationalAddressFileData || {};
    console.log('[SingleQuote] GNAF data keys from validation:', Object.keys(gnafData).length);
    console.log('[SingleQuote] GNAF has absStatisticalAreas:', !!gnafData.absStatisticalAreas);

    // Extract coordinates with priority: UI point-level > validation > street locality > suburb
    const extractedLatitude =
      driver?.address_latitude ??
      matched?.pointLevelCoordinates?.latitude ??
      matched?.latitude ??
      gnafData?.gnafStreetLocalityLatitude ??
      gnafData?.gnafSuburbLatitude ??
      null;

    const extractedLongitude =
      driver?.address_longitude ??
      matched?.pointLevelCoordinates?.longitude ??
      matched?.longitude ??
      gnafData?.gnafStreetLocalityLongitude ??
      gnafData?.gnafSuburbLongitude ??
      null;

    console.log('[SingleQuote] Extracted coordinates from validation:', {
      latitude: extractedLatitude,
      longitude: extractedLongitude,
      source: driver?.address_latitude ? 'driver.address (UI point-level)' :
              matched?.pointLevelCoordinates?.latitude ? 'matched.pointLevelCoordinates' : 
              matched?.latitude ? 'matched.latitude' :
              gnafData?.gnafStreetLocalityLatitude ? 'gnafData.streetLocality' :
              gnafData?.gnafSuburbLatitude ? 'gnafData.suburb' : 'none'
    });

    validatedAddress = {
      lurn: matched.addressId,
      suburb: matched.addressInBrokenDownForm?.suburb || driver.address_suburb,
      postcode: matched.addressInBrokenDownForm?.postcode || driver.address_postcode,
      state: matched.addressInBrokenDownForm?.state || driver.address_state,
      latitude: extractedLatitude,
      longitude: extractedLongitude,
      geocodedNationalAddressFileData: gnafData,
      structuredStreetAddress: {
        streetNumber1: matched.addressInBrokenDownForm?.streetNumber,
        streetName: matched.addressInBrokenDownForm?.streetName,
        streetTypeCode: matched.addressInBrokenDownForm?.streetType,
        unitNumber: matched.addressInBrokenDownForm?.unitNumber,
        unitTypeCode: matched.addressInBrokenDownForm?.unitType
      }
    };
  }

  // Log final validated address before building payload
  console.log('[SingleQuote] Final validated address before payload construction:', {
    hasLatitude: !!validatedAddress.latitude,
    hasLongitude: !!validatedAddress.longitude,
    latitude: validatedAddress.latitude,
    longitude: validatedAddress.longitude,
    lurn: validatedAddress.lurn?.substring(0, 30) + '...',
    suburb: validatedAddress.suburb,
    postcode: validatedAddress.postcode,
    state: validatedAddress.state
  });

  // Compute final effective coordinates with priority: UI point-level > validation > street locality > suburb
  const effectiveLat =
    driver?.address_latitude ??
    validatedAddress?.latitude ??
    validatedAddress?.geocodedNationalAddressFileData?.gnafStreetLocalityLatitude ??
    validatedAddress?.geocodedNationalAddressFileData?.gnafSuburbLatitude ??
    null;

  const effectiveLng =
    driver?.address_longitude ??
    validatedAddress?.longitude ??
    validatedAddress?.geocodedNationalAddressFileData?.gnafStreetLocalityLongitude ??
    validatedAddress?.geocodedNationalAddressFileData?.gnafSuburbLongitude ??
    null;

  console.log('[SingleQuote] Using pointLevelCoordinates:', {
    longLatLatitude: effectiveLat,
    longLatLongitude: effectiveLng,
    included: !!(effectiveLat && effectiveLng),
  });

    // Step 3: Build quote payload
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
        primaryUsage: 'S',  // ✅ FIXED: Use code 'S' for rideshare
        businessType: '',
        extraQuestions: {},
        showStampDutyModal: false,  // ✅ FIXED: Always false for THIRD_PARTY quotes
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

    // Get market value from vehicle data (passed from frontend or from lookup)
    const marketValue = vehicle.vehicle_value || 0;

    const quotePayload = {
      quoteDetails: {
        policyStartDate,
        acceptDutyOfDisclosure: true,
        currentInsurer: 'TGSH',
        sumInsured: {
          marketValue: marketValue,  // ✅ FIXED: Use actual vehicle market value
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
        postcode: validatedAddress.postcode,
        suburb: validatedAddress.suburb.toUpperCase(),
        state: validatedAddress.state,
        lurn: validatedAddress.lurn,
        lurnScale: '1',  // ✅ FIXED: Always use '1' as per working payload
        geocodedNationalAddressFileData: validatedAddress.geocodedNationalAddressFileData || {},
        pointLevelCoordinates: (() => {
          const latStr = (effectiveLat !== undefined && effectiveLat !== null && effectiveLat !== '') ? String(effectiveLat) : undefined;
          const lngStr = (effectiveLng !== undefined && effectiveLng !== null && effectiveLng !== '') ? String(effectiveLng) : undefined;
          return (latStr && lngStr) ? { longLatLatitude: latStr, longLatLongitude: lngStr } : undefined;
        })(),
        spatialReferenceId: 4283,
        matchStatus: 'HAPPY',
        structuredStreetAddress: {
          unitNumber: validatedAddress.structuredStreetAddress?.unitNumber || driver.address_unit_number || undefined,
          unitCode: (validatedAddress.structuredStreetAddress?.unitNumber || driver.address_unit_number)
            ? mapUnitType(validatedAddress.structuredStreetAddress?.unitTypeCode || driver.address_unit_type)
            : undefined,
          streetName: validatedAddress.structuredStreetAddress?.streetName || driver.address_street_name || '',
          streetNumber1: validatedAddress.structuredStreetAddress?.streetNumber1 || 
                        driver.address_street_number || '',
          streetTypeCode: validatedAddress.structuredStreetAddress?.streetTypeCode || 
                         driver.address_street_type || '',
        },
      },
      driverDetails: {
        mainDriver: {
          dateOfBirth: driver.date_of_birth,
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

    // 📤 LOG COMPLETE SUNCORP PAYLOAD
    console.log('[SingleQuote] 📤 SUNCORP API PAYLOAD:', JSON.stringify({
      quoteDetails: {
        policyStartDate: quotePayload.quoteDetails.policyStartDate,
        currentInsurer: quotePayload.quoteDetails.currentInsurer,
        sumInsuredType: quotePayload.quoteDetails.sumInsured.sumInsuredType,
        hasFamilyPolicy: quotePayload.quoteDetails.hasFamilyPolicy,
        hasMultiplePolicies: quotePayload.quoteDetails.hasMultiplePolicies
      },
      vehicleDetails: {
        nvic: quotePayload.vehicleDetails.nvic,
        primaryUsage: quotePayload.vehicleDetails.usage.primaryUsage,
        kmPerYear: quotePayload.vehicleDetails.kmPerYear,
        year: quotePayload.vehicleDetails.vehicleInfo.year,
        make: quotePayload.vehicleDetails.vehicleInfo.make,
        family: quotePayload.vehicleDetails.vehicleInfo.family
      },
      coverDetails: {
        coverType: quotePayload.coverDetails.coverType
      },
      riskAddress: {
        lurn: quotePayload.riskAddress.lurn.substring(0, 30) + '...',
        lurn_length: quotePayload.riskAddress.lurn.length,
        suburb: quotePayload.riskAddress.suburb,
        postcode: quotePayload.riskAddress.postcode,
        state: quotePayload.riskAddress.state,
        streetName: quotePayload.riskAddress.structuredStreetAddress.streetName,
        streetNumber: quotePayload.riskAddress.structuredStreetAddress.streetNumber1,
        streetType: quotePayload.riskAddress.structuredStreetAddress.streetTypeCode
      },
      driverDetails: {
        mainDriver: {
          dateOfBirth: quotePayload.driverDetails.mainDriver.dateOfBirth,
          gender: quotePayload.driverDetails.mainDriver.gender
        }
      },
      payloadSize: (JSON.stringify(quotePayload).length / 1024).toFixed(2) + ' KB'
    }, null, 2));

    // 🔍 LOG COMPLETE PAYLOAD FOR EXACT JSON COMPARISON
    console.log('[SingleQuote] 🔍 COMPLETE SUNCORP PAYLOAD (Full JSON):',
      JSON.stringify(quotePayload, null, 2));

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

    // 🚀 LOG API CALL
    console.log('[SingleQuote] 🚀 CALLING SUNCORP API:', {
      endpoint: '/pi-motor-quote-api/api/v1/insurance/motor/brands/sun/quotes',
      method: 'POST',
      baseUrl: SUNCORP_BASE_URL,
      nvic: quotePayload.vehicleDetails.nvic,
      lurn: quotePayload.riskAddress.lurn.substring(0, 30) + '...',
      policyStartDate: quotePayload.quoteDetails.policyStartDate
    });

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

    // ✅ FIXED: Safe response parsing to avoid "Unexpected end of JSON input"
    let quoteData;
    let rawResponseText = '';
    try {
      rawResponseText = await quoteResponse.text();
      quoteData = JSON.parse(rawResponseText);
    } catch (parseError) {
      console.error('[SingleQuote] Failed to parse Suncorp response:', {
        error: parseError,
        status: quoteResponse.status,
        statusText: quoteResponse.statusText,
        rawBody: rawResponseText.substring(0, 1000),
        headers: Object.fromEntries(quoteResponse.headers.entries())
      });
      
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to parse Suncorp API response',
          details: {
            parseError: parseError instanceof Error ? parseError.message : String(parseError),
            status: quoteResponse.status,
            statusText: quoteResponse.statusText,
            rawBody: rawResponseText.substring(0, 500),
            correlationId: quoteResponse.headers.get('x-correlationid') || null
          },
          requestPayload: quotePayload,
          responseData: null,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // 📩 LOG API RESPONSE
    console.log('[SingleQuote] 📩 SUNCORP API RESPONSE:', {
      status: quoteResponse.status,
      statusText: quoteResponse.statusText,
      success: quoteResponse.ok,
      quoteNumber: quoteData?.quoteNumber || 'N/A',
      responseSize: (JSON.stringify(quoteData).length / 1024).toFixed(2) + ' KB',
      hasErrors: !!quoteData?.errorKey,
      errorKey: quoteData?.errorKey || 'None'
    });

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
        sentPayload: quotePayload, // Include complete sent payload
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
