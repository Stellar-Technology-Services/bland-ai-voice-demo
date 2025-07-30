# Client-Side Code

This directory contains all browser-side code including UI components and state management.

## Structure

```
client/
├── components/       # Reusable Svelte components
│   ├── demo/        # Demo-specific components
│   ├── error/       # Error handling UI
│   ├── landing/     # Landing page components
│   └── ui/          # Reusable UI components
└── runes/           # Svelte 5 state management
```

## Component Organization

### Demo Components (`components/demo/`)
- **Purpose**: Components specific to the phone call demo functionality
- **Examples**: Call configuration, live transcript, voice selection
- **Scope**: Demo page and call management UI

### UI Components (`components/ui/`)
- **Purpose**: Reusable, generic UI components
- **Examples**: Buttons, inputs, cards, modals
- **Scope**: Used throughout the application

### Landing Components (`components/landing/`)
- **Purpose**: Marketing and informational components
- **Examples**: Hero sections, feature cards, technology stack
- **Scope**: Landing page and promotional content

### Error Components (`components/error/`)
- **Purpose**: Error state handling and display
- **Examples**: Error boundaries, error messages
- **Scope**: Application-wide error handling

## State Management (`runes/`)

Uses Svelte 5's new **runes** system for reactive state management:

- **Reactive**: Automatic UI updates when state changes
- **Type-safe**: Full TypeScript integration
- **Performance**: Optimized reactivity with fine-grained updates
- **Composable**: Modular state that can be composed and reused

## Key Features

- **Component Composition**: Build complex UIs from simple, reusable components
- **Type Safety**: All components are fully typed with TypeScript
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: WCAG compliant components with proper ARIA attributes
- **Performance**: Optimized for fast loading and smooth interactions

## Development Guidelines

1. **Single Responsibility**: Each component should have one clear purpose
2. **Props Interface**: Always define TypeScript interfaces for component props
3. **Event Handling**: Use Svelte's event forwarding for parent communication
4. **Styling**: Use Tailwind CSS classes with component-specific customizations
5. **Testing**: Components should be testable in isolation 