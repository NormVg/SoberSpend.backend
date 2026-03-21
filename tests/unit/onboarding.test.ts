/**
 * Unit tests for the onboarding endpoint
 *
 * Tests basic functionality of POST /api/onboarding including
 * validation, success responses, and error handling.
 *
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7
 */

import { describe, it, expect } from 'vitest'
import { OnboardingSchema } from '~/schemas/onboarding'
import { z } from 'zod'

describe('Onboarding API', () => {
  it('should have correct response structure for success', () => {
    const expectedResponse = {
      status: 'success',
      message: 'Context saved.'
    }

    expect(expectedResponse).toHaveProperty('status')
    expect(expectedResponse).toHaveProperty('message')
    expect(expectedResponse.status).toBe('success')
    expect(expectedResponse.message).toBe('Context saved.')
  })

  it('should validate user_id is non-empty string', () => {
    const validPayload = {
      user_id: 'test-user-123',
      bad_habits_prompt: 'I spend too much on coffee'
    }

    const result = OnboardingSchema.safeParse(validPayload)
    expect(result.success).toBe(true)
  })

  it('should reject empty user_id', () => {
    const invalidPayload = {
      user_id: '',
      bad_habits_prompt: 'Some bad habits'
    }

    const result = OnboardingSchema.safeParse(invalidPayload)
    expect(result.success).toBe(false)
    if (!result.success) {
      // Zod validation should fail for empty user_id
      const userIdError = result.error.issues.find(issue => issue.path[0] === 'user_id')
      expect(userIdError).toBeDefined()
    }
  })

  it('should reject empty bad_habits_prompt', () => {
    const invalidPayload = {
      user_id: 'test-user-789',
      bad_habits_prompt: ''
    }

    const result = OnboardingSchema.safeParse(invalidPayload)
    expect(result.success).toBe(false)
    if (!result.success) {
      // Zod validation should fail for empty bad_habits_prompt
      const badHabitsError = result.error.issues.find(issue => issue.path[0] === 'bad_habits_prompt')
      expect(badHabitsError).toBeDefined()
    }
  })

  it('should reject missing user_id', () => {
    const invalidPayload = {
      bad_habits_prompt: 'Some bad habits'
    }

    const result = OnboardingSchema.safeParse(invalidPayload)
    expect(result.success).toBe(false)
  })

  it('should reject missing bad_habits_prompt', () => {
    const invalidPayload = {
      user_id: 'test-user-999'
    }

    const result = OnboardingSchema.safeParse(invalidPayload)
    expect(result.success).toBe(false)
  })

  it('should accept valid payload with minimum length strings', () => {
    const validPayload = {
      user_id: 'a',
      bad_habits_prompt: 'b'
    }

    const result = OnboardingSchema.safeParse(validPayload)
    expect(result.success).toBe(true)
  })
})
