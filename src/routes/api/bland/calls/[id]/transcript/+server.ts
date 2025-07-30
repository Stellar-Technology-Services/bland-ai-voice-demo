/**
 * Call Transcript API Endpoint
 *
 * Retrieves call transcript data from Bland AI call details.
 * Provides both individual transcript entries and concatenated transcript.
 */

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCallDetails } from '$lib/server/services/blandai';
import { enforceRateLimit, RateLimitConfigs } from '$lib/server/modules/api/rateLimit';
import { createSafeError, ErrorMessages } from '$lib/server/modules/api/errorHandling';

/**
 * GET /api/bland/calls/[id]/transcript
 * Get transcript for a specific call (supports polling for live updates)
 */
export const GET: RequestHandler = async (event) => {
	// Apply polling-friendly rate limiting for transcript updates
	await enforceRateLimit(event, RateLimitConfigs.polling);

	try {
		const { params } = event;
		const callId = params.id;

		if (!callId) {
			throw error(400, 'Call ID is required');
		}

		// Get call details which includes transcript data
		const callDetails = await getCallDetails(callId);

		// Extract transcript information from call details
		let transcript: Array<{ text: string; user: string; timestamp: string }> = [];

		if (callDetails.transcripts && Array.isArray(callDetails.transcripts)) {
			// Convert Bland AI transcript format to our format with validation
			transcript = callDetails.transcripts
				.filter((entry) => 
					entry && typeof entry === 'object' && 
					'text' in entry && typeof entry.text === 'string' && 
					'user' in entry && typeof entry.user === 'string'
				)
				.map((entry) => ({
					text: String(entry.text || ''),
					user: String(entry.user || 'unknown'),
					timestamp: String(entry.created_at || new Date().toISOString())
				}))
				.filter(entry => entry.text.trim() !== ''); // Remove empty entries
		} else if (callDetails.concatenated_transcript) {
			// Parse concatenated transcript if individual entries aren't available
			const lines = callDetails.concatenated_transcript
				.split('\n')
				.filter((line: string) => line.trim());

			transcript = lines.map((line: string) => {
				const [user, ...textParts] = line.split(': ');
				return {
					user: user || 'unknown',
					text: textParts.join(': ') || line,
					timestamp: new Date().toISOString()
				};
			});
		}

		const response = {
			success: true,
			callId,
			transcript,
			concatenated_transcript: callDetails.concatenated_transcript || '',
			metadata: {
				call_length: callDetails.call_length,
				status: callDetails.status,
				created_at: callDetails.created_at,
				total_entries: transcript.length
			}
		};

		return json(response);
	} catch (err) {
		createSafeError(500, err, 'get_call_transcript', ErrorMessages.TRANSCRIPT_RETRIEVAL_FAILED);
	}
};
