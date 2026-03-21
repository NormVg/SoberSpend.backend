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
        }
      }
      Transactions: {
        Row: {
          id: number
          user_id: string
          amount: number
          category: string
          timestamp: string
        }
        Insert: {
          user_id: string
          amount: number
          category: string
          timestamp?: string
        }
        Update: {
          user_id?: string
          amount?: number
          category?: string
          timestamp?: string
        }
      }
    }
  }
}
