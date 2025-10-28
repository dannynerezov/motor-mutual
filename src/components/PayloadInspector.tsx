import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { getDefaultPolicyStartDate } from "@/lib/thirdPartyBulkLogic";

interface PayloadInspectorProps {
  vehicle: {
    registration_number: string;
    vehicle_make: string;
    vehicle_model: string;
    vehicle_year: number;
    vehicle_nvic: string | null;
    vehicle_variant?: string;
  };
  driver: {
    first_name: string;
    last_name: string;
    gender: string;
    date_of_birth: string;
    address_line1?: string;
    address_unit_type?: string;
    address_unit_number?: string;
    address_street_number?: string;
    address_street_name?: string;
    address_street_type?: string;
    address_suburb?: string;
    address_state?: string;
    address_postcode?: string;
    address_lurn?: string;
    address_latitude?: string;
    address_longitude?: string;
    address_gnaf_data?: any;
  };
  policyStartDate?: string;
  actualSentPayload?: any; // The actual payload sent to Suncorp
}

export const PayloadInspector = ({ vehicle, driver, policyStartDate, actualSentPayload }: PayloadInspectorProps) => {
  const defaultPolicyDate = policyStartDate || getDefaultPolicyStartDate();

  // Stage 1: Frontend Input Payload
  const frontendPayload = {
    vehicle: {
      registration_number: vehicle.registration_number,
      vehicle_make: vehicle.vehicle_make,
      vehicle_model: vehicle.vehicle_model,
      vehicle_year: vehicle.vehicle_year,
      vehicle_nvic: vehicle.vehicle_nvic,
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
    },
    policyStartDate: defaultPolicyDate,
  };

  // Stage 2: Simulated Edge Function Transform (Complete Suncorp Payload)
  // ✅ No conversion needed - Suncorp expects YYYY-MM-DD format

  const convertGender = (gender: string): string => {
    return gender?.toLowerCase() === 'male' ? 'M' : 'F';
  };

  const suncorpPayload = {
    quoteDetails: {
      policyStartDate: defaultPolicyDate,
      acceptDutyOfDisclosure: true,
      currentInsurer: "TGSH",
      sumInsured: {
        marketValue: 0,
        agreedValue: 0,
        sumInsuredType: "Agreed Value",
      },
      campaignCode: "",
      hasFamilyPolicy: false,
      hasMultiplePolicies: true,
    },
    vehicleDetails: {
      isRoadworthy: true,
      hasAccessoryAndModification: false,
      nvic: vehicle.vehicle_nvic || "MISSING",
      highPerformance: null,
      hasDamage: false,
      financed: false,
      usage: {
        primaryUsage: "RIDE_SHARE",
        businessType: "",
        extraQuestions: {},
        showStampDutyModal: ['NSW', 'VIC', 'QLD', 'WA', 'SA'].includes(driver.address_state || ''),
      },
      kmPerYear: "05",
      vehicleInfo: {
        year: vehicle.vehicle_year.toString(),
        make: vehicle.vehicle_make,
        family: vehicle.vehicle_model,
        variant: "",
      },
      peakHourDriving: false,
      daysUsed: "A",
      daytimeParked: {
        indicator: "S",
        suburb: null,
        postcode: null,
      },
    },
    coverDetails: {
      coverType: "THIRD_PARTY",
      hasWindscreenExcessWaiver: false,
      hasHireCarLimited: false,
      hasRoadAssist: false,
      hasFireAndTheft: false,
      standardExcess: null,
      voluntaryExcess: null,
    },
    riskAddress: {
      postcode: driver.address_postcode || "MISSING",
      suburb: driver.address_suburb?.toUpperCase() || "MISSING",
      state: driver.address_state || "MISSING",
      lurn: driver.address_lurn || "MISSING",
      lurnScale: "1",
      geocodedNationalAddressFileData: {},
      pointLevelCoordinates: {
        longLatLatitude: driver.address_latitude || "MISSING",
        longLatLongitude: driver.address_longitude || "MISSING",
      },
      spatialReferenceId: 4283,
      matchStatus: "HAPPY",
      structuredStreetAddress: {
        streetName: driver.address_street_name || "MISSING",
        streetNumber1: driver.address_street_number || "MISSING",
        streetTypeCode: driver.address_street_type || "MISSING",
      },
    },
    driverDetails: {
      mainDriver: {
        dateOfBirth: driver.date_of_birth || "MISSING",  // ✅ Keep ISO format YYYY-MM-DD
        gender: driver.gender ? convertGender(driver.gender) : "MISSING",
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

  // GNAF data analysis
  const gnafData = driver.address_gnaf_data || {};
  const gnafKeysCount = Object.keys(gnafData).length;
  const hasAbsStats = !!gnafData.absStatisticalAreas;
  const gnafComplete = gnafKeysCount > 5 && hasAbsStats;

  // Validation checks
  const validationChecks = [
    { field: 'Vehicle NVIC', path: 'vehicleDetails.nvic', value: vehicle.vehicle_nvic, required: true },
    { field: 'Vehicle Variant', path: 'vehicleDetails.vehicleInfo.variant', value: vehicle.vehicle_variant, required: false },
    { field: 'Policy Start Date', path: 'quoteDetails.policyStartDate', value: defaultPolicyDate, required: true },
    { field: 'Driver First Name', path: 'driver.first_name', value: driver.first_name, required: true },
    { field: 'Driver Last Name', path: 'driver.last_name', value: driver.last_name, required: true },
    { field: 'Driver DOB (ISO)', path: 'driverDetails.mainDriver.dateOfBirth', value: driver.date_of_birth, required: true },
    { field: 'Driver Gender', path: 'driverDetails.mainDriver.gender', value: driver.gender, required: true },
    { field: 'Address Line 1', path: 'driver.address_line1', value: driver.address_line1, required: true },
    { field: 'Suburb', path: 'riskAddress.suburb', value: driver.address_suburb, required: true },
    { field: 'State', path: 'riskAddress.state', value: driver.address_state, required: true },
    { field: 'Postcode', path: 'riskAddress.postcode', value: driver.address_postcode, required: true },
    { field: 'LURN (Address ID)', path: 'riskAddress.lurn', value: driver.address_lurn, required: true, critical: true },
    { field: 'GNAF Data Complete', path: 'riskAddress.geocodedNationalAddressFileData', value: gnafComplete ? 'YES' : null, required: true, critical: true },
    { field: 'Latitude', path: 'riskAddress.pointLevelCoordinates.longLatLatitude', value: driver.address_latitude, required: false },
    { field: 'Longitude', path: 'riskAddress.pointLevelCoordinates.longLatLongitude', value: driver.address_longitude, required: false },
    { field: 'Street Name', path: 'riskAddress.structuredStreetAddress.streetName', value: driver.address_street_name, required: true },
    { field: 'Street Number', path: 'riskAddress.structuredStreetAddress.streetNumber1', value: driver.address_street_number, required: true },
    { field: 'Street Type', path: 'riskAddress.structuredStreetAddress.streetTypeCode', value: driver.address_street_type, required: true },
  ];

  const missingRequired = validationChecks.filter(check => check.required && !check.value);
  const missingOptional = validationChecks.filter(check => !check.required && !check.value);
  const isComplete = missingRequired.length === 0;
  const hasCriticalMissing = validationChecks.some(check => check.critical && !check.value);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : hasCriticalMissing ? (
            <XCircle className="w-5 h-5 text-destructive" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-500" />
          )}
          3-Stage Payload Inspector
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Validation Summary */}
        <div className="p-4 border rounded-lg bg-muted/50">
          <h3 className="font-semibold mb-2">Validation Status</h3>
          <div className="grid gap-2">
            {missingRequired.length > 0 && (
              <div className="flex items-start gap-2 text-sm text-destructive">
                <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Missing Required Fields ({missingRequired.length}):</strong>
                  <div className="ml-4 mt-1">
                    {missingRequired.map(check => (
                      <div key={check.field} className="flex items-center gap-1">
                        <span>•</span>
                        <span className={check.critical ? 'font-bold text-destructive' : ''}>
                          {check.field} {check.critical && '(CRITICAL)'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {missingOptional.length > 0 && (
              <div className="flex items-start gap-2 text-sm text-yellow-600">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Missing Optional Fields ({missingOptional.length}):</strong>
                  <div className="ml-4 mt-1">
                    {missingOptional.map(check => (
                      <div key={check.field}>• {check.field}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {isComplete && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>All required fields present! Ready to submit.</span>
              </div>
            )}
          </div>
        </div>

        {/* Field Checklist */}
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-3">Field Checklist</h3>
          <div className="grid gap-1.5 text-sm">
            {validationChecks.map(check => (
              <div key={check.field} className="flex items-center gap-2">
                {check.value ? (
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                )}
                <span className={!check.value && check.required ? 'text-destructive font-medium' : ''}>
                  {check.field}
                </span>
                {check.critical && !check.value && (
                  <Badge variant="destructive" className="text-xs">CRITICAL</Badge>
                )}
                {!check.required && (
                  <Badge variant="outline" className="text-xs">Optional</Badge>
                )}
                {check.value && (
                  <span className="text-muted-foreground ml-auto truncate max-w-[200px]">
                    {String(check.value).substring(0, 50)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payload Tabs */}
        <Tabs defaultValue={actualSentPayload ? "actual" : "frontend"} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="frontend">
              Stage 1: Frontend
            </TabsTrigger>
            <TabsTrigger value="suncorp">
              Stage 2: Suncorp API
            </TabsTrigger>
            <TabsTrigger value="diff">
              Transformations
            </TabsTrigger>
            <TabsTrigger value="actual" className="text-blue-600">
              ✅ Actual Sent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="frontend" className="space-y-2">
            <div className="text-sm text-muted-foreground mb-2">
              This is the payload sent from the frontend to the edge function:
              <br />
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                supabase.functions.invoke('suncorp-single-quote', ...)
              </code>
            </div>
            <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-[400px] border">
              {JSON.stringify(frontendPayload, null, 2)}
            </pre>
          </TabsContent>

          <TabsContent value="suncorp" className="space-y-2">
            <div className="text-sm text-muted-foreground mb-2">
              This is the complete payload sent to Suncorp's quote API:
              <br />
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                POST /pi-motor-quote-api/api/v1/insurance/motor/brands/sun/quotes
              </code>
            </div>
            <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-[400px] border">
              {JSON.stringify(suncorpPayload, null, 2)}
            </pre>
          </TabsContent>

          <TabsContent value="diff" className="space-y-2">
            <div className="text-sm text-muted-foreground mb-2">
              Key transformations performed by the edge function:
            </div>
            <div className="space-y-2 text-sm">
              <div className="p-3 border rounded bg-muted/50">
                <strong>Date Format (ISO):</strong>
                <div className="ml-4 mt-1 font-mono text-xs">
                  <div>Input: {driver.date_of_birth || 'MISSING'}</div>
                  <div>Output: {driver.date_of_birth || 'MISSING'} (No conversion - already ISO)</div>
                </div>
              </div>
              <div className="p-3 border rounded bg-muted/50">
                <strong>GNAF Data:</strong>
                <div className="ml-4 mt-1 font-mono text-xs">
                  <div>Keys: {gnafKeysCount}</div>
                  <div>Has absStatisticalAreas: {hasAbsStats ? '✓' : '✗'}</div>
                  <div>Complete: {gnafComplete ? '✓ YES' : '✗ MISSING'}</div>
                </div>
              </div>
              <div className="p-3 border rounded bg-muted/50">
                <strong>Vehicle Variant:</strong>
                <div className="ml-4 mt-1 font-mono text-xs">
                  <div>Value: {vehicle.vehicle_variant || 'NOT PROVIDED'}</div>
                </div>
              </div>
              <div className="p-3 border rounded bg-muted/50">
                <strong>Gender Conversion:</strong>
                <div className="ml-4 mt-1 font-mono text-xs">
                  <div>Input: {driver.gender || 'MISSING'}</div>
                  <div>Output: {driver.gender ? convertGender(driver.gender) : 'MISSING'}</div>
                </div>
              </div>
              <div className="p-3 border rounded bg-muted/50">
                <strong>Address Structure:</strong>
                <div className="ml-4 mt-1 font-mono text-xs">
                  <div>Flat fields → Nested riskAddress object</div>
                  <div>LURN: {driver.address_lurn?.substring(0, 30) || 'MISSING'}...</div>
                </div>
              </div>
              <div className="p-3 border rounded bg-muted/50">
                <strong>Fixed Values:</strong>
                <div className="ml-4 mt-1 font-mono text-xs">
                  <div>coverType: "THIRD_PARTY"</div>
                  <div>primaryUsage: "RIDE_SHARE"</div>
                  <div>kmPerYear: "05"</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="actual" className="space-y-2">
            {actualSentPayload ? (
              <>
                <div className="text-sm text-muted-foreground mb-2 space-y-1">
                  <div className="text-green-600 font-semibold">✅ Actual Payload Sent to Suncorp API</div>
                  <div>This is the exact JSON that was sent to Suncorp. Copy this for comparison with working payloads.</div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(actualSentPayload, null, 2));
                    alert("Payload copied to clipboard!");
                  }}
                  className="mb-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
                >
                  📋 Copy to Clipboard
                </button>
                <pre className="text-xs bg-gray-900 text-blue-400 p-4 rounded-lg overflow-auto max-h-[500px] border">
                  {JSON.stringify(actualSentPayload, null, 2)}
                </pre>
              </>
            ) : (
              <div className="p-4 border border-yellow-500 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Not yet sent. Click "Recalculate Quote" to generate and send the payload to Suncorp.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
