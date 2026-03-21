/**
 * Receipt analysis endpoint
 *
 * Accepts multipart form data with an image file and user_id,
 * analyzes the receipt with AI, and returns personalized financial roasts.
 *
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 7.1, 7.2, 7.3, 7.4,
 *               9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 15.2, 15.3, 15.4
 */

import type { AnalysisResponse } from '../../types/api'

export default defineEventHandler(async (event): Promise<AnalysisResponse> => {
  // Parse multipart form data
  const formData = await readMultipartFormData(event)

  if (!formData) {
    throw createError({
      statusCode: 400,
      message: 'No form data provided.'
    })
  }

  // Extract user_id from form data
  const userIdField = formData.find(f => f.name === 'user_id')
  const userId = userIdField?.data.toString('utf-8').trim()

  // Validate that user_id is non-empty
  if (!userId) {
    throw createError({
      statusCode: 400,
      message: 'user_id is required.'
    })
  }

  // Extract file from form data
  const fileField = formData.find(f => f.name === 'file')

  // Validate that file data is non-empty
  if (!fileField || !fileField.data || fileField.data.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'Uploaded file is empty.'
    })
  }

  // Validate MIME type is image/jpeg or image/png
  const mimeType = fileField.type
  if (mimeType !== 'image/jpeg' && mimeType !== 'image/png') {
    throw createError({
      statusCode: 400,
      message: 'Invalid file type. Only image/jpeg and image/png are supported.'
    })
  }

  // Fetch user context using context-fetcher utility
  const userContext = await fetchUserContext(userId)

  // Call AI service with image bytes, MIME type, bad habits, and recent transactions
  const analysis = await analyzeReceiptWithAI({
    imageBytes: fileField.data,
    mimeType: mimeType,
    badHabitsPrompt: userContext.badHabitsPrompt,
    recentTransactions: userContext.transactions
  })

  // Save transaction using transaction-saver utility
  await saveTransaction(userId, {
    total_spent: analysis.total_spent,
    category: analysis.category
  })

  // Return JSON with status "success" and data object containing normalized analysis results
  // Normalize category and budget_status to lowercase
  return {
    status: 'success',
    data: {
      total_spent: analysis.total_spent,
      category: analysis.category.toLowerCase(),
      budget_status: analysis.budget_status.toLowerCase() as 'safe' | 'warning' | 'danger',
      ai_roast: analysis.ai_roast
    }
  }
})
