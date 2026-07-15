export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      households: {
        Row: {
          id: string
          name: string
          invite_code: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          invite_code: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          invite_code?: string
          created_at?: string
        }
        Relationships: any[]
      }
      members: {
        Row: {
          user_id: string
          household_id: string | null
          name: string
          initials: string
          color: string
          online: boolean
          joined_at: string
          last_name: string | null
          nickname: string | null
          birth_date: string | null
        }
        Insert: {
          user_id: string
          household_id?: string | null
          name: string
          initials: string
          color: string
          online?: boolean
          joined_at?: string
          last_name?: string | null
          nickname?: string | null
          birth_date?: string | null
        }
        Update: {
          user_id?: string
          household_id?: string | null
          name?: string
          initials?: string
          color?: string
          online?: boolean
          joined_at?: string
          last_name?: string | null
          nickname?: string | null
          birth_date?: string | null
        }
        Relationships: any[]
      }
      locations: {
        Row: {
          id: string
          household_id: string
          name: string
          icon: string
          created_at: string
        }
        Insert: {
          id?: string
          household_id: string
          name: string
          icon: string
          created_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          name?: string
          icon?: string
          created_at?: string
        }
        Relationships: any[]
      }
      inventory_items: {
        Row: {
          id: string
          household_id: string
          location_id: string | null
          name: string
          quantity: number
          unit: string
          min_stock: number | null
          expiry: string | null
          photo: string | null
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          household_id: string
          location_id?: string | null
          name: string
          quantity: number
          unit: string
          min_stock?: number | null
          expiry?: string | null
          photo?: string | null
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          location_id?: string | null
          name?: string
          quantity?: number
          unit?: string
          min_stock?: number | null
          expiry?: string | null
          photo?: string | null
          updated_by?: string | null
          updated_at?: string
        }
        Relationships: any[]
      }
      shopping_items: {
        Row: {
          id: string
          household_id: string
          name: string
          quantity: number
          unit: string
          urgency: string
          bought: boolean
          added_by: string | null
          source: string
          created_at: string
        }
        Insert: {
          id?: string
          household_id: string
          name: string
          quantity: number
          unit: string
          urgency: string
          bought?: boolean
          added_by?: string | null
          source: string
          created_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          name?: string
          quantity?: number
          unit?: string
          urgency?: string
          bought?: boolean
          added_by?: string | null
          source?: string
          created_at?: string
        }
        Relationships: any[]
      }
      recipes: {
        Row: {
          id: string
          household_id: string
          name: string
          photo: string | null
          servings: number
          minutes: number
          ingredients: Json
          steps: Json
          created_at: string
        }
        Insert: {
          id?: string
          household_id: string
          name: string
          photo?: string | null
          servings: number
          minutes: number
          ingredients?: Json
          steps?: Json
          created_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          name?: string
          photo?: string | null
          servings?: number
          minutes?: number
          ingredients?: Json
          steps?: Json
          created_at?: string
        }
        Relationships: any[]
      }
      services: {
        Row: {
          id: string
          household_id: string
          category: string
          icon: string
          provider: string
          amount: number
          due_date: string
          status: string
          recurrence: string
          created_at: string
        }
        Insert: {
          id?: string
          household_id: string
          category: string
          icon: string
          provider: string
          amount: number
          due_date: string
          status: string
          recurrence: string
          created_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          category?: string
          icon?: string
          provider?: string
          amount?: number
          due_date?: string
          status?: string
          recurrence?: string
          created_at?: string
        }
        Relationships: any[]
      }
      activities: {
        Row: {
          id: string
          household_id: string
          member_id: string
          text: string
          section: string
          timestamp: string
        }
        Insert: {
          id?: string
          household_id: string
          member_id: string
          text: string
          section: string
          timestamp?: string
        }
        Update: {
          id?: string
          household_id?: string
          member_id?: string
          text?: string
          section?: string
          timestamp?: string
        }
        Relationships: any[]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
