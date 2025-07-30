# UI Components

This directory contains all Svelte components organized by functionality and reusability.

## Component Categories

```
components/
├── demo/             # Demo-specific functionality
├── error/            # Error handling and display
├── landing/          # Marketing and landing page
└── ui/               # Reusable UI primitives
```

## Component Types

### Demo Components (`demo/`)
Components specific to the AI phone call demonstration:

- **AdvancedSettings.svelte**: Call configuration options
- **CallAnalysis.svelte**: Display analyzed call results
- **CallConfiguration.svelte**: Basic call setup form
- **CallProgress.svelte**: Real-time call status and controls
- **DemoHeader.svelte**: Demo page header and navigation
- **LiveTranscript.svelte**: Real-time conversation display
- **VoiceSelector.svelte**: AI voice selection interface

### UI Components (`ui/`)
Reusable, generic components following design system principles:

- **Button.svelte**: Configurable button with variants
- **Input.svelte**: Form input with validation states
- **Card.svelte**: Content containers with consistent styling
- **Modal.svelte**: Overlay dialogs and popups
- **Spinner.svelte**: Loading indicators
- **Alert.svelte**: Status messages and notifications

### Landing Components (`landing/`)
Marketing and informational components:

- **HeroSection.svelte**: Main landing page hero
- **FeatureCard.svelte**: Feature highlighting cards
- **TechnologyStack.svelte**: Tech stack showcase
- **CallToAction.svelte**: Conversion-focused sections

### Error Components (`error/`)
Error state management:

- **ErrorDisplay.svelte**: User-friendly error messages
- **ErrorBoundary.svelte**: Component error boundaries

## Design System

### Styling Guidelines
- **Tailwind CSS**: Utility-first styling approach
- **Design Tokens**: Consistent spacing, colors, typography
- **Responsive**: Mobile-first responsive design
- **Dark Mode**: Support for light/dark themes

### Component Props
```typescript
interface ComponentProps {
  // Always define clear prop interfaces
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}
```

### Event Handling
```typescript
// Use createEventDispatcher for parent communication
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher<{
  click: MouseEvent;
  change: { value: string };
}>();
```

## Best Practices

1. **Single Responsibility**: Each component should do one thing well
2. **Composability**: Build complex components from simple primitives  
3. **Type Safety**: Always define TypeScript interfaces for props
4. **Accessibility**: Include proper ARIA attributes and keyboard navigation
5. **Performance**: Use lazy loading and code splitting where appropriate
6. **Testing**: Write unit tests for component logic and integration tests for user flows 