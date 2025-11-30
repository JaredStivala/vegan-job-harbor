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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      animaladvocacy: {
        Row: {
          company_name: string | null
          date_closes: string | null
          date_posted: string | null
          description: string | null
          id: string
          location: string | null
          logo: string | null
          page_title: string | null
          salary: string | null
          tags: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          company_name?: string | null
          date_closes?: string | null
          date_posted?: string | null
          description?: string | null
          id?: string
          location?: string | null
          logo?: string | null
          page_title?: string | null
          salary?: string | null
          tags?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          company_name?: string | null
          date_closes?: string | null
          date_posted?: string | null
          description?: string | null
          id?: string
          location?: string | null
          logo?: string | null
          page_title?: string | null
          salary?: string | null
          tags?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      ea: {
        Row: {
          company_name: string | null
          date_closes: string | null
          date_posted: string | null
          description: string | null
          id: string
          location: string | null
          logo: string | null
          page_title: string | null
          salary: string | null
          tags: string[] | null
          updated_at: string | null
          url: string
        }
        Insert: {
          company_name?: string | null
          date_closes?: string | null
          date_posted?: string | null
          description?: string | null
          id?: string
          location?: string | null
          logo?: string | null
          page_title?: string | null
          salary?: string | null
          tags?: string[] | null
          updated_at?: string | null
          url: string
        }
        Update: {
          company_name?: string | null
          date_closes?: string | null
          date_posted?: string | null
          description?: string | null
          id?: string
          location?: string | null
          logo?: string | null
          page_title?: string | null
          salary?: string | null
          tags?: string[] | null
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      email_captures: {
        Row: {
          action: string
          created_at: string
          email: string
          id: string
        }
        Insert: {
          action: string
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          action?: string
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      job_clicks: {
        Row: {
          clicked_at: string | null
          id: string
          ip_address: string | null
          job_id: string
          job_source: string
          original_url: string
          user_agent: string | null
        }
        Insert: {
          clicked_at?: string | null
          id?: string
          ip_address?: string | null
          job_id: string
          job_source: string
          original_url: string
          user_agent?: string | null
        }
        Update: {
          clicked_at?: string | null
          id?: string
          ip_address?: string | null
          job_id?: string
          job_source?: string
          original_url?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      jobPayments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          job_id: string | null
          payment_type: string
          status: string
          stripe_customer_id: string | null
          stripe_payment_id: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          job_id?: string | null
          payment_type: string
          status: string
          stripe_customer_id?: string | null
          stripe_payment_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          job_id?: string | null
          payment_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_payment_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobPayments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "userSubmissions"
            referencedColumns: ["id"]
          },
        ]
      }
      userSubmissions: {
        Row: {
          Colored: boolean | null
          company_name: string | null
          date_closes: string | null
          date_posted: string | null
          description: string | null
          id: string
          location: string | null
          logo: string | null
          page_title: string | null
          salary: string | null
          tags: string | null
          updated_at: string | null
          url: string
          verification_end_date: string | null
          Verified: boolean | null
        }
        Insert: {
          Colored?: boolean | null
          company_name?: string | null
          date_closes?: string | null
          date_posted?: string | null
          description?: string | null
          id?: string
          location?: string | null
          logo?: string | null
          page_title?: string | null
          salary?: string | null
          tags?: string | null
          updated_at?: string | null
          url: string
          verification_end_date?: string | null
          Verified?: boolean | null
        }
        Update: {
          Colored?: boolean | null
          company_name?: string | null
          date_closes?: string | null
          date_posted?: string | null
          description?: string | null
          id?: string
          location?: string | null
          logo?: string | null
          page_title?: string | null
          salary?: string | null
          tags?: string | null
          updated_at?: string | null
          url?: string
          verification_end_date?: string | null
          Verified?: boolean | null
        }
        Relationships: []
      }
      veganjobs: {
        Row: {
          company_name: string | null
          date_closes: string | null
          date_posted: string | null
          description: string | null
          id: string
          location: string | null
          logo: string | null
          page_title: string | null
          salary: string | null
          tags: string[] | null
          updated_at: string | null
          url: string
        }
        Insert: {
          company_name?: string | null
          date_closes?: string | null
          date_posted?: string | null
          description?: string | null
          id?: string
          location?: string | null
          logo?: string | null
          page_title?: string | null
          salary?: string | null
          tags?: string[] | null
          updated_at?: string | null
          url: string
        }
        Update: {
          company_name?: string | null
          date_closes?: string | null
          date_posted?: string | null
          description?: string | null
          id?: string
          location?: string | null
          logo?: string | null
          page_title?: string | null
          salary?: string | null
          tags?: string[] | null
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      vevolution: {
        Row: {
          company_name: string | null
          date_closes: string | null
          date_posted: string | null
          description: string | null
          id: string
          location: string | null
          logo: string | null
          page_title: string | null
          salary: string | null
          tags: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          company_name?: string | null
          date_closes?: string | null
          date_posted?: string | null
          description?: string | null
          id?: string
          location?: string | null
          logo?: string | null
          page_title?: string | null
          salary?: string | null
          tags?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          company_name?: string | null
          date_closes?: string | null
          date_posted?: string | null
          description?: string | null
          id?: string
          location?: string | null
          logo?: string | null
          page_title?: string | null
          salary?: string | null
          tags?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      job_category: "Food Service" | "Tech" | "Retail" | "Non-Profit" | "Other"
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
    Enums: {
      job_category: ["Food Service", "Tech", "Retail", "Non-Profit", "Other"],
    },
  },
} as const
