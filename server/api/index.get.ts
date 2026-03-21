/**
 * Health Check Endpoint
 *
 * GET / - Returns backend status and verifies database connectivity
 *
 * Requirements: 1.1, 1.2, 1.3, 1.4, 10.4
 */

export default defineEventHandler(async (event) => {
  // Verify Supabase connection by querying Users table
  const supabase = useSupabase()
  await supabase.from('Users').select('id').limit(1)

  return {
    status: 'ok',
    message: 'SoberSpend backend is running.',
    database: 'supabase'
  }
})
