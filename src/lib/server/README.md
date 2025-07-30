# Server-Side Code

This directory contains all server-side code including external service integrations, API utilities, and business logic.

## Architecture

```
server/
├── services/         # External API integrations
│   ├── blandai/     # Bland AI voice calling service
│   ├── callanalysis/ # AI-powered call analysis
│   └── openai/      # OpenAI text generation service
└── modules/         # Server utilities and middleware
    ├── api/         # API helpers (rate limiting, error handling)
    ├── cookies/     # Cookie encryption and management
    └── env/         # Environment variable validation
```

## Service Layer

### External Integrations (`services/`)
The service layer abstracts external API interactions and provides type-safe interfaces:

- **Bland AI Service**: Real phone calls and voice interactions
- **OpenAI Service**: Text generation and analysis capabilities  
- **Call Analysis Service**: Structured data extraction from transcripts

### Service Design Patterns
```typescript
// Consistent service interface
interface Service {
  // Connection and authentication
  authenticate(): Promise<void>;
  
  // Core functionality
  execute(params: ServiceParams): Promise<ServiceResponse>;
  
  // Error handling
  handleError(error: unknown): ServiceError;
}
```

## Module Layer

### API Utilities (`modules/api/`)
Common functionality for REST API endpoints:

- **Rate Limiting**: Serverless-compatible request throttling
- **Error Handling**: Consistent error responses and logging
- **Request Validation**: Input sanitization and validation

### Infrastructure (`modules/`)
Supporting modules for server operation:

- **Cookie Management**: Secure cookie encryption/decryption
- **Environment Validation**: Required environment variable checking

## Serverless Architecture

### Vercel Optimization
The server code is optimized for Vercel's serverless environment:

- **Stateless**: No persistent server state between requests
- **Cold Start Friendly**: Minimal initialization overhead
- **Memory Efficient**: Automatic cleanup and resource management
- **Edge Compatible**: Functions can run on Vercel's edge network

### Rate Limiting Strategy
```typescript
// Serverless-compatible rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

// Different limits for different endpoints
const RateLimitConfigs = {
  polling: { limit: 50, windowMs: 60000 },    // 2.5s polling
  strict: { limit: 10, windowMs: 60000 },     // OpenAI calls
  critical: { limit: 5, windowMs: 300000 }    // Call creation
};
```

## API Endpoint Structure

### RESTful Design
```
/api/bland/
├── calls/                    # Call management
│   ├── GET /                 # List calls
│   ├── POST /                # Create call
│   └── [id]/                 # Individual call operations
│       ├── GET /             # Get call details
│       ├── POST /?action=stop # Stop call
│       ├── analyze/          # Analyze transcript
│       ├── transcript/       # Get transcript
│       └── recording/        # Get recording
└── events/                   # Server-sent events
    └── GET /?callId=xxx      # Real-time updates
```

### Error Handling
```typescript
// Consistent error responses
interface APIError {
  error: string;
  code?: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

// Safe error handling
function createSafeError(
  status: number,
  error: unknown,
  context: string,
  fallbackMessage: string
): never {
  // Log full error for debugging
  logError(context, error);
  
  // Return safe message to client
  throw error(status, fallbackMessage);
}
```

## Security Features

### Input Validation
- **Zod Schemas**: Runtime type checking for all inputs
- **Sanitization**: HTML/script tag removal from user content
- **Parameter Validation**: Bounds checking for numeric inputs

### Rate Limiting
- **Tiered Limits**: Different limits based on endpoint cost
- **Client Identification**: IP-based limiting with proxy header support
- **Graceful Degradation**: Fail-open approach for service availability

### Error Security
- **Information Disclosure**: No sensitive data in error messages
- **Context Logging**: Detailed server-side logging for debugging
- **Safe Defaults**: Secure fallbacks for all operations

## Environment Configuration

### Required Variables
```bash
# External service API keys
BLAND_AI_API_KEY=your_bland_ai_key_here
OPENAI_API_KEY=your_openai_key_here

# Optional configuration
NODE_ENV=production
```

### Validation
```typescript
// Startup validation
const REQUIRED_ENV_VARS = [
  { name: 'BLAND_AI_API_KEY', validation: (val) => val.startsWith('sk-') },
  { name: 'OPENAI_API_KEY', validation: (val) => val.startsWith('sk-') }
];
```

## Development Guidelines

1. **Service Abstraction**: Wrap external APIs in typed service classes
2. **Error Handling**: Use consistent error patterns throughout
3. **Rate Limiting**: Apply appropriate limits to protect external APIs
4. **Type Safety**: Full TypeScript coverage with runtime validation
5. **Logging**: Comprehensive logging for debugging and monitoring
6. **Testing**: Unit tests for business logic, integration tests for services
7. **Security**: Input validation and safe error handling 