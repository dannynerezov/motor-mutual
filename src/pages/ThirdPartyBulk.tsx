import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, Play, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import business logic
import {
  convertDateFormat,
  convertGenderFormat,
  getStampDutyModalByState,
  getDefaultPolicyStartDate,
  validateBulkRecord,
  BATCH_CONFIG,
  VEHICLE_LOOKUP_ENTRY_DATE,
  isValidAustralianState,
  shouldRetryWithCarPurchaseFlag,
  extractErrorMessage,
} from '@/lib/thirdPartyBulkLogic';

// Import types
import type {
  BulkRecord,
  VehicleDetails,
  AddressData,
  QuoteData,
  AustralianState,
  BatchStatistics,
} from '@/types/thirdPartyBulk';

const ThirdPartyBulk = () => {
  // STATE MANAGEMENT
  const [bulkInput, setBulkInput] = useState('');
  const [records, setRecords] = useState<BulkRecord[]>([]);
  const [processing, setProcessing] = useState(false);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [batchId, setBatchId] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<BatchStatistics>({
    totalRecords: 0,
    processedRecords: 0,
    successfulRecords: 0,
    failedRecords: 0,
    averageProcessingTime: 0,
    estimatedTimeRemaining: 0,
  });
  const { toast } = useToast();

  // PARSE INPUT DATA
  const handleParseInput = () => {
    const lines = bulkInput.trim().split('\n');
    const parsed: BulkRecord[] = [];
    let errors = 0;
    
    lines.forEach((line, index) => {
      const [rego, address, dob, gender] = line.split('\t');
      
      // Extract state from address (regex pattern)
      const stateMatch = address?.match(/\b(NSW|VIC|QLD|WA|SA|TAS|ACT|NT)\b/i);
      const state = stateMatch ? stateMatch[0].toUpperCase() : '';
      
      // Validate
      const validation = validateBulkRecord({ 
        rego: rego || '', 
        state: state || '', 
        address: address || '', 
        dob: dob || '', 
        gender: gender || '' 
      });
      
      if (validation.isValid && isValidAustralianState(state)) {
        parsed.push({
          id: index + 1,
          rego: rego.trim(),
          state: state as AustralianState,
          address: address.trim(),
          dob: dob.trim(),
          gender: gender.trim(),
          status: 'pending'
        });
      } else {
        errors++;
        toast({
          title: 'Validation Error',
          description: `Row ${index + 1}: ${validation.error}`,
          variant: 'destructive'
        });
      }
    });
    
    if (parsed.length > BATCH_CONFIG.MAX_RECORDS) {
      toast({
        title: 'Too Many Records',
        description: `Maximum ${BATCH_CONFIG.MAX_RECORDS} records allowed. Found ${parsed.length}.`,
        variant: 'destructive'
      });
      return;
    }
    
    if (parsed.length === 0) {
      toast({
        title: 'No Valid Records',
        description: errors > 0 ? `${errors} records had validation errors` : 'Please enter valid data',
        variant: 'destructive'
      });
      return;
    }
    
    setRecords(parsed);
    setStatistics({
      totalRecords: parsed.length,
      processedRecords: 0,
      successfulRecords: 0,
      failedRecords: 0,
      averageProcessingTime: 0,
      estimatedTimeRemaining: 0,
    });
    
    toast({
      title: 'Success',
      description: `Parsed ${parsed.length} valid records${errors > 0 ? ` (${errors} errors)` : ''}`
    });
  };

  // START BATCH PROCESSING
  const handleStartProcessing = async () => {
    if (records.length === 0) {
      toast({
        title: 'No Records',
        description: 'Please parse input data first',
        variant: 'destructive'
      });
      return;
    }
    
    // Create batch record
    const { data: batch, error } = await supabase
      .from('bulk_quote_batches')
      .insert({
        total_records: records.length,
        processing_start_time: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      toast({
        title: 'Database Error',
        description: error.message,
        variant: 'destructive'
      });
      return;
    }
    
    setBatchId(batch.id);
    setProcessing(true);
    await processBatches(batch.id);
  };

  // PROCESS RECORDS IN BATCHES
  const processBatches = async (batchId: string) => {
    const totalBatches = Math.ceil(records.length / BATCH_CONFIG.BATCH_SIZE);
    
    for (let i = 0; i < totalBatches; i++) {
      if (!processing) break;
      
      const start = i * BATCH_CONFIG.BATCH_SIZE;
      const end = Math.min(start + BATCH_CONFIG.BATCH_SIZE, records.length);
      const batchRecords = records.slice(start, end);
      
      setCurrentBatchIndex(i + 1);
      
      // Process batch in parallel
      await Promise.all(
        batchRecords.map(record => processRecord(record, batchId))
      );
      
      // Delay between batches
      if (i < totalBatches - 1) {
        await new Promise(resolve => setTimeout(resolve, BATCH_CONFIG.BATCH_DELAY_MS));
      }
    }
    
    // Update batch completion
    const successCount = records.filter(r => r.status === 'success').length;
    const failCount = records.filter(r => r.status === 'error').length;
    
    await supabase
      .from('bulk_quote_batches')
      .update({
        processing_end_time: new Date().toISOString(),
        successful_records: successCount,
        failed_records: failCount
      })
      .eq('id', batchId);
    
    setProcessing(false);
    toast({
      title: 'Processing Complete',
      description: `Processed ${records.length} records (${successCount} successful, ${failCount} failed)`
    });
  };

  // PROCESS SINGLE RECORD
  const processRecord = async (record: BulkRecord, batchId: string) => {
    const startTime = Date.now();
    
    // Update status
    setRecords(prev => 
      prev.map(r => r.id === record.id ? { ...r, status: 'processing', processingStartTime: startTime } : r)
    );
    
    try {
      // STEP 1: Vehicle Lookup
      const vehicleData = await callVehicleLookup(record, batchId);
      
      // STEP 2: Address Validation
      const addressData = await callAddressValidation(record, batchId);
      
      // STEP 3: Generate Quote
      const quoteData = await callGenerateQuote(record, vehicleData, addressData, batchId);
      
      // STEP 4: Save to Database
      await saveQuoteToDatabase(record, vehicleData, addressData, quoteData);
      
      // Update success
      setRecords(prev =>
        prev.map(r => r.id === record.id ? {
          ...r,
          status: 'success',
          vehicleData,
          addressData,
          quoteData,
          processingEndTime: Date.now()
        } : r)
      );
      
      // Update statistics
      setStatistics(prev => ({
        ...prev,
        processedRecords: prev.processedRecords + 1,
        successfulRecords: prev.successfulRecords + 1,
        averageProcessingTime: (prev.averageProcessingTime * prev.processedRecords + (Date.now() - startTime)) / (prev.processedRecords + 1),
      }));
      
    } catch (error: any) {
      // Update error
      setRecords(prev =>
        prev.map(r => r.id === record.id ? {
          ...r,
          status: 'error',
          error: extractErrorMessage(error),
          processingEndTime: Date.now()
        } : r)
      );
      
      // Update statistics
      setStatistics(prev => ({
        ...prev,
        processedRecords: prev.processedRecords + 1,
        failedRecords: prev.failedRecords + 1,
      }));
      
      // Log error
      await supabase.from('bulk_quote_processing_logs').insert({
        batch_id: batchId,
        record_id: record.id,
        record_identifier: record.rego,
        action: 'record_complete',
        status: 'error',
        error_message: extractErrorMessage(error),
        execution_time_ms: Date.now() - startTime
      });
    }
  };

  // STEP 1: VEHICLE LOOKUP
  const callVehicleLookup = async (record: BulkRecord, batchId: string): Promise<VehicleDetails> => {
    const startTime = Date.now();
    
    const { data, error } = await supabase.functions.invoke('suncorp-proxy', {
      body: {
        action: 'vehicleLookup',
        registrationNumber: record.rego,
        state: record.state,
        entryDate: VEHICLE_LOOKUP_ENTRY_DATE
      }
    });
    
    const executionTime = Date.now() - startTime;
    
    // Log to database
    await supabase.from('bulk_quote_processing_logs').insert({
      batch_id: batchId,
      record_id: record.id,
      record_identifier: record.rego,
      timestamp: new Date().toISOString(),
      action: 'vehicle_lookup',
      status: error ? 'error' : 'success',
      api_endpoint: 'vehicleLookup',
      request_payload: { registrationNumber: record.rego, state: record.state },
      response_data: data,
      error_message: error?.message,
      execution_time_ms: executionTime
    });
    
    if (error || !data?.success) {
      throw new Error(`Vehicle lookup failed: ${error?.message || data?.error || 'Unknown error'}`);
    }
    
    if (!data?.data?.vehicleDetails) {
      throw new Error('No vehicle details returned from API');
    }
    
    return data.data.vehicleDetails;
  };

  // STEP 2: ADDRESS VALIDATION
  const callAddressValidation = async (record: BulkRecord, batchId: string): Promise<AddressData> => {
    const startTime = Date.now();
    
    // First, search for address
    const { data: searchData } = await supabase.functions.invoke('suncorp-proxy', {
      body: {
        action: 'addressSearch',
        query: record.address
      }
    });
    
    if (!searchData?.success || !searchData?.data?.data?.addresses?.[0]) {
      throw new Error('Address search failed - no addresses found');
    }
    
    const firstAddress = searchData.data.data.addresses[0];
    
    // Then validate (get LURN and coordinates)
    const { data: validateData, error } = await supabase.functions.invoke('suncorp-proxy', {
      body: {
        action: 'addressValidate',
        payload: {
          address: {
            country: 'AUS',
            suburb: firstAddress.suburb || '',
            postcode: firstAddress.postcode || '',
            state: record.state,
            addressInFreeForm: {
              addressLine1: firstAddress.singleLineAddress || record.address
            }
          },
          expectedQualityLevels: ['1', '2', '3', '4', '5', '6'],
          addressSuggestionRequirements: {
            required: true,
            forAddressQualityLevels: ['3', '4', '5'],
            howMany: '10'
          }
        }
      }
    });
    
    const executionTime = Date.now() - startTime;
    
    // Log
    await supabase.from('bulk_quote_processing_logs').insert({
      batch_id: batchId,
      record_id: record.id,
      record_identifier: record.rego,
      action: 'address_validate',
      status: error ? 'error' : 'success',
      request_payload: { address: record.address },
      response_data: validateData,
      error_message: error?.message,
      execution_time_ms: executionTime
    });
    
    if (error || !validateData?.success) {
      throw new Error(`Address validation failed: ${error?.message || validateData?.error || 'Unknown error'}`);
    }
    
    const matchedAddress = validateData.data.data.matchedAddress;
    
    if (matchedAddress.addressQualityLevel !== '1') {
      throw new Error(`Address quality insufficient: ${matchedAddress.addressQualityLevel} (need level 1)`);
    }
    
    return matchedAddress;
  };

  // STEP 3: GENERATE QUOTE
  const callGenerateQuote = async (
    record: BulkRecord,
    vehicleData: VehicleDetails,
    addressData: AddressData,
    batchId: string
  ): Promise<QuoteData> => {
    const startTime = Date.now();
    
    const payload = {
      quoteDetails: {
        policyStartDate: getDefaultPolicyStartDate(),
        acceptDutyOfDisclosure: true,
        currentInsurer: 'NONE',
        sumInsured: {
          marketValue: vehicleData.newCarPrice,
          agreedValue: 0,
          sumInsuredType: 'Market Value'
        },
        hasMultiplePolicies: true
      },
      vehicleDetails: {
        isRoadworthy: true,
        hasAccessoryAndModification: false,
        nvic: vehicleData.nvic,
        hasDamage: false,
        financed: false,
        usage: {
          primaryUsage: 'PERSONAL',
          businessType: '',
          extraQuestions: {},
          showStampDutyModal: getStampDutyModalByState(record.state)
        },
        kmPerYear: '5000_15000',
        vehicleInfo: {
          year: vehicleData.year,
          make: vehicleData.make,
          family: vehicleData.family,
          variant: vehicleData.variant
        },
        peakHourDriving: false,
        daysUsed: 'A',
        daytimeParked: {
          indicator: 'S'
        }
      },
      coverDetails: {
        coverType: 'THIRD_PARTY',
        hasWindscreenExcessWaiver: false,
        hasHireCarLimited: false,
        hasRoadAssist: false,
        hasFireAndTheft: false
      },
      riskAddress: {
        postcode: addressData.postcode,
        suburb: addressData.suburb,
        state: addressData.state,
        lurn: addressData.addressId,
        lurnScale: addressData.addressQualityLevel,
        geocodedNationalAddressFileData: addressData.geocodedNationalAddressFileData,
        pointLevelCoordinates: addressData.pointLevelCoordinates,
        spatialReferenceId: 4283,
        matchStatus: 'HAPPY',
        structuredStreetAddress: addressData.structuredStreetAddress
      },
      driverDetails: {
        mainDriver: {
          dateOfBirth: convertDateFormat(record.dob),
          gender: convertGenderFormat(record.gender),
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
    
    // First attempt
    let { data, error } = await supabase.functions.invoke('suncorp-proxy', {
      body: {
        action: 'generateQuote',
        payload
      }
    });
    
    // RETRY LOGIC: If error mentions carPurchaseIn13Months
    if ((error || !data?.success) && shouldRetryWithCarPurchaseFlag(extractErrorMessage(error || data))) {
      console.log(`[Retry] Adding carPurchaseIn13Months flag for ${record.rego}`);
      
      // @ts-ignore - Add carPurchaseIn13Months
      payload.vehicleDetails.carPurchaseIn13Months = false;
      
      const retry = await supabase.functions.invoke('suncorp-proxy', {
        body: {
          action: 'generateQuote',
          payload
        }
      });
      
      data = retry.data;
      error = retry.error;
      
      // Log retry attempt
      await supabase.from('bulk_quote_processing_logs').insert({
        batch_id: batchId,
        record_id: record.id,
        record_identifier: record.rego,
        action: 'quote_generation_retry',
        status: retry.error || !retry.data?.success ? 'error' : 'success',
        request_payload: payload,
        response_data: retry.data,
        error_message: retry.error?.message || retry.data?.error
      });
    }
    
    const executionTime = Date.now() - startTime;
    
    // Log final attempt
    await supabase.from('bulk_quote_processing_logs').insert({
      batch_id: batchId,
      record_id: record.id,
      record_identifier: record.rego,
      action: 'quote_generation',
      status: error || !data?.success ? 'error' : 'success',
      request_payload: payload,
      response_data: data,
      error_message: error?.message || data?.error,
      execution_time_ms: executionTime
    });
    
    if (error || !data?.success) {
      throw new Error(`Quote generation failed: ${error?.message || data?.error || 'Unknown error'}`);
    }
    
    return {
      quoteNumber: data.data.data.quoteNumber,
      quoteReference: data.data.data.quoteReference,
      pricing: {
        basePremium: parseFloat(data.data.data.pricing?.basePremium || '0'),
        stampDuty: parseFloat(data.data.data.pricing?.stampDuty || '0'),
        gst: parseFloat(data.data.data.pricing?.gst || '0'),
        totalPremium: parseFloat(data.data.data.pricing?.totalPremium || '0'),
      }
    };
  };

  // STEP 4: SAVE TO DATABASE
  const saveQuoteToDatabase = async (
    record: BulkRecord,
    vehicleData: VehicleDetails,
    addressData: AddressData,
    quoteData: QuoteData
  ) => {
    const { error } = await supabase.from('third_party_quotes').insert({
      registration_number: record.rego,
      registration_state: record.state,
      vehicle_nvic: vehicleData.nvic,
      vehicle_year: vehicleData.year,
      vehicle_make: vehicleData.make,
      vehicle_family: vehicleData.family,
      vehicle_variant: vehicleData.variant,
      vehicle_body_style: vehicleData.bodyStyle,
      vehicle_transmission: vehicleData.transmissionDescription,
      vehicle_drive_type: vehicleData.driveType,
      vehicle_engine_size: vehicleData.size,
      risk_address_postcode: addressData.postcode,
      risk_address_suburb: addressData.suburb,
      risk_address_state: addressData.state,
      risk_address_street_number: addressData.structuredStreetAddress.streetNumber1,
      risk_address_street_name: addressData.structuredStreetAddress.streetName,
      risk_address_street_type: addressData.structuredStreetAddress.streetType,
      risk_address_unit_number: addressData.structuredStreetAddress.unitNumber || null,
      risk_address_unit_type: addressData.structuredStreetAddress.unitType || null,
      risk_address_lurn: addressData.addressId,
      risk_address_latitude: addressData.pointLevelCoordinates?.longLatLatitude || null,
      risk_address_longitude: addressData.pointLevelCoordinates?.longLatLongitude || null,
      date_of_birth: convertDateFormat(record.dob),
      gender: convertGenderFormat(record.gender),
      policy_start_date: getDefaultPolicyStartDate(),
      primary_usage: 'PERSONAL',
      km_per_year: '5000_15000',
      current_insurer: 'NONE',
      sum_insured_type: 'Market Value',
      cover_type: 'THIRD_PARTY',
      market_value: vehicleData.newCarPrice,
      base_premium: quoteData.pricing.basePremium,
      stamp_duty: quoteData.pricing.stampDuty,
      gst: quoteData.pricing.gst,
      total_premium: quoteData.pricing.totalPremium,
      quote_number: quoteData.quoteNumber,
      quote_reference: quoteData.quoteReference
    });
    
    if (error) {
      throw new Error(`Database insert failed: ${error.message}`);
    }
  };

  // EXPORT TO EXCEL
  const handleExportToExcel = () => {
    const exportData = records.map(r => ({
      'Rego': r.rego,
      'State': r.state,
      'Address': r.address,
      'DOB': r.dob,
      'Gender': r.gender,
      'Status': r.status,
      'Vehicle Make': r.vehicleData?.make || '',
      'Vehicle Model': r.vehicleData?.family || '',
      'Vehicle Year': r.vehicleData?.year || '',
      'Base Premium': r.quoteData?.pricing?.basePremium || '',
      'Total Premium': r.quoteData?.pricing?.totalPremium || '',
      'Quote Number': r.quoteData?.quoteNumber || '',
      'Error': r.error || ''
    }));
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Quotes');
    XLSX.writeFile(wb, `third-party-bulk-quotes-${Date.now()}.xlsx`);
    
    toast({
      title: 'Export Complete',
      description: 'Excel file downloaded successfully'
    });
  };

  // Calculate progress percentage
  const progressPercentage = statistics.totalRecords > 0 
    ? (statistics.processedRecords / statistics.totalRecords) * 100 
    : 0;

  // RENDER
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Third-Party Bulk Quote Generator</h1>
          <p className="text-muted-foreground">Process multiple insurance quotes in batch from tab-separated data</p>
        </div>
        
        {/* Input Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Bulk Input (Tab-Separated Format)</CardTitle>
            <CardDescription>
              Format: rego[TAB]address[TAB]dob[TAB]gender (e.g., ABC123[TAB]123 Main St, Brisbane QLD 4000[TAB]15/03/1985[TAB]Male)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="ABC123	123 Main Street, Brisbane QLD 4000	15/03/1985	Male"
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
            <Button onClick={handleParseInput} disabled={processing}>
              <Upload className="w-4 h-4 mr-2" />
              Parse & Preview Records
            </Button>
          </CardContent>
        </Card>
        
        {/* Records Table */}
        {records.length > 0 && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Records ({records.length})</CardTitle>
                    <CardDescription>
                      {statistics.successfulRecords} successful, {statistics.failedRecords} failed
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleStartProcessing} disabled={processing}>
                      {processing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Processing
                        </>
                      )}
                    </Button>
                    <Button onClick={handleExportToExcel} variant="outline" disabled={records.filter(r => r.status === 'success').length === 0}>
                      <Download className="w-4 h-4 mr-2" />
                      Export to Excel
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {records.map(record => (
                    <div key={record.id} className="flex items-center justify-between border rounded-lg p-3 hover:bg-accent/5 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <Badge variant="outline" className="font-mono">{record.rego}</Badge>
                        <span className="text-sm text-muted-foreground truncate max-w-md">{record.address}</span>
                        <Badge variant="secondary" className="text-xs">{record.state}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {record.status === 'pending' && <Badge variant="outline">Pending</Badge>}
                        {record.status === 'processing' && (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                            <span className="text-sm text-blue-600">Processing...</span>
                          </div>
                        )}
                        {record.status === 'success' && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-green-600 font-medium">${record.quoteData?.pricing?.totalPremium.toFixed(2)}</span>
                          </div>
                        )}
                        {record.status === 'error' && (
                          <div className="flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span className="text-xs text-red-600 max-w-xs truncate" title={record.error}>{record.error}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Processing Progress */}
            {processing && (
              <Card>
                <CardHeader>
                  <CardTitle>Processing Progress</CardTitle>
                  <CardDescription>
                    Batch {currentBatchIndex} of {Math.ceil(records.length / BATCH_CONFIG.BATCH_SIZE)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold">{statistics.processedRecords}</p>
                      <p className="text-xs text-muted-foreground">Processed</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{statistics.successfulRecords}</p>
                      <p className="text-xs text-muted-foreground">Successful</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">{statistics.failedRecords}</p>
                      <p className="text-xs text-muted-foreground">Failed</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{progressPercentage.toFixed(0)}%</p>
                      <p className="text-xs text-muted-foreground">Complete</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Info Alert */}
            {!processing && records.length > 0 && statistics.processedRecords === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Ready to process {records.length} records. Click "Start Processing" to begin batch quote generation.
                  Processing occurs in batches of {BATCH_CONFIG.BATCH_SIZE} with 1-second delays between batches.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ThirdPartyBulk;
