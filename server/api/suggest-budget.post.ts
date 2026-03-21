/**
 * Budget Suggestion endpoint - POST /api/suggest-budget
 *
 * Uses Ollama AI to generate a personalized monthly budget and savings target
 * based on user profile data (personality, goals, weaknesses, etc.)
 */

import { generateObject } from 'ai'
import { createOllama } from 'ollama-ai-provider'
import { z } from 'zod'
import { useSupabase } from '../utils/supabase'

const BudgetSuggestionSchema = z.object({
  monthly_budget: z.number().describe('Suggested monthly spending budget in Indian Rupees (INR). Should be a realistic round number.'),
  monthly_savings_target: z.number().describe('Suggested monthly savings target in INR. Should be between 10-40% of income implied by profile.'),
  reasoning: z.string().describe('A short 1-2 sentence brutal but honest explanation for these suggestions, matching the user personality type.')
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { user_id } = body
  if (!user_id) {
    throw createError({ statusCode: 400, message: 'user_id is required' })
  }

  // Fetch user profile from Supabase
  const supabase = useSupabase()
  const { data: user, error } = await supabase
    .from('Users')
    .select('name, financial_personality, spending_weakness, primary_goal, weekend_vibe, purchase_regret, savings_rate, monthly_budget, bad_habits_prompt')
    .eq('id', user_id)
    .single()

  if (error || !user) {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  // Build profile context for Ollama
  const profileContext = `
User Profile:
- Name: ${user.name || 'Unknown'}
- Financial Personality: ${user.financial_personality || 'Balanced'}
- Spending Weaknesses: ${(user.spending_weakness as string[] || []).join(', ') || 'None specified'}
- Primary Goal: ${user.primary_goal || 'Save money'}
- Weekend Vibe: ${user.weekend_vibe || 'Unknown'}
- Purchase Regret Frequency: ${user.purchase_regret || 'Sometimes'}
- Savings Rate: ${user.savings_rate || 'Unknown'}
- Current Budget: ₹${user.monthly_budget || 30000}
- Bad Habits Note: ${user.bad_habits_prompt || 'N/A'}

This person lives in India. Suggest a realistic monthly spending budget (in INR) and monthly savings target.
Consider their personality and goals. Be financially sound but also realistic about their lifestyle.
If they are a "Spender", suggest tighter limits. If they are a "Saver", validate their discipline.
`

  const baseUrl = process.env.OLLAMA_BASE_URL || 'https://ollama.com/api'
  const modelName = process.env.OLLAMA_MODEL || 'llava'
  const apiKey = process.env.OLLAMA_API_KEY

  const providerConfig: any = { baseURL: baseUrl }
  if (apiKey) {
    providerConfig.headers = { 'Authorization': `Bearer ${apiKey}` }
  }

  const ollama = createOllama(providerConfig)

  try {
    const result = await generateObject({
      model: ollama(modelName),
      schema: BudgetSuggestionSchema,
      prompt: profileContext,
      temperature: 0.6,
      maxRetries: 0,
      abortSignal: AbortSignal.timeout(30000)
    })

    return {
      status: 'success',
      data: result.object
    }
  } catch (err: any) {
    throw createError({
      statusCode: 502,
      message: `AI provider error: ${err.message}`
    })
  }
})
