import { z } from 'zod'

/**
 * Validation schema for AI response output from receipt analysis.
 * Ensures the AI returns properly structured data with:
 * - total_spent: non-negative integer
 * - category: non-empty string
 * - budget_status: one of 'safe', 'warning', or 'danger'
 * - ai_roast: non-empty string
 *
 * Requirements: 7.5, 7.6, 7.7, 7.8
 */
export const AnalysisOutputSchema = z.object({
  total_spent: z.number().int().nonnegative('total_spent must be a non-negative integer'),
  category: z.string().min(1, 'category must not be empty'),
  budget_status: z.enum(['safe', 'warning', 'danger'], {
    errorMap: () => ({ message: 'budget_status must be one of: safe, warning, danger' })
  }),
  ai_roast: z.string().min(1, 'ai_roast must not be empty')
})

export type AnalysisOutput = z.infer<typeof AnalysisOutputSchema>
