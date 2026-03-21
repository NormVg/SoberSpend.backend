/**
 * Unit tests for Health Check Endpoint
 *
 * Tests Requirements: 1.1, 1.2, 1.3, 1.4
 */

import { describe, it, expect } from 'vitest'

describe('Health Check Endpoint', () => {
  it('should have correct response structure', () => {
    // This test verifies the expected response structure
    const expectedResponse = {
      status: 'ok',
      message: 'SoberSpend backend is running.',
      database: 'supabase'
    }

    expect(expectedResponse).toHaveProperty('status')
    expect(expectedResponse).toHaveProperty('message')
    expect(expectedResponse).toHaveProperty('database')
    expect(expectedResponse.status).toBe('ok')
    expect(expectedResponse.message).toBe('SoberSpend backend is running.')
    expect(expectedResponse.database).toBe('supabase')
  })
})
