# SvelteKit Routes

This directory contains all SvelteKit routes including pages, API endpoints, and layouts following the file-based routing convention.

## Route Structure

```
routes/
├── +layout.svelte       # Root layout applied to all pages
├── +page.svelte         # Landing page (/)
├── +error.svelte        # Error page for unhandled errors
├── api/                 # API routes (server endpoints)
│   └── bland/           # Bland AI integration endpoints
│       ├── calls/       # Call management API
│       └── events/      # Server-sent events
└── demo/                # Demo page (/demo)
    └── +page.svelte     # Main demo interface
```

## Page Routes

### Landing Page (`+page.svelte`)
- **URL**: `/`
- **Purpose**: Marketing page showcasing AI phone call capabilities
- **Features**: Hero section, technology stack, call-to-action buttons
- **Target**: New visitors and potential users

### Demo Page (`demo/+page.svelte`)
- **URL**: `/demo`
- **Purpose**: Interactive demonstration of AI phone calling
- **Features**: Call configuration, real-time transcript, analysis results
- **Target**: Users wanting to try the functionality

### Layout (`+layout.svelte`)
- **Purpose**: Shared layout elements across all pages
- **Features**: Navigation, global styles, common components
- **Scope**: Applied to every route in the application

### Error Page (`+error.svelte`)
- **Purpose**: User-friendly error display for unhandled exceptions
- **Features**: Error details, navigation back to safety
- **Scope**: Shown when page-level errors occur

## API Routes

### Call Management (`api/bland/calls/`)
RESTful API for managing AI phone calls:

```
/api/bland/calls/
├── GET /                     # List all calls with pagination
├── POST /                    # Create new AI phone call
└── [id]/                     # Individual call operations
    ├── GET /                 # Get call details and status
    ├── POST /?action=stop    # Stop active call
    ├── analyze/              # Call analysis endpoint
    │   └── POST /            # Analyze transcript with OpenAI
    ├── transcript/           # Transcript retrieval
    │   └── GET /             # Get formatted transcript
    └── recording/            # Call recording access
        └── GET /             # Download call recording
```

### Server-Sent Events (`api/bland/events/`)
Real-time updates for call status:

```
/api/bland/events/
└── GET /?callId=xxx         # Stream real-time call updates
```

## Route Conventions

### File Naming
- **`+page.svelte`**: Page components (renders UI)
- **`+layout.svelte`**: Layout components (wraps child routes)
- **`+server.ts`**: Server endpoints (API routes)
- **`+error.svelte`**: Error boundaries for route segments
- **`[param]/`**: Dynamic route parameters

### API Endpoint Patterns
```typescript
// GET endpoint
export const GET: RequestHandler = async ({ url, params }) => {
  // Handle GET request
  return json(response);
};

// POST endpoint  
export const POST: RequestHandler = async ({ request, params }) => {
  const data = await request.json();
  // Handle POST request
  return json(response);
};
```

## Rate Limiting by Route

Different endpoints have different rate limiting policies:

| Route Pattern | Rate Limit | Purpose |
|--------------|------------|---------|
| `GET /api/bland/calls` | 200/min | Permissive for listing |
| `POST /api/bland/calls` | 5/5min | Critical for call creation |
| `GET /api/bland/calls/[id]` | 50/min | Polling-friendly |
| `POST /api/bland/calls/[id]/analyze` | 10/min | Strict for OpenAI costs |
| `GET /api/bland/events` | No limit | Real-time streams |

## Error Handling

### API Endpoints
```typescript
try {
  // API logic
  return json(result);
} catch (err) {
  createSafeError(500, err, 'context', 'User-friendly message');
}
```

### Page Routes
```svelte
<!-- Error boundaries catch component errors -->
{#if error}
  <ErrorDisplay {error} />
{:else}
  <!-- Page content -->
{/if}
```

## Security Considerations

### Input Validation
- All API endpoints validate input using Zod schemas
- Phone number format validation and sanitization
- HTML/script tag removal from user content

### Rate Limiting
- Applied at the route level before business logic
- Different limits based on computational cost
- Graceful degradation for rate limit exceeded

### CORS Configuration
- Configured for production domain in server-sent events
- Development mode allows all origins
- Specific headers allowed for API access

## Development Guidelines

1. **Route Organization**: Group related functionality in subdirectories
2. **API Design**: Follow RESTful conventions for predictable endpoints
3. **Error Handling**: Use consistent error patterns across all routes
4. **Type Safety**: Define TypeScript interfaces for all API contracts
5. **Documentation**: Document API endpoints with clear examples
6. **Testing**: Write integration tests for API routes and unit tests for page components
7. **Performance**: Apply appropriate caching and rate limiting strategies 