/**
 * Call Analysis Service
 *
 * Provides AI-powered analysis of phone call transcripts using OpenAI.
 * Specialized for pizza ordering scenarios with structured data extraction.
 */

import { z } from 'zod';
import { generateText } from '../openai';
import { OpenAIModel } from '$shared/openai';

// Pizza order analysis result schema
export const pizzaOrderAnalysisSchema = z.object({
	'Was the pizza order successful?': z.string(),
	'What specific pizzas were ordered?': z.string(),
	'Were all 5 pizzas confirmed (2 pepperoni, 1 margherita, 1 meat lovers, 1 vegetarian)?':
		z.string(),
	'What is the total cost?': z.string(),
	'What is the estimated pickup time?': z.string(),
	'What is the restaurant address?': z.string(),
	'Is there an order confirmation number?': z.string(),
	'Were there any substitutions or modifications?': z.string()
});

export type PizzaOrderAnalysis = z.infer<typeof pizzaOrderAnalysisSchema>;

// General call analysis schema
export const callAnalysisResultSchema = z.object({
	summary: z.string(),
	outcome: z.enum(['successful', 'failed', 'partial', 'unclear']),
	key_points: z.array(z.string()),
	next_steps: z.array(z.string()).optional(),
	confidence: z.number().min(0).max(1)
});

export type CallAnalysisResult = z.infer<typeof callAnalysisResultSchema>;

/**
 * Analyze a pizza ordering call transcript and extract structured order information
 */
export async function analyzePizzaOrder(
	transcript: string,
	callMetadata?: {
		callId?: string;
		duration?: number;
		phoneNumber?: string;
		status?: string;
	}
): Promise<PizzaOrderAnalysis> {
	const systemPrompt = `You are an expert call analyst specialized in pizza ordering conversations. Your task is to extract specific, accurate information from phone call transcripts.

INSTRUCTIONS:
- Analyze the transcript completely and thoroughly
- Extract only factual information that was explicitly stated in the conversation
- If information is unclear or not mentioned, state "Not mentioned" or "Unclear"
- Be precise with numbers, times, and addresses
- Focus on the customer's pizza order details and restaurant responses

ANALYSIS REQUIREMENTS:
- Read through the entire transcript before making any determinations
- Pay attention to both customer requests and restaurant confirmations
- Note any changes or corrections made during the call
- Distinguish between what was ordered vs. what was confirmed by the restaurant
- Extract exact prices, times, and addresses as stated`;

	const prompt = `Analyze this pizza ordering phone call transcript and extract the specific information requested.

TRANSCRIPT:
${transcript}

${
	callMetadata
		? `
CALL METADATA:
- Call ID: ${callMetadata.callId || 'Unknown'}
- Duration: ${callMetadata.duration || 'Unknown'} seconds
- Phone Number: ${callMetadata.phoneNumber || 'Unknown'}
- Status: ${callMetadata.status || 'Unknown'}
`
		: ''
}

Extract the following information based ONLY on what was explicitly discussed in the conversation. Do not make assumptions or inferences.`;

	try {
		const analysis = await generateText({
			systemPrompt,
			prompt,
			model: OpenAIModel.GPT_41_NANO,
			json: true,
			schema: {
				definition: pizzaOrderAnalysisSchema,
				name: 'pizza_order_analysis'
			},
			temperature: 0.1,
			maxTokens: 1000
		});

		return analysis;
	} catch (error) {
		console.error('Failed to analyze pizza order:', error);
		throw new Error(
			`Pizza order analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
		);
	}
}

/**
 * Perform general call analysis for any type of phone conversation
 */
export async function analyzeCall(
	transcript: string,
	callMetadata?: {
		callId?: string;
		duration?: number;
		phoneNumber?: string;
		status?: string;
	}
): Promise<CallAnalysisResult> {
	const systemPrompt = `You are an expert call analyst. Analyze phone call transcripts and provide structured insights about the conversation outcome, key points, and next steps.

Guidelines:
- Provide an objective summary of what happened
- Determine if the call achieved its apparent goal
- Extract the most important points discussed
- Suggest logical next steps if applicable
- Rate your confidence in the analysis (0.0 to 1.0)`;

	const prompt = `Please analyze this phone call transcript:

TRANSCRIPT:
${transcript}

${
	callMetadata
		? `
CALL METADATA:
- Call ID: ${callMetadata.callId || 'Unknown'}
- Duration: ${callMetadata.duration || 'Unknown'} seconds
- Phone Number: ${callMetadata.phoneNumber || 'Unknown'}
- Status: ${callMetadata.status || 'Unknown'}
`
		: ''
}

Provide a structured analysis including summary, outcome, key points, potential next steps, and your confidence level.`;

	try {
		const analysis = await generateText({
			systemPrompt,
			prompt,
			model: OpenAIModel.GPT_41_NANO,
			json: true,
			schema: {
				definition: callAnalysisResultSchema,
				name: 'call_analysis'
			},
			temperature: 0.2,
			maxTokens: 800
		});

		return analysis;
	} catch (error) {
		console.error('Failed to analyze call:', error);
		throw new Error(
			`Call analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
		);
	}
}

/**
 * Generate a concise order summary for display
 */
export async function generateOrderSummary(analysis: PizzaOrderAnalysis): Promise<string> {
	const successful =
		analysis['Was the pizza order successful?'].toLowerCase().includes('yes') ||
		analysis['Was the pizza order successful?'].toLowerCase().includes('successful');

	if (!successful) {
		return `Order unsuccessful. ${analysis['Were there any substitutions or modifications?']}`;
	}

	const parts = [];
	if (analysis['What specific pizzas were ordered?'] !== 'Not mentioned') {
		parts.push(`Ordered: ${analysis['What specific pizzas were ordered?']}`);
	}
	if (analysis['What is the total cost?'] !== 'Not mentioned') {
		parts.push(`Cost: ${analysis['What is the total cost?']}`);
	}
	if (analysis['What is the estimated pickup time?'] !== 'Not mentioned') {
		parts.push(`Pickup: ${analysis['What is the estimated pickup time?']}`);
	}

	return parts.join(' | ') || 'Order details extracted successfully';
}

/**
 * Extract key metrics from call metadata and analysis
 */
export async function extractCallMetrics(
	callDetails: any,
	analysis?: PizzaOrderAnalysis | CallAnalysisResult
) {
	return {
		callId: callDetails.call_id,
		duration: callDetails.call_length || callDetails.queue_time,
		phoneNumber: callDetails.to,
		status: callDetails.status,
		createdAt: callDetails.created_at,
		endedAt: callDetails.end_at || callDetails.ended_at,
		hasAnalysis: !!analysis,
		analysisType: analysis && 'Was the order successful?' in analysis ? 'pizza_order' : 'general'
	};
}
