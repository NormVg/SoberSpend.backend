/**
 * Budget Suggestion endpoint - POST /api/suggest-budget
 *
 * Uses user profile data to generate a smart, personalized budget + category limit recommendations.
 */

import { useSupabase } from '../utils/supabase'

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
  const key = (personality && personality in ROASTS) ? personality : 'Balanced'
  const arr = ROASTS[key]
  return arr[Math.floor(Math.random() * arr.length)]
}

// Category allocation weights by personality type (must sum to 1.0)
const CATEGORY_WEIGHTS: Record<string, Record<string, number>> = {
  Spender: {
    food: 0.30,
    travel: 0.18,
    shopping: 0.26,
    entertainment: 0.14,
    bills: 0.08,
    other: 0.04,
  },
  Balanced: {
    food: 0.28,
    travel: 0.16,
    shopping: 0.18,
    entertainment: 0.10,
    bills: 0.20,
    other: 0.08,
  },
  Saver: {
    food: 0.25,
    travel: 0.12,
    shopping: 0.10,
    entertainment: 0.06,
    bills: 0.38,
    other: 0.09,
  },
}

// Boost a category weight if it's in the user's spending_weakness
function getAdjustedWeights(
  personality: string | null,
  weaknesses: string[],
  budget: number
): Record<string, number> {
  const key = (personality && personality in CATEGORY_WEIGHTS) ? personality : 'Balanced'
  const weights = { ...CATEGORY_WEIGHTS[key] }

  // Map weakness strings to category ids
  const weaknessMap: Record<string, string> = {
    'Food & Dining': 'food',
    'Online Shopping': 'shopping',
    'Entertainment': 'entertainment',
    'Travel': 'travel',
    'Bills': 'bills',
  }

  for (const w of weaknesses) {
    const catId = weaknessMap[w]
    if (catId && catId in weights) {
      // Boost weakness category by 5%, reduce others proportionally
      const boost = 0.05
      weights[catId] = Math.min(weights[catId] + boost, 0.50)
      // Re-normalise other categories
      const total = Object.values(weights).reduce((a, b) => a + b, 0)
      for (const k of Object.keys(weights)) {
        weights[k] = weights[k] / total
      }
    }
  }

  // Convert to rupee amounts, rounded to nearest 250
  const result: Record<string, number> = {}
  for (const [catId, weight] of Object.entries(weights)) {
    result[catId] = Math.round((budget * weight) / 250) * 250
  }
  return result
}

function suggestAll(profile: {
  financial_personality: string | null
  spending_weakness: string[] | null
  savings_rate: string | null
  monthly_budget: number | null
  primary_goal: string | null
}) {
  const base = profile.monthly_budget || 30000
  const personality = profile.financial_personality || 'Balanced'
  const savingsRate = profile.savings_rate || '10-20%'
  const weaknesses = profile.spending_weakness || []

  // Budget adjustment multiplier based on personality
  let budgetMultiplier = 1.0
  if (personality === 'Spender') budgetMultiplier = 0.85
  else if (personality === 'Saver') budgetMultiplier = 0.90
  if (weaknesses.length >= 3) budgetMultiplier -= 0.05

  const suggestedBudget = Math.max(Math.round((base * budgetMultiplier) / 500) * 500, 5000)

  // Savings target from savings_rate string
  let savingsFraction = 0.15
  if (savingsRate.includes('5') && !savingsRate.includes('25')) savingsFraction = 0.05
  else if (savingsRate.includes('10')) savingsFraction = 0.12
  else if (savingsRate.includes('20') || savingsRate.includes('25')) savingsFraction = 0.22
  else if (savingsRate.includes('30') || savingsRate.includes('40')) savingsFraction = 0.32

  const estimatedIncome = base / (1 - savingsFraction)
  const suggestedSavings = Math.max(Math.round((estimatedIncome * savingsFraction) / 250) * 250, 500)

  const categoryLimits = getAdjustedWeights(personality, weaknesses, suggestedBudget)

  return {
    monthly_budget: suggestedBudget,
    monthly_savings_target: suggestedSavings,
    category_limits: categoryLimits,
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

  const suggestion = suggestAll({
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
