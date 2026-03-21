# Requirements Document

## Introduction

This document specifies the requirements for migrating the existing Python FastAPI backend to a Nuxt 4 server-based backend with AI SDK and Ollama integration. The migration maintains all existing functionality while modernizing the technology stack to TypeScript, Nuxt server routes, and the AI SDK for improved AI provider abstraction.

## Glossary

- **Backend_API**: The Nuxt server routes that handle HTTP requests
- **AI_Service**: The service that integrates with Ollama using AI SDK for receipt analysis
- **Supabase_Client**: The database client for interacting with Supabase tables
- **Receipt_Analyzer**: The component that processes receipt images and generates analysis
- **Prompt_Builder**: The utility that constructs AI prompts with user context
- **Onboarding_Handler**: The API endpoint that saves user onboarding data
- **Analysis_Handler**: The API endpoint that processes receipt uploads
- **Transaction_Store**: The Supabase Transactions table storage
- **User_Store**: The Supabase Users table storage
- **Ollama_Provider**: The AI SDK provider for Ollama integration
- **Context_Enricher**: The component that fetches and formats user context for AI prompts

## Requirements

### Requirement 1: Health Check Endpoint

**User Story:** As a system administrator, I want a health check endpoint, so that I can verify the backend is running and database is connected.

#### Acceptance Criteria

1. THE Backend_API SHALL provide a GET endpoint at "/" that returns status information
2. WHEN the health check endpoint is called, THE Backend_API SHALL return HTTP 200 with status "ok"
3. THE Backend_API SHALL include database connection status in the health check response
4. THE Backend_API SHALL return the response in JSON format with keys: status, message, database

### Requirement 2: User Onboarding

**User Story:** As a user, I want to save my bad habits during onboarding, so that the AI can personalize roasts based on my spending behavior.

#### Acceptance Criteria

1. THE Backend_API SHALL provide a POST endpoint at "/api/onboarding"
2. WHEN a valid onboarding request is received, THE Onboarding_Handler SHALL save the user_id and bad_habits_prompt to User_Store
3. WHEN a user_id already exists in User_Store, THE Onboarding_Handler SHALL update the bad_habits_prompt
4. THE Onboarding_Handler SHALL validate that user_id has minimum length of 1 character
5. THE Onboarding_Handler SHALL validate that bad_habits_prompt has minimum length of 1 character
6. WHEN validation fails, THE Onboarding_Handler SHALL return HTTP 400 with error details
7. WHEN the save operation succeeds, THE Onboarding_Handler SHALL return HTTP 200 with status "success"

### Requirement 3: Receipt Image Upload

**User Story:** As a user, I want to upload r
nd image/png
6. THE Analysis_Handler SHALL read the complete file contents into memory for processing

### Requirement 4: User Context Retrieval

**User Story:** As the system, I want to retrieve user context before analysis, so that AI roasts are personalized.

#### Acceptance Criteria

1. WHEN a receipt analysis is requested, THE Context_Enricher SHALL fetch the user record from User_Store
2. WHEN the user is not found in User_Store, THE Analysis_Handler SHALL return HTTP 404 with message "User not found. Complete onboarding first."
3. THE Context_Enricher SHALL retrieve the user's bad_habits_prompt from User_Store
4. THE Context_Enricher SHALL fetch the 20 most recent transactions from Transaction_Store ordered by timestamp descending
5. THE Context_Enricher SHALL filter transactions by user_id
6. THE Context_Enricher SHALL include amount, category, and timestamp fields for each transaction

### Requirement 5: AI Prompt Construction

**User Story:** As the system, I want to build context-aware prompts, so that the AI generates personalized roasts.

#### Acceptance Criteria

1. THE Prompt_Builder SHALL construct a system prompt that includes the user's bad habits
2. THE Prompt_Builder SHALL format recent transactions as a readable list in the prompt
3. WHEN no recent transactions exist, THE Prompt_Builder SHALL include the text "No prior transaction history available."
4. THE Prompt_Builder SHALL instruct the AI to return JSON with keys: total_spent, category, budget_status, ai_roast
5. THE Prompt_Builder SHALL specify budget_status values as: safe, warning, or danger
6. THE Prompt_Builder SHALL instruct the AI to generate 1-3 lines of sharp and funny roast text
7. THE Prompt_Builder SHALL instruct the AI to avoid hate speech or slurs
8. THE Prompt_Builder SHALL instruct the AI to reference both bad habits and spending history in the roast

### Requirement 6: Ollama AI Integration

**User Story:** As a developer, I want to use AI SDK with Ollama, so that I have a clean abstraction for AI provider integration.

#### Acceptance Criteria

1. THE AI_Service SHALL use AI SDK's Ollama provider instead of direct HTTP calls
2. THE AI_Service SHALL read Ollama base URL from environment variable OLLAMA_BASE_URL with default "http://127.0.0.1:11434"
3. THE AI_Service SHALL read Ollama model name from environment variable OLLAMA_MODEL with default "llava"
4. THE AI_Service SHALL configure the Ollama provider with the base URL
5. THE AI_Service SHALL use structured output mode to enforce JSON response format
6. THE AI_Service SHALL set temperature to 0.7 for AI generation
7. THE AI_Service SHALL set a timeout of 90 seconds for AI requests
8. WHEN the AI provider returns an error, THE AI_Service SHALL throw an error with status code 502

### Requirement 7: Receipt Image Analysis

**User Story:** As a user, I want the AI to analyze my receipt image, so that I receive spending insights and a personalized roast.

#### Acceptance Criteria

1. WHEN a receipt image is provided, THE Receipt_Analyzer SHALL encode the image as base64
2. THE Receipt_Analyzer SHALL send the image to Ollama_Provider with the constructed prompt
3. THE Receipt_Analyzer SHALL request structured JSON output from the AI
4. THE Receipt_Analyzer SHALL parse the AI response into a structured object
5. THE Receipt_Analyzer SHALL validate that total_spent is a non-negative integer
6. THE Receipt_Analyzer SHALL validate that category is a non-empty string
7. THE Receipt_Analyzer SHALL validate that budget_status is one of: safe, warning, danger
8. THE Receipt_Analyzer SHALL validate that ai_roast is a non-empty string
9. WHEN the AI returns invalid JSON, THE Receipt_Analyzer SHALL throw an error with status code 502
10. WHEN the AI response fails validation, THE Receipt_Analyzer SHALL throw an error with status code 502

### Requirement 8: Transaction Storage

**User Story:** As the system, I want to save analyzed transactions, so that they can be used for future context.

#### Acceptance Criteria

1. WHEN receipt analysis succeeds, THE Analysis_Handler SHALL insert a new record into Transaction_Store
2. THE Analysis_Handler SHALL save the user_id from the request
3. THE Analysis_Handler SHALL save the total_spent from the AI analysis as amount
4. THE Analysis_Handler SHALL save the category from the AI analysis
5. THE Transaction_Store SHALL automatically set the timestamp to the current time
6. WHEN the database insert fails, THE Analysis_Handler SHALL return HTTP 500 with error details

### Requirement 9: Analysis Response Format

**User Story:** As a client application, I want a consistent response format, so that I can reliably parse analysis results.

#### Acceptance Criteria

1. WHEN receipt analysis succeeds, THE Analysis_Handler SHALL return HTTP 200
2. THE Analysis_Handler SHALL return JSON with a top-level "status" field set to "success"
3. THE Analysis_Handler SHALL return a "data" field containing the analysis object
4. THE Analysis_Handler SHALL include total_spent, category, budget_status, and ai_roast in the data object
5. THE Analysis_Handler SHALL normalize category to lowercase
6. THE Analysis_Handler SHALL normalize budget_status to lowercase

### Requirement 10: Supabase Database Integration

**User Story:** As a developer, I want to use Supabase for data persistence, so that user data and transactions are stored reliably.

#### Acceptance Criteria

1. THE Supabase_Client SHALL read connection URL from environment variable SUPABASE_URL
2. THE Supabase_Client SHALL read API key from SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY environment variable
3. WHEN Supabase credentials are missing, THE Backend_API SHALL throw an error during initialization
4. THE Supabase_Client SHALL verify database connection on startup by querying the Users table
5. THE Supabase_Client SHALL use the Users table with columns: id (text primary key), bad_habits_prompt (text)
6. THE Supabase_Client SHALL use the Transactions table with columns: id (bigint), user_id (text), amount (integer), category (text), timestamp (timestamptz)
7. THE Supabase_Client SHALL support upsert operations on the Users table with conflict resolution on id

### Requirement 11: CORS Configuration

**User Story:** As a frontend developer, I want CORS enabled, so that my client application can make cross-origin requests.

#### Acceptance Criteria

1. THE Backend_API SHALL enable CORS for all origins
2. THE Backend_API SHALL allow all HTTP methods
3. THE Backend_API SHALL allow all HTTP headers
4. THE Backend_API SHALL allow credentials in CORS requests

### Requirement 12: TypeScript Type Safety

**User Story:** As a developer, I want full TypeScript type safety, so that I catch errors at compile time.

#### Acceptance Criteria

1. THE Backend_API SHALL use TypeScript for all server route implementations
2. THE Backend_API SHALL define TypeScript interfaces for all request payloads
3. THE Backend_API SHALL define TypeScript interfaces for all response payloads
4. THE Backend_API SHALL define TypeScript types for database table schemas
5. THE Backend_API SHALL use Zod or similar for runtime validation of request data
6. THE AI_Service SHALL use TypeScript types for AI SDK integration

### Requirement 13: Error Handling

**User Story:** As a client application, I want consistent error responses, so that I can handle failures gracefully.

#### Acceptance Criteria

1. WHEN a validation error occurs, THE Backend_API SHALL return HTTP 400 with error details
2. WHEN a resource is not found, THE Backend_API SHALL return HTTP 404 with error message
3. WHEN a database error occurs, THE Backend_API SHALL return HTTP 500 with error details
4. WHEN an AI provider error occurs, THE Backend_API SHALL return HTTP 502 with error details
5. THE Backend_API SHALL include descriptive error messages in all error responses
6. THE Backend_API SHALL return errors in JSON format with a "detail" or "message" field

### Requirement 14: Environment Configuration

**User Story:** As a developer, I want environment-based configuration, so that I can deploy to different environments.

#### Acceptance Criteria

1. THE Backend_API SHALL read all configuration from environment variables
2. THE Backend_API SHALL provide sensible defaults for optional configuration
3. THE Backend_API SHALL require SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/SUPABASE_ANON_KEY
4. THE Backend_API SHALL use default "http://127.0.0.1:11434" for OLLAMA_BASE_URL when not provided
5. THE Backend_API SHALL use default "llava" for OLLAMA_MODEL when not provided
6. THE Backend_API SHALL validate required environment variables on startup

### Requirement 15: Nuxt Server Routes Structure

**User Story:** As a developer, I want to follow Nuxt conventions, so that the codebase is maintainable and idiomatic.

#### Acceptance Criteria

1. THE Backend_API SHALL implement endpoints as Nuxt server routes in the server/api directory
2. THE Backend_API SHALL use Nuxt's auto-imported utilities like defineEventHandler
3. THE Backend_API SHALL use Nuxt's readBody and readMultipartFormData for request parsing
4. THE Backend_API SHALL leverage Nuxt's built-in error handling with createError
5. THE Backend_API SHALL organize shared utilities in server/utils directory
6. THE AI_Service SHALL be implemented as a server utility for reusability
