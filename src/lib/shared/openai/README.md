# Shared OpenAI Types

Shared TypeScript types, enums, and schemas for OpenAI integration across client and server.

## Purpose

This module provides a single source of truth for OpenAI-related types that need to be used by both client-side and server-side code, ensuring consistency and preventing duplication.

## Model Definitions (`index.ts`)

### OpenAI Model Enum
```typescript
export enum OpenAIModel {
  GPT_4 = 'gpt-4',
  GPT_4_TURBO = 'gpt-4-turbo',
  GPT_41_NANO = 'gpt-4o-mini',        // Primary model (cost-effective)
  GPT_3_5_TURBO = 'gpt-3.5-turbo',
  TEXT_EMBEDDING_3_LARGE = 'text-embedding-3-large',
  TEXT_EMBEDDING_3_SMALL = 'text-embedding-3-small'
}
```

**Current Model Usage**:
- **Primary**: `GPT_41_NANO` (gpt-4o-mini) for cost-effectiveness and performance
- **Legacy**: Other models available for specific use cases
- **Updated**: Model name reflects current OpenAI naming (4.1-nano vs 4.1)

## Validation Schemas

### Call Analysis Request
```typescript
export const callAnalysisSchema = z.object({
  transcript: z.string(),
  callId: z.string(),
  purpose: z.enum(['order_extraction', 'call_summary', 'success_analysis']).optional()
});

export type CallAnalysisRequest = z.infer<typeof callAnalysisSchema>;
```

### Response Schemas
```typescript
// Pizza order analysis response
export const pizzaOrderAnalysisSchema = z.object({
  'Was the pizza order successful?': z.string(),
  'What specific pizzas were ordered?': z.string(),
  'What is the total cost?': z.string(),
  'What is the pickup time?': z.string(),
  'What is the restaurant\'s address?': z.string(),
  'What is the confirmation number?': z.string(),
  'Any special instructions?': z.string(),
  'Payment method discussed?': z.string(),
  'Call quality assessment': z.string(),
  'Any issues or concerns?': z.string()
});

// General call analysis response
export const callAnalysisResponseSchema = z.object({
  call_summary: z.string(),
  success_indicator: z.string(),
  key_information: z.string(),
  action_items: z.string(),
  conversation_quality: z.string(),
  technical_issues: z.string()
});
```

## Type Exports

### Inferred Types
```typescript
export type PizzaOrderAnalysis = z.infer<typeof pizzaOrderAnalysisSchema>;
export type CallAnalysisResponse = z.infer<typeof callAnalysisResponseSchema>;
export type CallAnalysisRequest = z.infer<typeof callAnalysisSchema>;
```

### Request Parameters
```typescript
export interface GenerateTextParams {
  prompt: string;
  model?: OpenAIModel;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}
```

## Usage Patterns

### Client-Side Usage
```typescript
// In Svelte components
import { OpenAIModel } from '$shared/openai';
import type { PizzaOrderAnalysis } from '$shared/openai';

// Type-safe model references
const currentModel = OpenAIModel.GPT_41_NANO;

// Type-safe state management
let analysis: PizzaOrderAnalysis | null = null;
```

### Server-Side Usage
```typescript
// In API endpoints and services
import { OpenAIModel, callAnalysisSchema } from '$shared/openai';
import type { CallAnalysisRequest } from '$shared/openai';

// Service configuration
const config = {
  model: OpenAIModel.GPT_41_NANO,
  temperature: 0.1
};

// Request validation
const validatedRequest = callAnalysisSchema.parse(requestData);
```

## Design Principles

### Type Safety
- **Compile-time**: TypeScript interfaces for static type checking
- **Runtime**: Zod schemas for runtime validation
- **Consistency**: Single source of truth prevents type drift

### Maintainability
- **Centralized**: All OpenAI types in one location
- **Versioned**: Changes affect both client and server simultaneously
- **Documented**: Clear usage examples and patterns

### Performance
- **Tree-shaking**: Specific imports for optimal bundle size
- **No Dependencies**: Minimal external dependencies for shared code
- **Environment Agnostic**: Works in both browser and Node.js

## Model Selection Strategy

### Cost vs Performance
```typescript
// Model selection based on use case
const MODEL_SELECTION = {
  structured_analysis: OpenAIModel.GPT_41_NANO,    // Cost-effective for JSON
  creative_writing: OpenAIModel.GPT_4,             // Higher quality for creativity
  simple_classification: OpenAIModel.GPT_3_5_TURBO, // Fast for simple tasks
  embeddings: OpenAIModel.TEXT_EMBEDDING_3_SMALL   // Cost-effective embeddings
};
```

### Current Deployment
- **Primary**: GPT-4o-mini for all analysis tasks
- **Rationale**: Best balance of cost, speed, and quality
- **Monitoring**: Track performance and costs for optimization

## Schema Evolution

### Adding New Analysis Types
```typescript
// Extend existing schemas
export const newAnalysisSchema = z.object({
  // New fields for different analysis type
});

export type NewAnalysisType = z.infer<typeof newAnalysisSchema>;
```

### Versioning Strategy
- **Backward Compatible**: Add optional fields first
- **Migration Path**: Provide clear upgrade guidance
- **Documentation**: Document breaking changes clearly

## Development Guidelines

1. **Single Source**: Keep all OpenAI types in this shared location
2. **Validation**: Use Zod schemas for all API contracts
3. **Documentation**: Document all new types and their usage
4. **Testing**: Test schemas with real API responses
5. **Performance**: Consider bundle size impact of new additions
6. **Compatibility**: Ensure types work in all target environments
7. **Evolution**: Plan for schema changes and backward compatibility 