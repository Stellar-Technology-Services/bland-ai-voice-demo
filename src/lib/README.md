# Library Code

This directory contains the core library code organized into client-side, server-side, and shared modules.

## Structure

```
lib/
├── client/           # Client-side code (browser)
├── server/           # Server-side code (Node.js/serverless)
└── shared/           # Code shared between client and server
```

## Architecture Principles

### Client (`client/`)
- **Components**: Reusable UI components with clear separation of concerns
- **Runes**: Svelte 5 reactive state management for demo logic
- **Browser-only**: Code that runs exclusively in the browser

### Server (`server/`)
- **Services**: External API integrations and business logic
- **Modules**: Utilities for authentication, rate limiting, validation
- **Node.js/Serverless**: Code that runs on the server or in serverless functions

### Shared (`shared/`)
- **Types**: TypeScript interfaces used by both client and server
- **Schemas**: Zod validation schemas for API contracts
- **Constants**: Configuration and constants used across the application

## Import Aliases

The project uses path aliases for clean imports:

```typescript
import { Button } from '$components/ui/Button.svelte';
import { generateText } from '$server/services/openai';
import { OpenAIModel } from '$shared/openai';
```

## Design Patterns

- **Service Layer**: External integrations abstracted into services
- **Type Safety**: Full TypeScript coverage with runtime validation
- **Error Handling**: Consistent error patterns across all modules
- **Separation of Concerns**: Clear boundaries between client, server, and shared code 