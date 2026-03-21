# Implementation Plan: Backend Migration to Nuxt 4 with AI SDK and Ollama

## Overview

This plan migrates the existing Python FastAPI backend to Nuxt 4 server routes with TypeScript, AI SDK for Ollama integration, and Supabase for data persistence. The implementation follows a bottom-up approach: database types → utilities → server routes → testing.

## Tasks

- [x] 1. Set up project dependencies and configuration
  - Install required packages: @ai-sdk/ollama, ai, @supabase/supabase-js, zod
  - Install dev dependencies: fast-check, vitest, @nuxt/test-utils
  - Create .env.example with required environment variables
  - _Requirements: 14.1, 14.2, 14.3_

- [ ] 2. Define TypeScript types and schemas
  - [x] 2.1 Create database type definitions
    - Create types/database.ts with Database interface for Users and Transactions tables
    - Define Row, Insert, and Update types for each table
    - _Requirements: 12.4, 10.5, 10.6_

  - [x] 2.2 Create API type definitions
    - Create types/api.ts with OnboardingRequest, OnboardingResponse, AnalysisResponse, Transaction, and UserContext interfaces
    - _Requirements: 12.2, 12.3_

  - [x] 2.3 Create Zod validation schemas
    - Create schemas/onboarding.ts with OnboardingSchema for user_id and bad_habits_prompt validation
    - Create schemas/analysis.ts with AnalysisOutputSchema for AI response validation
    - _Requirements: 12.5, 2.4, 2.5, 7.5, 7.6, 7.7, 7.8_

- [ ] 3. Implement Supabase client utility
  - [x] 3.1 Create Supabase client singleton
    - Create server/utils/supabase.ts with useSupabase() function
    - Read SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/SUPABASE_ANON_KEY from environment
    - Throw error if credentials are missing
    - Return typed Supabase client with Database types
    - _Requirements: 10.1, 10.2, 10.3, 14.3, 14.6_

  - [ ]* 3.2 Write property test for Supabase client
    - **Property: Missing credentials throw error**
    - **Validates: Requirements 10.3, 14.6**

- [ ] 4. Implement prompt builder utility
  - [x] 4.1 Create prompt construction functions
    - Create server/utils/prompt-builder.ts with buildPrompt() and formatTransactions() functions
    - Include user's bad habits in system prompt
    - Format recent transactions as readable list
    - Handle empty transactions with "No prior transaction history available."
    - Include AI output format instructions (JSON schema, budget_status values, roast guidelines)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

  - [ ]* 4.2 Write property test for prompt builder
    - **Property 7: Prompt contains bad habits**
    - **Validates: Requirements 5.1**

  - [ ]* 4.3 Write property test for transaction formatting
    - **Property 8: Prompt contains transaction history**
    - **Validates: Requirements 5.2**

  - [ ]* 4.4 Write unit test for empty transactions
    - Test that empty transactions array produces "No prior
   - Return UserContext object with badHabitsPrompt and transactions
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [ ]* 5.2 Write property test for transaction limit
    - **Property 5: Transaction context limit**
    - **Validates: Requirements 4.4**

  - [ ]* 5.3 Write property test for transaction isolation
    - **Property 6: Transaction context isolation**
    - **Validates: Requirements 4.5**

  - [ ]* 5.4 Write unit test for user not found
    - Test that non-existent user returns 404 with specific message
    - _Requirements: 4.2_

- [ ] 6. Implement transaction saver utility
  - [x] 6.1 Create transaction persistence function
    - Create server/utils/transaction-saver.ts with saveTransaction() function
    - Insert record into Transactions table with user_id, amount, and category
    - Throw 500 error if database insert fails
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.6_

  - [ ]* 6.2 Write property test for transaction persistence
    - **Property 17: Transaction persistence after analysis**
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4**

  - [ ]* 6.3 Write property test for timestamp auto-generation
    - **Property 18: Transaction timestamp auto-generation**
    - **Validates: Requirements 8.5**

- [ ] 7. Implement AI service utility
  - [x] 7.1 Create AI analysis function
    - Create server/utils/ai-service.ts with analyzeReceiptWithAI() function
    - Read OLLAMA_BASE_URL from environment with default "http://127.0.0.1:11434"
    - Read OLLAMA_MODEL from environment with default "llava"
    - Configure Ollama provider with AI SDK
    - Encode image bytes as base64 data URL
    - Build prompt using prompt-builder utility
    - Call generateObject() with AnalysisOutputSchema, temperature 0.7, and 90-second timeout
    - Catch AI provider errors and throw 502 error
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 7.1, 7.2, 7.3, 7.4_

  - [ ]* 7.2 Write property test for OLLAMA_BASE_URL default
    - **Property 9: OLLAMA_BASE_URL defaults to localhost**
    - **Validates: Requirements 6.2, 14.4**

  - [ ]* 7.3 Write property test for OLLAMA_MODEL default
    - **Property 10: OLLAMA_MODEL defaults to llava**
    - **Validates: Requirements 6.3, 14.5**

  - [ ]* 7.4 Write property test for AI provider error handling
    - **Property 11: AI provider error handling**
    - **Validates: Requirements 6.8, 13.4**

  - [ ]* 7.5 Write property test for base64 encoding
    - **Property 12: Image base64 encoding**
    - **Validates: Requirements 7.1**

  - [ ]* 7.6 Write property tests for AI response validation
    - **Property 13: Non-negative total_spent validation**
    - **Property 14: Non-empty category validation**
    - **Property 15: Valid budget_status validation**
    - **Property 16: Non-empty ai_roast validation**
    - **Validates: Requirements 7.5, 7.6, 7.7, 7.8, 7.9, 7.10**

  - [ ]* 7.7 Write unit test for AI service configuration
    - Test that temperature is set to 0.7 and timeout is 90 seconds
    - _Requirements: 6.6, 6.7_

- [x] 8. Checkpoint - Ensure all utility tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Implement health check endpoint
  - [x] 9.1 Create health check server route
    - Create server/api/index.get.ts with defineEventHandler
    - Query Supabase Users table to verify database connection
    - Return JSON with status "ok", message "SoberSpend backend is running.", and database "supabase"
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 10.4_

  - [ ]* 9.2 Write unit test for health check endpoint
    - Test that endpoint returns 200 with correct JSON structure
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 10. Implement onboarding endpoint
  - [x] 10.1 Create onboarding server route
    - Create server/api/onboarding.post.ts with defineEventHandler
    - Read request body with readBody()
    - Validate payload with OnboardingSchema
    - Throw 400 error if validation fails
    - Upsert user record to Supabase Users table
    - Return JSON with status "success" and message "Context saved."
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 15.2, 15.3, 15.4_

  - [ ]* 10.2 Write property test for onboarding data persistence
    - **Property 1: Onboarding data persistence**
    - **Validates: Requirements 2.2**

  - [ ]* 10.3 Write property test for onboarding upsert behavior
    - **Property 2: Onboarding upsert behavior**
    - **Validates: Requirements 2.3**

  - [ ]* 10.4 Write property test for validation error response
    - **Property 3: Validation error response**
    - **Validates: Requirements 2.6, 13.1**

  - [ ]* 10.5 Write property test for onboarding success response
    - **Property 4: Onboarding success response**
    - **Validates: Requirements 2.7**

- [ ] 11. Implement receipt analysis endpoint
  - [x] 11.1 Create receipt analysis server route
    - Create server/api/analyze-receipt.post.ts with defineEventHandler
    - Parse multipart form data with readMultipartFormData()
    - Extract file and user_id from form data
    - Validate that user_id is non-empty, throw 400 if missing
    - Validate that file data is non-empty, throw 400 if missing
    - Validate MIME type is image/jpeg or image/png, throw 400 if invalid
    - Fetch user context using context-fetcher utility
    - Call AI service with image bytes, MIME type, bad habits, and recent transactions
    - Save transaction using transaction-saver utility
    - Return JSON with status "success" and data object containing normalized analysis results
    - Normalize category and budget_status to lowercase
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 7.1, 7.2, 7.3, 7.4, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 15.2, 15.3, 15.4_

  - [ ]* 11.2 Write property test for analysis success response format
    - **Property 19: Analysis success response format**
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4**

  - [ ]* 11.3 Write property test for category normalization
    - **Property 20: Category normalization**
    - **Validates: Requirements 9.5**

  - [ ]* 11.4 Write property test for budget status normalization
    - **Property 21: Budget status normalization**
    - **Validates: Requirements 9.6**

  - [ ]* 11.5 Write unit test for validation errors
    - Test missing user_id returns 400
    - Test empty file returns 400
    - Test invalid MIME type returns 400
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 12. Configure CORS and error handling
  - [x] 12.1 Add CORS configuration
    - Configure Nuxt to enable CORS for all origins, methods, headers, and credentials
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [ ]* 12.2 Write property test for error response format
    - **Property 22: Error response format**
    - **Validates: Requirements 13.6**

  - [ ]* 12.3 Write unit tests for error handling
    - Test that validation errors return 400
    - Test that not found errors return 404
    - Test that database errors return 500
    - Test that AI provider errors return 502
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [x] 13. Checkpoint - Ensure all endpoint tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Create environment configuration documentation
  - [x] 14.1 Create .env.example file
    - Document all required environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
    - Document optional environment variables with defaults: OLLAMA_BASE_URL, OLLAMA_MODEL
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ] 15. Integration testing and final validation
  - [ ]* 15.1 Write end-to-end integration test
    - Test complete flow: onboarding → receipt analysis → transaction storage → context retrieval
    - _Requirements: All requirements_

  - [x] 15.2 Final checkpoint
    - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with minimum 100 iterations
- Unit tests validate specific examples and edge cases
- The implementation uses TypeScript throughout as specified in the design document
- All server routes follow Nuxt 4 conventions with file-based routing in server/api directory
