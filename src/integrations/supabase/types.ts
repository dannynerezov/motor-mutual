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
          date_of_birth: string
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
          date_of_birth: string
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
          date_of_birth?: string
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
          selected_coverage_value: number
          vehicle_image_url: string | null
          vehicle_make: string
          vehicle_model: string
          vehicle_nvic: string | null
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
          selected_coverage_value: number
          vehicle_image_url?: string | null
          vehicle_make: string
          vehicle_model: string
          vehicle_nvic?: string | null
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
          selected_coverage_value?: number
          vehicle_image_url?: string | null
          vehicle_make?: string
          vehicle_model?: string
          vehicle_nvic?: string | null
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
