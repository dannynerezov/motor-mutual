export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bulk_quote_batches: {
        Row: {
          batch_name: string | null
          created_at: string
          created_by: string
          failed_records: number
          id: string
          processing_end_time: string | null
          processing_start_time: string | null
          successful_records: number
          total_processing_time_ms: number | null
          total_records: number
          updated_at: string
        }
        Insert: {
          batch_name?: string | null
          created_at?: string
          created_by?: string
          failed_records?: number
          id?: string
          processing_end_time?: string | null
          processing_start_time?: string | null
          successful_records?: number
          total_processing_time_ms?: number | null
          total_records: number
          updated_at?: string
        }
        Update: {
          batch_name?: string | null
          created_at?: string
          created_by?: string
          failed_records?: number
          id?: string
          processing_end_time?: string | null
          processing_start_time?: string | null
          successful_records?: number
          total_processing_time_ms?: number | null
          total_records?: number
          updated_at?: string
        }
        Relationships: []
      }
      bulk_quote_processing_logs: {
        Row: {
          action: string
          api_endpoint: string | null
          batch_id: string
          created_at: string
          error_message: string | null
          execution_time_ms: number | null
          id: string
          record_id: number
          record_identifier: string
          request_payload: Json | null
          response_data: Json | null
          status: string
          timestamp: string
        }
        Insert: {
          action: string
          api_endpoint?: string | null
          batch_id: string
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          record_id: number
          record_identifier: string
          request_payload?: Json | null
          response_data?: Json | null
          status: string
          timestamp?: string
        }
        Update: {
          action?: string
          api_endpoint?: string | null
          batch_id?: string
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          record_id?: number
          record_identifier?: string
          request_payload?: Json | null
          response_data?: Json | null
          status?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "bulk_quote_processing_logs_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "bulk_quote_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      claims: {
        Row: {
          claim_amount: number | null
          claim_number: string
          created_at: string
          customer_id: string
          id: string
          incident_date: string
          incident_description: string
          policy_id: string
          status: string
          updated_at: string
        }
        Insert: {
          claim_amount?: number | null
          claim_number: string
          created_at?: string
          customer_id: string
          id?: string
          incident_date: string
          incident_description: string
          policy_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          claim_amount?: number | null
          claim_number?: string
          created_at?: string
          customer_id?: string
          id?: string
          incident_date?: string
          incident_description?: string
          policy_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "claims_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string
          postcode: string
          state: string
          updated_at: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          phone: string
          postcode: string
          state: string
          updated_at?: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string
          postcode?: string
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      form1_submissions: {
        Row: {
          attachments: Json | null
          cc_email: string | null
          channel: string | null
          claim_description: string | null
          contact_type: string | null
          created_at: string
          deal_id: string | null
          email: string | null
          enquiry_description: string | null
          first_name: string | null
          home_insurance_type: string | null
          how_can: string | null
          id: string
          insurance_expiry: string | null
          insurance_expiry_day: string | null
          insurance_expiry_month: string | null
          insurance_expiry_year: string | null
          insurance_type: string | null
          ip_address: string | null
          last_name: string | null
          notes: string | null
          partner_name: string | null
          phone: string | null
          previously_insured: string | null
          price_target: string | null
          quote_number: string | null
          renewal: string | null
          submission_status: string | null
          support_type: string | null
          updated_at: string
          user_agent: string | null
          user_field: string | null
        }
        Insert: {
          attachments?: Json | null
          cc_email?: string | null
          channel?: string | null
          claim_description?: string | null
          contact_type?: string | null
          created_at?: string
          deal_id?: string | null
          email?: string | null
          enquiry_description?: string | null
          first_name?: string | null
          home_insurance_type?: string | null
          how_can?: string | null
          id?: string
          insurance_expiry?: string | null
          insurance_expiry_day?: string | null
          insurance_expiry_month?: string | null
          insurance_expiry_year?: string | null
          insurance_type?: string | null
          ip_address?: string | null
          last_name?: string | null
          notes?: string | null
          partner_name?: string | null
          phone?: string | null
          previously_insured?: string | null
          price_target?: string | null
          quote_number?: string | null
          renewal?: string | null
          submission_status?: string | null
          support_type?: string | null
          updated_at?: string
          user_agent?: string | null
          user_field?: string | null
        }
        Update: {
          attachments?: Json | null
          cc_email?: string | null
          channel?: string | null
          claim_description?: string | null
          contact_type?: string | null
          created_at?: string
          deal_id?: string | null
          email?: string | null
          enquiry_description?: string | null
          first_name?: string | null
          home_insurance_type?: string | null
          how_can?: string | null
          id?: string
          insurance_expiry?: string | null
          insurance_expiry_day?: string | null
          insurance_expiry_month?: string | null
          insurance_expiry_year?: string | null
          insurance_type?: string | null
          ip_address?: string | null
          last_name?: string | null
          notes?: string | null
          partner_name?: string | null
          phone?: string | null
          previously_insured?: string | null
          price_target?: string | null
          quote_number?: string | null
          renewal?: string | null
          submission_status?: string | null
          support_type?: string | null
          updated_at?: string
          user_agent?: string | null
          user_field?: string | null
        }
        Relationships: []
      }
      form2_submissions: {
        Row: {
          abn: string | null
          abn_duration: string | null
          add_more_vehicles: string | null
          address: string | null
          address_suncorp_validated: string | null
          age_received_license: string | null
          agreed_value: number | null
          all_drivers_2_years: string | null
          bankruptcy: string | null
          better_quote_calculated_price: string | null
          better_quote_evidence_url: string | null
          better_quote_target_insurer: string | null
          better_quote_target_price: string | null
          broker_terms_accepted: boolean | null
          business_usage_type: string | null
          cc_email: string | null
          claim_denied_fraud: string | null
          claims_count: string | null
          claims_list: Json | null
          claims_made: string | null
          company_name: string | null
          continuously_insured: string | null
          coverage_level: string | null
          created_at: string
          criminal_offences: string | null
          current_cover: string | null
          current_excess: string | null
          current_insurer: string | null
          current_premium: string | null
          customer_type: string | null
          days_per_week_work: string | null
          deal_id: string | null
          demerit_points: string | null
          dob_day: string | null
          dob_month: string | null
          dob_year: string | null
          domain_alias: string | null
          email: string | null
          excess_level: string | null
          exclude_under_25: string | null
          finance_company: string | null
          first_name: string | null
          first_owner: string | null
          food_delivery_hours: string | null
          form1_submission_id: string | null
          gender: string | null
          h_plate: string | null
          home_insurance_opt_in: boolean | null
          housing_status: string | null
          id: string
          insurance_declined: string | null
          international_license: string | null
          international_years: string | null
          ip_address: string | null
          is_delivery: boolean | null
          is_financed: string | null
          is_modified: string | null
          is_refrigerated: boolean | null
          is_rented: boolean | null
          is_rideshare: boolean | null
          is_vehicle_unregistered: boolean | null
          km_per_year: string | null
          last_name: string | null
          license_suspended: string | null
          license_type: string | null
          market_value: number | null
          modification_details: string | null
          nominated_drivers_list: Json | null
          owner_drives: string | null
          parking_address: string | null
          parking_location: string | null
          peak_times: string | null
          phone: string | null
          policy_extras: string | null
          policy_start_date: string | null
          previously_insured: string | null
          privacy_accepted: boolean | null
          purchase_type: string | null
          quote_type: string | null
          retail_value: number | null
          rideshare_delivery: string | null
          roadside_assistance: string | null
          security: string | null
          signature: string | null
          submission_status: string | null
          sum_insured_type: string | null
          trade_value: number | null
          undamaged_roadworthy: string | null
          updated_at: string
          user_agent: string | null
          user_field: string | null
          vehicle_body_style: string | null
          vehicle_description: string | null
          vehicle_identification_method: string | null
          vehicle_image_url: string | null
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_nvic: string | null
          vehicle_registration: string | null
          vehicle_series: string | null
          vehicle_state: string | null
          vehicle_transmission: string | null
          vehicle_usage: string | null
          vehicle_variant: string | null
          vehicle_year: string | null
          which_insurer: string | null
        }
        Insert: {
          abn?: string | null
          abn_duration?: string | null
          add_more_vehicles?: string | null
          address?: string | null
          address_suncorp_validated?: string | null
          age_received_license?: string | null
          agreed_value?: number | null
          all_drivers_2_years?: string | null
          bankruptcy?: string | null
          better_quote_calculated_price?: string | null
          better_quote_evidence_url?: string | null
          better_quote_target_insurer?: string | null
          better_quote_target_price?: string | null
          broker_terms_accepted?: boolean | null
          business_usage_type?: string | null
          cc_email?: string | null
          claim_denied_fraud?: string | null
          claims_count?: string | null
          claims_list?: Json | null
          claims_made?: string | null
          company_name?: string | null
          continuously_insured?: string | null
          coverage_level?: string | null
          created_at?: string
          criminal_offences?: string | null
          current_cover?: string | null
          current_excess?: string | null
          current_insurer?: string | null
          current_premium?: string | null
          customer_type?: string | null
          days_per_week_work?: string | null
          deal_id?: string | null
          demerit_points?: string | null
          dob_day?: string | null
          dob_month?: string | null
          dob_year?: string | null
          domain_alias?: string | null
          email?: string | null
          excess_level?: string | null
          exclude_under_25?: string | null
          finance_company?: string | null
          first_name?: string | null
          first_owner?: string | null
          food_delivery_hours?: string | null
          form1_submission_id?: string | null
          gender?: string | null
          h_plate?: string | null
          home_insurance_opt_in?: boolean | null
          housing_status?: string | null
          id?: string
          insurance_declined?: string | null
          international_license?: string | null
          international_years?: string | null
          ip_address?: string | null
          is_delivery?: boolean | null
          is_financed?: string | null
          is_modified?: string | null
          is_refrigerated?: boolean | null
          is_rented?: boolean | null
          is_rideshare?: boolean | null
          is_vehicle_unregistered?: boolean | null
          km_per_year?: string | null
          last_name?: string | null
          license_suspended?: string | null
          license_type?: string | null
          market_value?: number | null
          modification_details?: string | null
          nominated_drivers_list?: Json | null
          owner_drives?: string | null
          parking_address?: string | null
          parking_location?: string | null
          peak_times?: string | null
          phone?: string | null
          policy_extras?: string | null
          policy_start_date?: string | null
          previously_insured?: string | null
          privacy_accepted?: boolean | null
          purchase_type?: string | null
          quote_type?: string | null
          retail_value?: number | null
          rideshare_delivery?: string | null
          roadside_assistance?: string | null
          security?: string | null
          signature?: string | null
          submission_status?: string | null
          sum_insured_type?: string | null
          trade_value?: number | null
          undamaged_roadworthy?: string | null
          updated_at?: string
          user_agent?: string | null
          user_field?: string | null
          vehicle_body_style?: string | null
          vehicle_description?: string | null
          vehicle_identification_method?: string | null
          vehicle_image_url?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_nvic?: string | null
          vehicle_registration?: string | null
          vehicle_series?: string | null
          vehicle_state?: string | null
          vehicle_transmission?: string | null
          vehicle_usage?: string | null
          vehicle_variant?: string | null
          vehicle_year?: string | null
          which_insurer?: string | null
        }
        Update: {
          abn?: string | null
          abn_duration?: string | null
          add_more_vehicles?: string | null
          address?: string | null
          address_suncorp_validated?: string | null
          age_received_license?: string | null
          agreed_value?: number | null
          all_drivers_2_years?: string | null
          bankruptcy?: string | null
          better_quote_calculated_price?: string | null
          better_quote_evidence_url?: string | null
          better_quote_target_insurer?: string | null
          better_quote_target_price?: string | null
          broker_terms_accepted?: boolean | null
          business_usage_type?: string | null
          cc_email?: string | null
          claim_denied_fraud?: string | null
          claims_count?: string | null
          claims_list?: Json | null
          claims_made?: string | null
          company_name?: string | null
          continuously_insured?: string | null
          coverage_level?: string | null
          created_at?: string
          criminal_offences?: string | null
          current_cover?: string | null
          current_excess?: string | null
          current_insurer?: string | null
          current_premium?: string | null
          customer_type?: string | null
          days_per_week_work?: string | null
          deal_id?: string | null
          demerit_points?: string | null
          dob_day?: string | null
          dob_month?: string | null
          dob_year?: string | null
          domain_alias?: string | null
          email?: string | null
          excess_level?: string | null
          exclude_under_25?: string | null
          finance_company?: string | null
          first_name?: string | null
          first_owner?: string | null
          food_delivery_hours?: string | null
          form1_submission_id?: string | null
          gender?: string | null
          h_plate?: string | null
          home_insurance_opt_in?: boolean | null
          housing_status?: string | null
          id?: string
          insurance_declined?: string | null
          international_license?: string | null
          international_years?: string | null
          ip_address?: string | null
          is_delivery?: boolean | null
          is_financed?: string | null
          is_modified?: string | null
          is_refrigerated?: boolean | null
          is_rented?: boolean | null
          is_rideshare?: boolean | null
          is_vehicle_unregistered?: boolean | null
          km_per_year?: string | null
          last_name?: string | null
          license_suspended?: string | null
          license_type?: string | null
          market_value?: number | null
          modification_details?: string | null
          nominated_drivers_list?: Json | null
          owner_drives?: string | null
          parking_address?: string | null
          parking_location?: string | null
          peak_times?: string | null
          phone?: string | null
          policy_extras?: string | null
          policy_start_date?: string | null
          previously_insured?: string | null
          privacy_accepted?: boolean | null
          purchase_type?: string | null
          quote_type?: string | null
          retail_value?: number | null
          rideshare_delivery?: string | null
          roadside_assistance?: string | null
          security?: string | null
          signature?: string | null
          submission_status?: string | null
          sum_insured_type?: string | null
          trade_value?: number | null
          undamaged_roadworthy?: string | null
          updated_at?: string
          user_agent?: string | null
          user_field?: string | null
          vehicle_body_style?: string | null
          vehicle_description?: string | null
          vehicle_identification_method?: string | null
          vehicle_image_url?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_nvic?: string | null
          vehicle_registration?: string | null
          vehicle_series?: string | null
          vehicle_state?: string | null
          vehicle_transmission?: string | null
          vehicle_usage?: string | null
          vehicle_variant?: string | null
          vehicle_year?: string | null
          which_insurer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form2_submissions_form1_submission_id_fkey"
            columns: ["form1_submission_id"]
            isOneToOne: false
            referencedRelation: "form1_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      form3_submissions: {
        Row: {
          additional_vehicles: string | null
          age_restriction: string | null
          agreed_value: number | null
          base_premium: number | null
          broker_fee_total: number | null
          brokerage_fee: number | null
          created_at: string
          customer_excess: number | null
          deal_id: string | null
          difference_monthly_to_yearly: number | null
          excess_cashback: number | null
          fire_levy: number | null
          form2_excess_level: string | null
          form2_submission_id: string | null
          gst: number | null
          id: string
          insurance_type: string | null
          insurer_quotation_url: string | null
          insurer_reference: string | null
          insurer_total: number | null
          ip_address: string | null
          named_drivers: Json | null
          overseas_licences: string | null
          policy_coverage: string | null
          policy_description: string | null
          policy_extras: Json | null
          policy_start_date: string | null
          policy_type: string | null
          processing_fee: number | null
          product: string | null
          quote_agent: string | null
          stamp_duty: number | null
          standard_excess: number | null
          submission_status: string | null
          total_annual_premium: number | null
          total_monthly_premium: number | null
          updated_at: string
          user_agent: string | null
          uw_base_premium: number | null
          uw_fire_levy: number | null
          uw_gst: number | null
          uw_levy: number | null
          uw_name: string | null
          uw_quote_number: string | null
          uw_stamp_duty: number | null
          uw_total_premium: number | null
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_rego: string | null
          vehicle_value: number | null
          vehicle_year: string | null
        }
        Insert: {
          additional_vehicles?: string | null
          age_restriction?: string | null
          agreed_value?: number | null
          base_premium?: number | null
          broker_fee_total?: number | null
          brokerage_fee?: number | null
          created_at?: string
          customer_excess?: number | null
          deal_id?: string | null
          difference_monthly_to_yearly?: number | null
          excess_cashback?: number | null
          fire_levy?: number | null
          form2_excess_level?: string | null
          form2_submission_id?: string | null
          gst?: number | null
          id?: string
          insurance_type?: string | null
          insurer_quotation_url?: string | null
          insurer_reference?: string | null
          insurer_total?: number | null
          ip_address?: string | null
          named_drivers?: Json | null
          overseas_licences?: string | null
          policy_coverage?: string | null
          policy_description?: string | null
          policy_extras?: Json | null
          policy_start_date?: string | null
          policy_type?: string | null
          processing_fee?: number | null
          product?: string | null
          quote_agent?: string | null
          stamp_duty?: number | null
          standard_excess?: number | null
          submission_status?: string | null
          total_annual_premium?: number | null
          total_monthly_premium?: number | null
          updated_at?: string
          user_agent?: string | null
          uw_base_premium?: number | null
          uw_fire_levy?: number | null
          uw_gst?: number | null
          uw_levy?: number | null
          uw_name?: string | null
          uw_quote_number?: string | null
          uw_stamp_duty?: number | null
          uw_total_premium?: number | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_rego?: string | null
          vehicle_value?: number | null
          vehicle_year?: string | null
        }
        Update: {
          additional_vehicles?: string | null
          age_restriction?: string | null
          agreed_value?: number | null
          base_premium?: number | null
          broker_fee_total?: number | null
          brokerage_fee?: number | null
          created_at?: string
          customer_excess?: number | null
          deal_id?: string | null
          difference_monthly_to_yearly?: number | null
          excess_cashback?: number | null
          fire_levy?: number | null
          form2_excess_level?: string | null
          form2_submission_id?: string | null
          gst?: number | null
          id?: string
          insurance_type?: string | null
          insurer_quotation_url?: string | null
          insurer_reference?: string | null
          insurer_total?: number | null
          ip_address?: string | null
          named_drivers?: Json | null
          overseas_licences?: string | null
          policy_coverage?: string | null
          policy_description?: string | null
          policy_extras?: Json | null
          policy_start_date?: string | null
          policy_type?: string | null
          processing_fee?: number | null
          product?: string | null
          quote_agent?: string | null
          stamp_duty?: number | null
          standard_excess?: number | null
          submission_status?: string | null
          total_annual_premium?: number | null
          total_monthly_premium?: number | null
          updated_at?: string
          user_agent?: string | null
          uw_base_premium?: number | null
          uw_fire_levy?: number | null
          uw_gst?: number | null
          uw_levy?: number | null
          uw_name?: string | null
          uw_quote_number?: string | null
          uw_stamp_duty?: number | null
          uw_total_premium?: number | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_rego?: string | null
          vehicle_value?: number | null
          vehicle_year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form3_submissions_form2_submission_id_fkey"
            columns: ["form2_submission_id"]
            isOneToOne: false
            referencedRelation: "form2_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      form4_submissions: {
        Row: {
          additional_vehicles: string | null
          change_request_category: string | null
          change_request_text: string | null
          confirmation_choice: string | null
          created_at: string
          customer_email: string | null
          customer_excess: number | null
          customer_first_name: string | null
          customer_last_name: string | null
          customer_phone: string | null
          deal_id: string | null
          details_confirmed: boolean | null
          form3_submission_id: string | null
          id: string
          insurance_type: string | null
          ip_address: string | null
          payment_method: string | null
          policy_coverage: string | null
          policy_start_date: string | null
          policy_type: string | null
          standard_excess: number | null
          submission_status: string | null
          terms_accepted: boolean | null
          total_annual_premium: number | null
          total_monthly_premium: number | null
          underwriter: string | null
          updated_at: string
          user_agent: string | null
          vehicle_image_url: string | null
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_rego: string | null
          vehicle_state: string | null
          vehicle_usage: string | null
          vehicle_value: number | null
          vehicle_year: string | null
        }
        Insert: {
          additional_vehicles?: string | null
          change_request_category?: string | null
          change_request_text?: string | null
          confirmation_choice?: string | null
          created_at?: string
          customer_email?: string | null
          customer_excess?: number | null
          customer_first_name?: string | null
          customer_last_name?: string | null
          customer_phone?: string | null
          deal_id?: string | null
          details_confirmed?: boolean | null
          form3_submission_id?: string | null
          id?: string
          insurance_type?: string | null
          ip_address?: string | null
          payment_method?: string | null
          policy_coverage?: string | null
          policy_start_date?: string | null
          policy_type?: string | null
          standard_excess?: number | null
          submission_status?: string | null
          terms_accepted?: boolean | null
          total_annual_premium?: number | null
          total_monthly_premium?: number | null
          underwriter?: string | null
          updated_at?: string
          user_agent?: string | null
          vehicle_image_url?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_rego?: string | null
          vehicle_state?: string | null
          vehicle_usage?: string | null
          vehicle_value?: number | null
          vehicle_year?: string | null
        }
        Update: {
          additional_vehicles?: string | null
          change_request_category?: string | null
          change_request_text?: string | null
          confirmation_choice?: string | null
          created_at?: string
          customer_email?: string | null
          customer_excess?: number | null
          customer_first_name?: string | null
          customer_last_name?: string | null
          customer_phone?: string | null
          deal_id?: string | null
          details_confirmed?: boolean | null
          form3_submission_id?: string | null
          id?: string
          insurance_type?: string | null
          ip_address?: string | null
          payment_method?: string | null
          policy_coverage?: string | null
          policy_start_date?: string | null
          policy_type?: string | null
          standard_excess?: number | null
          submission_status?: string | null
          terms_accepted?: boolean | null
          total_annual_premium?: number | null
          total_monthly_premium?: number | null
          underwriter?: string | null
          updated_at?: string
          user_agent?: string | null
          vehicle_image_url?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_rego?: string | null
          vehicle_state?: string | null
          vehicle_usage?: string | null
          vehicle_value?: number | null
          vehicle_year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form4_submissions_form3_submission_id_fkey"
            columns: ["form3_submission_id"]
            isOneToOne: false
            referencedRelation: "form3_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_pricing_data: {
        Row: {
          created_at: string
          full_address: string
          id: string
          index_value: string | null
          postcode: string
          state: string
          street: string | null
          suburb: string | null
        }
        Insert: {
          created_at?: string
          full_address: string
          id?: string
          index_value?: string | null
          postcode: string
          state: string
          street?: string | null
          suburb?: string | null
        }
        Update: {
          created_at?: string
          full_address?: string
          id?: string
          index_value?: string | null
          postcode?: string
          state?: string
          street?: string | null
          suburb?: string | null
        }
        Relationships: []
      }
      manual_quote_requests: {
        Row: {
          additional_vehicle_info: string | null
          admin_notes: string | null
          assigned_to: string | null
          completed_at: string | null
          contacted_at: string | null
          created_at: string | null
          customer_email: string
          customer_first_name: string
          customer_last_name: string
          customer_phone: string | null
          error_message: string | null
          id: string
          registration_number: string
          request_notes: string | null
          state_of_registration: string
          status: string
          updated_at: string | null
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_year: number | null
          vin_number: string | null
        }
        Insert: {
          additional_vehicle_info?: string | null
          admin_notes?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          contacted_at?: string | null
          created_at?: string | null
          customer_email: string
          customer_first_name: string
          customer_last_name: string
          customer_phone?: string | null
          error_message?: string | null
          id?: string
          registration_number: string
          request_notes?: string | null
          state_of_registration: string
          status?: string
          updated_at?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_year?: number | null
          vin_number?: string | null
        }
        Update: {
          additional_vehicle_info?: string | null
          admin_notes?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          contacted_at?: string | null
          created_at?: string | null
          customer_email?: string
          customer_first_name?: string
          customer_last_name?: string
          customer_phone?: string | null
          error_message?: string | null
          id?: string
          registration_number?: string
          request_notes?: string | null
          state_of_registration?: string
          status?: string
          updated_at?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_year?: number | null
          vin_number?: string | null
        }
        Relationships: []
      }
      memberships: {
        Row: {
          base_premium: number | null
          coverage_level: string | null
          created_at: string
          deal_id: string | null
          form1_submission_id: string | null
          form2_submission_id: string | null
          form3_submission_id: string | null
          id: string
          member_address: string | null
          member_dob: string | null
          member_email: string | null
          member_first_name: string
          member_last_name: string
          member_phone: string | null
          membership_end_date: string
          membership_number: string
          membership_start_date: string
          quote_number: string | null
          status: string
          total_annual_premium: number | null
          total_monthly_premium: number | null
          updated_at: string
          vehicle_description: string | null
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_registration: string | null
          vehicle_year: string | null
        }
        Insert: {
          base_premium?: number | null
          coverage_level?: string | null
          created_at?: string
          deal_id?: string | null
          form1_submission_id?: string | null
          form2_submission_id?: string | null
          form3_submission_id?: string | null
          id?: string
          member_address?: string | null
          member_dob?: string | null
          member_email?: string | null
          member_first_name: string
          member_last_name: string
          member_phone?: string | null
          membership_end_date: string
          membership_number: string
          membership_start_date: string
          quote_number?: string | null
          status?: string
          total_annual_premium?: number | null
          total_monthly_premium?: number | null
          updated_at?: string
          vehicle_description?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_registration?: string | null
          vehicle_year?: string | null
        }
        Update: {
          base_premium?: number | null
          coverage_level?: string | null
          created_at?: string
          deal_id?: string | null
          form1_submission_id?: string | null
          form2_submission_id?: string | null
          form3_submission_id?: string | null
          id?: string
          member_address?: string | null
          member_dob?: string | null
          member_email?: string | null
          member_first_name?: string
          member_last_name?: string
          member_phone?: string | null
          membership_end_date?: string
          membership_number?: string
          membership_start_date?: string
          quote_number?: string | null
          status?: string
          total_annual_premium?: number | null
          total_monthly_premium?: number | null
          updated_at?: string
          vehicle_description?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_registration?: string | null
          vehicle_year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memberships_form1_submission_id_fkey"
            columns: ["form1_submission_id"]
            isOneToOne: false
            referencedRelation: "form1_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_form2_submission_id_fkey"
            columns: ["form2_submission_id"]
            isOneToOne: false
            referencedRelation: "form2_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_form3_submission_id_fkey"
            columns: ["form3_submission_id"]
            isOneToOne: false
            referencedRelation: "form3_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      mutual_quotes: {
        Row: {
          comp_benchmark_price: number | null
          comp_total_annual: number | null
          created_at: string
          deal_id: string
          id: string
          mutual_membership_price: number | null
          mutual_target_price: number | null
          tppd_status: string | null
          tppd_winning_insurer: string | null
          tppd_winning_premium: number | null
          tppd_winning_quote_ref: string | null
          updated_at: string
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_state: string | null
          vehicle_value: number | null
          vehicle_year: string | null
        }
        Insert: {
          comp_benchmark_price?: number | null
          comp_total_annual?: number | null
          created_at?: string
          deal_id: string
          id?: string
          mutual_membership_price?: number | null
          mutual_target_price?: number | null
          tppd_status?: string | null
          tppd_winning_insurer?: string | null
          tppd_winning_premium?: number | null
          tppd_winning_quote_ref?: string | null
          updated_at?: string
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_state?: string | null
          vehicle_value?: number | null
          vehicle_year?: string | null
        }
        Update: {
          comp_benchmark_price?: number | null
          comp_total_annual?: number | null
          created_at?: string
          deal_id?: string
          id?: string
          mutual_membership_price?: number | null
          mutual_target_price?: number | null
          tppd_status?: string | null
          tppd_winning_insurer?: string | null
          tppd_winning_premium?: number | null
          tppd_winning_quote_ref?: string | null
          updated_at?: string
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_state?: string | null
          vehicle_value?: number | null
          vehicle_year?: string | null
        }
        Relationships: []
      }
      named_drivers: {
        Row: {
          address_latitude: string | null
          address_line1: string | null
          address_longitude: string | null
          address_lurn: string | null
          address_postcode: string | null
          address_state: string | null
          address_street_name: string | null
          address_street_number: string | null
          address_street_type: string | null
          address_suburb: string | null
          address_unit_number: string | null
          address_unit_type: string | null
          claims_count: number
          created_at: string
          date_of_birth: string | null
          driver_name: string | null
          first_name: string | null
          gender: string | null
          id: string
          last_name: string | null
          quote_id: string
        }
        Insert: {
          address_latitude?: string | null
          address_line1?: string | null
          address_longitude?: string | null
          address_lurn?: string | null
          address_postcode?: string | null
          address_state?: string | null
          address_street_name?: string | null
          address_street_number?: string | null
          address_street_type?: string | null
          address_suburb?: string | null
          address_unit_number?: string | null
          address_unit_type?: string | null
          claims_count?: number
          created_at?: string
          date_of_birth?: string | null
          driver_name?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          quote_id: string
        }
        Update: {
          address_latitude?: string | null
          address_line1?: string | null
          address_longitude?: string | null
          address_lurn?: string | null
          address_postcode?: string | null
          address_state?: string | null
          address_street_name?: string | null
          address_street_number?: string | null
          address_street_type?: string | null
          address_suburb?: string | null
          address_unit_number?: string | null
          address_unit_type?: string | null
          claims_count?: number
          created_at?: string
          date_of_birth?: string | null
          driver_name?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          quote_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "named_drivers_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      policies: {
        Row: {
          created_at: string
          customer_id: string
          end_date: string
          id: string
          policy_number: string
          premium_amount: number
          quote_id: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          end_date: string
          id?: string
          policy_number: string
          premium_amount: number
          quote_id: string
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          end_date?: string
          id?: string
          policy_number?: string
          premium_amount?: number
          quote_id?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "policies_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policies_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: true
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_schemes: {
        Row: {
          ceiling_point: number
          ceiling_price: number
          created_at: string
          floor_point: number
          floor_price: number
          id: string
          is_active: boolean
          scheme_number: number
          updated_at: string
          valid_from: string
          valid_until: string | null
        }
        Insert: {
          ceiling_point: number
          ceiling_price: number
          created_at?: string
          floor_point: number
          floor_price: number
          id?: string
          is_active?: boolean
          scheme_number: number
          updated_at?: string
          valid_from?: string
          valid_until?: string | null
        }
        Update: {
          ceiling_point?: number
          ceiling_price?: number
          created_at?: string
          floor_point?: number
          floor_price?: number
          id?: string
          is_active?: boolean
          scheme_number?: number
          updated_at?: string
          valid_from?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      product_disclosure_statements: {
        Row: {
          conditions: Json | null
          coverage_details: Json | null
          created_at: string | null
          effective_from: string
          effective_until: string | null
          exclusions: Json | null
          faq: Json | null
          full_content: Json
          id: string
          is_active: boolean | null
          key_benefits: Json | null
          pdf_file_name: string
          pdf_file_path: string
          pdf_file_size: number
          summary: string | null
          updated_at: string | null
          uploaded_by: string | null
          version_number: string
        }
        Insert: {
          conditions?: Json | null
          coverage_details?: Json | null
          created_at?: string | null
          effective_from: string
          effective_until?: string | null
          exclusions?: Json | null
          faq?: Json | null
          full_content: Json
          id?: string
          is_active?: boolean | null
          key_benefits?: Json | null
          pdf_file_name: string
          pdf_file_path: string
          pdf_file_size: number
          summary?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          version_number: string
        }
        Update: {
          conditions?: Json | null
          coverage_details?: Json | null
          created_at?: string | null
          effective_from?: string
          effective_until?: string | null
          exclusions?: Json | null
          faq?: Json | null
          full_content?: Json
          id?: string
          is_active?: boolean | null
          key_benefits?: Json | null
          pdf_file_name?: string
          pdf_file_path?: string
          pdf_file_size?: number
          summary?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          version_number?: string
        }
        Relationships: []
      }
      quote_vehicles: {
        Row: {
          base_price: number
          created_at: string
          id: string
          quote_id: string
          registration_number: string
          retail_price: number | null
          selected_coverage_value: number
          state_of_registration: string | null
          trade_low_price: number | null
          vehicle_body_style: string | null
          vehicle_desc1: string | null
          vehicle_desc2: string | null
          vehicle_fuel_type: string | null
          vehicle_image_url: string | null
          vehicle_make: string
          vehicle_model: string
          vehicle_nvic: string | null
          vehicle_series: string | null
          vehicle_transmission: string | null
          vehicle_value: number
          vehicle_variant: string | null
          vehicle_year: number
        }
        Insert: {
          base_price: number
          created_at?: string
          id?: string
          quote_id: string
          registration_number: string
          retail_price?: number | null
          selected_coverage_value: number
          state_of_registration?: string | null
          trade_low_price?: number | null
          vehicle_body_style?: string | null
          vehicle_desc1?: string | null
          vehicle_desc2?: string | null
          vehicle_fuel_type?: string | null
          vehicle_image_url?: string | null
          vehicle_make: string
          vehicle_model: string
          vehicle_nvic?: string | null
          vehicle_series?: string | null
          vehicle_transmission?: string | null
          vehicle_value: number
          vehicle_variant?: string | null
          vehicle_year: number
        }
        Update: {
          base_price?: number
          created_at?: string
          id?: string
          quote_id?: string
          registration_number?: string
          retail_price?: number | null
          selected_coverage_value?: number
          state_of_registration?: string | null
          trade_low_price?: number | null
          vehicle_body_style?: string | null
          vehicle_desc1?: string | null
          vehicle_desc2?: string | null
          vehicle_fuel_type?: string | null
          vehicle_image_url?: string | null
          vehicle_make?: string
          vehicle_model?: string
          vehicle_nvic?: string | null
          vehicle_series?: string | null
          vehicle_transmission?: string | null
          vehicle_value?: number
          vehicle_variant?: string | null
          vehicle_year?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_vehicles_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          address_gnaf_data: Json | null
          claim_loading_percentage: number | null
          created_at: string
          customer_id: string
          expires_at: string
          id: string
          membership_price: number
          pricing_scheme_id: string | null
          quote_number: string | null
          quote_reference: string
          registration_number: string
          status: string
          third_party_api_request_payload: Json | null
          third_party_api_response_data: Json | null
          third_party_base_premium: number | null
          third_party_gst: number | null
          third_party_quote_number: string | null
          third_party_stamp_duty: number | null
          third_party_total_premium: number | null
          total_base_price: number | null
          total_final_price: number | null
          vehicle_make: string
          vehicle_model: string
          vehicle_nvic: string | null
          vehicle_value: number
          vehicle_year: number
        }
        Insert: {
          address_gnaf_data?: Json | null
          claim_loading_percentage?: number | null
          created_at?: string
          customer_id: string
          expires_at?: string
          id?: string
          membership_price: number
          pricing_scheme_id?: string | null
          quote_number?: string | null
          quote_reference: string
          registration_number: string
          status?: string
          third_party_api_request_payload?: Json | null
          third_party_api_response_data?: Json | null
          third_party_base_premium?: number | null
          third_party_gst?: number | null
          third_party_quote_number?: string | null
          third_party_stamp_duty?: number | null
          third_party_total_premium?: number | null
          total_base_price?: number | null
          total_final_price?: number | null
          vehicle_make: string
          vehicle_model: string
          vehicle_nvic?: string | null
          vehicle_value: number
          vehicle_year: number
        }
        Update: {
          address_gnaf_data?: Json | null
          claim_loading_percentage?: number | null
          created_at?: string
          customer_id?: string
          expires_at?: string
          id?: string
          membership_price?: number
          pricing_scheme_id?: string | null
          quote_number?: string | null
          quote_reference?: string
          registration_number?: string
          status?: string
          third_party_api_request_payload?: Json | null
          third_party_api_response_data?: Json | null
          third_party_base_premium?: number | null
          third_party_gst?: number | null
          third_party_quote_number?: string | null
          third_party_stamp_duty?: number | null
          third_party_total_premium?: number | null
          total_base_price?: number | null
          total_final_price?: number | null
          vehicle_make?: string
          vehicle_model?: string
          vehicle_nvic?: string | null
          vehicle_value?: number
          vehicle_year?: number
        }
        Relationships: [
          {
            foreignKeyName: "quotes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_pricing_scheme_id_fkey"
            columns: ["pricing_scheme_id"]
            isOneToOne: false
            referencedRelation: "pricing_schemes"
            referencedColumns: ["id"]
          },
        ]
      }
      sample_vehicle_quotes: {
        Row: {
          api_response_data: Json | null
          calculated_membership_price: number | null
          created_at: string
          error_message: string | null
          id: string
          image_exists: boolean | null
          market_value: number | null
          pricing_scheme_id: string | null
          pricing_scheme_number: number | null
          processed_at: string | null
          processing_status: string | null
          registration_number: string
          retail_price: number | null
          state: string
          trade_low_price: number | null
          trade_price: number | null
          updated_at: string
          vehicle_body_style: string | null
          vehicle_desc1: string | null
          vehicle_desc2: string | null
          vehicle_fuel_type: string | null
          vehicle_image_url: string | null
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_nvic: string | null
          vehicle_series: string | null
          vehicle_transmission: string | null
          vehicle_variant: string | null
          vehicle_year: number | null
        }
        Insert: {
          api_response_data?: Json | null
          calculated_membership_price?: number | null
          created_at?: string
          error_message?: string | null
          id?: string
          image_exists?: boolean | null
          market_value?: number | null
          pricing_scheme_id?: string | null
          pricing_scheme_number?: number | null
          processed_at?: string | null
          processing_status?: string | null
          registration_number: string
          retail_price?: number | null
          state: string
          trade_low_price?: number | null
          trade_price?: number | null
          updated_at?: string
          vehicle_body_style?: string | null
          vehicle_desc1?: string | null
          vehicle_desc2?: string | null
          vehicle_fuel_type?: string | null
          vehicle_image_url?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_nvic?: string | null
          vehicle_series?: string | null
          vehicle_transmission?: string | null
          vehicle_variant?: string | null
          vehicle_year?: number | null
        }
        Update: {
          api_response_data?: Json | null
          calculated_membership_price?: number | null
          created_at?: string
          error_message?: string | null
          id?: string
          image_exists?: boolean | null
          market_value?: number | null
          pricing_scheme_id?: string | null
          pricing_scheme_number?: number | null
          processed_at?: string | null
          processing_status?: string | null
          registration_number?: string
          retail_price?: number | null
          state?: string
          trade_low_price?: number | null
          trade_price?: number | null
          updated_at?: string
          vehicle_body_style?: string | null
          vehicle_desc1?: string | null
          vehicle_desc2?: string | null
          vehicle_fuel_type?: string | null
          vehicle_image_url?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_nvic?: string | null
          vehicle_series?: string | null
          vehicle_transmission?: string | null
          vehicle_variant?: string | null
          vehicle_year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sample_vehicle_quotes_pricing_scheme_id_fkey"
            columns: ["pricing_scheme_id"]
            isOneToOne: false
            referencedRelation: "pricing_schemes"
            referencedColumns: ["id"]
          },
        ]
      }
      suncorp_quote_details: {
        Row: {
          annual_base_premium: number | null
          annual_fsl: number | null
          annual_gst: number | null
          annual_premium: number | null
          annual_stamp_duty: number | null
          cover_type: string | null
          created_at: string
          has_criminal_history: boolean | null
          has_fire_and_theft: boolean | null
          has_rejected_insurance_or_claims: boolean | null
          id: string
          km_per_year: string | null
          market_value: number | null
          policy_expiry_date: string | null
          policy_start_date: string | null
          postcode: string | null
          primary_usage: string | null
          quote_create_date: string | null
          quote_id: string
          standard_excess: number | null
          state: string | null
          street_name: string | null
          street_number: string | null
          suburb: string | null
          sum_insured_type: string | null
          suncorp_quote_number: string | null
          updated_at: string
        }
        Insert: {
          annual_base_premium?: number | null
          annual_fsl?: number | null
          annual_gst?: number | null
          annual_premium?: number | null
          annual_stamp_duty?: number | null
          cover_type?: string | null
          created_at?: string
          has_criminal_history?: boolean | null
          has_fire_and_theft?: boolean | null
          has_rejected_insurance_or_claims?: boolean | null
          id?: string
          km_per_year?: string | null
          market_value?: number | null
          policy_expiry_date?: string | null
          policy_start_date?: string | null
          postcode?: string | null
          primary_usage?: string | null
          quote_create_date?: string | null
          quote_id: string
          standard_excess?: number | null
          state?: string | null
          street_name?: string | null
          street_number?: string | null
          suburb?: string | null
          sum_insured_type?: string | null
          suncorp_quote_number?: string | null
          updated_at?: string
        }
        Update: {
          annual_base_premium?: number | null
          annual_fsl?: number | null
          annual_gst?: number | null
          annual_premium?: number | null
          annual_stamp_duty?: number | null
          cover_type?: string | null
          created_at?: string
          has_criminal_history?: boolean | null
          has_fire_and_theft?: boolean | null
          has_rejected_insurance_or_claims?: boolean | null
          id?: string
          km_per_year?: string | null
          market_value?: number | null
          policy_expiry_date?: string | null
          policy_start_date?: string | null
          postcode?: string | null
          primary_usage?: string | null
          quote_create_date?: string | null
          quote_id?: string
          standard_excess?: number | null
          state?: string | null
          street_name?: string | null
          street_number?: string | null
          suburb?: string | null
          sum_insured_type?: string | null
          suncorp_quote_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "suncorp_quote_details_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: true
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      third_party_quotes: {
        Row: {
          agreed_value: number | null
          api_request_payload: Json | null
          api_response_data: Json | null
          base_premium: number
          cover_type: string
          created_at: string
          current_insurer: string
          date_of_birth: string
          gender: string
          gst: number
          id: string
          ip_address: string | null
          km_per_year: string
          market_value: number | null
          policy_start_date: string
          primary_usage: string
          quote_number: string
          quote_reference: string
          registration_number: string
          registration_state: string
          risk_address_latitude: string | null
          risk_address_longitude: string | null
          risk_address_lurn: string
          risk_address_postcode: string
          risk_address_state: string
          risk_address_street_name: string
          risk_address_street_number: string
          risk_address_street_type: string
          risk_address_suburb: string
          risk_address_unit_number: string | null
          risk_address_unit_type: string | null
          stamp_duty: number
          sum_insured_type: string
          total_premium: number
          updated_at: string
          user_agent: string | null
          vehicle_body_style: string | null
          vehicle_drive_type: string | null
          vehicle_engine_size: string | null
          vehicle_family: string
          vehicle_make: string
          vehicle_nvic: string
          vehicle_transmission: string | null
          vehicle_variant: string
          vehicle_year: string
        }
        Insert: {
          agreed_value?: number | null
          api_request_payload?: Json | null
          api_response_data?: Json | null
          base_premium: number
          cover_type?: string
          created_at?: string
          current_insurer: string
          date_of_birth: string
          gender: string
          gst: number
          id?: string
          ip_address?: string | null
          km_per_year: string
          market_value?: number | null
          policy_start_date: string
          primary_usage: string
          quote_number: string
          quote_reference: string
          registration_number: string
          registration_state: string
          risk_address_latitude?: string | null
          risk_address_longitude?: string | null
          risk_address_lurn: string
          risk_address_postcode: string
          risk_address_state: string
          risk_address_street_name: string
          risk_address_street_number: string
          risk_address_street_type: string
          risk_address_suburb: string
          risk_address_unit_number?: string | null
          risk_address_unit_type?: string | null
          stamp_duty: number
          sum_insured_type: string
          total_premium: number
          updated_at?: string
          user_agent?: string | null
          vehicle_body_style?: string | null
          vehicle_drive_type?: string | null
          vehicle_engine_size?: string | null
          vehicle_family: string
          vehicle_make: string
          vehicle_nvic: string
          vehicle_transmission?: string | null
          vehicle_variant: string
          vehicle_year: string
        }
        Update: {
          agreed_value?: number | null
          api_request_payload?: Json | null
          api_response_data?: Json | null
          base_premium?: number
          cover_type?: string
          created_at?: string
          current_insurer?: string
          date_of_birth?: string
          gender?: string
          gst?: number
          id?: string
          ip_address?: string | null
          km_per_year?: string
          market_value?: number | null
          policy_start_date?: string
          primary_usage?: string
          quote_number?: string
          quote_reference?: string
          registration_number?: string
          registration_state?: string
          risk_address_latitude?: string | null
          risk_address_longitude?: string | null
          risk_address_lurn?: string
          risk_address_postcode?: string
          risk_address_state?: string
          risk_address_street_name?: string
          risk_address_street_number?: string
          risk_address_street_type?: string
          risk_address_suburb?: string
          risk_address_unit_number?: string | null
          risk_address_unit_type?: string | null
          stamp_duty?: number
          sum_insured_type?: string
          total_premium?: number
          updated_at?: string
          user_agent?: string | null
          vehicle_body_style?: string | null
          vehicle_drive_type?: string | null
          vehicle_engine_size?: string | null
          vehicle_family?: string
          vehicle_make?: string
          vehicle_nvic?: string
          vehicle_transmission?: string | null
          vehicle_variant?: string
          vehicle_year?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_membership_number: { Args: never; Returns: string }
      generate_quote_number: { Args: never; Returns: string }
      get_active_pds: {
        Args: never
        Returns: {
          conditions: Json | null
          coverage_details: Json | null
          created_at: string | null
          effective_from: string
          effective_until: string | null
          exclusions: Json | null
          faq: Json | null
          full_content: Json
          id: string
          is_active: boolean | null
          key_benefits: Json | null
          pdf_file_name: string
          pdf_file_path: string
          pdf_file_size: number
          summary: string | null
          updated_at: string | null
          uploaded_by: string | null
          version_number: string
        }[]
        SetofOptions: {
          from: "*"
          to: "product_disclosure_statements"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_postcode_pricing_analysis: {
        Args: never
        Returns: {
          avg_index: number
          location_count: number
          max_index: number
          min_index: number
          postcode: string
          state: string
        }[]
      }
      get_pricing_summary_stats: {
        Args: never
        Returns: {
          avg_index: number
          max_index: number
          median_index: number
          min_index: number
          std_dev: number
          total_locations: number
        }[]
      }
      get_state_pricing_analysis: {
        Args: never
        Returns: {
          avg_index: number
          location_count: number
          max_index: number
          min_index: number
          state: string
          suburb_count: number
        }[]
      }
      get_state_suburbs: {
        Args: { state_filter: string }
        Returns: {
          avg_index: number
          location_count: number
          max_index: number
          min_index: number
          postcode: string
          suburb: string
        }[]
      }
      get_suburb_pricing_analysis: {
        Args: never
        Returns: {
          avg_index: number
          location_count: number
          max_index: number
          min_index: number
          postcode: string
          state: string
          suburb: string
        }[]
      }
      get_suburb_pricing_analysis_paginated: {
        Args: { limit_rows?: number; offset_rows?: number }
        Returns: {
          avg_index: number
          location_count: number
          max_index: number
          min_index: number
          postcode: string
          state: string
          suburb: string
          total_count: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
