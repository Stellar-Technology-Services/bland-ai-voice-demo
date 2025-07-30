# OpenAI Service

Integration with OpenAI's GPT models for intelligent text analysis and conversation understanding.

## Overview

The OpenAI service provides AI-powered analysis capabilities including:
- Structured data extraction from conversation transcripts
- JSON-mode responses with schema validation
- Cost-effective analysis using GPT-4o-mini
- Robust error handling and retry logic

## Service Configuration (`index.ts`)

### Client Setup
```typescript
export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  timeout: 60000,           // 60 seconds timeout
  maxRetries: 2,            // Retry failed requests twice
  defaultHeaders: {
    'User-Agent': 'bland-ai-voice-demo/1.0'
  }
});
```

### Model Configuration
```typescript
export enum OpenAIModel {
  GPT_41_NANO = 'gpt-4o-mini',  // Primary model for cost-effectiveness
  GPT_4 = 'gpt-4',
  GPT_4_TURBO = 'gpt-4-turbo'
}
```

## Core Functions

### `generateText(params: GenerateTextParams): Promise<string>`
General-purpose text generation with configurable parameters.

**Parameters**:
```typescript
interface GenerateTextParams {
  prompt: string;                    // Input prompt
  model?: OpenAIModel;               // Model selection (default: GPT_41_NANO)
  temperature?: number;              // Creativity (0.0-1.0, default: 0.1)
  maxTokens?: number;                // Response length limit (default: 1000)
  systemPrompt?: string;             // System instruction context
}
```

**Features**:
- Automatic JSON parsing for structured responses
- Graceful fallback for malformed JSON
- Comprehensive error handling with context

### Usage Examples

#### Conversation Analysis
```typescript
const analysis = await generateText({
  prompt: transcriptText,
  systemPrompt: "Analyze this pizza order conversation and extract key details.",
  temperature: 0.1,
  model: OpenAIModel.GPT_41_NANO
});
```

#### Structured Data Extraction
```typescript
// JSON mode with schema validation
const completion = await openai.chat.completions.create({
  model: OpenAIModel.GPT_41_NANO,
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: transcript }
  ],
  temperature: 0.1,
  max_tokens: 1000,
  response_format: { type: 'json_object' }
});
```

## Integration with Call Analysis

### Pizza Order Analysis
The service is integrated with the call analysis service for specialized pizza order extraction:

```typescript
// In callanalysis service
const result = await generateText({
  prompt: transcript,
  systemPrompt: `Analyze this pizza order conversation...`,
  temperature: 0.1,
  model: OpenAIModel.GPT_41_NANO
});

// Parse and validate with Zod schema
const parsedData = pizzaOrderAnalysisSchema.parse(JSON.parse(result));
```

### General Call Analysis
```typescript
const analysis = await generateText({
  prompt: transcript,
  systemPrompt: `Analyze this phone conversation and provide insights...`,
  temperature: 0.1
});
```

## Error Handling

### JSON Parsing Safety
```typescript
try {
  const parsed = JSON.parse(content);
  return parsed;
} catch (parseError) {
  console.warn('Failed to parse OpenAI response as JSON:', parseError);
  return content; // Return raw text as fallback
}
```

### API Error Context
```typescript
catch (error) {
  console.error('OpenAI API error:', error);
  if (error.code === 'rate_limit_exceeded') {
    throw new Error('OpenAI rate limit exceeded. Please try again later.');
  } else if (error.code === 'insufficient_quota') {
    throw new Error('OpenAI quota exceeded. Please check your billing.');
  } else {
    throw new Error(`OpenAI analysis failed: ${error.message}`);
  }
}
```

## Cost Management

### Model Selection
- **Primary**: GPT-4o-mini (`gpt-4o-mini`) for cost-effectiveness
- **Fallback**: GPT-3.5-turbo for simple tasks
- **Premium**: GPT-4 for complex analysis when needed

### Token Optimization
```typescript
// Reasonable token limits for different use cases
const TOKEN_LIMITS = {
  pizza_analysis: 800,     // Structured order extraction
  call_summary: 500,       // Brief conversation summary
  detailed_analysis: 1500  // Comprehensive analysis
};
```

### Rate Limiting Integration
- Applied through server-side rate limiting (10 requests/minute)
- Integrated with the application's rate limiting system
- Graceful degradation when limits are exceeded

## Response Formats

### JSON Mode
For structured data extraction:
```typescript
response_format: { type: 'json_object' }
```

### Text Mode
For general analysis and summaries:
```typescript
// Default text response format
```

## System Prompts

### Pizza Order Analysis
```typescript
const PIZZA_ORDER_PROMPT = `
You are analyzing a pizza order phone conversation. Extract the following information in JSON format:
{
  "Was the pizza order successful?": "Yes/No",
  "What specific pizzas were ordered?": "Details of pizzas",
  "What is the total cost?": "Price information",
  "What is the pickup time?": "Time information",
  // ... additional fields
}
`;
```

### General Analysis
```typescript
const GENERAL_ANALYSIS_PROMPT = `
Analyze this phone conversation and provide insights about:
- Call success/failure
- Key information exchanged
- Action items or next steps
- Overall conversation quality
`;
```

## Development Guidelines

1. **Cost Awareness**: Use GPT-4o-mini as the primary model for cost efficiency
2. **Error Resilience**: Implement comprehensive error handling with context
3. **JSON Safety**: Always handle JSON parsing errors gracefully
4. **Rate Limiting**: Respect OpenAI's rate limits and integrate with app limits
5. **Token Management**: Set appropriate token limits for different use cases
6. **Prompt Engineering**: Design clear, specific prompts for consistent results
7. **Testing**: Mock OpenAI responses for reliable unit testing
8. **Monitoring**: Track usage and costs for optimization opportunities 