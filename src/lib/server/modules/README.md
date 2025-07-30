# Server Modules

Utility modules and middleware for server-side functionality.

## Module Structure

```
modules/
├── api/              # API utilities and middleware
│   ├── rateLimit.ts  # Serverless-compatible rate limiting
│   ├── errorHandling.ts # Consistent error handling
│   └── handlers.ts   # HTTP method handlers
├── cookies/          # Cookie encryption and management
│   └── index.ts     # Secure cookie utilities
└── env/             # Environment variable validation
    └── validation.ts # Startup environment checks
```

## API Modules (`api/`)

### Rate Limiting (`rateLimit.ts`)
**Purpose**: Protect API endpoints from abuse while supporting real-time features

**Features**:
- Serverless-compatible in-memory storage
- Sliding window algorithm for accurate limiting
- Different rate tiers (polling, strict, critical)
- Graceful degradation on failures

**Usage**:
```typescript
await enforceRateLimit(event, RateLimitConfigs.strict); // 10/min for OpenAI
await enforceRateLimit(event, RateLimitConfigs.polling); // 50/min for 2.5s polling
```

### Error Handling (`errorHandling.ts`)
**Purpose**: Consistent error responses and secure error messaging

**Features**:
- Safe error messages that don't leak sensitive information
- Comprehensive logging for debugging
- Context-aware error categorization
- Development vs production error detail levels

**Usage**:
```typescript
createSafeError(500, error, 'context', 'User-friendly message');
```

### HTTP Handlers (`handlers.ts`)
**Purpose**: Standardized HTTP method handling patterns

**Features**:
- Consistent response patterns
- Rate limiting integration
- Error handling middleware
- Type-safe request/response handling

## Cookie Management (`cookies/`)

### Secure Cookies (`index.ts`)
**Purpose**: Encrypted cookie storage for sensitive data

**Features**:
- AES encryption for cookie values
- Environment-based configuration
- Development fallback for easy testing
- Type-safe cookie interfaces

**Usage**:
```typescript
const encrypted = await encryptCookie({ userId: '123', preferences: data });
const decrypted = await decryptCookie(cookieValue);
```

## Environment Validation (`env/`)

### Startup Validation (`validation.ts`)
**Purpose**: Ensure required environment variables are present and valid

**Features**:
- Comprehensive environment variable checking
- Custom validation rules for API keys
- Clear error messages for missing configuration
- Development vs production validation levels

**Configuration**:
```typescript
const REQUIRED_ENV_VARS = [
  { name: 'BLAND_AI_API_KEY', validation: (val) => val.startsWith('sk-') },
  { name: 'OPENAI_API_KEY', validation: (val) => val.startsWith('sk-') }
];
```

## Module Design Principles

### Serverless Compatibility
- **Stateless**: No persistent state between requests
- **Cold Start Optimized**: Minimal initialization overhead
- **Memory Efficient**: Automatic cleanup and resource management
- **Environment Agnostic**: Works across different serverless platforms

### Security First
- **Input Validation**: All inputs are validated and sanitized
- **Error Security**: No sensitive information in error responses
- **Rate Limiting**: Protection against abuse and DoS
- **Encryption**: Sensitive data is encrypted at rest and in transit

### Developer Experience
- **Type Safety**: Full TypeScript integration
- **Error Context**: Rich error information for debugging
- **Consistent APIs**: Uniform patterns across all modules
- **Testing**: Modular design enables easy unit testing

## Integration Patterns

### Middleware Chain
```typescript
// Typical API endpoint pattern
export const POST: RequestHandler = async (event) => {
  // 1. Rate limiting
  await enforceRateLimit(event, RateLimitConfigs.standard);
  
  // 2. Input validation
  const data = await validateInput(event.request);
  
  // 3. Business logic
  const result = await processRequest(data);
  
  // 4. Response handling
  return json(result);
};
```

### Error Handling Pattern
```typescript
try {
  // Business logic
  return json(result);
} catch (err) {
  if (err instanceof Response) {
    throw err; // Re-throw Response objects (like rate limit errors)
  }
  createSafeError(500, err, 'operation_context', 'User-friendly message');
}
```

## Performance Considerations

### Rate Limiting
- In-memory storage with automatic cleanup
- Sliding window algorithm for accuracy
- Configurable limits based on endpoint requirements
- Emergency cleanup for memory pressure

### Error Handling
- Minimal performance overhead
- Structured logging for efficient debugging
- Context preservation without memory leaks

### Cookie Management
- Efficient encryption/decryption
- Minimal payload sizes
- Secure defaults for all operations

## Development Guidelines

1. **Modularity**: Each module should have a single, clear responsibility
2. **Error Handling**: Always use the centralized error handling patterns
3. **Type Safety**: Define clear interfaces for all module interactions
4. **Testing**: Write comprehensive unit tests for all utilities
5. **Performance**: Optimize for serverless cold start and execution time
6. **Security**: Apply security best practices to all user-facing functionality
7. **Documentation**: Maintain clear usage examples and API documentation 