/**
 * Bland AI Service
 *
 * Provides integration with Bland AI API for automated phone calls.
 * Supports call creation, monitoring, transcripts, and real-time event streaming.
 * Used specifically for pizza ordering automation demo.
 */

import { BLAND_AI_API_KEY } from '$env/static/private';
import { z } from 'zod';

// Bland AI API base URL
const BLAND_AI_BASE_URL = 'https://api.bland.ai';

// Request/Response schemas for type safety
export const sendCallSchema = z.object({
	phone_number: z.string(),
	task: z.string(),
	model: z.string().optional(),
	language: z.string().optional(),
	voice: z.string().optional(),
	voice_settings: z
		.object({
			speed: z.number().optional(),
			stability: z.number().optional(),
			similarity_boost: z.number().optional()
		})
		.optional(),
	pathway_id: z.string().optional(),
	local_dialing: z.boolean().optional(),
	max_duration: z.number().optional(),
	answered_by_enabled: z.boolean().optional(),
	wait_for_greeting: z.boolean().optional(),
	record: z.boolean().optional(),
	amd: z.boolean().optional(),
	interruption_threshold: z.number().optional(),
	voicemail_message: z.string().optional(),
	temperature: z.number().optional(),
	pronunciation_guide: z
		.array(
			z.object({
				word: z.string(),
				pronunciation: z.string()
			})
		)
		.optional(),
	start_time: z.string().optional(),
	request_data: z.record(z.string(), z.unknown()).optional(),
	tools: z.array(z.unknown()).optional(),
	dynamic_data: z.array(z.unknown()).optional(),
	analysis_preset: z.string().optional(),
	analysis_schema: z.record(z.string(), z.unknown()).optional(),
	webhook: z.string().optional(),
	calendly: z
		.object({
			url: z.string(),
			timezone: z.string().optional()
		})
		.optional()
});

export const callResponseSchema = z.object({
	call_id: z.string(),
	status: z.string()
});

export const callDetailsSchema = z.object({
	call_id: z.string(),
	call_length: z.number().nullish(),
	batch_id: z.string().nullish(),
	to: z.string(),
	from: z.string(),
	request_data: z.record(z.string(), z.unknown()).nullish(),
	completed: z.boolean().nullish(),
	created_at: z.string(),
	inbound: z.boolean().nullish(),
	queue_status: z.string().nullish(),
	endpoint_url: z.string().nullish(),
	max_duration: z.number(),
	error_message: z.string().nullish(),
	variables: z.record(z.string(), z.unknown()).nullish(),
	answered_by: z.string().nullish(),
	record: z.boolean(),
	recording_url: z.string().nullish(),
	c_id: z.string().nullish(),
	metadata: z.record(z.string(), z.unknown()).nullish(),
	summary: z.string().nullish(),
	price: z.number().nullish(),
	started_at: z.string().nullish(),
	local_dialing: z.boolean().nullish(),
	call_ended_by: z.string().nullish(),
	pathway_logs: z.string().nullish(),
	analysis_schema: z.record(z.string(), z.unknown()).nullish(),
	analysis: z.record(z.string(), z.unknown()).nullish(),
	concatenated_transcript: z.string().nullish(),
	transcripts: z
		.array(
			z.object({
				id: z.number().nullish(),
				created_at: z.string(),
				text: z.string(),
				user: z.string(),
				c_id: z.string().nullish(),
				status: z.string().nullish(),
				transcript_id: z.string().nullish()
			})
		)
		.nullish(),
	status: z.string(),
	corrected_duration: z.string().nullish(),
	end_at: z.string().nullish()
});

export const eventStreamDataSchema = z.object({
	call_id: z.string(),
	timestamp: z.string(),
	event_type: z.string(),
	data: z.record(z.string(), z.unknown())
});

export type SendCallRequest = z.infer<typeof sendCallSchema>;
export type CallResponse = z.infer<typeof callResponseSchema>;
export type CallDetails = z.infer<typeof callDetailsSchema>;
export type EventStreamData = z.infer<typeof eventStreamDataSchema>;

/**
 * Bland AI Service Class
 *
 * Manages all interactions with the Bland AI API including call creation,
 * monitoring, analysis, and real-time event streaming.
 */
export class BlandAIService {
	private readonly apiKey: string;
	private readonly baseUrl: string;

	constructor(apiKey?: string) {
		this.apiKey = apiKey || BLAND_AI_API_KEY;
		this.baseUrl = BLAND_AI_BASE_URL;

		if (!this.apiKey) {
			throw new Error('Bland AI API key is required');
		}
	}

	/**
	 * Get default headers for API requests
	 */
	private getHeaders(contentType: string = 'application/json'): Record<string, string> {
		return {
			Authorization: `Bearer ${this.apiKey}`,
			'Content-Type': contentType
		};
	}

	/**
	 * Make API request with timeout and retry logic
	 */
	private async makeRequest(url: string, options: RequestInit, timeoutMs: number = 30000): Promise<Response> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

		try {
			const response = await fetch(url, {
				...options,
				signal: controller.signal,
				headers: {
					...options.headers,
					'User-Agent': 'bland-ai-voice-demo/1.0'
				}
			});
			clearTimeout(timeoutId);
			return response;
		} catch (error) {
			clearTimeout(timeoutId);
			if (controller.signal.aborted) {
				throw new Error(`Request timeout after ${timeoutMs}ms`);
			}
			throw error;
		}
	}

	/**
	 * Handle API response and errors with improved error context
	 */
	private async handleResponse<T>(response: Response): Promise<T> {
		if (!response.ok) {
			let errorMessage: string;
			try {
				const errorData = await response.json();
				errorMessage = errorData.message || errorData.error || 'Unknown error';
			} catch {
				errorMessage = await response.text();
			}
			
			// Provide context based on status code
			const statusContext = response.status >= 500 
				? 'Bland AI service temporarily unavailable' 
				: response.status === 429 
				? 'Rate limit exceeded' 
				: response.status === 401 
				? 'Invalid API key' 
				: 'Request failed';
				
			throw new Error(`${statusContext}: ${response.status} - ${errorMessage}`);
		}
		return await response.json();
	}

	/**
	 * Send a call with comprehensive configuration options
	 */
	async sendCall(callRequest: {
		phone_number: string;
		task?: string;
		voice?: string;
		model?: string;
		language?: string;
		wait_for_greeting?: boolean;
		temperature?: number;
		interruption_threshold?: number;
		max_duration?: number;
		from?: string;
		local_dialing?: boolean;
		timezone?: string;
		start_time?: string;
		transfer_phone_number?: string;
		background_track?: string;
		noise_cancellation?: boolean;
		block_interruptions?: boolean;
		record?: boolean;
		analysis_preset?: string;
		summary_prompt?: string;
		first_sentence?: string;
		precall_dtmf_sequence?: string;
		ignore_button_press?: boolean;
		request_data?: Record<string, any>;
		metadata?: Record<string, any>;
		webhook?: string;
		keywords?: string[];
	}): Promise<{ status: string; message: string; call_id?: string; batch_id?: string }> {
		// Build the request body with all provided parameters
		const requestBody: any = {
			phone_number: callRequest.phone_number
		};

		// Add optional parameters if they have values
		if (callRequest.task) requestBody.task = callRequest.task;
		if (callRequest.voice) requestBody.voice = callRequest.voice;
		if (callRequest.model) requestBody.model = callRequest.model;
		if (callRequest.language) requestBody.language = callRequest.language;
		if (callRequest.wait_for_greeting !== undefined)
			requestBody.wait_for_greeting = callRequest.wait_for_greeting;
		if (callRequest.temperature !== undefined) requestBody.temperature = callRequest.temperature;
		if (callRequest.interruption_threshold !== undefined)
			requestBody.interruption_threshold = callRequest.interruption_threshold;
		if (callRequest.max_duration !== undefined) requestBody.max_duration = callRequest.max_duration;
		if (callRequest.from) requestBody.from = callRequest.from;
		if (callRequest.local_dialing !== undefined)
			requestBody.local_dialing = callRequest.local_dialing;
		if (callRequest.timezone) requestBody.timezone = callRequest.timezone;
		if (callRequest.start_time) requestBody.start_time = callRequest.start_time;
		if (callRequest.transfer_phone_number)
			requestBody.transfer_phone_number = callRequest.transfer_phone_number;
		if (callRequest.background_track) requestBody.background_track = callRequest.background_track;
		if (callRequest.noise_cancellation !== undefined)
			requestBody.noise_cancellation = callRequest.noise_cancellation;
		if (callRequest.block_interruptions !== undefined)
			requestBody.block_interruptions = callRequest.block_interruptions;
		if (callRequest.record !== undefined) requestBody.record = callRequest.record;
		if (callRequest.analysis_preset) requestBody.analysis_preset = callRequest.analysis_preset;
		if (callRequest.summary_prompt) requestBody.summary_prompt = callRequest.summary_prompt;
		if (callRequest.first_sentence) requestBody.first_sentence = callRequest.first_sentence;
		if (callRequest.precall_dtmf_sequence)
			requestBody.precall_dtmf_sequence = callRequest.precall_dtmf_sequence;
		if (callRequest.ignore_button_press !== undefined)
			requestBody.ignore_button_press = callRequest.ignore_button_press;
		if (callRequest.request_data) requestBody.request_data = callRequest.request_data;
		if (callRequest.metadata) requestBody.metadata = callRequest.metadata;
		if (callRequest.webhook) requestBody.webhook = callRequest.webhook;
		if (callRequest.keywords && callRequest.keywords.length > 0)
			requestBody.keywords = callRequest.keywords;

		const response = await this.makeRequest(`${this.baseUrl}/v1/calls`, {
			method: 'POST',
			headers: this.getHeaders(),
			body: JSON.stringify(requestBody)
		}, 60000); // 60 second timeout for call creation

		return await this.handleResponse<{
			status: string;
			message: string;
			call_id?: string;
			batch_id?: string;
		}>(response);
	}

	/**
	 * Create a new phone call (wrapper for sendCall)
	 */
	async createCall(
		phoneNumber: string,
		task: string,
		options?: {
			maxDuration?: number;
			record?: boolean;
			wait_for_greeting?: boolean;
			webhook?: string;
		}
	): Promise<{ status: string; message: string; call_id?: string; batch_id?: string }> {
		const callRequest: any = {
			phone_number: phoneNumber,
			task
		};

		if (options?.maxDuration) {
			callRequest.max_duration = options.maxDuration;
		}
		if (options?.record !== undefined) {
			callRequest.record = options.record;
		}
		if (options?.wait_for_greeting !== undefined) {
			callRequest.wait_for_greeting = options.wait_for_greeting;
		}
		if (options?.webhook) {
			callRequest.webhook = options.webhook;
		}

		return await this.sendCall(callRequest);
	}

	/**
	 * Get details of a specific call
	 */
	async getCallDetails(callId: string): Promise<CallDetails> {
		const response = await this.makeRequest(`${this.baseUrl}/v1/calls/${callId}`, {
			method: 'GET',
			headers: this.getHeaders()
		}, 30000); // 30 second timeout for call details

		const data = await this.handleResponse<any>(response);
		return callDetailsSchema.parse(data);
	}

	/**
	 * Stop an active call
	 */
	async stopCall(callId: string): Promise<{ status: string }> {
		const response = await this.makeRequest(`${this.baseUrl}/v1/calls/${callId}/stop`, {
			method: 'POST',
			headers: this.getHeaders()
		}, 15000); // 15 second timeout for stopping calls

		return await this.handleResponse<{ status: string }>(response);
	}

	/**
	 * Stop all active calls
	 */
	async stopAllActiveCalls(): Promise<{ stopped_calls: string[] }> {
		const response = await fetch(`${this.baseUrl}/v1/calls/active/stop`, {
			method: 'POST',
			headers: this.getHeaders()
		});

		return await this.handleResponse<{ stopped_calls: string[] }>(response);
	}

	/**
	 * List all calls with optional filters
	 */
	async listCalls(options?: {
		limit?: number;
		offset?: number;
		status?: string;
	}): Promise<{ calls: CallDetails[]; total: number }> {
		const params = new URLSearchParams();
		if (options?.limit) params.append('limit', options.limit.toString());
		if (options?.offset) params.append('offset', options.offset.toString());
		if (options?.status) params.append('status', options.status);

		const url = `${this.baseUrl}/v1/calls${params.toString() ? '?' + params.toString() : ''}`;

		const response = await fetch(url, {
			method: 'GET',
			headers: this.getHeaders()
		});

		return await this.handleResponse<{ calls: CallDetails[]; total: number }>(response);
	}

	/**
	 * Get call recording URL
	 */
	async getCallRecording(callId: string): Promise<{ recording_url: string }> {
		const response = await fetch(`${this.baseUrl}/v1/calls/${callId}/recording`, {
			method: 'GET',
			headers: this.getHeaders()
		});

		return await this.handleResponse<{ recording_url: string }>(response);
	}

	/**
	 * Analyze a call with AI
	 */
	async analyzeCall(
		callId: string,
		analysisRequest?: {
			goal?: string;
			questions?: string[];
		}
	): Promise<{ analysis: Record<string, any> }> {
		const response = await fetch(`${this.baseUrl}/v1/calls/${callId}/analyze`, {
			method: 'POST',
			headers: this.getHeaders(),
			body: JSON.stringify(analysisRequest || {})
		});

		return await this.handleResponse<{ analysis: Record<string, any> }>(response);
	}

	/**
	 * Create event stream for real-time call updates
	 * Note: This returns a ReadableStream for real-time events
	 */
	async createEventStream(callId?: string): Promise<ReadableStream<Uint8Array>> {
		const url = callId ? `${this.baseUrl}/v1/calls/${callId}/events` : `${this.baseUrl}/v1/events`;

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
				Accept: 'text/event-stream',
				'Cache-Control': 'no-cache'
			}
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(`Bland AI API error: ${response.status} - ${error}`);
		}

		return response.body!;
	}

	/**
	 * Create the pizza ordering task prompt for Bland AI
	 */
	createPizzaOrderingTask(): string {
		return `You are calling a pizza restaurant to place a takeout order for 12 people. Your task is to:

1. Order enough pizza for 12 people (typically 4-5 large pizzas with varied toppings)
2. Ask for popular/recommended toppings if unsure
3. Confirm the total price and estimated preparation time
4. Get the restaurant's exact address for pickup
5. Confirm pickup time and any special instructions
6. Be polite and professional throughout the call

Important details to collect:
- Order confirmation number (if provided)
- Total cost
- Estimated pickup time
- Restaurant address
- Any special instructions for pickup

If the restaurant is closed or cannot fulfill the order, politely end the call and note the reason.

Start the conversation by greeting them and explaining you'd like to place a large takeout order for 12 people.`;
	}

	/**
	 * Create a pizza ordering call with default settings
	 */
	async createPizzaOrderingCall(
		phoneNumber: string,
		options?: {
			voice?: string;
			maxDuration?: number;
			voicemailMessage?: string;
			webhook?: string;
		}
	): Promise<{ status: string; message: string; call_id?: string; batch_id?: string }> {
		const callRequest: SendCallRequest = {
			phone_number: phoneNumber,
			task: this.createPizzaOrderingTask(),
			model: 'enhanced',
			language: 'en',
			voice: options?.voice || 'maya',
			voice_settings: {
				speed: 1,
				stability: 0.5,
				similarity_boost: 0.75
			},
			max_duration: options?.maxDuration || 12,
			record: true,
			temperature: 0.7,
			interruption_threshold: 100,
			wait_for_greeting: true,
			answered_by_enabled: false,
			local_dialing: false,
			amd: false
		};

		// Add optional fields if provided
		if (options?.voicemailMessage) {
			callRequest.voicemail_message = options.voicemailMessage;
		}
		if (options?.webhook) {
			callRequest.webhook = options.webhook;
		}

		return await this.sendCall(callRequest);
	}
}

// Create a default instance for convenience
export const blandAI = new BlandAIService();

// Export individual functions for backward compatibility
export const sendCall = (request: SendCallRequest) => blandAI.sendCall(request);
export const getCallDetails = (callId: string) => blandAI.getCallDetails(callId);
export const stopCall = (callId: string) => blandAI.stopCall(callId);
export const stopAllActiveCalls = () => blandAI.stopAllActiveCalls();
export const listCalls = (options?: { limit?: number; offset?: number; status?: string }) =>
	blandAI.listCalls(options);
export const getCallRecording = (callId: string) => blandAI.getCallRecording(callId);
export const analyzeCall = (
	callId: string,
	analysisRequest?: { goal?: string; questions?: string[] }
) => blandAI.analyzeCall(callId, analysisRequest);
export const createEventStream = (callId?: string) => blandAI.createEventStream(callId);
export const createPizzaOrderingTask = () => blandAI.createPizzaOrderingTask();
