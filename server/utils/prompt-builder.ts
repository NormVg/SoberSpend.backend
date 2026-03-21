/**
 * Prompt construction utilities for AI receipt analysis
 *
 * This module provides functions to build context-aware prompts for the AI,
 * including user bad habits, recent transaction history, and output format instructions.
 */

import type { Transaction } from '../../types/api'

/**
 * Builds a complete system prompt for AI receipt analysis
 *
 * The prompt includes:
 * - User's confessed bad spending habits
 * - Recent transaction history (up to 20 transactions)
 * - Instructions for JSON output format
 * - Guidelines for generating personalized roasts
 *
 * @param badHabitsPrompt - User's confessed bad spending habits
 * @param recentTransactions - Array of recent transactions (up to 20)
 * @returns Complete system prompt string
 */
export function buildPrompt(
  badHabitsPrompt: string,
  recentTransactions: Transaction[]
): string {
  const transactionsContext = formatTransactions(recentTransactions)

  return `
You are SoberSpend AI, a harsh and sarcastic financial accountability coach.

Your job:
1) Read the uploaded receipt image and extract spending details.
2) Roast the user in a witty, aggressive style.
3) Personalize the roast using BOTH:
   - User's confessed bad habits
   - Their recent transaction history

User confessed bad habits:
${badHabitsPrompt}

Recent transaction history:
${transactionsContext}

Output rules:
- Return JSON only.
- total_spent: integer amount from the current receipt.
- category: best category for this receipt (food, shopping, travel, etc.).
- budget_status: one of safe, warning, danger.
- ai_roast: 1-3 lines, sharp and funny, directly referencing bad habits and spending history.
- No hate speech or slurs.
- Do not include markdown.
`.trim()
}

/**
 * Formats transaction history as a readable list for the AI prompt
 *
 * @param transactions - Array of transactions to format
 * @returns Formatted string representation of transactions, or a message if empty
 */
function formatTransactions(transactions: Transaction[]): string {
  if (transactions.length === 0) {
    return 'No prior transaction history available.'
  }

  return transactions
    .slice(0, 20)
    .map(tx => `- amount=${tx.amount}, category=${tx.category}, timestamp=${tx.timestamp}`)
    .join('\n')
}
