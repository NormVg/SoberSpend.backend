/**
 * Budget Suggestion endpoint - POST /api/suggest-budget
 *
 * Uses user profile data to generate a smart, personalized budget recommendation.
 * Falls back to rule-based calculation if AI is unavailable.
 */

import { useSupabase } from '../utils/supabase'

// Wit library for roast messages keyed by personality + goal combo
const ROASTS: Record<string, string[]> = {
  Spender: [
    "You spend like there's no tomorrow. Let's fix that before tomorrow actually arrives.",
    "Your wallet has abandonment issues because you keep leaving it empty.",
    "You treat money like confetti at a party you didn't even enjoy.",
  ],
  Balanced: [
    "You're financially okay, like a B+ student who could try harder.",
    "Decent. Not great. The Toyota Corolla of financial personalities.",
    "You're balanced like a scale that's mostly level but slightly judging you.",
  ],
  Saver: [
    "Okay, finance nerd. We see you. Your future self says thanks.",
    "You save so much you probably feel guilty buying coffee. Relax a little.",
    "Disciplined. Boring to your friends. Wealthy at 40. Worth it.",
  ],
}

function getRoast(personality: string | null): string {
  const key = personality in ROASTS ? (personality as string) : 'Balanced'
  const arr = ROASTS[key]
  return arr[Math.floor(Math.random() * arr.length)]
}

function suggestBudget(profile: {
  financial_personality: string | null
  spending_weakness: string[] | null
  savings_rate: string | null
  monthly_budget: number | null
  primary_goal: string | null
}) {
  const base = profile.monthly_budget || 30000
  const personality = profile.financial_personality || 'Balanced'
  const savingsRate = profile.savings_rate || '10-20%'
  const weaknesses = (profile.spending_weakness || []).length

  // Budget adjustment multiplier based on personality
  let budgetMultiplier = 1.0
  if (personality === 'Spender') budgetMultiplier = 0.85   // cut 15% to enforce discipline
  else if (personality === 'Saver') budgetMultiplier = 0.90 // already disciplined, minor trim

  // Extra cut if many weaknesses
  if (weaknesses >= 3) budgetMultiplier -= 0.05

  const suggestedBudget = Math.round((base * budgetMultiplier) / 500) * 500

  // Savings target: parse the savings_rate string to a fraction
  let savingsFraction = 0.15
  if (savingsRate.includes('5') && !savingsRate.includes('25')) savingsFraction = 0.05
  else if (savingsRate.includes('10')) savingsFraction = 0.12
  else if (savingsRate.includes('20') || savingsRate.includes('25')) savingsFraction = 0.22
  else if (savingsRate.includes('30') || savingsRate.includes('40')) savingsFraction = 0.32

  // Savings target based on original income estimate (budget + savings)
  const estimatedIncome = base / (1 - savingsFraction)
  const suggestedSavings = Math.round((estimatedIncome * savingsFraction) / 250) * 250

  return {
    monthly_budget: Math.max(suggestedBudget, 5000),
    monthly_savings_target: Math.max(suggestedSavings, 500),
    reasoning: getRoast(personality),
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { user_id } = body

  if (!user_id) {
    throw createError({ statusCode: 400, message: 'user_id is required' })
  }

  const supabase = useSupabase()
  const { data: user, error } = await supabase
    .from('Users')
    .select('name, financial_personality, spending_weakness, primary_goal, savings_rate, monthly_budget')
    .eq('id', user_id)
    .single()

  if (error || !user) {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  const suggestion = suggestBudget({
    financial_personality: user.financial_personality,
    spending_weakness: user.spending_weakness as string[],
    savings_rate: user.savings_rate,
    monthly_budget: user.monthly_budget ? Number(user.monthly_budget) : null,
    primary_goal: user.primary_goal,
  })

  return {
    status: 'success',
    data: suggestion,
  }
})
