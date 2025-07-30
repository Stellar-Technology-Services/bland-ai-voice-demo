# Error Components

Components for handling and displaying error states throughout the application.

## Components

### ErrorDisplay.svelte
**Purpose**: User-friendly error message display with recovery options

**Features**:
- Clear, non-technical error messages
- Visual error state indicators
- Recovery action buttons
- Responsive design for all screen sizes

**Usage**:
```svelte
<ErrorDisplay 
  error="Failed to load call data" 
  onRetry={handleRetry}
  showDetails={false}
/>
```

## Error Handling Philosophy

### User Experience
- **Non-Technical Language**: Error messages should be understandable by non-developers
- **Actionable**: Provide clear next steps for users to resolve issues
- **Contextual**: Error messages should relate to what the user was trying to do
- **Recovery**: Always provide a path forward when possible

### Visual Design
- **Clear Hierarchy**: Error messages should be prominently displayed
- **Consistent Styling**: Use design system colors and typography
- **Accessibility**: Proper color contrast and screen reader support
- **Mobile Friendly**: Responsive design for all device sizes

## Error Categories

### Network Errors
- **Connection Issues**: Internet connectivity problems
- **API Failures**: Server-side errors and timeouts
- **Rate Limiting**: Too many requests errors
- **Authentication**: Invalid API keys or permissions

### Validation Errors
- **Form Validation**: User input validation failures
- **Phone Number Format**: Invalid phone number patterns
- **Required Fields**: Missing required information
- **Data Type Errors**: Incorrect data format submissions

### Application Errors
- **Call Failures**: Voice call initialization problems
- **Analysis Errors**: OpenAI analysis processing failures
- **State Errors**: Invalid application state transitions
- **Browser Compatibility**: Unsupported browser features

## Error Recovery Patterns

### Automatic Retry
```svelte
<script>
  import { ErrorDisplay } from '$components/error';
  
  let error = null;
  let retryCount = 0;
  
  async function handleRetry() {
    if (retryCount < 3) {
      retryCount++;
      error = null;
      try {
        await retryOperation();
      } catch (err) {
        error = err.message;
      }
    }
  }
</script>

{#if error}
  <ErrorDisplay 
    {error} 
    onRetry={handleRetry}
    retryDisabled={retryCount >= 3}
  />
{/if}
```

### Graceful Degradation
```svelte
<!-- Provide alternative functionality when primary feature fails -->
{#if callError}
  <ErrorDisplay error="Voice calling is temporarily unavailable">
    <Button href="/contact">Contact Support</Button>
    <Button onClick={tryAlternativeMethod}>Try Alternative</Button>
  </ErrorDisplay>
{:else}
  <!-- Normal call interface -->
{/if}
```

## Component Props

### ErrorDisplay Props
```typescript
interface ErrorDisplayProps {
  error: string;                    // Error message to display
  onRetry?: () => void;            // Optional retry callback
  retryDisabled?: boolean;         // Disable retry button
  showDetails?: boolean;           // Show technical details
  variant?: 'warning' | 'error';  // Visual variant
  title?: string;                  // Custom error title
  children?: any;                  // Additional action buttons
}
```

## Integration with Error Handling

### API Error Handling
```typescript
// In demo rune or components
try {
  const result = await fetch('/api/bland/calls', { method: 'POST', body });
  // Handle success
} catch (err) {
  if (err.status === 429) {
    errorMessage = 'Too many requests. Please wait a moment before trying again.';
  } else if (err.status >= 500) {
    errorMessage = 'Service temporarily unavailable. Please try again later.';
  } else {
    errorMessage = 'Something went wrong. Please check your input and try again.';
  }
}
```

### Form Validation Errors
```svelte
<script>
  let phoneError = '';
  
  function validatePhone(phone) {
    if (!phone) {
      phoneError = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(phone)) {
      phoneError = 'Please enter a valid phone number';
    } else {
      phoneError = '';
    }
  }
</script>

{#if phoneError}
  <ErrorDisplay error={phoneError} variant="warning" />
{/if}
```

## Accessibility Considerations

### Screen Readers
- **ARIA Labels**: Proper labeling for assistive technologies
- **Role Attributes**: Error regions marked with appropriate roles
- **Live Regions**: Dynamic error announcements

### Visual Design
- **Color Contrast**: WCAG AA compliant error colors
- **Icon Support**: Visual indicators beyond just color
- **Font Sizing**: Readable error text at all sizes

### Keyboard Navigation
- **Focus Management**: Proper focus handling for error states
- **Action Buttons**: Keyboard accessible retry and recovery actions
- **Escape Handling**: Clear ways to dismiss non-critical errors

## Development Guidelines

1. **User-Centric**: Write error messages from the user's perspective
2. **Actionable**: Always provide next steps when possible
3. **Consistent**: Use the same error component patterns throughout
4. **Accessible**: Follow WCAG guidelines for error messaging
5. **Testing**: Test error states as thoroughly as success states
6. **Recovery**: Design for error recovery, not just error display
7. **Context**: Provide relevant context about what went wrong 