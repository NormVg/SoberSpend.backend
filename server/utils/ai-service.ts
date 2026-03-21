/**
 * AI service for receipt analysis using Ollama with AI SDK
 *
 * This module provides the core AI integration for analyzing receipt images
 * and generating personalized financial roasts using the Ollama provider.
 *
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 7.1, 7.2, 7.3, 7.4
 */

import { ollama } from 'ollama-ai-provider-v2'
import { generateObject } from 'ai'
import { AnalysisOutputSchema } from '~/schemas/analysis'
import type { Transaction } from '~/types/api'

/**
 * Parameters for AI receipt analysis
 */
interface AnalyzeReceiptParams {
  imageBytes: Buffer
  mimeType: string
  badHabitsPrompt: string
  recentTransactions: Transaction[]
}

/**
 * Analyzes a receipt image using Ollama AI with structured output
 *
 * This function:
 * 1. Configures the Ollama provider with environment variables
 * 2. Encodes the image as base64 data URL
 * 3. Builds a context-aware prompt using user habits and transaction history
 * 4. Calls the AI with structured output validation
 * 5. Returns validated analysis results
 *
 * @param params - Analysis parameters including image, user context, and transactions
 * @returns Validated analysis object with total_spent, category, budget_status, and ai_roast
 * @throws {Error} 502 error if AI provider fails or returns invalid response
 */
export async function analyzeReceiptWithAI(params: AnalyzeReceiptParams) {
  // Read configuration from environment with defaults
  const baseUrl = process.env.OLLAMA_BASE_URL || 'https://ollama.com/api'
  const modelName = process.env.OLLAMA_MODEL || 'llava'
  const apiKey = process.env.OLLAMA_API_KEY

  // Configure Ollama provider with base URL and optional API key
  const providerConfig: any = { baseURL: baseUrl }

  // Add API key to headers if provided (required for cloud service)
  if (apiKey) {
    providerConfig.headers = {
      'Authorization': `Bearer ${apiKey}`
    }
  }

  const provider = ollama(modelName, providerConfig)

  // Build context-aware prompt using prompt-builder utility
  const prompt = buildPrompt(
    params.badHabitsPrompt,
    params.recentTransactions
  )

  // Encode image bytes as base64 data URL
  const imageBase64 = params.imageBytes.toString('base64')
  const imageDataUrl = `data:${params.mimeType};base64,${imageBase64}`

  try {
    // Call generateObject with schema validation, temperature 0.7, and 90-second timeout
    const result = await generateObject({
      model: provider,
      schema: AnalysisOutputSchema,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image', image: imageDataUrl }
          ]
        }
      ],
      temperature: 0.7,
      maxRetries: 0,
      abortSignal: AbortSignal.timeout(90000) // 90-second timeout
    })

    return result.object
  } catch (error: any) {
    // Catch AI provider errors and throw 502 error
    throw createError({
      statusCode: 502,
      message: `AI provider error: ${error.message}`
    })
  }
}
