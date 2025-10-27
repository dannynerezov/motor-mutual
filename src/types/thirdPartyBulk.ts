// ============================================
// BULK PROCESSING TYPES
// ============================================

export type ProcessingStatus = 'pending' | 'processing' | 'success' | 'error';

export type AustralianState = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';

export interface BulkRecord {
  id: number;
  rego: string;
  state: AustralianState;
  address: string;
  dob: string;
  gender: string;
  status: ProcessingStatus;
  error?: string;
  vehicleData?: VehicleDetails;
  addressData?: AddressData;
  quoteData?: QuoteData;
  processingStartTime?: number;
  processingEndTime?: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface VehicleDetails {
  nvic: string;
  year: string;
  make: string;
  family: string;
  variant: string;
  bodyStyle: string;
  transmissionDescription: string;
  driveType: string;
  size: string;
  newCarPrice: number;
}

export interface AddressData {
  addressId: string;
  postcode: string;
  suburb: string;
  state: string;
  addressQualityLevel: string;
  geocodedNationalAddressFileData: {
    gnafId: string;
  };
  pointLevelCoordinates: {
    longLatLatitude: string;
    longLatLongitude: string;
  };
  structuredStreetAddress: {
    unitNumber?: string;
    unitType?: string;
    streetNumber1: string;
    streetName: string;
    streetType: string;
  };
}

export interface QuoteData {
  quoteNumber: string;
  quoteReference: string;
  pricing: {
    basePremium: number;
    stampDuty: number;
    gst: number;
    totalPremium: number;
  };
}

// ============================================
// DATABASE TYPES
// ============================================

export interface ThirdPartyQuote {
  id: string;
  created_at: string;
  updated_at: string;
  
  // Vehicle information
  registration_number: string;
  registration_state: string;
  vehicle_nvic: string;
  vehicle_year: string;
  vehicle_make: string;
  vehicle_family: string;
  vehicle_variant: string;
  vehicle_body_style?: string;
  vehicle_transmission?: string;
  vehicle_drive_type?: string;
  vehicle_engine_size?: string;
  
  // Risk address
  risk_address_postcode: string;
  risk_address_suburb: string;
  risk_address_state: string;
  risk_address_street_number: string;
  risk_address_street_name: string;
  risk_address_street_type: string;
  risk_address_unit_number?: string;
  risk_address_unit_type?: string;
  risk_address_lurn: string;
  risk_address_latitude?: string;
  risk_address_longitude?: string;
  
  // Customer information
  date_of_birth: string;
  gender: string;
  
  // Policy details
  policy_start_date: string;
  primary_usage: string;
  km_per_year: string;
  current_insurer: string;
  sum_insured_type: string;
  cover_type: string;
  
  // Valuation
  market_value?: number;
  agreed_value?: number;
  
  // Pricing
  base_premium: number;
  stamp_duty: number;
  gst: number;
  total_premium: number;
  
  // Quote reference
  quote_number: string;
  quote_reference: string;
  
  // API data
  api_request_payload?: Record<string, any>;
  api_response_data?: Record<string, any>;
  
  // Metadata
  ip_address?: string;
  user_agent?: string;
}

export interface BulkQuoteBatch {
  id: string;
  created_at: string;
  updated_at: string;
  batch_name?: string;
  created_by: string;
  total_records: number;
  successful_records: number;
  failed_records: number;
  processing_start_time?: string;
  processing_end_time?: string;
  total_processing_time_ms?: number;
}

export type ProcessingAction = 
  | 'vehicle_lookup'
  | 'address_search'
  | 'address_validate'
  | 'quote_generation'
  | 'quote_generation_retry'
  | 'batch_start'
  | 'batch_complete'
  | 'record_start'
  | 'record_complete';

export interface BulkQuoteProcessingLog {
  id: string;
  created_at: string;
  batch_id: string;
  record_id: number;
  record_identifier: string;
  timestamp: string;
  action: ProcessingAction;
  status: 'success' | 'error';
  api_endpoint?: string;
  request_payload?: Record<string, any>;
  response_data?: Record<string, any>;
  error_message?: string;
  execution_time_ms?: number;
}

// ============================================
// PROCESSING LOG TYPES
// ============================================

export interface BulkProcessingLog {
  recordId: number;
  recordIdentifier: string;
  timestamp: Date;
  action: ProcessingAction;
  status: 'success' | 'error';
  message: string;
  executionTime?: number;
  error?: string;
}

// ============================================
// BATCH STATISTICS
// ============================================

export interface BatchStatistics {
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  failedRecords: number;
  averageProcessingTime: number;
  estimatedTimeRemaining: number;
}
