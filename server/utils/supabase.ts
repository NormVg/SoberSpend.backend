/**
 * Supabase client singleton utility
 *
 * Provides a typed Supabase client instance that reads credentials from
 * environment variables and enforces type safety using Database types.
 *
 * Requirements: 10.1, 10.2, 10.3, 14.3, 14.6
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../types/database'

let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

/**
 * Returns a singleton Supabase client instance with Database types
 *
 * @throws {Error} If SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/SUPABASE_ANON_KEY are missing
 * @returns Typed Supabase client
 */
export function useSupabase() {
  if (supabaseClient) return supabaseClient

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/SUPABASE_ANON_KEY')
  }

  supabaseClient = createClient<Database>(url, key)
  return supabaseClient
}
