/**
 * Call Analysis API Endpoint
 *
 * Provides AI-powered analysis of call transcripts using OpenAI.
 * Specializes in pizza ordering scenarios with structured data extraction.
 */

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCallDetails } from '$lib/server/services/blandai';
import {
	analyzePizzaOrder,
	analyzeCall,
	generateOrderSummary,
	extractCallMetrics
} from '$lib/server/services/callanalysis';
import { enforceRateLimit, RateLimitConfigs } from '$lib/server/modules/api/rateLimit';
import { createSafeError, ErrorMessages } from '$lib/server/modules/api/errorHandling';

/**
 * POST /api/bland/calls/[id]/analyze
 * Analyze a completed call using OpenAI
 */
export const POST: RequestHandler = async (event) => {
	// Apply rate limiting for analysis operations (uses OpenAI API)
	await enforceRateLimit(event, RateLimitConfigs.strict);

	try {
		const { params, request } = event;
		const callId = params.id;

		if (!callId) {
			throw error(400, 'Call ID is required');
		}

		// Get request body for analysis options
		const body = await request.json().catch(() => ({}));
		const analysisType = body.type || 'pizza_order'; // Default to pizza order analysis
		const useSpecificQuestions = body.questions && body.questions.length > 0;

		// Get call details first
		const callDetails = await getCallDetails(callId);

		// Check if call is completed
		if (callDetails.status !== 'completed') {
			throw error(400, `Cannot analyze incomplete call. Current status: ${callDetails.status}`);
		}

		// Get transcript from call details
		let transcript = '';

		if (callDetails.transcripts && Array.isArray(callDetails.transcripts)) {
			// Convert Bland AI transcript format to our format with validation
			transcript = callDetails.transcripts
				.filter((entry: any) => entry && typeof entry === 'object')
				.map((entry: any) => {
					const user = entry.user || 'unknown';
					const text = entry.text || '';
					return `${user}: ${text}`;
				})
				.filter((line) => line.trim() !== 'unknown:') // Remove empty entries
				.join('\n');
		} else if (callDetails.concatenated_transcript) {
			// Use concatenated transcript if available
			transcript = callDetails.concatenated_transcript;
		}

		if (!transcript || transcript.trim().length === 0) {
			throw error(400, 'No transcript available for analysis');
		}

		// Extract call metadata
		const callMetadata = {
			callId: callDetails.call_id,
			duration: callDetails.call_length || undefined,
			phoneNumber: callDetails.to,
			status: callDetails.status,
			createdAt: callDetails.created_at,
			endedAt: callDetails.end_at || undefined
		};

		let analysisResult;
		let summary;

		// Perform analysis based on type
		if (analysisType === 'pizza_order') {
			console.log(`Analyzing pizza order for call ${callId}`);
			const pizzaAnalysis = await analyzePizzaOrder(transcript, callMetadata);
			summary = await generateOrderSummary(pizzaAnalysis);
			analysisResult = pizzaAnalysis;
		} else if (useSpecificQuestions) {
			// Custom analysis with specific questions
			console.log(
				`Performing custom analysis for call ${callId} with ${body.questions.length} questions`
			);
			const generalAnalysis = await analyzeCall(transcript, {
				...callMetadata,
				duration: callDetails.call_length || undefined
			});
			analysisResult = generalAnalysis;
			summary = generalAnalysis.summary;
		} else {
			// General call analysis
			console.log(`Performing general analysis for call ${callId}`);
			const generalAnalysis = await analyzeCall(transcript, {
				...callMetadata,
				duration: callDetails.call_length || undefined
			});
			analysisResult = generalAnalysis;
			summary = generalAnalysis.summary;
		}

		// Extract additional metrics
		const metrics = await extractCallMetrics(callDetails, analysisResult);

		const response = {
			success: true,
			callId,
			analysis: analysisResult,
			summary,
			metadata: {
				transcriptLength: transcript.length,
				...metrics,
				analyzedAt: new Date().toISOString()
			}
		};

		console.log(`Analysis completed for call ${callId}: ${analysisType}`);
		return json(response);
	} catch (err) {
		// Handle OpenAI service errors specifically
		if (err instanceof Error && err.message.includes('OpenAI')) {
			createSafeError(
				503,
				err,
				'openai_analysis',
				'AI analysis service is temporarily unavailable. Please try again later.'
			);
		}

		// Handle all other analysis errors
		createSafeError(500, err, 'call_analysis', ErrorMessages.CALL_ANALYSIS_FAILED);
	}
};
