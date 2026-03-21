# Design Document: Backend Migration to Nuxt 4 with AI SDK and Ollama

## Overview

This design specifies the migration of the existing Python FastAPI backend to a modern Nuxt 4 server-based architecture with TypeScript, AI SDK for Ollama integration, and Supabase for data persistence. The migration maintains all existing functionality while improving type safety, developer experience, and AI provider abstraction.

The system provides three main capabilities:
1. Health check endpoint for monitoring
2. User onboarding to capture spending habits
3. Receipt image analysis with AI-powered personalized financial roasts

The migration replaces direct HTTP calls to Ollama with the AI SDK's provider abstraction, enabling better error handling, structured outputs, and future provider flexibility. All endpoints follow Nuxt 4 conventions using server routes in the `server/api` directory.

## Architecture

### High-Level Architecture

```
┌─────────────────┐
│  Nuxt Client    │
│   (Frontend)    │
└────────┬────────┘
         │ HTTP/HTTPS
         ▼
┌─────────────────────────────────────────┐
│      Nuxt 4 Server Routes               │
│  ┌─────────────────────────────────┐   │
│  │  GET /                          │   │
│  │  POST /api/onboarding           │   │
│  │  POST /api/analyze-receipt      │   │
│  └─────────────────────────────────┘   │
└───┬─────────────────────────────┬───────┘
    │                             │
    │ Supabase Client             │ AI SDK
    ▼                             ▼
┌──────────────┐          ┌──────────────┐
│   Supabase   │          │    Ollama    │
│   Database   │          │   Provider   │
│              │          │              │
│ - Users      │          │ - llava      │
│ - Transactions│         │   model      │
└──────────────┘          └──────────────┘
```

### Technology Stack

- **Runtime**: Node.js with Nuxt 4
- **Language**: TypeScript with strict type checking
- **Framework**: Nuxt 4 server routes
- **AI Integration**: AI SDK (@ai-sdk/ollama)
- **Database**: Supabase (PostgreSQL)
- **Validation**: Zod for runtime type validation
- **Image Processing**: Base64 encoding for multipart uploads

### Key Design Decisions

1. **AI SDK over Direct HTTP**: Using AI SDK's Ollama provider provides structured output enforcement, better error handling, and abstraction for potential future provider changes.

2. **Nuxt Server Routes**: Leveraging Nuxt's file-based routing in `server/api` provides automatic endpoint registration, built-in utilities, and idiomatic TypeScript integration.

3. **Zod Validation**: Runtime validation with Zod ensures type safety at API boundaries and provides clear error messages for invalid requests.

4. **Service Layer Pattern**: Extracting AI logic into `server/utils` promotes reusability and testability while keeping route handlers focused on HTTP concerns.

5. **Environment-Based Configuration**: All external dependencies (Supabase, Ollama) are configured via environment variables with sensible defaults for development.

## Components and Interfaces

### Server Routes

#### 1. Health Check Route (`server/api/index.get.ts`)

```typescript
export default defineEventHandler(async (event) => {
  // Verify Supabase connection
  const supabase = useSupabase()
  await supabase.from('Users').select('id').limit(1)

  return {
    status: 'ok',
    message: 'SoberSpend backend is running.',
    database: 'supabase'
  }
})
```

**Responsibilities**:
- Return 200 OK status
- Verify database connectivity
- Provide JSON response with status information

#### 2. Onboarding Route (`server/api/onboarding.post.ts`)

```typescript
import { z } from 'zod'

const OnboardingSchema = z.object({
  user_id: z.string().min(1),
  bad_habits_prompt: z.string().min(1)
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const payload = OnboardingSchema.parse(body)

  const supabase = useSupabase()
  await supabase.from('Users').upsert({
    id: payload.user_id,
    bad_habits_prompt: payload.bad_habits_prompt
  })

  return {
    status: 'success',
    message: 'Context saved.'
  }
})
```

**Responsibilities**:
- Validate request payload with Zod
- Upsert user record to Supabase
- Return success response

#### 3. Receipt Analysis Route (`server/api/analyze-receipt.post.ts`)

```typescript
export default defineEventHandler(async (event) => {
  // Parse multipart form data
  const formData = await readMultipartFormData(event)
  const file = formData.find(f => f.name === 'file')
  const userId = formData.find(f => f.name === 'user_id')?.data.toString()

  // Validate inputs
  if (!userId?.trim()) {
    throw createError({ statusCode: 400, message: 'user_id is required.' })
  }
  if (!file?.data) {
    throw createError({ statusCode: 400, message: 'Uploaded file is empty.' })
  }

  // Fetch
      budget_status: analysis.budgetStatus.toLowerCase(),
      ai_roast: analysis.aiRoast
    }
  }
})
```

**Responsibilities**:
- Parse multipart form data (file + user_id)
- Validate required fields
- Fetch user context from database
- Invoke AI service for receipt analysis
- Save transaction to database
- Return formatted analysis response

### Server Utilities

#### 1. Supabase Client (`server/utils/supabase.ts`)

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database'

let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export function useSupabase() {
  if (supabaseClient) return supabaseClient

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/SUPABASE_ANON_KEY')
  }

  supabaseClient = createClient<Database>(url, key)
  return supabaseClient
}
```

**Responsibilities**:
- Initialize Supabase client with environment variables
- Provide singleton instance
- Enforce type safety with Database types

#### 2. AI Service (`server/utils/ai-service.ts`)

```typescript
import { ollama } from '@ai-sdk/ollama'
import { generateObject } from 'ai'
import { z } from 'zod'

const AnalysisSchema = z.object({
  total_spent: z.number().int().nonnegative(),
  category: z.string().min(1),
  budget_status: z.enum(['safe', 'warning', 'danger']),
  ai_roast: z.string().min(1)
})

export async function analyzeReceiptWithAI(params: {
  imageBytes: Buffer
  mimeType: string
  badHabitsPrompt: string
  recentTransactions: Transaction[]
}) {
  const baseUrl = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434'
  const modelName = process.env.OLLAMA_MODEL || 'llava'

  const provider = ollama(modelName, { baseURL: baseUrl })

  const prompt = buildPrompt(
    params.badHabitsPrompt,
    params.recentTransactions
  )

  const imageBase64 = params.imageBytes.toString('base64')
  const imageDataUrl = `data:${params.mimeType};base64,${imageBase64}`

  try {
    const result = await generateObject({
      model: provider,
      schema: AnalysisSchema,
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
      abortSignal: AbortSignal.timeout(90000)
    })

    return result.object
  } catch (error) {
    throw createError({
      statusCode: 502,
      message: `AI provider error: ${error.message}`
    })
  }
}
```

**Responsibilities**:
- Configure Ollama provider with AI SDK
- Build context-aware prompts
- Encode images as base64 data URLs
- Generate structured JSON output with schema validation
- Handle AI provider errors with 502 status

#### 3. Prompt Builder (`server/utils/prompt-builder.ts`)

```typescript
export function buildPrompt(
  badHabitsPrompt: string,
  recentTransactions: Transaction[]
): string {
  const transactionsContext = formatTransactions(recentTransactions)

  return `
You are SoberSpend AI, a harsh and sarcastic financial accountability coach.

Your job:
1) Read the uploaded receipt image and extract spending details.
2) Roast the user in a witty, aggressive style.
3) Personalize the roast using BOTH:
   - User's confessed bad habits
   - Their recent transaction history

User confessed bad habits:
${badHabitsPrompt}

Recent transaction history:
${transactionsContext}

Output rules:
- Return JSON only.
- total_spent: integer amount from the current receipt.
- category: best category for this receipt (food, shopping, travel, etc.).
- budget_status: one of safe, warning, danger.
- ai_roast: 1-3 lines, sharp and funny, directly referencing bad habits and spending history.
- No hate speech or slurs.
- Do not include markdown.
`.trim()
}

function formatTransactions(transactions: Transaction[]): string {
  if (transactions.length === 0) {
    return 'No prior transaction history available.'
  }

  return transactions
    .slice(0, 20)
    .map(tx => `- amount=${tx.amount}, category=${tx.category}, timestamp=${tx.timestamp}`)
    .join('\n')
}
```

**Responsibilities**:
- Construct system prompt with user context
- Format transaction history as readable list
- Include AI output format instructions

#### 4. Context Fetcher (`server/utils/context-fetcher.ts`)

```typescript
export async function fetchUserContext(userId: string) {
  const supabase = useSupabase()

  // Fetch user
  const { data: users, error: userError } = await supabase
    .from('Users')
    .select('id, bad_habits_prompt')
    .eq('id', userId)
    .limit(1)

  if (userError || !users || users.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'User not found. Complete onboarding first.'
    })
  }

  // Fetch recent transactions
  const { data: transactions } = await supabase
    .from('Transactions')
    .select('amount, category, timestamp')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(20)

  return {
    badHabitsPrompt: users[0].bad_habits_prompt,
    transactions: transactions || []
  }
}
```

**Responsibilities**:
- Query user record from Supabase
- Return 404 if user not found
- Fetch 20 most recent transactions
- Return structured context object

#### 5. Transaction Saver (`server/utils/transaction-saver.ts`)

```typescript
export async function saveTransaction(
  userId: string,
  analysis: { total_spent: number; category: string }
) {
  const supabase = useSupabase()

  const { error } = await supabase
    .from('Transactions')
    .insert({
      user_id: userId,
      amount: analysis.total_spent,
      category: analysis.category
    })

  if (error) {
    throw createError({
      statusCode: 500,
      message: `Database error: ${error.message}`
    })
  }
}
```

**Responsibilities**:
- Insert transaction record to Supabase
- Handle database errors with 500 status

## Data Models

### TypeScript Interfaces

```typescript
// types/database.ts
export interface Database {
  public: {
    Tables: {
      Users: {
        Row: {
          id: string
          bad_habits_prompt: string
        }
        Insert: {
          id: string
          bad_habits_prompt: string
        }
        Update: {
          id?: string
          bad_habits_prompt?: string
        }
      }
      Transactions: {
        Row: {
          id: number
          user_id: string
          amount: number
          category: string
          timestamp: string
        }
        Insert: {
          user_id: string
          amount: number
          category: string
          timestamp?: string
        }
        Update: {
          user_id?: string
          amount?: number
          category?: string
          timestamp?: string
        }
      }
    }
  }
}

// types/api.ts
export interface OnboardingRequest {
  user_id: string
  bad_habits_prompt: string
}

export interface OnboardingResponse {
  status: 'success'
  message: string
}

export interface AnalysisResponse {
  status: 'success'
  data: {
    total_spent: number
    category: string
    budget_status: 'safe' | 'warning' | 'danger'
    ai_roast: string
  }
}

export interface Transaction {
  amount: number
  category: string
  timestamp: string
}

export interface UserContext {
  badHabitsPrompt: string
  transactions: Transaction[]
}
```

### Zod Schemas

```typescript
// schemas/onboarding.ts
import { z } from 'zod'

export const OnboardingSchema = z.object({
  user_id: z.string().min(1, 'user_id must not be empty'),
  bad_habits_prompt: z.string().min(1, 'bad_habits_prompt must not be empty')
})

// schemas/analysis.ts
export const AnalysisOutputSchema = z.object({
  total_spent: z.number().int().nonnegative(),
  category: z.string().min(1),
  budget_status: z.enum(['safe', 'warning', 'danger']),
  ai_roast: z.string().min(1)
})
```

### Database Schema

The existing Supabase schema remains unchanged:

```sql
create table if not exists public."Users" (
    id text primary key,
    bad_habits_prompt text not null
);

create table if not exists public."Transactions" (
    id bigint generated by default as identity primary key,
    user_id text not null references public."Users"(id) on delete cascade,
    amount integer not null,
    category text not null,
    timestamp timestamptz not null default now()
);

create index if not exists transactions_user_id_idx on public."Transactions"(user_id);
create index if not exists transactions_timestamp_idx on public."Transactions"(timestamp desc);
```


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property Reflection

After analyzing all 90+ acceptance criteria, I identified the following testable properties and performed redundancy elimination:

**Redundancies Eliminated:**
- Requirements 2.6 and 13.1 both test validation error handling → consolidated into Property 2
- Requirements 4.2 and 13.2 both test 404 responses → consolidated into example test
- Requirements 6.8 and 13.4 both test AI provider error handling → consolidated into Property 11
- Requirements 8.2, 8.3, 8.4 all test transaction field saving → consolidated into Property 13
- Requirements 9.2, 9.3, 9.4 all test response structure → consolidated into Property 15
- Requirements 6.2, 14.2, 14.4 all test OLLAMA_BASE_URL defaults → consolidated into Property 9
- Requirements 6.3, 14.2, 14.5 all test OLLAMA_MODEL defaults → consolidated into Property 10
- Requirements 10.3, 14.3, 14.6 all test required env vars → consolidated into example test

**Properties vs Examples:**
- Properties: Universal rules that apply across all valid inputs (tested with property-based testing)
- Examples: Specific test cases for concrete scenarios (tested with unit tests)
- Edge cases: Handled by property test generators (empty strings, invalid inputs, etc.)

### Property 1: Onboarding Data Persistence

*For any* valid user_id and bad_habits_prompt, when an onboarding request is submitted, querying the Users table should return the same user_id and bad_habits_prompt.

**Validates: Requirements 2.2**

### Property 2: Onboarding Upsert Behavior

*For any* existing user_id, when a new onboarding request is submitted with a different bad_habits_prompt, the stored bad_habits_prompt should be updated to the new value.

**Validates: Requirements 2.3**

### Property 3: Validation Error Response

*For any* invalid onboarding request (empty user_id or empty bad_habits_prompt), the endpoint should return HTTP 400 with error details.

**Validates: Requirements 2.6, 13.1**

### Property 4: Onboarding Success Response

*For any* valid onboarding request, the endpoint should return HTTP 200 with status "success".

**Validates: Requirements 2.7**

### Property 5: Transaction Context Limit

*For any* user with more than 20 transactions, when fetching user context, only the 20 most recent transactions (ordered by timestamp descending) should be retrieved.

**Validates: Requirements 4.4**

### Property 6: Transaction Context Isolation

*For any* user_id, when fetching user context, only transactions belonging to that user_id should be retrieved (no transactions from other users).

**Validates: Requirements 4.5**

### Property 7: Prompt Contains Bad Habits

*For any* bad_habits_prompt string, the constructed system prompt should contain the complete bad_habits_prompt text.

**Validates: Requirements 5.1**

### Property 8: Prompt Contains Transaction History

*For any*
the AI service should use the OLLAMA_MODEL environment variable when set, and default to "llava" when not set.

**Validates: Requirements 6.3, 14.5**

### Property 11: AI Provider Error Handling

*For any* AI provider error (network failure, timeout, invalid response), the AI service should throw an error with status code 502.

**Validates: Requirements 6.8, 13.4**

### Property 12: Image Base64 Encoding

*For any* image bytes, the receipt analyzer should encode them as valid base64 that can be decoded back to the original bytes.

**Validates: Requirements 7.1**

### Property 13: AI Response Validation - Non-negative Total

*For any* AI response, if total_spent is negative, the receipt analyzer should reject it with a 502 error.

**Validates: Requirements 7.5**

### Property 14: AI Response Validation - Non-empty Category

*For any* AI response, if category is an empty string, the receipt analyzer should reject it with a 502 error.

**Validates: Requirements 7.6**

### Property 15: AI Response Validation - Valid Budget Status

*For any* AI response, if budget_status is not one of "safe", "warning", or "danger", the receipt analyzer should reject it with a 502 error.

**Validates: Requirements 7.7**

### Property 16: AI Response Validation - Non-empty Roast

*For any* AI response, if ai_roast is an empty string, the receipt analyzer should reject it with a 502 error.

**Validates: Requirements 7.8**

### Property 17: Transaction Persistence After Analysis

*For any* successful receipt analysis, a new transaction record should be inserted into the Transactions table with the correct user_id, amount (from total_spent), and category.

**Validates: Requirements 8.1, 8.2, 8.3, 8.4**

### Property 18: Transaction Timestamp Auto-generation

*For any* saved transaction, the timestamp field should be automatically set to a recent time (within the last few seconds of insertion).

**Validates: Requirements 8.5**

### Property 19: Analysis Success Response Format

*For any* successful receipt analysis, the response should have HTTP 200 status, a top-level "status" field set to "success", and a "data" field containing total_spent, category, budget_status, and ai_roast.

**Validates: Requirements 9.1, 9.2, 9.3, 9.4**

### Property 20: Category Normalization

*For any* AI-generated category value, the response should normalize it to lowercase before returning.

**Validates: Requirements 9.5**

### Property 21: Budget Status Normalization

*For any* AI-generated budget_status value, the response should normalize it to lowercase before returning.

**Validates: Requirements 9.6**

### Property 22: Error Response Format

*For any* error condition (400, 404, 500, 502), the response should be in JSON format with either a "detail" or "message" field containing a descriptive error message.

**Validates: Requirements 13.6**

## Error Handling

### Error Categories and HTTP Status Codes

The system uses standard HTTP status codes to communicate different error conditions:

**400 Bad Request**
- Invalid request payload (missing required fields, empty strings)
- Invalid file upload (empty file, unsupported MIME type)
- Validation errors from Zod schemas

**404 Not Found**
- User not found in database (user must complete onboarding first)

**500 Internal Server Error**
- Database connection failures
- Database query/insert failures
- Unexpected server-side errors

**502 Bad Gateway**
- AI provider errors (Ollama unavailable, timeout, network failure)
- Invalid AI response (malformed JSON, failed validation)
- AI model errors

### Error Response Format

All errors follow a consistent JSON format:

```typescript
{
  "statusCode": number,
  "statusMessage": string,
  "message": string,  // or "detail": string
  "data": {
    // Optional additional error context
  }
}
```

### Error Handling Implementation

**Nuxt Error Handling**:
```typescript
// Using createError for consistent error responses
throw createError({
  statusCode: 400,
  message: 'user_id is required.'
})
```

**Zod Validation Errors**:
```typescript
try {
  const payload = OnboardingSchema.parse(body)
} catch (error) {
  if (error instanceof z.ZodError) {
    throw createError({
      statusCode: 400,
      message: 'Validation failed',
      data: error.errors
    })
  }
}
```

**Database Errors**:
```typescript
const { data, error } = await supabase.from('Users').insert(...)
if (error) {
  throw createError({
    statusCode: 500,
    message: `Database error: ${error.message}`
  })
}
```

**AI Provider Errors**:
```typescript
try {
  const result = await generateObject({ ... })
} catch (error) {
  throw createError({
    statusCode: 502,
    message: `AI provider error: ${error.message}`
  })
}
```

### Timeout Handling

- AI requests have a 90-second timeout using `AbortSignal.timeout(90000)`
- Timeout errors are caught and returned as 502 Bad Gateway
- Database queries use Supabase's default timeout settings

### Validation Strategy

**Request Validation**:
- All request payloads validated with Zod schemas before processing
- Multipart form data validated for required fields and non-empty values
- MIME type validation for uploaded images

**Response Validation**:
- AI responses validated against Zod schema before returning to client
- Ensures total_spent is non-negative integer
- Ensures category and ai_roast are non-empty strings
- Ensures budget_status is one of the allowed enum values

**Database Validation**:
- Foreign key constraints ensure referential integrity
- NOT NULL constraints on required fields
- Primary key constraints prevent duplicates

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit tests and property-based tests to achieve comprehensive coverage:

**Unit Tests**: Verify specific examples, edge cases, and integration points
- Health check endpoint returns correct structure
- Onboarding endpoint exists and accepts POST requests
- Analysis endpoint accepts multipart/form-data
- User not found returns 404 with specific message
- Empty transactions list includes "No prior transaction history available."
- Prompt includes specific AI instructions (JSON format, budget_status values, etc.)
- CORS headers are present in responses
- Supabase client reads correct environment variables
- Missing Supabase credentials throw error on initialization
- AI service uses temperature 0.7 and 90-second timeout

**Property-Based Tests**: Verify universal properties across all inputs
- All properties listed in the Correctness Properties section
- Minimum 100 iterations per property test
- Each test tagged with feature name and property reference

### Property-Based Testing Configuration

**Library**: fast-check (JavaScript/TypeScript property-based testing library)

**Installation**:
```bash
pnpm add -D fast-check vitest @nuxt/test-utils
```

**Test Structure**:
```typescript
import { describe, it, expect } from 'vitest'
import fc from 'fast-check'

describe('Onboarding API', () => {
  it('Property 1: Onboarding Data Persistence - Feature: backend-migration-ollama-ai, Property 1: For any valid user_id and bad_habits_prompt, when an onboarding request is submitted, querying the Users table should return the same user_id and bad_habits_prompt', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1 }),  // user_id
        fc.string({ minLength: 1 }),  // bad_habits_prompt
        async (userId, badHabits) => {
          // Submit onboarding request
          const response = await $fetch('/api/onboarding', {
            method: 'POST',
            body: { user_id: userId, bad_habits_prompt: badHabits }
          })

          // Query database
          const supabase = useSupabase()
          const { data } = await supabase
            .from('Users')
            .select('*')
            .eq('id', userId)
            .single()

          // Verify persistence
          expect(data.id).toBe(userId)
          expect(data.bad_habits_prompt).toBe(badHabits)
        }
      ),
      { numRuns: 100 }
    )
  })
})
```

**Custom Generators**:
```typescript
// Generator for valid image bytes
const imageBytes = fc.uint8Array({ minLength: 100, maxLength: 10000 })

// Generator for transactions
const transaction = fc.record({
  amount: fc.integer({ min: 0, max: 100000 }),
  category: fc.constantFrom('food', 'shopping', 'travel', 'entertainment'),
  timestamp: fc.date()
})

// Generator for AI responses
const aiResponse = fc.record({
  total_spent: fc.integer({ min: 0, max: 100000 }),
  category: fc.string({ minLength: 1 }),
  budget_status: fc.constantFrom('safe', 'warning', 'danger'),
  ai_roast: fc.string({ minLength: 1, maxLength: 500 })
})
```

### Test Organization

```
tests/
├── unit/
│   ├── health-check.test.ts
│   ├── onboarding.test.ts
│   ├── analyze-receipt.test.ts
│   ├── prompt-builder.test.ts
│   └── ai-service.test.ts
├── property/
│   ├── onboarding-properties.test.ts
│   ├── context-fetcher-properties.test.ts
│   ├── prompt-builder-properties.test.ts
│   ├── ai-service-properties.test.ts
│   ├── transaction-properties.test.ts
│   └── response-format-properties.test.ts
└── integration/
    └── end-to-end.test.ts
```

### Test Coverage Goals

- **Unit Tests**: Cover all example test cases and edge cases identified in prework
- **Property Tests**: Cover all 22 properties with minimum 100 iterations each
- **Integration Tests**: Cover complete user flows (onboarding → analysis → transaction storage)
- **Code Coverage**: Aim for 80%+ line coverage, 90%+ branch coverage

### Mocking Strategy

**Database Mocking**:
- Use in-memory Supabase instance for tests
- Seed test data before each test suite
- Clean up after each test to ensure isolation

**AI Provider Mocking**:
- Mock Ollama responses for unit tests
- Use real Ollama instance for integration tests (if available)
- Provide fixture responses for common scenarios

**Environment Variables**:
- Use test-specific .env.test file
- Override with process.env in test setup
- Restore original values after tests

### Continuous Integration

- Run all tests on every commit
- Fail build if any test fails
- Generate coverage reports
- Run property tests with increased iterations (1000+) on main branch

