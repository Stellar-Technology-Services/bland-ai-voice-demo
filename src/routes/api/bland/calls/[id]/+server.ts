/**
 * Individual Call API Endpoints
 *
 * Provides REST API endpoints for individual call operations.
 * Supports retrieving call details, stopping calls, and analyzing completed calls.
 */

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	getCallDetails,
	stopCall,
	analyzeCall,
	getCallRecording
} from '$lib/server/services/blandai';
import { enforceRateLimit, RateLimitConfigs } from '$lib/server/modules/api/rateLimit';
import { createSafeError, ErrorMessages } from '$lib/server/modules/api/errorHandling';

/**
 * GET /api/bland/calls/[id]
 * Get details of a specific call (supports 2.5 second polling)
 */
export const GET: RequestHandler = async (event) => {
	// Apply polling-friendly rate limiting (allows 2.5 second intervals)
	await enforceRateLimit(event, RateLimitConfigs.polling);

	try {
		const { params } = event;
		const callId = params.id;

		if (!callId) {
			throw error(400, 'Call ID is required');
		}

		const result = await getCallDetails(callId);

		return json(result);
	} catch (err) {
		createSafeError(500, err, 'get_call_details', ErrorMessages.CALL_RETRIEVAL_FAILED);
	}
};

/**
 * POST /api/bland/calls/[id]
 * Handle call actions: stop or analyze
 */
export const POST: RequestHandler = async (event) => {
	// Apply standard rate limiting for call actions
	await enforceRateLimit(event, RateLimitConfigs.standard);

	const { params, request } = event;
	const callId = params.id;

	if (!callId) {
		throw error(400, 'Call ID is required');
	}

	const url = new URL(request.url);
	const action = url.searchParams.get('action');

	try {
		if (action === 'stop') {
			const result = await stopCall(callId);
			return json(result);
		} else if (action === 'analyze') {
			const body = await request.json().catch(() => ({}));
			const result = await analyzeCall(callId, body);
			return json(result);
		} else {
			throw error(400, 'Invalid action. Use ?action=stop or ?action=analyze');
		}
	} catch (err) {
		if (err instanceof Response) {
			throw err; // Re-throw Response objects (like rate limit errors)
		}

		// Handle stop call failures specifically
		if (action === 'stop') {
			createSafeError(500, err, 'stop_call', ErrorMessages.CALL_STOP_FAILED);
		}

		// Handle analyze call failures
		createSafeError(500, err, 'call_action', 'Failed to perform call action. Please try again.');
	}
};
