/**
 * Transaction saver utility
 *
 * Saves analyzed transaction data to the Supabase Transactions table
 * after successful receipt analysis.
 *
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.6
 */

/**
 * Saves a transaction to the Transactions table
 *
 * @param userId - The user ID who made the transaction
 * @param analysis - The AI analysis result containing total_spent and category
 * @throws {Error} 500 error if database insert fails
 */
export async function saveTransaction(
  userId: string,
  analysis: { total_spent: number; category: string }
): Promise<void> {
  const supabase = useSupabase()

  // Insert transaction record into Transactions table
  const { error } = await supabase
    .from('Transactions')
    .insert({
      user_id: userId,
      amount: analysis.total_spent,
      category: analysis.category
    })

  // Throw 500 error if database insert fails
  if (error) {
    throw createError({
      statusCode: 500,
      message: `Database error: ${error.message}`
    })
  }
}
