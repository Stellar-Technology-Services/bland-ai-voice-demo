/**
 * Call Recording API Endpoints
 * 
 * Provides access to call recordings from Bland AI.
 */

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCallRecording } from '$lib/server/services/blandai';

/**
 * GET /api/bland/calls/[id]/recording
 * Get recording URL for a specific call
 */
export const GET: RequestHandler = async ({ params }) => {
	try {
		const callId = params.id;
		
		if (!callId) {
			throw error(400, 'Call ID is required');
		}

		const result = await getCallRecording(callId);
		
		return json(result);
	} catch (err) {
		console.error('Failed to get call recording:', err);
		throw error(500, `Failed to retrieve call recording: ${err instanceof Error ? err.message : 'Unknown error'}`);
	}
}; 