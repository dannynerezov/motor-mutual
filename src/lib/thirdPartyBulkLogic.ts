import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

// ============================================
// TYPE DEFINITIONS
// ============================================

export type AustralianState = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';

// ============================================
// CONSTANTS
// ============================================

export const BATCH_CONFIG = {
  BATCH_SIZE: 50,
  BATCH_DELAY_MS: 1000,
  MAX_RECORDS: 100000,
} as const;

export const STANDARD_EXCESS_BY_STATE: Record<AustralianState, number> = {
  'QLD': 1300,
  'NSW': 795,
  'VIC': 750,
  'ACT': 795,
  'WA': 650,
  'SA': 600,
  'NT': 750,
  'TAS': 600,
};

// CORRECTED: NSW is the ONLY state requiring stamp duty modal
export const STAMP_DUTY_MODAL_BY_STATE: Record<AustralianState, boolean> = {
  'NSW': true,   // ✅ ONLY NSW
  'VIC': false,
  'QLD': false,
  'WA': false,
  'SA': false,
  'TAS': false,
  'ACT': false,
  'NT': false,
};

export const VEHICLE_LOOKUP_ENTRY_DATE = '2024-07-07';
export const DEFAULT_TIMEZONE = 'Australia/Brisbane';
export const API_DATE_FORMAT = 'yyyy-MM-dd';

// ============================================
// DATE UTILITIES
// ============================================

/**
 * Convert date to dd/mm/yyyy format for Suncorp API
 * Accepts either dd/mm/yyyy or yyyy-mm-dd (ISO) format
 */
export function convertDateFormat(dateString: string): string {
  try {
    // Remove any whitespace
    const cleaned = dateString.trim();
    
    let date: Date;
    
    // Check if it's ISO format (yyyy-mm-dd)
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
      // Parse ISO format: "1998-06-16"
      const [year, month, day] = cleaned.split('-').map(n => parseInt(n, 10));
      
      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        throw new Error('Invalid date values in ISO format');
      }
      
      date = new Date(year, month - 1, day);
    }
    // Check if it's dd/mm/yyyy format
    else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(cleaned)) {
      // Parse dd/mm/yyyy format: "16/06/1998"
      const [day, month, year] = cleaned.split('/').map(n => parseInt(n, 10));
      
      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        throw new Error('Invalid date values in dd/mm/yyyy format');
      }
      
      date = new Date(year, month - 1, day);
    }
    else {
      throw new Error('Invalid date format. Expected dd/mm/yyyy or yyyy-mm-dd');
    }
    
    // Validate the date is real (handles cases like Feb 31st)
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    
    // Return in dd/mm/yyyy format for Suncorp API
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
    
  } catch (error) {
    console.error('Date conversion error:', error);
    throw new Error(`Failed to convert date "${dateString}": ${error}`);
  }
}

/**
 * Get default policy start date (tomorrow in Brisbane timezone)
 */
export function getDefaultPolicyStartDate(): string {
  const tomorrow = new Date();
  // Add one day correctly (do not nest setDate)
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatInTimeZone(tomorrow, DEFAULT_TIMEZONE, API_DATE_FORMAT);
}

// ============================================
// GENDER UTILITIES
// ============================================

/**
 * Convert gender from "Male"/"Female" to "M"/"F" for API
 */
export function convertGenderFormat(gender: string): string {
  const normalized = gender.trim().toLowerCase();
  
  if (normalized === 'male' || normalized === 'm') {
    return 'M';
  }
  
  if (normalized === 'female' || normalized === 'f') {
    return 'F';
  }
  
  throw new Error(`Invalid gender value: "${gender}". Expected "Male" or "Female"`);
}

// ============================================
// STATE UTILITIES
// ============================================

/**
 * Get standard excess amount by state
 */
export function getStandardExcessByState(state: AustralianState): number {
  return STANDARD_EXCESS_BY_STATE[state];
}

/**
 * Check if state requires stamp duty modal (NSW ONLY)
 */
export function getStampDutyModalByState(state: AustralianState): boolean {
  return STAMP_DUTY_MODAL_BY_STATE[state];
}

/**
 * Validate if string is a valid Australian state
 */
export function isValidAustralianState(state: string): state is AustralianState {
  return ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'].includes(state);
}

/**
 * Determines if carPurchaseIn13Months field should be included based on vehicle age
 * Field is required for 2024-2025 vehicles only
 */
export function shouldIncludeCarPurchaseField(vehicleYear: string): boolean {
  const year = parseInt(vehicleYear, 10);
  const currentYear = new Date().getFullYear();
  
  // Include the field for 2024 and 2025 vehicles only
  // For 2023 and older: omit the field
  return year >= 2024 && year <= currentYear + 1;
}

// ============================================
// ADDRESS UTILITIES
// ============================================

/**
 * Build address line 1 from components
 */
export function buildAddressLine1(
  unitNumber?: string,
  unitType?: string,
  streetNumber?: string,
  streetName?: string,
  streetType?: string
): string {
  const parts: string[] = [];
  
  if (unitNumber && unitType) {
    parts.push(`${unitType} ${unitNumber}`);
  }
  
  if (streetNumber) {
    parts.push(streetNumber);
  }
  
  if (streetName) {
    parts.push(streetName);
  }
  
  if (streetType) {
    parts.push(streetType);
  }
  
  return parts.join(' ');
}

// ============================================
// VALIDATION UTILITIES
// ============================================

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate a single bulk record
 */
export function validateBulkRecord(record: {
  rego: string;
  state: string;
  address: string;
  dob: string;
  gender: string;
}): ValidationResult {
  // Validate registration number
  if (!record.rego || record.rego.trim().length === 0) {
    return { isValid: false, error: 'Registration number is required' };
  }

  // Validate state
  if (!record.state || !isValidAustralianState(record.state)) {
    return { isValid: false, error: `Invalid state: ${record.state}` };
  }

  // Validate address
  if (!record.address || record.address.trim().length === 0) {
    return { isValid: false, error: 'Address is required' };
  }

  // Validate date of birth
  try {
    convertDateFormat(record.dob);
  } catch (error) {
    return { isValid: false, error: `Invalid date of birth: ${record.dob}` };
  }

  // Validate gender
  try {
    convertGenderFormat(record.gender);
  } catch (error) {
    return { isValid: false, error: `Invalid gender: ${record.gender}` };
  }

  return { isValid: true };
}

// ============================================
// PRICING UTILITIES
// ============================================

/**
 * Extract pricing information from Suncorp quote response
 */
export function extractPricingFromQuote(quoteData: any): {
  basePremium: number;
  stampDuty: number;
  gst: number;
  totalPremium: number;
} {
  const pricing = quoteData?.pricing || {};
  
  return {
    basePremium: parseFloat(pricing.basePremium || '0'),
    stampDuty: parseFloat(pricing.stampDuty || '0'),
    gst: parseFloat(pricing.gst || '0'),
    totalPremium: parseFloat(pricing.totalPremium || '0'),
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ============================================
// ERROR UTILITIES
// ============================================

/**
 * Extract meaningful error message from API response
 */
export function extractErrorMessage(error: any): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.error) {
    return typeof error.error === 'string' ? error.error : JSON.stringify(error.error);
  }
  
  return 'An unknown error occurred';
}
