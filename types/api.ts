/**
 * API type definitions for request/response payloads
 *
 * This file defines TypeScript interfaces for API request and response
 * payloads, as well as internal data structures used across the application.
 */

/**
 * Request payload for the onboarding endpoint
 */
export interface OnboardingRequest {
  user_id: string
  bad_habits_prompt: string
}

/**
 * Response payload for the onboarding endpoint
 */
export interface OnboardingResponse {
  status: 'success'
  message: string
}

/**
 * Response payload for the receipt analysis endpoint
 */
export interface AnalysisResponse {
  status: 'success'
  data: {
    total_spent: number
    category: string
    budget_status: 'safe' | 'warning' | 'danger'
    ai_roast: string
  }
}

/**
 * Transaction data structure used for user context
 */
export interface Transaction {
  amount: number
  category: string
  timestamp: string
}

/**
 * User context data structure containing bad habits and recent transactions
 */
export interface UserContext {
  badHabitsPrompt: string
  transactions: Transaction[]
}
