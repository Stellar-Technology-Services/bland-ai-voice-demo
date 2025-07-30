# Source Code Directory

This directory contains the entire source code for the AI Phone Call Demo application built with SvelteKit and Svelte 5.

## Directory Structure

```
src/
├── lib/              # Library code (client, server, shared)
├── routes/           # SvelteKit routes (pages and API endpoints)
├── app.html          # HTML template
├── app.css           # Global styles
├── app.d.ts          # TypeScript app declarations
├── error.html        # Error page template
└── hooks.*.ts        # SvelteKit hooks
```

## Architecture Overview

### Frontend (`lib/client/`)
- **Components**: Reusable Svelte components organized by feature
- **Runes**: Svelte 5 state management using the new runes system
- **Styling**: Tailwind CSS with custom design system

### Backend (`lib/server/`)
- **Services**: External API integrations (Bland AI, OpenAI)
- **Modules**: Utilities for rate limiting, error handling, cookies
- **API Layer**: RESTful endpoints for call management

### Shared (`lib/shared/`)
- **Types**: TypeScript interfaces and type definitions
- **Schemas**: Zod schemas for validation
- **Utilities**: Code shared between client and server

### Routes (`routes/`)
- **Pages**: SvelteKit pages (landing, demo)
- **API**: Server endpoints for call management and analysis
- **Layout**: Shared layouts and error pages

## Key Technologies

- **SvelteKit**: Full-stack framework with SSR/SPA capabilities
- **Svelte 5**: Latest Svelte with runes for reactive state management  
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework
- **Zod**: Runtime type validation and schema definition

## Getting Started

1. Install dependencies: `bun install`
2. Copy environment variables: `cp .env.example .env`
3. Add your API keys to `.env`
4. Start development server: `bun run dev`
5. Visit the demo at: `http://localhost:3000/demo` 