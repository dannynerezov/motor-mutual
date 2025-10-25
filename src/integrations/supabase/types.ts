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
          base_premium: number
          ceiling_point: number
          ceiling_price: number
          created_at: string
          floor_point: number
          floor_price: number
          id: string
          increment: number
          is_active: boolean
          number_increments: number
          scheme_number: number
          updated_at: string
          valid_from: string
          valid_until: string | null
          vehicle_value: number
        }
        Insert: {
          base_premium: number
          ceiling_point: number
          ceiling_price: number
          created_at?: string
          floor_point: number
          floor_price: number
          id?: string
          increment: number
          is_active?: boolean
          number_increments: number
          scheme_number: number
          updated_at?: string
          valid_from?: string
          valid_until?: string | null
          vehicle_value: number
        }
        Update: {
          base_premium?: number
          ceiling_point?: number
          ceiling_price?: number
          created_at?: string
          floor_point?: number
          floor_price?: number
          id?: string
          increment?: number
          is_active?: boolean
          number_increments?: number
          scheme_number?: number
          updated_at?: string
          valid_from?: string
          valid_until?: string | null
          vehicle_value?: number
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
          claim_loading_percentage: number | null
          created_at: string
          customer_id: string
          expires_at: string
          id: string
          membership_price: number
          quote_number: string | null
          quote_reference: string
          registration_number: string
          status: string
          total_base_price: number | null
          total_final_price: number | null
          vehicle_make: string
          vehicle_model: string
          vehicle_nvic: string | null
          vehicle_value: number
          vehicle_year: number
        }
        Insert: {
          claim_loading_percentage?: number | null
          created_at?: string
          customer_id: string
          expires_at?: string
          id?: string
          membership_price: number
          quote_number?: string | null
          quote_reference: string
          registration_number: string
          status?: string
          total_base_price?: number | null
          total_final_price?: number | null
          vehicle_make: string
          vehicle_model: string
          vehicle_nvic?: string | null
          vehicle_value: number
          vehicle_year: number
        }
        Update: {
          claim_loading_percentage?: number | null
          created_at?: string
          customer_id?: string
          expires_at?: string
          id?: string
          membership_price?: number
          quote_number?: string | null
          quote_reference?: string
          registration_number?: string
          status?: string
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
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_quote_number: { Args: never; Returns: string }
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
