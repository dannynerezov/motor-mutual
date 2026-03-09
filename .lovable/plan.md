

## Plan: Create Form 1-4 Database Tables Mirroring No-Database Webform

### Context

The [No-Database Webform](/projects/c66a07aa-56fb-46ec-9cbc-31971191d1b5) project has 4 form types with well-defined TypeScript interfaces. We need to create corresponding database tables in this project to receive and store submissions from that project.

### Form-to-Table Mapping

**Table 1: `form1_submissions`** — Initial contact/enquiry (from `Form1Data`)
Fields: `how_can`, `insurance_type`, `support_type`, `home_insurance_type`, `enquiry_description`, `claim_description`, `previously_insured`, `price_target`, `insurance_expiry`, `insurance_expiry_day`, `insurance_expiry_month`, `insurance_expiry_year`, `first_name`, `last_name`, `phone`, `email`, `attachments` (jsonb), `channel`, `user_field`, `notes`, `renewal`, `contact_type`, `cc_email`, `partner_name`, `deal_id`, plus metadata (`id`, `created_at`, `updated_at`, `ip_address`, `user_agent`, `submission_status`)

**Table 2: `form2_submissions`** — Full quote application (from `FormData` — 80+ fields across 9 pages)
Organized into column groups:
- **Customer type**: `customer_type`, `company_name`, `abn`, `abn_duration`, `deal_id`, `user_field`, `cc_email`, `domain_alias`
- **Vehicle usage**: `vehicle_usage`, `is_rented`, `is_delivery`, `is_rideshare`, `food_delivery_hours`, `business_usage_type`, `is_refrigerated`
- **Contact details**: `first_name`, `last_name`, `gender`, `dob_day`, `dob_month`, `dob_year`, `phone`, `email`, `address`, `address_suncorp_validated`, `housing_status`
- **Driving history**: `international_license`, `international_years`, `owner_drives`, `license_type`, `all_drivers_2_years`, `age_received_license`, `demerit_points`, `claims_made`, `claims_count`, `claims_list` (jsonb), `bankruptcy`, `license_suspended`, `criminal_offences`, `insurance_declined`, `claim_denied_fraud`
- **Vehicle details**: `vehicle_registration`, `vehicle_state`, `is_vehicle_unregistered`, `vehicle_make`, `vehicle_model`, `vehicle_year`, `h_plate`, `vehicle_nvic`, `vehicle_variant`, `vehicle_body_style`, `vehicle_description`, `vehicle_transmission`, `vehicle_series`, `market_value`, `trade_value`, `retail_value`, `vehicle_image_url`, `vehicle_identification_method`, `add_more_vehicles`
- **Vehicle usage details**: `exclude_under_25`, `rideshare_delivery`, `purchase_type`, `first_owner`, `continuously_insured`, `is_financed`, `finance_company`, `is_modified`, `modification_details`, `security`, `undamaged_roadworthy`, `days_per_week_work`, `km_per_year`, `peak_times`, `parking_location`, `parking_address`
- **Cover options**: `policy_start_date`, `coverage_level`, `excess_level`, `policy_extras`, `roadside_assistance`, `sum_insured_type`, `agreed_value`, `nominated_drivers_list` (jsonb)
- **betterQuote**: `quote_type`, `better_quote_target_insurer`, `better_quote_target_price`, `better_quote_evidence_url`, `better_quote_calculated_price`
- **Price guarantee**: `previously_insured`, `which_insurer`, `current_insurer`, `current_premium`, `current_cover`, `current_excess`
- **Terms**: `privacy_accepted`, `broker_terms_accepted`, `home_insurance_opt_in`, `signature`
- **Metadata**: `id`, `created_at`, `updated_at`, `ip_address`, `user_agent`, `submission_status`

**Table 3: `form3_submissions`** — Quote issued to customer (from `Form3Data`)
Fields: `form2_submission_id` (uuid FK), `quote_agent`, `deal_id`, `insurance_type`, `policy_description`, `insurer_quotation_url`, `product`, `policy_start_date`, `insurer_reference`, `policy_type`, `policy_coverage`, `agreed_value`, `vehicle_rego`, `vehicle_make`, `vehicle_model`, `vehicle_year`, `standard_excess`, `excess_cashback`, `customer_excess`, `form2_excess_level`, `vehicle_value`, `additional_vehicles`, `named_drivers` (jsonb), `policy_extras` (jsonb), `overseas_licences`, `age_restriction`, `brokerage_fee`, `base_premium`, `fire_levy`, `uw_levy`, `stamp_duty`, `gst`, `insurer_total`, `broker_fee_total`, `processing_fee`, `total_annual_premium`, `total_monthly_premium`, `difference_monthly_to_yearly`, plus metadata

**Table 4: `form4_submissions`** — Quote accepted by customer (from `Form4Data` + `Form4LiteData`)
Fields: `form3_submission_id` (uuid FK), `deal_id`, `policy_type`, `policy_coverage`, `standard_excess`, `customer_excess`, `vehicle_rego`, `vehicle_make`, `vehicle_model`, `vehicle_year`, `insurance_type`, `additional_vehicles`, `total_annual_premium`, `total_monthly_premium`, `policy_start_date`, `customer_first_name`, `customer_last_name`, `customer_email`, `customer_phone`, `vehicle_usage`, `vehicle_image_url`, `vehicle_value`, `vehicle_state`, `underwriter`, `details_confirmed`, `terms_accepted`, `payment_method`, `confirmation_choice`, `change_request_text`, `change_request_category`, plus metadata

### Implementation Steps

1. **Create migration** with all 4 tables, appropriate column types (text for most, numeric for prices, jsonb for arrays/objects, boolean for flags), nullable where appropriate
2. **Add RLS policies** — public INSERT (for receiving submissions) and public SELECT (for admin viewing). No auth required since submissions come from external project.
3. **Add foreign keys** — `form3_submissions.form2_submission_id` → `form2_submissions.id`, `form4_submissions.form3_submission_id` → `form3_submissions.id`
4. **Add `updated_at` triggers** using existing `update_updated_at_column()` function
5. **Enable realtime** on all 4 tables (useful for admin dashboard later)

### What This Does NOT Include (deferred to GUI phase)
- No frontend forms or admin views yet
- No API endpoint for receiving submissions (will build after tables exist)
- No data migration from the other project

