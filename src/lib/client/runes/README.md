# Svelte 5 Runes - State Management

This directory contains Svelte 5 runes for reactive state management throughout the application.

## What are Runes?

Svelte 5 introduces **runes** - a new way to declare reactive state that provides:

- **Fine-grained reactivity**: Only update what actually changed
- **Universal reactivity**: Works inside and outside components
- **Better TypeScript integration**: Full type safety for reactive state
- **Explicit state management**: Clear, intentional reactive declarations

## Current Runes

### Demo Rune (`demo.svelte.ts`)
Centralized state management for the AI phone call demo functionality.

```typescript
import { demoRune } from '$lib/client/runes/demo.svelte';

// Create rune instance
const demo = demoRune();

// Access reactive state
$: phoneNumber = demo.phoneNumber;
$: callStatus = demo.callStatus;
$: transcript = demo.transcript;
$: orderDetails = demo.orderDetails;

// Update state
demo.phoneNumber = '+1-555-123-4567';
demo.startCall();
demo.stopCall();
```

## Demo Rune Features

### Call Configuration
- **phoneNumber**: Target phone number for AI calls
- **customTask**: Conversation instructions for the AI
- **advancedSettings**: Voice, temperature, and call parameters
- **showAdvancedSettings**: UI state for settings visibility

### Call State Management
- **isCallActive**: Boolean indicating if a call is in progress
- **currentCall**: Active call details and metadata
- **callStatus**: Current call status (idle, dialing, in-progress, completed, etc.)
- **isLoading**: Loading states for async operations
- **errorMessage**: User-friendly error messages

### Real-time Data
- **transcript**: Live conversation transcript entries
- **orderDetails**: Parsed order information from AI analysis
- **statusColor**: Dynamic status indicator colors

### Actions
- **startCall()**: Initiate a new AI phone call
- **stopCall()**: End the current active call
- **resetDemo()**: Reset all state to initial values
- **setTranscriptContainer()**: Set DOM reference for auto-scrolling

## State Architecture

### Reactive Patterns
```typescript
// State declaration
let phoneNumber = $state('');
let callStatus = $state<CallStatus>('idle');
let transcript = $state<TranscriptEntry[]>([]);

// Computed state
const canStartCall = $derived(
  phoneNumber.length > 0 && 
  !isCallActive && 
  !isLoading
);

const statusColor = $derived(
  callStatus === 'completed' ? 'green' :
  callStatus === 'failed' ? 'red' :
  callStatus === 'in-progress' ? 'blue' : 'gray'
);
```

### Side Effects
```typescript
// Effect for cleanup
$effect(() => {
  return () => {
    stopStatusPolling();
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
  };
});
```

## Integration with Components

### Component Usage
```svelte
<script>
  import { demoRune } from '$lib/client/runes/demo.svelte';
  
  const demo = demoRune();
  
  // Reactive bindings
  $: phoneNumber = demo.phoneNumber;
  $: canStart = demo.canStartCall;
</script>

<input bind:value={demo.phoneNumber} />
<button disabled={!canStart} onclick={demo.startCall}>
  Start Call
</button>
```

### State Synchronization
All demo components share the same rune instance, ensuring:
- **Consistent State**: All components reflect the same data
- **Automatic Updates**: Changes propagate automatically
- **Type Safety**: Full TypeScript integration prevents errors

## Performance Benefits

### Fine-grained Updates
- Only components using changed state re-render
- Automatic dependency tracking eliminates unnecessary updates
- Optimal performance for real-time features like transcript updates

### Memory Management
- Automatic cleanup of intervals and timeouts
- Proper reference management for DOM elements
- Prevention of memory leaks in long-running sessions

## Development Guidelines

1. **Single Source of Truth**: Use runes for all shared state
2. **Type Safety**: Always define interfaces for complex state
3. **Cleanup**: Implement proper cleanup in $effect
4. **Derived State**: Use $derived for computed values
5. **Side Effects**: Keep side effects in $effect, not in components
6. **Testing**: Write tests for rune logic independently of components

## Future Enhancements

- **Persistence**: Add local storage for call history
- **Multiple Calls**: Support for managing multiple concurrent calls
- **Analytics**: Integration with analytics providers
- **Caching**: Smart caching for API responses 