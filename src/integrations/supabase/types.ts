export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agents: {
        Row: {
          created_at: string | null
          district: string | null
          email: string
          id: number
          location: string | null
          name: string
          phone: string | null
          state: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          district?: string | null
          email: string
          id?: number
          location?: string | null
          name: string
          phone?: string | null
          state?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          district?: string | null
          email?: string
          id?: number
          location?: string | null
          name?: string
          phone?: string | null
          state?: string | null
          status?: string | null
        }
        Relationships: []
      }
      assets: {
        Row: {
          agent_id: number | null
          asset_name: string
          asset_type: string
          created_at: string
          id: string
          purchase_amount: number | null
          purchase_date: string | null
          serial_number: string | null
          status: string | null
          warranty_expiry: string | null
        }
        Insert: {
          agent_id?: number | null
          asset_name: string
          asset_type: string
          created_at?: string
          id?: string
          purchase_amount?: number | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: string | null
          warranty_expiry?: string | null
        }
        Update: {
          agent_id?: number | null
          asset_name?: string
          asset_type?: string
          created_at?: string
          id?: string
          purchase_amount?: number | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: string | null
          warranty_expiry?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_details: {
        Row: {
          account_holder_name: string
          account_number: string
          bank_name: string
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          ifsc_code: string
          is_primary: boolean | null
        }
        Insert: {
          account_holder_name: string
          account_number: string
          bank_name: string
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          ifsc_code: string
          is_primary?: boolean | null
        }
        Update: {
          account_holder_name?: string
          account_number?: string
          bank_name?: string
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          ifsc_code?: string
          is_primary?: boolean | null
        }
        Relationships: []
      }
      commission_approvals: {
        Row: {
          agent_id: number | null
          approved_by: string | null
          created_at: string | null
          final_amount: number
          id: string
          period_end: string
          period_start: string
          status: Database["public"]["Enums"]["approval_status"] | null
          total_commission: number
        }
        Insert: {
          agent_id?: number | null
          approved_by?: string | null
          created_at?: string | null
          final_amount: number
          id?: string
          period_end: string
          period_start: string
          status?: Database["public"]["Enums"]["approval_status"] | null
          total_commission: number
        }
        Update: {
          agent_id?: number | null
          approved_by?: string | null
          created_at?: string | null
          final_amount?: number
          id?: string
          period_end?: string
          period_start?: string
          status?: Database["public"]["Enums"]["approval_status"] | null
          total_commission?: number
        }
        Relationships: [
          {
            foreignKeyName: "commission_approvals_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_approvals_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          created_at: string | null
          department: string | null
          designation: string | null
          email: string
          employee_code: string
          full_name: string
          id: string
          joining_date: string | null
          manager_id: string | null
          phone: string | null
          status: Database["public"]["Enums"]["employee_status"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          designation?: string | null
          email: string
          employee_code: string
          full_name: string
          id?: string
          joining_date?: string | null
          manager_id?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["employee_status"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          designation?: string | null
          email?: string
          employee_code?: string
          full_name?: string
          id?: string
          joining_date?: string | null
          manager_id?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["employee_status"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          agent_id: number | null
          amount: number
          approved_by: string | null
          category: string
          created_at: string
          description: string | null
          employee_id: string | null
          expense_date: string
          id: string
          project_id: string | null
          receipt_url: string | null
          status: string | null
          vertical_id: string | null
        }
        Insert: {
          agent_id?: number | null
          amount: number
          approved_by?: string | null
          category: string
          created_at?: string
          description?: string | null
          employee_id?: string | null
          expense_date?: string
          id?: string
          project_id?: string | null
          receipt_url?: string | null
          status?: string | null
          vertical_id?: string | null
        }
        Update: {
          agent_id?: number | null
          amount?: number
          approved_by?: string | null
          category?: string
          created_at?: string
          description?: string | null
          employee_id?: string | null
          expense_date?: string
          id?: string
          project_id?: string | null
          receipt_url?: string | null
          status?: string | null
          vertical_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_vertical_id_fkey"
            columns: ["vertical_id"]
            isOneToOne: false
            referencedRelation: "verticals"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_collections: {
        Row: {
          agent_id: number | null
          amount: number
          citizen_name: string
          collection_date: string | null
          commission_amount: number | null
          created_at: string | null
          id: string
          receipt_number: string | null
          service_id: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
        }
        Insert: {
          agent_id?: number | null
          amount: number
          citizen_name: string
          collection_date?: string | null
          commission_amount?: number | null
          created_at?: string | null
          id?: string
          receipt_number?: string | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Update: {
          agent_id?: number | null
          amount?: number
          citizen_name?: string
          collection_date?: string | null
          commission_amount?: number | null
          created_at?: string | null
          id?: string
          receipt_number?: string | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "fee_collections_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_collections_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_transactions: {
        Row: {
          agent_id: number | null
          amount: number
          created_at: string | null
          description: string | null
          employee_id: string | null
          id: string
          status: Database["public"]["Enums"]["payment_status"] | null
          transaction_date: string | null
          transaction_type: string
        }
        Insert: {
          agent_id?: number | null
          amount: number
          created_at?: string | null
          description?: string | null
          employee_id?: string | null
          id?: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_date?: string | null
          transaction_type: string
        }
        Update: {
          agent_id?: number | null
          amount?: number
          created_at?: string | null
          description?: string | null
          employee_id?: string | null
          id?: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_date?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          approved: boolean
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          approved?: boolean
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          approved?: boolean
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          budget: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          location: string | null
          name: string
          project_lead_id: string | null
          start_date: string | null
          state: string | null
          status: string | null
          vertical_id: string | null
        }
        Insert: {
          budget?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          name: string
          project_lead_id?: string | null
          start_date?: string | null
          state?: string | null
          status?: string | null
          vertical_id?: string | null
        }
        Update: {
          budget?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          name?: string
          project_lead_id?: string | null
          start_date?: string | null
          state?: string | null
          status?: string | null
          vertical_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_project_lead_id_fkey"
            columns: ["project_lead_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_vertical_id_fkey"
            columns: ["vertical_id"]
            isOneToOne: false
            referencedRelation: "verticals"
            referencedColumns: ["id"]
          },
        ]
      }
      reimbursements: {
        Row: {
          amount: number
          approved_by: string | null
          category: string
          created_at: string | null
          description: string | null
          employee_id: string | null
          expense_date: string
          id: string
          status: Database["public"]["Enums"]["approval_status"] | null
        }
        Insert: {
          amount: number
          approved_by?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          employee_id?: string | null
          expense_date: string
          id?: string
          status?: Database["public"]["Enums"]["approval_status"] | null
        }
        Update: {
          amount?: number
          approved_by?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          employee_id?: string | null
          expense_date?: string
          id?: string
          status?: Database["public"]["Enums"]["approval_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "reimbursements_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reimbursements_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          base_price: number
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          service_code: string
          service_name: string
          vertical_id: string | null
        }
        Insert: {
          base_price?: number
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          service_code: string
          service_name: string
          vertical_id?: string | null
        }
        Update: {
          base_price?: number
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          service_code?: string
          service_name?: string
          vertical_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_vertical_id_fkey"
            columns: ["vertical_id"]
            isOneToOne: false
            referencedRelation: "verticals"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      training_camps: {
        Row: {
          agent_id: number | null
          camp_name: string
          created_at: string | null
          end_date: string
          id: string
          location: string | null
          start_date: string
          status: Database["public"]["Enums"]["training_status"] | null
          target_citizens: number | null
        }
        Insert: {
          agent_id?: number | null
          camp_name: string
          created_at?: string | null
          end_date: string
          id?: string
          location?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["training_status"] | null
          target_citizens?: number | null
        }
        Update: {
          agent_id?: number | null
          camp_name?: string
          created_at?: string | null
          end_date?: string
          id?: string
          location?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["training_status"] | null
          target_citizens?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "training_camps_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      training_targets: {
        Row: {
          agent_id: number | null
          created_at: string | null
          id: string
          period: string
          target_camps: number | null
          target_citizens: number | null
        }
        Insert: {
          agent_id?: number | null
          created_at?: string | null
          id?: string
          period: string
          target_camps?: number | null
          target_citizens?: number | null
        }
        Update: {
          agent_id?: number | null
          created_at?: string | null
          id?: string
          period?: string
          target_camps?: number | null
          target_citizens?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "training_targets_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          role_id: number
          user_id: string
        }
        Insert: {
          role_id: number
          user_id: string
        }
        Update: {
          role_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          id: string
        }
        Insert: {
          id: string
        }
        Update: {
          id?: string
        }
        Relationships: []
      }
      verticals: {
        Row: {
          color_code: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          color_code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          color_code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: Record<PropertyKey, never> | { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      approval_status: "pending" | "approved" | "rejected"
      employee_status: "active" | "inactive" | "on_leave" | "terminated"
      payment_status: "pending" | "paid" | "failed" | "refunded"
      service_status: "pending" | "in_progress" | "completed" | "cancelled"
      training_status: "planned" | "ongoing" | "completed" | "me_pending"
      training_type:
        | "skill_development"
        | "awareness"
        | "capacity_building"
        | "livelihood"
      user_role:
        | "super_admin"
        | "admin"
        | "manager"
        | "supervisor"
        | "agent"
        | "viewer"
        | "partner_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      approval_status: ["pending", "approved", "rejected"],
      employee_status: ["active", "inactive", "on_leave", "terminated"],
      payment_status: ["pending", "paid", "failed", "refunded"],
      service_status: ["pending", "in_progress", "completed", "cancelled"],
      training_status: ["planned", "ongoing", "completed", "me_pending"],
      training_type: [
        "skill_development",
        "awareness",
        "capacity_building",
        "livelihood",
      ],
      user_role: [
        "super_admin",
        "admin",
        "manager",
        "supervisor",
        "agent",
        "viewer",
        "partner_admin",
      ],
    },
  },
} as const
