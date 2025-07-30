/**
 * Demo Rune - AI Phone Call State Management
 *
 * This class-based rune handles all the complex state management and business logic for the AI phone call demo.
 * It encapsulates call lifecycle, transcript management, status polling, and analysis functionality.
 * Uses Svelte 5 runes with class fields for optimal reactivity and performance.
 */

import { onDestroy } from 'svelte';

// Type definitions for demo functionality
interface TranscriptEntry {
	text: string;
	user: string;
	timestamp: string;
}

interface BlandTranscriptEntry {
	text: string;
	user: string;
	created_at: string;
}

interface CallDetails {
	call_id: string;
	status: string;
	transcripts?: BlandTranscriptEntry[];
	concatenated_transcript?: string;
	call_length?: number;
	to?: string;
	created_at?: string;
	end_at?: string;
}

interface PizzaOrderDetails {
	pizzas?: Array<{
		type: string;
		size: string;
		quantity: number;
		price?: number;
	}>;
	total_cost?: string;
	pickup_time?: string;
	customer_name?: string;
	special_instructions?: string;
	order_successful: boolean;
	[key: string]: unknown; // Allow additional properties from analysis
}

interface AdvancedSettings {
	// Voice & Model
	voice: string;
	model: string;
	language: string;

	// Behavior
	wait_for_greeting: boolean;
	temperature: number;
	interruption_threshold: number;
	max_duration: number;

	// Call Configuration
	timezone: string;
	start_time: string;

	// Audio & Quality
	background_track: string;
	noise_cancellation: boolean;
	block_interruptions: boolean;
	record: boolean;

	// Analysis
	analysis_preset: string;
	summary_prompt: string;

	// Advanced Features
	first_sentence: string;
	precall_dtmf_sequence: string;
	ignore_button_press: boolean;

	webhook: string;
	keywords: string;
}

// Default pizza ordering task template
const DEFAULT_TASK = `You are an AI assistant making a phone call to order pizza. You MUST act exactly like a real human customer placing a pizza order. This is your complete task:

## CORE OBJECTIVE
Order pizza for 12 people from this restaurant. You must complete this entire interaction before ending the call.

## SPECIFIC ORDER TO PLACE
You must order these exact pizzas (adjust sizes based on what they offer):
1. Two (2) large pepperoni pizzas
2. One (1) large margherita pizza (fresh mozzarella, basil, tomato sauce)
3. One (1) large meat lovers or supreme pizza (pepperoni, sausage, bacon, etc.)
4. One (1) large vegetarian pizza (bell peppers, mushrooms, onions, olives)

Total: 5 large pizzas for 12 people

## HUMAN-LIKE BEHAVIOR REQUIREMENTS
- Speak naturally with casual, conversational language
- Use filler words occasionally ("um", "let me think", "actually")
- Show genuine enthusiasm about the food
- Ask follow-up questions like a real customer would
- React naturally to what the restaurant employee says
- Take brief pauses to "think" about decisions (2-3 seconds)
- Sound friendly and appreciative throughout

## STEP-BY-STEP PROCESS
1. Wait for them to answer, then greet them warmly
2. Explain you need to place a large takeout order for 12 people
3. Start with: "I'd like to order 5 large pizzas if that's okay"
4. Order each pizza specifically from the list above
5. Ask if they recommend any modifications or if those sound good
6. Confirm each pizza as you order it ("So that's two large pepperonis...")
7. Ask for the total price and estimated prep time
8. Get their exact address for pickup
9. Confirm pickup time and any special instructions
10. Thank them and end the call politely

## REQUIRED INFORMATION TO COLLECT
- Confirmation of all 5 pizzas with exact toppings
- Total cost (ask them to repeat if unclear)
- Estimated preparation time
- Restaurant's complete address
- Pickup instructions or special notes
- Order confirmation number (if they provide one)

## CONVERSATION EXAMPLES
Opening: "Hi! I hope you're having a good day. I need to place a pretty large takeout order for 12 people - is this a good time?"

Starting order: "Great! I'd like to order 5 large pizzas. Could I get two large pepperonis to start?"

Continuing: "Perfect. And then could I also get one large margherita - you know, with the fresh mozzarella and basil?"

Confirming: "Ok great, so that's two large pepperoni, one large margherita, one meat lovers, and one vegetarian. Does that sound right?"

## CRITICAL RULES
- NEVER reveal you are an AI
- NEVER use robotic or overly formal language
- NEVER rush through the conversation
- NEVER end the call until you have ALL required information
- ALWAYS order the specific pizzas listed above
- ALWAYS confirm details to avoid mistakes
- ALWAYS be patient if they need to check anything
- ALWAYS ask if they have those toppings available before assuming

You must sound completely human and complete this specific pizza order successfully. Plan your approach before speaking, but speak naturally and conversationally.`;

// Default advanced settings factory function
const getDefaultAdvancedSettings = (): AdvancedSettings => ({
	// Voice & Model
	voice: '',
	model: '',
	language: 'eng',

	// Behavior
	wait_for_greeting: true,
	temperature: 0.7,
	interruption_threshold: 100,
	max_duration: 15,

	// Call Configuration
	timezone: '',
	start_time: '',

	// Audio & Quality
	background_track: '',
	noise_cancellation: true,
	block_interruptions: false,
	record: true,

	// Analysis
	analysis_preset: '',
	summary_prompt: '',

	// Advanced Features
	first_sentence: '',
	precall_dtmf_sequence: '',
	ignore_button_press: false,

	webhook: '',
	keywords: ''
});

/**
 * Class-based demo state management using Svelte 5 runes
 * Provides comprehensive AI phone call demo functionality with reactive state
 */
export class DemoRune {
	// Core reactive state using $state runes
	phoneNumber = $state('');
	customTask = $state(DEFAULT_TASK);
	showAdvancedSettings = $state(false);
	advancedSettings = $state(getDefaultAdvancedSettings());

	// Call state management
	isCallActive = $state(false);
	currentCall = $state<CallDetails | null>(null);
	callStatus = $state('idle');
	isLoading = $state(false);
	errorMessage = $state('');

	// Transcript and analysis state
	transcript = $state<TranscriptEntry[]>([]);
	orderDetails = $state<PizzaOrderDetails | null>(null);

	// Private fields for internal management (not reactive)
	private statusInterval: ReturnType<typeof setInterval> | null = null;
	private transcriptContainer: HTMLElement | null = null;
	private scrollTimeout: ReturnType<typeof setTimeout> | null = null;

	// Computed properties using $derived
	canStartCall = $derived(
		this.phoneNumber.length >= 10 &&
			this.customTask.trim().length > 0 &&
			!this.isCallActive &&
			!this.isLoading
	);

	statusColor = $derived(() => {
		switch (this.callStatus) {
			case 'queued':
				return 'warning';
			case 'ringing':
				return 'info';
			case 'in-progress':
				return 'success';
			case 'completed':
				return 'success';
			case 'failed':
				return 'danger';
			case 'no-answer':
				return 'default';
			default:
				return 'default';
		}
	});

	constructor() {
		// Setup cleanup on component destruction
		onDestroy(() => {
			this.cleanup();
		});
	}

	/**
	 * Start a new AI phone call with configured settings
	 */
	startCall = async (): Promise<void> => {
		// Prevent multiple simultaneous calls
		if (this.isLoading || this.isCallActive) {
			console.warn('Call already in progress, ignoring duplicate request');
			return;
		}

		if (!this.phoneNumber) {
			this.errorMessage = 'Please enter a phone number';
			return;
		}

		if (!this.customTask.trim()) {
			this.errorMessage = 'Please enter a task for the AI to perform';
			return;
		}

		this.isLoading = true;
		this.errorMessage = '';

		try {
			const requestBody: any = {
				phone_number: this.phoneNumber,
				task: this.customTask.trim(),
				max_duration: this.advancedSettings.max_duration,
				record: this.advancedSettings.record,
				wait_for_greeting: this.advancedSettings.wait_for_greeting,
				temperature: this.advancedSettings.temperature,
				interruption_threshold: this.advancedSettings.interruption_threshold,
				noise_cancellation: this.advancedSettings.noise_cancellation,
				block_interruptions: this.advancedSettings.block_interruptions,
				ignore_button_press: this.advancedSettings.ignore_button_press
			};

			// Add optional parameters if they have values
			if (this.advancedSettings.voice) requestBody.voice = this.advancedSettings.voice;
			if (this.advancedSettings.model) requestBody.model = this.advancedSettings.model;
			if (this.advancedSettings.language) requestBody.language = this.advancedSettings.language;
			if (this.advancedSettings.timezone) requestBody.timezone = this.advancedSettings.timezone;
			if (this.advancedSettings.start_time)
				requestBody.start_time = this.advancedSettings.start_time;
			if (this.advancedSettings.background_track)
				requestBody.background_track = this.advancedSettings.background_track;
			if (this.advancedSettings.analysis_preset)
				requestBody.analysis_preset = this.advancedSettings.analysis_preset;
			if (this.advancedSettings.summary_prompt)
				requestBody.summary_prompt = this.advancedSettings.summary_prompt;
			if (this.advancedSettings.first_sentence)
				requestBody.first_sentence = this.advancedSettings.first_sentence;
			if (this.advancedSettings.precall_dtmf_sequence)
				requestBody.precall_dtmf_sequence = this.advancedSettings.precall_dtmf_sequence;
			if (this.advancedSettings.webhook) requestBody.webhook = this.advancedSettings.webhook;

			// Handle keywords array
			if (this.advancedSettings.keywords.trim()) {
				requestBody.keywords = this.advancedSettings.keywords
					.split(',')
					.map((k) => k.trim())
					.filter((k) => k);
			}

			const response = await fetch('/api/bland/calls', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestBody)
			});

			if (!response.ok) {
				const error = await response.text();
				throw new Error(error);
			}

			const result = await response.json();
			this.currentCall = result;
			this.isCallActive = true;
			this.callStatus = 'queued';
			this.transcript = [];

			// Start polling for call status
			this.startStatusPolling();
		} catch (error) {
			console.error('Failed to start call:', error);
			this.errorMessage = error instanceof Error ? error.message : 'Failed to start call';
		} finally {
			this.isLoading = false;
		}
	};

	/**
	 * Stop the active call
	 */
	stopCall = async (): Promise<void> => {
		if (!this.currentCall?.call_id) return;

		const callId = this.currentCall.call_id;

		// Clear any existing error messages
		this.errorMessage = '';

		// Stop polling immediately to prevent race conditions
		this.stopStatusPolling();

		// Update UI state immediately for instant feedback
		this.callStatus = 'stopped';
		this.isCallActive = false;
		this.isLoading = false;

		console.log(`Stopping call ${callId} - UI updated immediately`);

		// Make API call in background without blocking UI
		// This ensures the actual call is stopped on the server
		try {
			const response = await fetch(`/api/bland/calls/${callId}?action=stop`, {
				method: 'POST'
			});

			if (!response.ok) {
				console.warn(`Failed to stop call ${callId} on server:`, response.status);
				// Don't revert UI state - user sees call as stopped regardless
				// Only show error for debugging purposes, not user-facing
			} else {
				console.log(`Call ${callId} stopped successfully on server`);
			}
		} catch (error) {
			console.warn(`Network error stopping call ${callId}:`, error);
			// Don't revert UI state or show error to user
			// The UI shows the call as stopped, which is what the user wanted
		}
	};

	/**
	 * Start polling for call status updates
	 */
	private startStatusPolling(): void {
		if (this.statusInterval) {
			clearInterval(this.statusInterval);
		}

		this.statusInterval = setInterval(async () => {
			// Guard against polling after it's been stopped
			if (!this.statusInterval) return;
			if (!this.currentCall?.call_id) return;
			if (!this.isCallActive) return; // Additional guard for stopped calls

			const callId = this.currentCall.call_id; // Store call ID to prevent race conditions

			try {
				// Fetch call details
				const response = await fetch(`/api/bland/calls/${callId}`);

				// Guard against polling being stopped during request
				if (
					!this.statusInterval ||
					!this.currentCall?.call_id ||
					this.currentCall.call_id !== callId ||
					!this.isCallActive
				) {
					return;
				}

				if (!response.ok) {
					// Handle different error status codes appropriately
					if (response.status === 404) {
						console.warn(`Call ${callId} not found - may have been deleted`);
						this.stopStatusPolling();
						this.isCallActive = false;
						this.callStatus = 'unknown';
						return;
					}
					console.warn('Failed to fetch call details:', response.status);
					return;
				}

				const callDetails = await response.json();

				// Final guard before updating state
				if (
					!this.statusInterval ||
					!this.currentCall?.call_id ||
					this.currentCall.call_id !== callId ||
					!this.isCallActive
				) {
					return;
				}

				// Only update if status actually changed to avoid unnecessary updates
				if (this.callStatus !== callDetails.status) {
					this.callStatus = callDetails.status;
					console.log(`Call ${callId} status changed to: ${this.callStatus}`);
				}

				// Update transcript
				await this.updateTranscript(callDetails);

				// If call is completed, stop polling and analyze
				if (
					['completed', 'failed', 'no-answer', 'busy', 'cancelled'].includes(callDetails.status)
				) {
					console.log(`Call finished with status: ${callDetails.status}`);
					this.stopStatusPolling();
					this.isCallActive = false;

					if (callDetails.status === 'completed') {
						this.analyzeCall();
					}
				}
			} catch (error) {
				// Only log error if polling is still active and call hasn't been stopped
				if (this.statusInterval && this.currentCall?.call_id === callId && this.isCallActive) {
					console.error('Failed to poll call status:', error);
					// Don't set error message for network failures during polling
					// as they're temporary and could be distracting
				}
			}
		}, 2500); // Poll every 2.5 seconds
	}

	/**
	 * Update transcript from call details or dedicated endpoint
	 */
	private async updateTranscript(callDetails: CallDetails): Promise<void> {
		// Guard against invalid call details or stopped calls
		if (!callDetails || !this.currentCall?.call_id || !this.isCallActive) {
			return;
		}

		try {
			// First try to get transcript from our API endpoint
			if (callDetails.status === 'completed' || callDetails.status === 'in-progress') {
				try {
					const transcriptResponse = await fetch(
						`/api/bland/calls/${this.currentCall.call_id}/transcript`
					);

					// Check if call is still active before processing response
					if (!this.isCallActive || !this.currentCall?.call_id) {
						return;
					}

					if (transcriptResponse.ok) {
						const transcriptData = await transcriptResponse.json();
						if (
							transcriptData.transcript &&
							Array.isArray(transcriptData.transcript) &&
							transcriptData.transcript.length > 0
						) {
							// Only update if we have more entries than before to avoid overwriting
							if (transcriptData.transcript.length >= this.transcript.length) {
								this.transcript = transcriptData.transcript;
								console.log(`Updated transcript: ${this.transcript.length} entries`);
								this.scrollToBottom();
							}
							return;
						}
					}
				} catch (transcriptError) {
					console.warn('Failed to fetch transcript from API:', transcriptError);
				}
			}

			// Fallback to using transcript data directly from call details
			if (callDetails.transcripts && Array.isArray(callDetails.transcripts)) {
				// Convert Bland AI transcript format to our format with validation
				const newTranscript = callDetails.transcripts
					.filter(
						(entry): entry is BlandTranscriptEntry =>
							entry &&
							typeof entry === 'object' &&
							typeof entry.text === 'string' &&
							typeof entry.user === 'string'
					)
					.map(
						(entry): TranscriptEntry => ({
							text: entry.text || '',
							user: entry.user || 'unknown',
							timestamp: entry.created_at || new Date().toISOString()
						})
					)
					.filter((entry) => entry.text.trim() !== ''); // Remove empty entries

				// Only update if we have new content to avoid unnecessary re-renders
				if (newTranscript.length >= this.transcript.length) {
					this.transcript = newTranscript;
					console.log(`Updated transcript from call details: ${this.transcript.length} entries`);
					this.scrollToBottom();
				}
			} else if (
				callDetails.concatenated_transcript &&
				callDetails.concatenated_transcript.trim()
			) {
				// Parse concatenated transcript if available and not empty
				const lines = callDetails.concatenated_transcript
					.split('\n')
					.filter((line: string) => line.trim());

				if (lines.length > 0) {
					const parsedTranscript = lines.map((line: string) => {
						const [user, ...textParts] = line.split(': ');
						return {
							user: user || 'unknown',
							text: textParts.join(': ') || line,
							timestamp: new Date().toISOString()
						};
					});

					// Only update if we have more content
					if (parsedTranscript.length >= this.transcript.length) {
						this.transcript = parsedTranscript;
						console.log(`Parsed concatenated transcript: ${this.transcript.length} entries`);
						this.scrollToBottom();
					}
				}
			}
		} catch (error) {
			console.error('Failed to update transcript:', error);
		}
	}

	/**
	 * Stop status polling
	 */
	private stopStatusPolling(): void {
		if (this.statusInterval) {
			clearInterval(this.statusInterval);
			this.statusInterval = null;
		}
	}

	/**
	 * Analyze the completed call to extract order details
	 */
	private analyzeCall = async (): Promise<void> => {
		if (!this.currentCall?.call_id) return;

		console.log(`Starting analysis for call ${this.currentCall.call_id}`);

		try {
			const response = await fetch(`/api/bland/calls/${this.currentCall.call_id}/analyze`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					type: 'pizza_order'
				})
			});

			if (response.ok) {
				const analysisResult = await response.json();
				if (analysisResult.success && analysisResult.analysis) {
					this.orderDetails = analysisResult.analysis;
					console.log('Call analysis completed successfully');
				} else {
					console.warn('Analysis returned no results:', analysisResult);
				}
			} else {
				console.warn(`Analysis failed with status ${response.status}`);
				// Don't set error message for analysis failures as they're not critical
			}
		} catch (error) {
			console.error('Failed to analyze call:', error);
			// Analysis failure is not critical - don't show error to user
		}
	};

	/**
	 * Scroll transcript to bottom to show latest messages (debounced for performance)
	 */
	private scrollToBottom = (): void => {
		if (!this.transcriptContainer || !this.isCallActive) return;

		// Clear existing timeout to debounce multiple rapid calls
		if (this.scrollTimeout) {
			clearTimeout(this.scrollTimeout);
		}

		this.scrollTimeout = setTimeout(() => {
			if (this.transcriptContainer && this.isCallActive) {
				// Use requestAnimationFrame for smoother scrolling
				requestAnimationFrame(() => {
					if (this.transcriptContainer && this.isCallActive) {
						try {
							this.transcriptContainer.scrollTo({
								top: this.transcriptContainer.scrollHeight,
								behavior: 'smooth'
							});
						} catch (error) {
							console.warn('Failed to scroll transcript:', error);
						}
					}
				});
			}
			this.scrollTimeout = null;
		}, 50); // Reduced timeout for better responsiveness
	};

	/**
	 * Set the transcript container reference for auto-scrolling
	 */
	setTranscriptContainer = (element: HTMLElement): void => {
		this.transcriptContainer = element;
	};

	/**
	 * Reset the demo to initial state
	 */
	resetDemo = (): void => {
		console.log('Resetting demo to initial state');

		// Stop all ongoing operations
		this.stopStatusPolling();

		// Clear any pending scroll operations
		if (this.scrollTimeout) {
			clearTimeout(this.scrollTimeout);
			this.scrollTimeout = null;
		}

		// Reset all state to initial values
		this.phoneNumber = '';
		this.advancedSettings = getDefaultAdvancedSettings();
		this.showAdvancedSettings = false;
		this.customTask = DEFAULT_TASK;
		this.isCallActive = false;
		this.currentCall = null;
		this.callStatus = 'idle';
		this.transcript = [];
		this.orderDetails = null;
		this.errorMessage = '';
		this.isLoading = false;

		// Clear transcript container reference if it exists
		this.transcriptContainer = null;
	};

	/**
	 * Comprehensive cleanup for component destruction
	 */
	private cleanup(): void {
		this.stopStatusPolling();

		// Clear any pending scroll operations
		if (this.scrollTimeout) {
			clearTimeout(this.scrollTimeout);
			this.scrollTimeout = null;
		}

		// Clear transcript container reference
		this.transcriptContainer = null;
	}
}

/**
 * Factory function to create a new DemoRune instance
 * Maintains compatibility with existing component usage patterns
 */
export function createDemoRune(): DemoRune {
	return new DemoRune();
}
