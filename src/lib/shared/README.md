# Shared Code

Code shared between client and server including types, schemas, and utilities.

## Directory Structure

```
shared/
└── openai/           # OpenAI-related shared code
    └── index.ts      # OpenAI models, types, and schemas
```

## Purpose

The shared directory contains code that needs to be used by both client-side and server-side components:

- **Type Definitions**: TypeScript interfaces used across the application
- **Validation Schemas**: Zod schemas for runtime type checking
- **Constants**: Configuration values and enums
- **Utilities**: Pure functions with no side effects

## OpenAI Shared Module (`openai/`)

### Model Definitions
```typescript
export enum OpenAIModel {
  GPT_4 = 'gpt-4',
  GPT_4_TURBO = 'gpt-4-turbo', 
  GPT_41_NANO = 'gpt-4o-mini',  // Current model in use
  GPT_3_5_TURBO = 'gpt-3.5-turbo',
  TEXT_EMBEDDING_3_LARGE = 'text-embedding-3-large',
  TEXT_EMBEDDING_3_SMALL = 'text-embedding-3-small'
}
```

### Validation Schemas
```typescript
export const callAnalysisSchema = z.object({
  transcript: z.string(),
  callId: z.string(),
  purpose: z.enum(['order_extraction', 'call_summary', 'success_analysis']).optional()
});

export type CallAnalysisRequest = z.infer<typeof callAnalysisSchema>;
```

## Design Principles

### Universal Compatibility
- **No Side Effects**: Shared code should be pure and side-effect free
- **Environment Agnostic**: Works in both browser and Node.js environments
- **No Dependencies**: Minimal external dependencies to avoid conflicts

### Type Safety
- **Runtime Validation**: Zod schemas provide both compile-time and runtime type safety
- **Consistent Types**: Single source of truth for data structures
- **Inference**: TypeScript type inference from Zod schemas

### Maintainability
- **Single Source**: Shared types prevent duplication and inconsistency
- **Versioned**: Changes to shared code affect both client and server
- **Documentation**: Clear documentation of all shared interfaces

## Usage Patterns

### Client-Side Usage
```typescript
// In Svelte components
import { OpenAIModel, callAnalysisSchema } from '$shared/openai';

// Type-safe model selection
const selectedModel: OpenAIModel = OpenAIModel.GPT_41_NANO;

// Runtime validation
const validatedData = callAnalysisSchema.parse(userInput);
```

### Server-Side Usage
```typescript
// In API endpoints
import { OpenAIModel, type CallAnalysisRequest } from '$shared/openai';

// Service configuration
const analysisConfig = {
  model: OpenAIModel.GPT_41_NANO,
  temperature: 0.1
};

// Type-safe request handling
export const POST: RequestHandler = async ({ request }) => {
  const data: CallAnalysisRequest = await request.json();
  // data is now type-safe and validated
};
```

## Shared Code Categories

### Type Definitions
- **Interfaces**: Data structure definitions
- **Enums**: Constant value definitions
- **Union Types**: Flexible type combinations
- **Generic Types**: Reusable type patterns

### Validation Schemas
- **Zod Schemas**: Runtime type validation
- **Request/Response**: API contract validation
- **Configuration**: Settings and options validation
- **Data Transformation**: Type-safe data mapping

### Constants
- **API Endpoints**: URL patterns and routes
- **Configuration**: Default values and settings
- **Error Codes**: Standardized error identifiers
- **Feature Flags**: Application feature toggles

## Best Practices

### Adding Shared Code
1. **Evaluate Need**: Ensure code is truly needed by both client and server
2. **Pure Functions**: No side effects or external dependencies
3. **Type Safety**: Always provide TypeScript definitions
4. **Validation**: Use Zod for runtime type checking
5. **Documentation**: Clear usage examples and API documentation

### Schema Design
```typescript
// Good: Descriptive and type-safe
export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  language: z.string().min(2).max(5)
});

// Good: Inferred types
export type UserPreferences = z.infer<typeof userPreferencesSchema>;
```

### Import Patterns
```typescript
// Specific imports for better tree-shaking
import { OpenAIModel } from '$shared/openai';
import type { CallAnalysisRequest } from '$shared/openai';

// Avoid namespace imports in shared code
// import * as OpenAI from '$shared/openai'; // ❌ Avoid
```

## Development Guidelines

1. **Purity**: Shared code should have no side effects
2. **Compatibility**: Ensure code works in all target environments
3. **Type Safety**: Provide comprehensive TypeScript definitions
4. **Validation**: Use runtime validation for critical data structures
5. **Testing**: Write tests that run in both client and server environments
6. **Documentation**: Maintain clear usage examples and API references
7. **Versioning**: Consider impact of changes on both client and server code 