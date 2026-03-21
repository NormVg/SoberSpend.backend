/**
 * Context fetcher utility
 *
 * Fetches user context (bad habits and recent transactions) from Supabase
 * before AI analysis to enable personalized roasts.
 *
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 */

import type { UserContext } from '~/types/api'

/**
 * Fetches user context including bad habits and recent transactions
 *
 * @param userId - The user ID to fetch context for
 * @returns UserContext object with badHabitsPrompt and transactions
 * @throws {Error} 404 error if user not found with message "User not found. Complete onboarding first."
 */
export async function fetchUserContext(userId: string): Promise<UserContext> {
  const supabase = useSupabase()

  // Fetch user record from Users table
  const { data: users, error: userError } = await supabase
    .from('Users')
    .select('id, bad_habits_prompt')
    .eq('id', userId)
    .limit(1)

  // Return 404 if user not found
  if (userError || !users || users.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'User not found. Complete onboarding first.'
    })
  }

  // Fetch 20 most recent transactions ordered by timestamp descending
  const { data: transactions } = await supabase
    .from('Transactions')
    .select('amount, category, timestamp')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(20)

  // Return UserContext object
  return {
    badHabitsPrompt: users[0].bad_habits_prompt,
    transactions: transactions || []
  }
}
