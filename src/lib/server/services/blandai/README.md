# Bland AI Service

Integration with Bland AI's voice calling API for real phone calls and transcription.

## Overview

The Bland AI service provides the core voice calling functionality for the application, enabling:
- Real phone calls to actual phone numbers
- Live transcription during conversations
- Call status monitoring and control
- Voice configuration and customization
- Call recording and playback

## Service Class (`index.ts`)

### Core Methods

#### `sendCall(request: CallRequest): Promise<CallResponse>`
Initiates a new AI phone call with specified parameters.

**Parameters**:
```typescript
interface CallRequest {
  phone_number: string;          // Target phone number
  task: string;                  // Conversation instructions
  voice?: string;                // Voice ID selection
  max_duration?: number;         // Call duration limit (seconds)
  temperature?: number;          // AI randomness (0.0-1.0)
  interruption_threshold?: number; // Voice interruption sensitivity
  model?: string;                // AI model selection
}
```

**Response**:
```typescript
interface CallResponse {
  call_id: string;               // Unique call identifier
  status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed';
}
```

#### `getCallDetails(callId: string): Promise<CallDetails>`
Retrieves comprehensive call information including transcripts.

**Response**:
```typescript
interface CallDetails {
  call_id: string;
  status: CallStatus;
  created_at: string;
  completed_at?: string;
  duration?: number;
  cost?: number;
  transcripts: TranscriptEntry[];
  recording_url?: string;
}
```

#### `stopCall(callId: string): Promise<void>`
Immediately terminates an active phone call.

### Enhanced Features

#### Request Timeouts
- **sendCall**: 60 seconds (phone call initiation)
- **getCallDetails**: 30 seconds (status polling)
- **stopCall**: 15 seconds (immediate termination)

#### Error Handling
```typescript
// Enhanced error context based on HTTP status
const statusContext = 
  response.status >= 500 ? 'Bland AI service temporarily unavailable' :
  response.status === 429 ? 'Rate limit exceeded' :
  response.status === 401 ? 'Invalid API key' : 'Request failed';
```

#### User-Agent Headers
All requests include identifying headers for service monitoring:
```typescript
headers: { 'User-Agent': 'bland-ai-voice-demo/1.0' }
```

## API Configuration

### Authentication
```typescript
const BLAND_AI_API_KEY = getRequiredEnv('BLAND_AI_API_KEY');
```

### Endpoints
- **Base URL**: `https://api.bland.ai/v1`
- **Send Call**: `POST /calls`
- **Get Call**: `GET /calls/{call_id}`
- **Stop Call**: `POST /calls/{call_id}/stop`

## Integration with Demo

### Call Configuration
The service integrates with the demo through standardized call parameters:

```typescript
const callRequest = {
  phone_number: demo.phoneNumber,
  task: demo.customTask || DEFAULT_PIZZA_TASK,
  voice: demo.advancedSettings.selectedVoice,
  max_duration: demo.advancedSettings.maxDuration,
  temperature: demo.advancedSettings.temperature,
  interruption_threshold: demo.advancedSettings.interruptionThreshold
};
```

### Real-time Updates
Status polling every 2.5 seconds during active calls:

```typescript
// In demo rune
async function pollCallStatus() {
  if (!isCallActive) return;
  
  try {
    const details = await blandAI.getCallDetails(currentCall.call_id);
    callStatus = details.status;
    transcript = processTranscript(details.transcripts);
    
    if (details.status === 'completed' || details.status === 'failed') {
      stopStatusPolling();
      if (details.status === 'completed') {
        triggerAnalysis();
      }
    }
  } catch (error) {
    handlePollingError(error);
  }
}
```

## Voice Configuration

### Available Voices
The service supports 10+ premium AI voices with different characteristics:

- **maya**: Conversational and friendly
- **ryan**: Professional and clear
- **adriana**: Warm and approachable
- **jenny**: Energetic and engaging

### Voice Parameters
```typescript
interface VoiceSettings {
  voice: string;                 // Voice ID
  temperature: number;           // Creativity (0.0-1.0)
  interruption_threshold: number; // Sensitivity (50-1000)
}
```

## Error Handling Patterns

### Network Errors
```typescript
try {
  const response = await makeRequest(url, options, timeoutMs);
  return await handleResponse(response);
} catch (error) {
  if (controller.signal.aborted) {
    throw new Error(`Request timeout after ${timeoutMs}ms`);
  }
  throw error;
}
```

### API Errors
```typescript
// Contextual error messages based on response status
if (!response.ok) {
  let errorMessage: string;
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorData.error || 'Unknown error';
  } catch {
    errorMessage = await response.text();
  }
  throw new Error(`${statusContext}: ${response.status} - ${errorMessage}`);
}
```

## Development Guidelines

1. **Timeout Management**: Always use appropriate timeouts for different operations
2. **Error Context**: Provide meaningful error messages based on HTTP status codes
3. **Rate Limiting**: Respect Bland AI's rate limits for API calls
4. **Monitoring**: Include User-Agent headers for service tracking
5. **Type Safety**: Use TypeScript interfaces for all API interactions
6. **Testing**: Mock external API calls for unit testing
7. **Configuration**: Keep API keys and endpoints configurable 