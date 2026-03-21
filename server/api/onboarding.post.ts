/**
 * Onboarding endpoint - POST /api/onboarding
 *
 * Saves user ID and bad habits prompt to the database.
 * Supports upsert behavior - creates new user or updates existing user's bad habits.
 *
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 15.2, 15.3, 15.4
 */

import { z } from 'zod'
import { OnboardingSchema } from '../schemas/onboarding'
import { useSupabase } from '../utils/supabase'

export default defineEventHandler(async (event) => {
  // Read and parse request body
  const body = await readBody(event)

  // Validate payload with Zod schema
  let payload
  try {
    payload = OnboardingSchema.parse(body)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: 'Validation failed',
        data: error.errors
      })
    }
    throw error
  }

  // Get Supabase client
  const supabase = useSupabase()

  // Upsert user record (insert or update if exists)
  const { error } = await supabase
    .from('Users')
    .upsert({
      id: payload.user_id,
      bad_habits_prompt: payload.bad_habits_prompt,
      name: payload.name,
      monthly_budget: payload.monthly_budget,
      financial_personality: payload.financial_personality,
      spending_weakness: payload.spending_weakness,
      primary_goal: payload.primary_goal,
      weekend_vibe: payload.weekend_vibe,
      purchase_regret: payload.purchase_regret,
      savings_rate: payload.savings_rate
    })

  if (error) {
    throw createError({
      statusCode: 500,
      message: `Database error: ${error.message}`
    })
  }

  // Return success response
  return {
    status: 'success',
    message: 'Context saved.'
  }
})
