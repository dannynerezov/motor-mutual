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
  getStandardExcessByState,
  shouldIncludeCarPurchaseField,
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
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'untested' | 'success' | 'failed'>('untested');
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [batchId, setBatchId] = useState<string | null>(null);
  const [processingLogs, setProcessingLogs] = useState<string[]>([]);
  const [statistics, setStatistics] = useState<BatchStatistics>({
    totalRecords: 0,
    processedRecords: 0,
    successfulRecords: 0,
    failedRecords: 0,
    averageProcessingTime: 0,
    estimatedTimeRemaining: 0,
  });
  const { toast } = useToast();

  // Helper to add logs both to console and UI
  const addLog = (message: string, data?: any) => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage, data || '');
    setProcessingLogs(prev => [...prev, logMessage + (data ? ` ${JSON.stringify(data)}` : '')]);
  };

  // PARSE INPUT DATA
  const handleParseInput = () => {
    const lines = bulkInput.trim().split('\n').filter(line => line.trim().length > 0);
    const parsed: BulkRecord[] = [];
    let errors = 0;
    const errorMessages: string[] = [];
    
    lines.forEach((line, index) => {
      const rowNumber = index + 1;
      
      // Check if line contains tabs
      if (!line.includes('\t')) {
        errors++;
        errorMessages.push(`Row ${rowNumber}: Missing tab separators. Expected format: rego[TAB]address[TAB]dob[TAB]gender`);
        return;
      }
      
      const parts = line.split('\t');
      
      // Check if we have all 4 fields
      if (parts.length < 4) {
        errors++;
        errorMessages.push(`Row ${rowNumber}: Missing fields. Found ${parts.length} fields, need 4: rego, address, dob, gender`);
        return;
      }
      
      const [rego, address, dob, gender] = parts;
      
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
          id: rowNumber,
          rego: rego.trim(),
          state: state as AustralianState,
          address: address.trim(),
          dob: dob.trim(),
          gender: gender.trim(),
          status: 'pending'
        });
      } else {
        errors++;
        errorMessages.push(`Row ${rowNumber}: ${validation.error || 'Invalid state in address'}`);
      }
    });
    
    // Show all error messages
    if (errorMessages.length > 0) {
      errorMessages.slice(0, 5).forEach(msg => {
        toast({
          title: 'Validation Error',
          description: msg,
          variant: 'destructive'
        });
      });
      
      if (errorMessages.length > 5) {
        toast({
          title: 'Additional Errors',
          description: `${errorMessages.length - 5} more validation errors found`,
          variant: 'destructive'
        });
      }
    }
    
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
        description: errors > 0 
          ? `All ${errors} records had validation errors. Check format: rego[TAB]address[TAB]dd/mm/yyyy[TAB]gender` 
          : 'Please enter valid data in tab-separated format',
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

  // TEST EDGE FUNCTION CONNECTION
  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      console.log('[Test Connection] Pinging suncorp-proxy edge function...');
      
      const { data, error } = await supabase.functions.invoke('suncorp-proxy', {
        body: { action: 'ping' }
      });

      console.log('[Test Connection] Response:', { data, error });

      if (error) {
        console.error('[Test Connection] Edge function error:', error);
        setConnectionStatus('failed');
        toast({
          title: "Connection Failed",
          description: `Edge function error: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      if (!data?.success) {
        console.error('[Test Connection] Ping failed:', data);
        setConnectionStatus('failed');
        toast({
          title: "Connection Failed",
          description: data?.error || "Ping response unsuccessful",
          variant: "destructive",
        });
        return;
      }

      console.log('[Test Connection] Success - Edge function is accessible');
      setConnectionStatus('success');
      toast({
        title: "Connection Successful",
        description: "Edge function is accessible and ready",
      });
    } catch (error: any) {
      console.error('[Test Connection] Fatal error:', error);
      setConnectionStatus('failed');
      toast({
        title: "Connection Failed",
        description: `Fatal error: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
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

    // Check connection first
    if (connectionStatus !== 'success') {
      toast({
        title: "Test Connection First",
        description: "Please test the edge function connection before processing",
        variant: "destructive",
      });
      return;
    }
    
    // Clear previous logs
    setProcessingLogs([]);
    addLog('═══════════════════════════════════════════');
    addLog('🚀 BATCH PROCESSING STARTED');
    addLog(`📊 Total records to process: ${records.length}`);
    addLog('═══════════════════════════════════════════');
    
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
      addLog(`❌ Failed to create batch record: ${error.message}`);
      toast({
        title: 'Database Error',
        description: error.message,
        variant: 'destructive'
      });
      return;
    }
    
    addLog(`✅ Batch created with ID: ${batch.id}`);
    setBatchId(batch.id);
    setProcessing(true);
    await processBatches(batch.id);
  };

  // PROCESS RECORDS IN BATCHES
  const processBatches = async (batchId: string) => {
    const totalBatches = Math.ceil(records.length / BATCH_CONFIG.BATCH_SIZE);
    addLog(`📦 Processing ${totalBatches} batch${totalBatches > 1 ? 'es' : ''}`);
    
    for (let i = 0; i < totalBatches; i++) {
      const start = i * BATCH_CONFIG.BATCH_SIZE;
      const end = Math.min(start + BATCH_CONFIG.BATCH_SIZE, records.length);
      const batchRecords = records.slice(start, end);
      
      setCurrentBatchIndex(i + 1);
      addLog(`\n📦 Batch ${i + 1}/${totalBatches}: Processing ${batchRecords.length} records`);
      
      // Process batch in parallel
      await Promise.all(
        batchRecords.map(record => processRecord(record, batchId))
      );
      
      addLog(`✅ Batch ${i + 1}/${totalBatches} complete`);
      
      // Delay between batches
      if (i < totalBatches - 1) {
        addLog(`⏱️ Waiting ${BATCH_CONFIG.BATCH_DELAY_MS}ms before next batch...`);
        await new Promise(resolve => setTimeout(resolve, BATCH_CONFIG.BATCH_DELAY_MS));
      }
    }
    
    // Update batch completion
    const successCount = records.filter(r => r.status === 'success').length;
    const failCount = records.filter(r => r.status === 'error').length;
    
    addLog(`\n═══════════════════════════════════════════`);
    addLog(`🏁 BATCH PROCESSING COMPLETE`);
    addLog(`✅ Successful: ${successCount}`);
    addLog(`❌ Failed: ${failCount}`);
    addLog(`📊 Total: ${records.length}`);
    addLog(`═══════════════════════════════════════════`);
    
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
    
    addLog(`🚀 Starting processing for ${record.rego}`);
    
    // Update status
    setRecords(prev => 
      prev.map(r => r.id === record.id ? { ...r, status: 'processing', processingStartTime: startTime } : r)
    );
    
    try {
      // STEP 1: Vehicle Lookup
      addLog(`📋 Step 1/4: Vehicle Lookup for ${record.rego}`);
      const vehicleData = await callVehicleLookup(record, batchId);
      addLog(`✅ Vehicle found: ${vehicleData.year} ${vehicleData.make} ${vehicleData.family}`);
      
      // STEP 2: Address Validation
      addLog(`📍 Step 2/4: Address Validation for ${record.rego}`);
      const addressData = await callAddressValidation(record, batchId);
      addLog(`✅ Address validated: ${addressData.suburb}, ${addressData.state} (Quality: ${addressData.addressQualityLevel})`);
      
      // STEP 3: Generate Quote
      addLog(`💰 Step 3/4: Quote Generation for ${record.rego}`);
      const quoteData = await callGenerateQuote(record, vehicleData, addressData, batchId);
      addLog(`✅ Quote generated: ${quoteData.quoteNumber} - $${quoteData.pricing.totalPremium.toFixed(2)}`);
      
      // STEP 4: Save to Database
      addLog(`💾 Step 4/4: Saving to database for ${record.rego}`);
      await saveQuoteToDatabase(record, vehicleData, addressData, quoteData);
      addLog(`✅ Quote saved successfully for ${record.rego}`);
      
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
      
      const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
      addLog(`🎉 Completed ${record.rego} in ${totalTime}s`);
      
    } catch (error: any) {
      addLog(`❌ ERROR processing ${record.rego}: ${extractErrorMessage(error)}`);
      console.error(`[ERROR] ${record.rego}:`, error);
      
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
    
    try {
      addLog(`  → Calling Suncorp vehicle API: ${record.rego}, ${record.state}`);
      
      const { data, error } = await supabase.functions.invoke('suncorp-proxy', {
        body: {
          action: 'vehicleLookup',
          registrationNumber: record.rego,
          state: record.state
        }
      });
      
      const executionTime = Date.now() - startTime;
      addLog(`  ← Vehicle API response (${executionTime}ms): ${data?.success ? 'Success' : 'Failed'}`);

      if (error) {
        const errorMsg = `Edge function error: ${error.message}`;
        addLog(`  ❌ Vehicle lookup edge function error: ${errorMsg}`);
        await supabase.from('bulk_quote_processing_logs').insert({
          batch_id: batchId,
          record_id: record.id,
          record_identifier: record.rego,
          action: 'vehicle_lookup',
          status: 'error',
          api_endpoint: 'vehicleLookup',
          request_payload: { registrationNumber: record.rego, state: record.state },
          error_message: errorMsg,
          execution_time_ms: executionTime
        });
        throw new Error(errorMsg);
      }

      if (!data?.success) {
        const errorMsg = data?.error || 'Vehicle lookup failed';
        addLog(`  ❌ Vehicle API returned error: ${errorMsg}`);
        console.error('[Vehicle API Error Details]', data);
        await supabase.from('bulk_quote_processing_logs').insert({
          batch_id: batchId,
          record_id: record.id,
          record_identifier: record.rego,
          action: 'vehicle_lookup',
          status: 'error',
          api_endpoint: 'vehicleLookup',
          request_payload: { registrationNumber: record.rego, state: record.state },
          response_data: data,
          error_message: errorMsg,
          execution_time_ms: executionTime
        });
        throw new Error(errorMsg);
      }
      
      const vehicle = data.data.vehicleDetails;
      const valueInfo = data.data.vehicleValueInfo;
      
      if (!vehicle) {
        addLog(`  ❌ No vehicle details in response`);
        throw new Error('No vehicle details in response');
      }
      
      // Log success
      await supabase.from('bulk_quote_processing_logs').insert({
        batch_id: batchId,
        record_id: record.id,
        record_identifier: record.rego,
        action: 'vehicle_lookup',
        status: 'success',
        api_endpoint: 'vehicleLookup',
        request_payload: { registrationNumber: record.rego, state: record.state },
        response_data: data,
        execution_time_ms: executionTime
      });
      
      return {
        nvic: vehicle.nvic,
        year: vehicle.year?.toString() || '',
        make: vehicle.make,
        family: vehicle.family,
        variant: vehicle.variant,
        bodyStyle: vehicle.bodyStyle || '',
        transmissionDescription: vehicle.transmissionDescription || '',
        driveType: vehicle.driveType || '',
        size: vehicle.size || '',
        newCarPrice: valueInfo?.marketValue || valueInfo?.retailPrice || 0
      };
    } catch (error: any) {
      console.error('[Vehicle Lookup Full Error]', error);
      throw error;
    }
  };

  // STEP 2: ADDRESS VALIDATION
  const callAddressValidation = async (record: BulkRecord, batchId: string): Promise<AddressData> => {
    const startTime = Date.now();
    
    try {
      addLog(`  → Calling address search API: "${record.address}"`);
      
      // Step 1: Search for address suggestions
      const { data: searchData, error: searchError } = await supabase.functions.invoke('suncorp-proxy', {
        body: {
          action: 'addressSearch',
          query: record.address
        }
      });
      
      addLog(`  ← Address search response: ${searchData?.success ? 'Success' : 'Failed'}`);
      
      if (searchError || !searchData?.success) {
        const errorMsg = searchData?.error || searchError?.message || 'Address search failed';
        addLog(`  ❌ Address search error: ${errorMsg}`);
        throw new Error(errorMsg);
      }
      
      if (!searchData.data?.data || searchData.data.data.length === 0) {
        addLog(`  ❌ No address suggestions found`);
        throw new Error('No address suggestions found');
      }
      
      // Use first suggestion
      const suggestion = searchData.data.data[0];
      const addressLine1 = `${suggestion.addressInBrokenDownForm.streetNumber} ${suggestion.addressInBrokenDownForm.streetName} ${suggestion.addressInBrokenDownForm.streetType}`;
      
      addLog(`  → Found suggestion: ${addressLine1}, ${suggestion.suburb}`);
      addLog(`  → Calling address validate API`);
      
      // Step 2: Validate address and get GNAF data
      const { data: validateData, error: validateError } = await supabase.functions.invoke('suncorp-proxy', {
        body: {
          action: 'addressValidate',
          address: {
            country: 'AUS',
            suburb: suggestion.suburb,
            postcode: suggestion.postcode,
            state: suggestion.state,
            addressInFreeForm: {
              addressLine1: addressLine1
            }
          }
        }
      });
      
      const executionTime = Date.now() - startTime;
      addLog(`  ← Address validate response (${executionTime}ms): ${validateData?.success ? 'Success' : 'Failed'}`);
      
      if (validateError || !validateData?.success) {
        const errorMsg = validateData?.error || validateError?.message || 'Address validation failed';
        addLog(`  ❌ Address validate error: ${errorMsg}`);
        console.error('[Address Validate Error Details]', validateData);
        await supabase.from('bulk_quote_processing_logs').insert({
          batch_id: batchId,
          record_id: record.id,
          record_identifier: record.rego,
          action: 'address_validate',
          status: 'error',
          api_endpoint: 'addressValidate',
          request_payload: { query: record.address },
          error_message: errorMsg,
          execution_time_ms: executionTime
        });
        throw new Error(errorMsg);
      }
      
      const matched = validateData.data.matchedAddress;
      
      if (!matched) {
        addLog(`  ❌ No matched address in response`);
        throw new Error('No matched address in validation response');
      }
      
      // Accept quality levels 1-3; log warning for >1
      if (!['1','2','3'].includes(matched.addressQualityLevel)) {
        addLog(`  ❌ Address quality level ${matched.addressQualityLevel} not acceptable (need 1-3)`);
        throw new Error(`Address quality level ${matched.addressQualityLevel} not acceptable (need level 1-3)`);
      }
      if (matched.addressQualityLevel !== '1') {
        addLog(`  ⚠️ Proceeding with address quality ${matched.addressQualityLevel}`);
      }
      
      // Log success
      await supabase.from('bulk_quote_processing_logs').insert({
        batch_id: batchId,
        record_id: record.id,
        record_identifier: record.rego,
        action: 'address_validate',
        status: 'success',
        api_endpoint: 'addressValidate',
        request_payload: { query: record.address },
        response_data: validateData,
        execution_time_ms: executionTime
      });
      
      return {
        addressId: matched.addressId,
        postcode: matched.postcode,
        suburb: matched.suburb,
        state: matched.state,
        addressQualityLevel: matched.addressQualityLevel,
        geocodedNationalAddressFileData: matched.geocodedNationalAddressFileData,
        pointLevelCoordinates: matched.pointLevelCoordinates,
        structuredStreetAddress: matched.addressInBrokenDownForm
      };
    } catch (error: any) {
      console.error('[Address Validation Full Error]', error);
      throw error;
    }
  };

  // STEP 3: GENERATE QUOTE (SINGLE POST FOR THIRD_PARTY)
  const callGenerateQuote = async (
    record: BulkRecord,
    vehicleData: VehicleDetails,
    addressData: AddressData,
    batchId: string
  ): Promise<QuoteData> => {
    const startTime = Date.now();
    
    try {
      const dob = convertDateFormat(record.dob);
      const gender = convertGenderFormat(record.gender);
      const policyStartDate = new Date().toISOString().slice(0, 10);
      const showStampDutyModal = getStampDutyModalByState(record.state);
      const includeCarPurchase = shouldIncludeCarPurchaseField(vehicleData.year);
      const standardExcess = getStandardExcessByState(record.state);
      
      addLog(`  → Building quote payload (DOB: ${dob}, Gender: ${gender}, Start: ${policyStartDate})`);
      addLog(`  → Vehicle year: ${vehicleData.year}, Include carPurchase: ${includeCarPurchase}, Excess: $${standardExcess}`);
      
      // Build vehicle details dynamically
      const vehicleDetails: any = {
        isRoadworthy: true,
        hasAccessoryAndModification: false,
        nvic: vehicleData.nvic,
        highPerformance: null,
        hasDamage: false,
        financed: false,
        usage: {
          primaryUsage: 'S',
          businessType: '',
          extraQuestions: {},
          showStampDutyModal
        },
        kmPerYear: '05',
        vehicleInfo: {
          year: vehicleData.year,
          make: vehicleData.make,
          family: vehicleData.family,
          variant: vehicleData.variant
        },
        peakHourDriving: false,
        daysUsed: 'A',
        daytimeParked: {
          indicator: 'S',
          suburb: null,
          postcode: null
        }
      };

      // Conditionally add carPurchaseIn13Months
      if (includeCarPurchase) {
        vehicleDetails.carPurchaseIn13Months = false;
        addLog(`  → Including carPurchaseIn13Months field (newer vehicle)`);
      } else {
        addLog(`  → Omitting carPurchaseIn13Months field (older vehicle)`);
      }
      
      // Build quote request payload
      const quotePayload = {
        quoteDetails: {
          policyStartDate,
          acceptDutyOfDisclosure: true,
          currentInsurer: 'TGSH',
          sumInsured: {
            marketValue: vehicleData.newCarPrice,
            agreedValue: 0,
            sumInsuredType: 'Agreed Value'
          },
          campaignCode: '',
          hasFamilyPolicy: false,
          hasMultiplePolicies: true
        },
        vehicleDetails,
        coverDetails: {
          coverType: 'THIRD_PARTY',
          hasWindscreenExcessWaiver: false,
          hasHireCarLimited: false,
          hasRoadAssist: false,
          hasFireAndTheft: false,
          standardExcess,
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
              streetName: addressData.structuredStreetAddress?.streetName || '',
              streetNumber1: addressData.structuredStreetAddress?.streetNumber1 || addressData.structuredStreetAddress?.streetNumber || '',
              streetTypeCode: addressData.structuredStreetAddress?.streetType || 
                              (addressData.structuredStreetAddress as any)?.streetTypeCode || ''
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
      
      addLog(`  → Calling quote API with vehicle ${vehicleData.nvic}`);
      console.log('[Quote Payload]', JSON.stringify(quotePayload, null, 2));
      
      // Call createQuote action (single POST returns final pricing for THIRD_PARTY)
      let { data, error } = await supabase.functions.invoke('suncorp-proxy', {
        body: {
          action: 'createQuote',
          quotePayload
        }
      });
      
      // If error and carPurchaseIn13Months was included, retry without it
      if ((error || !data?.success) && includeCarPurchase) {
        const errorMsg = error?.message || data?.error || JSON.stringify(error || data);
        
        // Check if it's a validation error that might be related to carPurchaseIn13Months
        if (errorMsg.includes('validation') || errorMsg.includes('400') || errorMsg.includes('invalid')) {
          addLog(`  ⚠️  First attempt failed, retrying without carPurchaseIn13Months field`);
          
          // Remove carPurchaseIn13Months from vehicleDetails
          const retryVehicleDetails = { ...vehicleDetails };
          delete retryVehicleDetails.carPurchaseIn13Months;
          
          const retryPayload = {
            ...quotePayload,
            vehicleDetails: retryVehicleDetails
          };
          
          console.log('[Retry Quote Payload]', JSON.stringify(retryPayload, null, 2));
          
          // Log retry attempt
          await supabase.from('bulk_quote_processing_logs').insert({
            batch_id: batchId,
            record_id: record.id,
            record_identifier: record.rego,
            action: 'quote_generation_retry',
            status: 'success',
            api_endpoint: 'createQuote',
            request_payload: retryPayload,
            error_message: 'Retrying without carPurchaseIn13Months',
            execution_time_ms: 0
          });
          
          // Second attempt
          const retryResult = await supabase.functions.invoke('suncorp-proxy', {
            body: {
              action: 'createQuote',
              quotePayload: retryPayload
            }
          });
          
          data = retryResult.data;
          error = retryResult.error;
          
          if (!error && data?.success) {
            addLog(`  ✅ Retry successful without carPurchaseIn13Months`);
          }
        }
      }
      
      const executionTime = Date.now() - startTime;
      addLog(`  ← Quote API response (${executionTime}ms): ${data?.success ? 'Success' : 'Failed'}`);
      
      if (error || !data?.success) {
        const errorDetails = data?.error || data?.details || error?.message || 'Quote generation failed';
        const errorMsg = typeof errorDetails === 'object' ? JSON.stringify(errorDetails) : errorDetails;
        addLog(`  ❌ Quote API error: ${errorMsg}`);
        console.error('[Quote API Error Details]', { error, data, errorDetails });
        console.error('[Suncorp API Full Response]', JSON.stringify(data, null, 2));
        if (data?.details) {
          console.error('[Suncorp Validation Error]', JSON.stringify(data.details, null, 2));
        }
        await supabase.from('bulk_quote_processing_logs').insert({
          batch_id: batchId,
          record_id: record.id,
          record_identifier: record.rego,
          action: 'quote_generation',
          status: 'error',
          api_endpoint: 'createQuote',
          request_payload: quotePayload,
          error_message: errorMsg,
          execution_time_ms: executionTime
        });
        throw new Error(errorMsg);
      }
      
      if (!data.data?.quoteDetails) {
        addLog(`  ❌ No quote details in response`);
        throw new Error('No quote details in response');
      }
      
      const quoteDetails = data.data.quoteDetails;
      const premium = quoteDetails.premium;
      
      addLog(`  → Quote details received: ${quoteDetails.quoteNumber}`);
      addLog(`  → Premium breakdown: Base $${premium.annualBasePremium}, Stamp $${premium.annualStampDuty}, GST $${premium.annualGST}`);
      
      // Log success
      await supabase.from('bulk_quote_processing_logs').insert({
        batch_id: batchId,
        record_id: record.id,
        record_identifier: record.rego,
        action: 'quote_generation',
        status: 'success',
        api_endpoint: 'createQuote',
        request_payload: quotePayload,
        response_data: data,
        execution_time_ms: executionTime
      });
      
      return {
        quoteNumber: quoteDetails.quoteNumber,
        quoteReference: quoteDetails.quoteNumber,
        pricing: {
          basePremium: premium.annualBasePremium,
          stampDuty: premium.annualStampDuty,
          gst: premium.annualGST,
          totalPremium: premium.annualPremium
        }
      };
    } catch (error: any) {
      console.error('[Quote Generation Full Error]', error);
      throw error;
    }
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
            <CardDescription className="space-y-2">
              <div>Required format: <code className="bg-muted px-2 py-1 rounded">rego[TAB]address[TAB]dob[TAB]gender</code></div>
              <div className="text-xs">Each row must have 4 fields separated by TAB characters (not spaces)</div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Example format:</strong><br/>
                <code className="text-xs">ABC123[TAB]123 Main St, Brisbane QLD 4000[TAB]15/03/1985[TAB]Male</code>
                <br/><br/>
                <strong>Your data must include:</strong>
                <ul className="list-disc list-inside text-xs mt-2 space-y-1">
                  <li>Registration number (e.g., ABC123)</li>
                  <li>Full address with state (must contain NSW, VIC, QLD, WA, SA, TAS, ACT, or NT)</li>
                  <li>Date of birth in dd/mm/yyyy format (e.g., 15/03/1985)</li>
                  <li>Gender (Male or Female)</li>
                </ul>
              </AlertDescription>
            </Alert>
            <Textarea
              placeholder="ABC123	123 Main Street, Brisbane QLD 4000	15/03/1985	Male&#10;XYZ789	456 High St, Melbourne VIC 3000	20/06/1990	Female"
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
            <div className="flex gap-2">
              <Button onClick={handleParseInput} disabled={processing}>
                <Upload className="w-4 h-4 mr-2" />
                Parse & Preview Records
              </Button>
              <Button 
                onClick={() => setBulkInput('YLD31Q\t6C Carr Crescent, Wanniassa, ACT\t15/03/1985\tMale\nYOC13W\t19 Watkins Street, Wanniassa, ACT\t20/06/1990\tFemale')}
                variant="outline"
              >
                Load Example Data
              </Button>
            </div>
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
                    <Button 
                      onClick={handleTestConnection}
                      disabled={isTestingConnection || processing}
                      variant={connectionStatus === 'success' ? 'outline' : 'default'}
                    >
                      {isTestingConnection ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Testing...
                        </>
                      ) : connectionStatus === 'success' ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Connection OK
                        </>
                      ) : connectionStatus === 'failed' ? (
                        <>
                          <XCircle className="w-4 h-4 mr-2" />
                          Test Connection
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Test Connection
                        </>
                      )}
                    </Button>
                    <Button onClick={handleStartProcessing} disabled={processing || connectionStatus !== 'success'}>
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
            
            {/* Processing Logs */}
            {processingLogs.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Processing Logs</CardTitle>
                      <CardDescription>Real-time API call logs and status</CardDescription>
                    </div>
                    <Button 
                      onClick={() => setProcessingLogs([])} 
                      variant="outline" 
                      size="sm"
                    >
                      Clear Logs
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-xs max-h-96 overflow-y-auto space-y-1">
                    {processingLogs.map((log, index) => (
                      <div key={index} className={
                        log.includes('❌') ? 'text-red-400' : 
                        log.includes('✅') ? 'text-green-400' :
                        log.includes('🚀') || log.includes('🎉') ? 'text-blue-400 font-bold' :
                        log.includes('→') ? 'text-yellow-400' :
                        log.includes('←') ? 'text-cyan-400' :
                        'text-gray-400'
                      }>
                        {log}
                      </div>
                    ))}
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
