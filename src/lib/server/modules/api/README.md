# API Modules

Core utilities and middleware for API endpoint functionality.

## Module Overview

```
api/
├── rateLimit.ts      # Serverless-compatible rate limiting
├── errorHandling.ts  # Consistent error responses and logging
└── handlers.ts       # HTTP request/response utilities
```

## Rate Limiting (`rateLimit.ts`)

### Serverless-Compatible Design
The rate limiting system is designed specifically for Vercel's serverless environment:

- **In-Memory Storage**: Per-instance rate limiting using Map storage
- **Sliding Window**: Accurate rate limiting with timestamp-based windows
- **Memory Management**: Automatic cleanup to prevent memory leaks
- **Graceful Degradation**: Fail-open approach for service availability

### Rate Limit Configurations
```typescript
export const RateLimitConfigs = {
  polling: {
    limit: 50,           // 50 requests
    windowMs: 60000,     // per minute (2.5s polling support)
    identifier: 'polling'
  },
  strict: {
    limit: 10,           // 10 requests
    windowMs: 60000,     // per minute (OpenAI cost control)
    identifier: 'strict'
  },
  critical: {
    limit: 5,            // 5 requests
    windowMs: 300000,    // per 5 minutes (call creation)
    identifier: 'critical'
  },
  standard: {
    limit: 30,           // 30 requests
    windowMs: 60000,     // per minute (general API)
    identifier: 'standard'
  },
  permissive: {
    limit: 200,          // 200 requests
    windowMs: 60000,     // per minute (listing endpoints)
    identifier: 'permissive'
  }
};
```

### Client Identification
```typescript
// Enhanced client identification for serverless
const clientAddress = getClientAddress();
const forwardedFor = request.headers.get('x-forwarded-for');
const realIp = request.headers.get('x-real-ip');
const identifier = clientAddress || 
                  forwardedFor?.split(',')[0]?.trim() || 
                  realIp || 
                  'anonymous';
```

### Memory Safety Features
```typescript
const MAX_ENTRIES = 10000;        // Memory limit
const CLEANUP_INTERVAL = 300000;  // 5 minutes

// Automatic cleanup with memory pressure handling
function cleanupExpiredEntries(): void {
  const now = Date.now();
  const forceCleanup = rateLimitStore.size > MAX_ENTRIES;
  
  if (!forceCleanup && now - lastCleanup < CLEANUP_INTERVAL) {
    return;
  }
  
  // Emergency cleanup when approaching capacity
  if (rateLimitStore.size > MAX_ENTRIES * 0.8) {
    console.warn(`Rate limit store approaching capacity: ${rateLimitStore.size}/${MAX_ENTRIES} entries`);
  }
}
```

### Usage Pattern
```typescript
// In API endpoints
export const POST: RequestHandler = async (event) => {
  // Apply appropriate rate limit
  await enforceRateLimit(event, RateLimitConfigs.critical);
  
  // Continue with business logic
  const result = await processRequest(event);
  return json(result);
};
```

## Error Handling (`errorHandling.ts`)

### Safe Error Responses
Prevents information disclosure while providing useful feedback:

```typescript
export function createSafeError(
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

### Error Logging
```typescript
export function logError(context: string, error: unknown): void {
  const timestamp = new Date().toISOString();
  const errorInfo = error instanceof Error ? 
    { message: error.message, stack: error.stack } : 
    { raw: error };
    
  console.error(`[${timestamp}] ${context}:`, errorInfo);
}
```

### Error Message Sanitization
```typescript
export function sanitizeErrorMessage(message: string): string {
  // Remove sensitive patterns
  return message
    .replace(/sk-[a-zA-Z0-9]+/g, '***') // API keys
    .replace(/password=\w+/gi, 'password=***') // Passwords
    .replace(/token=\w+/gi, 'token=***'); // Tokens
}
```

### Standard Error Messages
```typescript
export const ErrorMessages = {
  INVALID_INPUT: 'Invalid input provided',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
  AUTHENTICATION_FAILED: 'Authentication failed',
  RESOURCE_NOT_FOUND: 'Requested resource not found',
  INTERNAL_ERROR: 'An unexpected error occurred'
};
```

## HTTP Handlers (`handlers.ts`)

### Request/Response Utilities
Common patterns for handling HTTP requests and responses:

```typescript
// Standardized API response wrapper
export function apiResponse<T>(
  data: T, 
  status: number = 200,
  headers: Record<string, string> = {}
): Response {
  return json(data, {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  });
}

// Error response wrapper
export function apiError(
  message: string,
  status: number = 500,
  details?: Record<string, unknown>
): Response {
  return json({
    error: message,
    timestamp: new Date().toISOString(),
    ...(details && { details })
  }, { status });
}
```

### Input Validation
```typescript
export async function validateInput<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<T> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Validation failed: ${error.message}`);
    }
    throw new Error('Invalid request body');
  }
}
```

## Integration Patterns

### Middleware Chain
```typescript
// Standard API endpoint pattern
export const POST: RequestHandler = async (event) => {
  try {
    // 1. Rate limiting
    await enforceRateLimit(event, RateLimitConfigs.standard);
    
    // 2. Input validation
    const data = await validateInput(event.request, requestSchema);
    
    // 3. Business logic
    const result = await processRequest(data);
    
    // 4. Success response
    return apiResponse(result);
    
  } catch (err) {
    // 5. Error handling
    if (err instanceof Response) {
      throw err; // Re-throw rate limit responses
    }
    createSafeError(500, err, 'endpoint_context', ErrorMessages.INTERNAL_ERROR);
  }
};
```

### Rate Limit Headers
```typescript
// Rate limit information in responses
const rateLimitHeaders = {
  'X-RateLimit-Limit': String(limit),
  'X-RateLimit-Remaining': String(remaining),
  'X-RateLimit-Reset': String(resetTime)
};

// Applied automatically by enforceRateLimit
return new Response('Rate limit exceeded', {
  status: 429,
  headers: rateLimitHeaders
});
```

## Performance Considerations

### Memory Usage
- In-memory rate limiting with automatic cleanup
- Configurable memory limits with emergency cleanup
- Efficient timestamp-based sliding windows

### Error Handling Overhead
- Minimal performance impact from error handling
- Structured logging for efficient debugging
- Context preservation without memory leaks

### Serverless Optimization
- Cold start friendly initialization
- Stateless design for horizontal scaling
- Efficient resource cleanup

## Development Guidelines

1. **Rate Limiting**: Apply appropriate limits based on endpoint cost and usage patterns
2. **Error Security**: Never expose sensitive information in error responses
3. **Logging**: Provide comprehensive context for debugging without information disclosure
4. **Type Safety**: Use TypeScript and Zod for all API interactions
5. **Testing**: Write unit tests for all utility functions and middleware
6. **Performance**: Optimize for serverless cold start and execution time
7. **Monitoring**: Include metrics and logging for production debugging 