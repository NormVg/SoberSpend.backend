/**
 * Database type definitions for Supabase tables
 *
 * This file defines TypeScript types for the Users and Transactions tables
 * in the Supabase database, providing type safety for database operations.
 */

export interface Database {
  public: {
    Tables: {
      Users: {
        Row: {
          id: string
          bad_habits_prompt: string
          name?: string | null
          monthly_budget?: number | null
          financial_personality?: string | null
          spending_weakness?: string[] | null
          primary_goal?: string | null
          weekend_vibe?: string | null
          purchase_regret?: string | null
          savings_rate?: string | null
          monthly_savings_target?: number | null
          category_limits?: any | null
        }
        Insert: {
          id: string
          bad_habits_prompt: string
          name?: string | null
          monthly_budget?: number | null
          financial_personality?: string | null
          spending_weakness?: string[] | null
          primary_goal?: string | null
          weekend_vibe?: string | null
          purchase_regret?: string | null
          savings_rate?: string | null
          monthly_savings_target?: number | null
          category_limits?: any | null
        }
        Update: {
          id?: string
          bad_habits_prompt?: string
          name?: string | null
          monthly_budget?: number | null
          financial_personality?: string | null
          spending_weakness?: string[] | null
          primary_goal?: string | null
          weekend_vibe?: string | null
          purchase_regret?: string | null
          savings_rate?: string | null
          monthly_savings_target?: number | null
          category_limits?: any | null
        }
      }
      Transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          category: string
          merchant: string
          note?: string | null
          timestamp: string
        }
        Insert: {
          id: string
          user_id: string
          amount: number
          category: string
          merchant: string
          note?: string | null
          timestamp?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          category?: string
          merchant?: string
          note?: string | null
          timestamp?: string
        }
      }
      Wishlists: {
        Row: {
          id: string
          user_id: string
          name: string
          price: number
          category_id?: string | null
          added_at: string
        }
        Insert: {
          id: string
          user_id: string
          name: string
          price: number
          category_id?: string | null
          added_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          price?: number
          category_id?: string | null
          added_at?: string
        }
      }
    }
  }
}
