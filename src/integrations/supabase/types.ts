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
          area: string | null
          assigned_routes: string[] | null
          created_at: string | null
          created_by: string | null
          district: string | null
          email: string
          id: number
          location: string | null
          name: string
          performance_score: number | null
          phone: string | null
          services_completed: number | null
          state: string | null
          status: string | null
          total_collections: number | null
          updated_at: string | null
        }
        Insert: {
          area?: string | null
          assigned_routes?: string[] | null
          created_at?: string | null
          created_by?: string | null
          district?: string | null
          email: string
          id?: number
          location?: string | null
          name: string
          performance_score?: number | null
          phone?: string | null
          services_completed?: number | null
          state?: string | null
          status?: string | null
          total_collections?: number | null
          updated_at?: string | null
        }
        Update: {
          area?: string | null
          assigned_routes?: string[] | null
          created_at?: string | null
          created_by?: string | null
          district?: string | null
          email?: string
          id?: number
          location?: string | null
          name?: string
          performance_score?: number | null
          phone?: string | null
          services_completed?: number | null
          state?: string | null
          status?: string | null
          total_collections?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          partner_id: string | null
          project_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          partner_id?: string | null
          project_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          partner_id?: string | null
          project_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          agent_count: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          location: string | null
          name: string
          route_count: number | null
          start_date: string | null
          state: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          agent_count?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          name: string
          route_count?: number | null
          start_date?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_count?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          name?: string
          route_count?: number | null
          start_date?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      training_camps: {
        Row: {
          agent_id: number | null
          agent_name: string
          camp_feedback: string | null
          camp_name: string
          completed_citizens: number | null
          created_at: string | null
          district: string | null
          end_date: string
          id: string
          location: string | null
          me_completed_date: string | null
          me_score: number | null
          registered_citizens: number | null
          start_date: string
          state: string | null
          status: Database["public"]["Enums"]["training_status"] | null
          taluk: string | null
          target_citizens: number | null
          trainer_id: number | null
          trainer_name: string | null
          training_type: Database["public"]["Enums"]["training_type"] | null
          updated_at: string | null
          village: string | null
        }
        Insert: {
          agent_id?: number | null
          agent_name: string
          camp_feedback?: string | null
          camp_name: string
          completed_citizens?: number | null
          created_at?: string | null
          district?: string | null
          end_date: string
          id?: string
          location?: string | null
          me_completed_date?: string | null
          me_score?: number | null
          registered_citizens?: number | null
          start_date: string
          state?: string | null
          status?: Database["public"]["Enums"]["training_status"] | null
          taluk?: string | null
          target_citizens?: number | null
          trainer_id?: number | null
          trainer_name?: string | null
          training_type?: Database["public"]["Enums"]["training_type"] | null
          updated_at?: string | null
          village?: string | null
        }
        Update: {
          agent_id?: number | null
          agent_name?: string
          camp_feedback?: string | null
          camp_name?: string
          completed_citizens?: number | null
          created_at?: string | null
          district?: string | null
          end_date?: string
          id?: string
          location?: string | null
          me_completed_date?: string | null
          me_score?: number | null
          registered_citizens?: number | null
          start_date?: string
          state?: string | null
          status?: Database["public"]["Enums"]["training_status"] | null
          taluk?: string | null
          target_citizens?: number | null
          trainer_id?: number | null
          trainer_name?: string | null
          training_type?: Database["public"]["Enums"]["training_type"] | null
          updated_at?: string | null
          village?: string | null
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
          actual_camps: number | null
          actual_citizens: number | null
          agent_id: number | null
          agent_name: string
          created_at: string | null
          id: string
          period: string
          target_camps: number | null
          target_citizens: number | null
          updated_at: string | null
        }
        Insert: {
          actual_camps?: number | null
          actual_citizens?: number | null
          agent_id?: number | null
          agent_name: string
          created_at?: string | null
          id?: string
          period: string
          target_camps?: number | null
          target_citizens?: number | null
          updated_at?: string | null
        }
        Update: {
          actual_camps?: number | null
          actual_citizens?: number | null
          agent_id?: number | null
          agent_name?: string
          created_at?: string | null
          id?: string
          period?: string
          target_camps?: number | null
          target_citizens?: number | null
          updated_at?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
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
