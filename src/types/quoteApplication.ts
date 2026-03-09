export interface QuoteApplicationFormData {
  // Page 1 - Vehicle Usage
  vehicle_usage: string;
  is_rented: string;
  is_delivery: string;
  is_rideshare: string;
  food_delivery_hours: string;
  business_usage_type: string;
  is_refrigerated: string;

  // Page 2 - Contact Details
  first_name: string;
  last_name: string;
  gender: string;
  dob_day: string;
  dob_month: string;
  dob_year: string;
  phone: string;
  email: string;
  address: string;
  housing_status: string;

  // Page 3 - Driving History
  international_license: string;
  international_years: string;
  owner_drives: string;
  license_type: string;
  all_drivers_2_years: string;
  age_received_license: string;
  demerit_points: string;
  claims_made: string;
  claims_count: string;
  claims_list: string;
  bankruptcy: string;
  license_suspended: string;
  criminal_offences: string;
  insurance_declined: string;
  claim_denied_fraud: string;

  // Page 4 - Vehicle Details
  vehicle_registration: string;
  vehicle_state: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: string;
  vehicle_nvic: string;
  vehicle_variant: string;
  vehicle_body_style: string;
  vehicle_description: string;
  vehicle_transmission: string;
  vehicle_series: string;
  vehicle_image_url: string;
  vehicle_identification_method: string;
  is_vehicle_unregistered: string;
  h_plate: string;
  market_value: string;
  trade_value: string;
  retail_value: string;
  add_more_vehicles: string;

  // Page 5 - Vehicle Usage Details
  exclude_under_25: string;
  rideshare_delivery: string;
  purchase_type: string;
  first_owner: string;
  continuously_insured: string;
  is_financed: string;
  finance_company: string;
  is_modified: string;
  modification_details: string;
  security: string;
  undamaged_roadworthy: string;
  days_per_week_work: string;
  km_per_year: string;
  peak_times: string;
  parking_location: string;
  parking_address: string;

  // Page 6 - Cover Options
  policy_start_date: string;
  coverage_level: string;
  excess_level: string;
  policy_extras: string;
  roadside_assistance: string;
  sum_insured_type: string;
  agreed_value: string;

  // Page 7 - Terms
  privacy_accepted: string;
  broker_terms_accepted: string;
  home_insurance_opt_in: string;
  signature: string;
}

export const INITIAL_FORM_DATA: QuoteApplicationFormData = {
  vehicle_usage: "",
  is_rented: "",
  is_delivery: "",
  is_rideshare: "",
  food_delivery_hours: "",
  business_usage_type: "",
  is_refrigerated: "",
  first_name: "",
  last_name: "",
  gender: "",
  dob_day: "",
  dob_month: "",
  dob_year: "",
  phone: "",
  email: "",
  address: "",
  housing_status: "",
  international_license: "",
  international_years: "",
  owner_drives: "",
  license_type: "",
  all_drivers_2_years: "",
  age_received_license: "",
  demerit_points: "",
  claims_made: "",
  claims_count: "",
  claims_list: "",
  bankruptcy: "",
  license_suspended: "",
  criminal_offences: "",
  insurance_declined: "",
  claim_denied_fraud: "",
  vehicle_registration: "",
  vehicle_state: "",
  vehicle_make: "",
  vehicle_model: "",
  vehicle_year: "",
  vehicle_nvic: "",
  vehicle_variant: "",
  vehicle_body_style: "",
  vehicle_description: "",
  vehicle_transmission: "",
  vehicle_series: "",
  vehicle_image_url: "",
  vehicle_identification_method: "",
  is_vehicle_unregistered: "",
  h_plate: "",
  market_value: "",
  trade_value: "",
  retail_value: "",
  add_more_vehicles: "",
  exclude_under_25: "",
  rideshare_delivery: "",
  purchase_type: "",
  first_owner: "",
  continuously_insured: "",
  is_financed: "",
  finance_company: "",
  is_modified: "",
  modification_details: "",
  security: "",
  undamaged_roadworthy: "",
  days_per_week_work: "",
  km_per_year: "",
  peak_times: "",
  parking_location: "",
  parking_address: "",
  policy_start_date: "",
  coverage_level: "",
  excess_level: "",
  policy_extras: "",
  roadside_assistance: "",
  sum_insured_type: "",
  agreed_value: "",
  privacy_accepted: "",
  broker_terms_accepted: "",
  home_insurance_opt_in: "",
  signature: "",
};
