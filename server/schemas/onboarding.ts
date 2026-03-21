import { z } from 'zod'

/**
 * Validation schema for user onboarding requests.
 * Validates that both user_id and bad_habits_prompt are non-empty strings.
 *
 * Requirements: 2.4, 2.5
 */
export const OnboardingSchema = z.object({
  user_id: z.string().min(1, 'user_id must not be empty'),
  bad_habits_prompt: z.string().min(1, 'bad_habits_prompt must not be empty'),
  name: z.string().optional(),
  monthly_budget: z.number().optional(),
  financial_personality: z.string().optional(),
  spending_weakness: z.array(z.string()).optional(),
  primary_goal: z.string().optional(),
  weekend_vibe: z.string().optional(),
  purchase_regret: z.string().optional(),
  savings_rate: z.string().optional()
})

export type OnboardingInput = z.infer<typeof OnboardingSchema>
