# Call Analysis Service

Business logic for analyzing AI phone call transcripts and extracting structured data.

## Overview

The Call Analysis service acts as a bridge between Bland AI transcripts and OpenAI analysis, providing:
- Specialized pizza order analysis logic
- General conversation analysis capabilities
- Structured data extraction using Zod schemas
- Business rule implementation for different analysis types

## Service Functions (`index.ts`)

### `analyzePizzaOrder(transcript: string): Promise<PizzaOrderAnalysis>`
Specialized analysis for pizza ordering conversations with structured data extraction.

**Purpose**: Extract order details, pricing, timing, and success status from pizza restaurant calls.

**System Prompt**:
```typescript
const PIZZA_ORDER_PROMPT = `
You are analyzing a pizza order phone conversation. Extract the following information in JSON format:

{
  "Was the pizza order successful?": "Yes/No with explanation",
  "What specific pizzas were ordered?": "List each pizza with size, toppings, quantity",
  "What is the total cost?": "Total price including tax if mentioned",
  "What is the pickup time?": "When the order will be ready",
  "What is the restaurant's address?": "Address if provided",
  "What is the confirmation number?": "Order confirmation if provided",
  "Any special instructions?": "Dietary restrictions, delivery notes, etc.",
  "Payment method discussed?": "Cash, card, online, etc.",
  "Call quality assessment": "How well did the AI handle the conversation?",
  "Any issues or concerns?": "Problems that occurred during the call"
}
`;
```

**Response Schema**:
```typescript
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

export type PizzaOrderAnalysis = z.infer<typeof pizzaOrderAnalysisSchema>;
```

### `analyzeCall(transcript: string): Promise<CallAnalysisResult>`
General-purpose conversation analysis for any type of phone call.

**Purpose**: Provide insights, summarization, and action items for any conversation type.

**System Prompt**:
```typescript
const GENERAL_ANALYSIS_PROMPT = `
Analyze this phone conversation and provide insights in JSON format:

{
  "call_summary": "Brief summary of what happened",
  "success_indicator": "Was the call successful? (Yes/No/Partial)",
  "key_information": "Important details exchanged",
  "action_items": "Next steps or follow-up actions",
  "conversation_quality": "How natural and effective was the conversation?",
  "technical_issues": "Any problems with the call quality or AI performance"
}
`;
```

**Response Schema**:
```typescript
export const callAnalysisSchema = z.object({
  call_summary: z.string(),
  success_indicator: z.string(),
  key_information: z.string(),
  action_items: z.string(),
  conversation_quality: z.string(),
  technical_issues: z.string()
});

export type CallAnalysisResult = z.infer<typeof callAnalysisSchema>;
```

## Integration with Demo

### Pizza Order Flow
```typescript
// In demo rune after call completion
async function triggerAnalysis() {
  try {
    isAnalyzing = true;
    const analysisResult = await fetch(`/api/bland/calls/${currentCall.call_id}/analyze`, {
      method: 'POST'
    });
    
    if (analysisResult.ok) {
      const analysis = await analysisResult.json();
      orderDetails = analysis; // PizzaOrderAnalysis type
    }
  } catch (error) {
    console.error('Analysis failed:', error);
  } finally {
    isAnalyzing = false;
  }
}
```

### API Endpoint Integration
```typescript
// In /api/bland/calls/[id]/analyze/+server.ts
export const POST: RequestHandler = async ({ params }) => {
  await enforceRateLimit(event, RateLimitConfigs.strict);
  
  const callDetails = await blandAI.getCallDetails(params.id);
  const transcript = formatTranscriptForAnalysis(callDetails.transcripts);
  
  // Use specialized pizza analysis for demo
  const analysis = await analyzePizzaOrder(transcript);
  
  return json(analysis);
};
```

## Business Logic

### Transcript Preprocessing
```typescript
function formatTranscriptForAnalysis(transcripts: BlandTranscriptEntry[]): string {
  return transcripts
    .filter(entry => entry && entry.text && entry.user)
    .map(entry => `${entry.user}: ${entry.text}`)
    .join('\n');
}
```

### Error Handling
```typescript
// Robust error handling with fallbacks
try {
  const result = await generateText({
    prompt: transcript,
    systemPrompt: PIZZA_ORDER_PROMPT,
    temperature: 0.1,
    model: OpenAIModel.GPT_41_NANO
  });
  
  return pizzaOrderAnalysisSchema.parse(JSON.parse(result));
} catch (error) {
  if (error instanceof z.ZodError) {
    throw new Error(`Analysis validation failed: ${error.message}`);
  }
  throw new Error(`Pizza order analysis failed: ${error.message}`);
}
```

## Analysis Types

### Pizza Order Analysis
- **Specialized**: Tailored for food ordering scenarios
- **Structured**: Consistent JSON output with specific fields
- **Business-Focused**: Extracts commercially relevant information
- **Quality Assessment**: Evaluates AI conversation performance

### General Call Analysis
- **Flexible**: Works with any conversation type
- **Summarization**: Provides concise conversation overviews
- **Action-Oriented**: Identifies next steps and follow-ups
- **Quality Metrics**: Assesses conversation effectiveness

## Performance Considerations

### Rate Limiting
- Applied at 10 requests/minute (strict tier) due to OpenAI costs
- Integrated with application-wide rate limiting system

### Cost Optimization
- Uses GPT-4o-mini for cost-effective analysis
- Structured prompts for consistent, focused responses
- Reasonable token limits to control costs

### Caching Strategy
- Analysis results could be cached based on transcript hash
- Avoid re-analyzing identical conversations
- Consider implementing result persistence for historical data

## Development Guidelines

1. **Prompt Engineering**: Design clear, specific prompts for consistent results
2. **Schema Validation**: Always use Zod schemas for response validation
3. **Error Handling**: Provide meaningful error messages for different failure modes
4. **Business Logic**: Keep analysis logic focused on business requirements
5. **Testing**: Mock OpenAI responses for reliable unit testing
6. **Extensibility**: Design for easy addition of new analysis types
7. **Performance**: Monitor costs and optimize for efficiency 