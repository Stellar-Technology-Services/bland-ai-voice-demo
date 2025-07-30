# UI Components

Reusable, generic UI components that form the foundation of the design system.

## Component Library

### Form Controls
- **Button.svelte**: Primary, secondary, and action buttons with loading states
- **Input.svelte**: Text inputs with validation and error states
- **Textarea.svelte**: Multi-line text inputs for longer content
- **Select.svelte**: Dropdown selections with keyboard navigation
- **Checkbox.svelte**: Boolean input controls with custom styling
- **Switch.svelte**: Toggle switches for settings and preferences

### Layout & Structure
- **Card.svelte**: Content containers with consistent spacing and shadows
- **Container.svelte**: Page layout wrapper with responsive max-width
- **Divider.svelte**: Visual separators between content sections
- **Tabs.svelte**: Tab navigation for organizing related content

### Feedback & Status
- **Alert.svelte**: Status messages (success, warning, error, info)
- **Badge.svelte**: Small status indicators and labels
- **Spinner.svelte**: Loading indicators for async operations
- **Tooltip.svelte**: Contextual help and additional information

### Data Display
- **Table.svelte**: Structured data display with sorting and pagination
- **Avatar.svelte**: User profile images and initials
- **TranscriptViewer.svelte**: Specialized component for conversation display

### Navigation
- **Heading.svelte**: Consistent typography hierarchy (h1-h6)

## Design System

### Component Variants
```typescript
// Example: Button variants
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}
```

### Styling System
- **Tailwind CSS**: Utility-first CSS framework
- **CSS Variables**: Design tokens for colors, spacing, and typography
- **Responsive**: Mobile-first breakpoint system
- **Dark Mode**: Automatic theme switching support

### Accessibility Features
- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG AA compliant color combinations

## Usage Patterns

### Import and Usage
```svelte
<script>
  import { Button, Input, Card } from '$components/ui';
  
  let value = '';
  
  function handleSubmit() {
    // Handle form submission
  }
</script>

<Card>
  <Input bind:value placeholder="Enter text..." />
  <Button variant="primary" on:click={handleSubmit}>
    Submit
  </Button>
</Card>
```

### Component Composition
```svelte
<!-- Build complex UIs from simple components -->
<Card>
  <div class="space-y-4">
    <Heading level={2}>Settings</Heading>
    <Divider />
    
    <div class="flex items-center justify-between">
      <span>Enable notifications</span>
      <Switch bind:checked={notifications} />
    </div>
    
    <Alert variant="info">
      Changes will be saved automatically.
    </Alert>
  </div>
</Card>
```

## Development Guidelines

1. **Reusability**: Design components to be used in multiple contexts
2. **Props Interface**: Always define clear TypeScript interfaces
3. **Default Values**: Provide sensible defaults for all optional props
4. **Event Forwarding**: Forward native events for parent components
5. **Slot Support**: Use slots for flexible content composition
6. **Style Overrides**: Support style customization via CSS variables
7. **Documentation**: Include usage examples and prop descriptions 