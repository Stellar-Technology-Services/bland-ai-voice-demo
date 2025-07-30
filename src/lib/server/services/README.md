# Server Services

External service integrations and business logic for the AI phone call demo.

## Services Overview

```
services/
├── blandai/           # Bland AI voice calling service
├── callanalysis/      # AI-powered call transcript analysis  
└── openai/           # OpenAI text generation and analysis
```

## Service Architecture

### Bland AI Service (`blandai/`)
**Purpose**: Real phone call management and voice interactions

**Key Features**:
- Make actual phone calls to real numbers
- Real-time transcription during calls
- Call status monitoring and control
- Voice configuration and selection
- Call recording and playback

**Integration**: Primary service for voice calling functionality

### Call Analysis Service (`callanalysis/`)
**Purpose**: Structured data extraction from conversation transcripts

**Key Features**:
- Pizza order analysis (specialized for food ordering)
- General conversation analysis
- Structured data extraction using Zod schemas
- Business logic for different analysis types

**Integration**: Bridges Bland AI transcripts with OpenAI analysis

### OpenAI Service (`openai/`)
**Purpose**: AI text generation and intelligent analysis

**Key Features**:
- GPT-4o-mini integration for cost-effective analysis
- Structured JSON responses with schema validation
- Text generation with configurable parameters
- Error handling for API failures

**Integration**: Analysis engine for extracting insights from transcripts

## Service Design Patterns

### Configuration Management
```typescript
// Service configuration with timeout and retry logic
export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  timeout: 60000,
  maxRetries: 2,
  defaultHeaders: { 'User-Agent': 'bland-ai-voice-demo/1.0' }
});
```

### Error Handling
```typescript
// Consistent error handling across services
try {
  const result = await service.execute(params);
  return result;
} catch (error) {
  // Enhanced error context for debugging
  const contextualError = `${serviceName} error: ${error.message}`;
  throw new ServiceError(contextualError, { originalError: error });
}
```

### Type Safety
```typescript
// Zod schemas for runtime validation
export const pizzaOrderAnalysisSchema = z.object({
  'Was the pizza order successful?': z.string(),
  'What specific pizzas were ordered?': z.string(),
  'What is the total cost?': z.string(),
  // ... additional fields
});

export type PizzaOrderAnalysis = z.infer<typeof pizzaOrderAnalysisSchema>;
```

## Integration Flow

```
1. User initiates call
   ↓
2. Bland AI Service creates call
   ↓
3. Real-time transcript updates
   ↓
4. Call completion trigger
   ↓
5. Call Analysis Service processes transcript
   ↓
6. OpenAI Service generates insights
   ↓
7. Structured results returned to UI
```

## Service Dependencies

### External APIs
- **Bland AI API**: Voice calling and transcription
- **OpenAI API**: Text analysis and generation

### Internal Dependencies
- **Rate Limiting**: Applied per service based on cost
- **Error Handling**: Consistent error patterns
- **Environment Variables**: API key management

### Shared Resources
- **Type Definitions**: Shared interfaces in `$lib/shared`
- **Validation Schemas**: Zod schemas for data contracts
- **Error Utilities**: Common error handling patterns

## Development Guidelines

1. **Service Isolation**: Each service should be independently testable
2. **Error Boundaries**: Comprehensive error handling with context
3. **Type Safety**: Full TypeScript coverage with runtime validation  
4. **Configuration**: Externalize all configuration through environment variables
5. **Monitoring**: Include logging for debugging and performance monitoring
6. **Testing**: Unit tests for service logic, integration tests for external APIs
7. **Documentation**: Clear API documentation with usage examples 