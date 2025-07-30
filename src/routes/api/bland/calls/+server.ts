/**
 * Bland AI Calls API Endpoints
 *
 * Provides REST API endpoints for managing Bland AI phone calls.
 * Supports creating calls, retrieving call details, and listing calls.
 */

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { listCalls, blandAI } from '$lib/server/services/blandai';
import { enforceRateLimit, RateLimitConfigs } from '$lib/server/modules/api/rateLimit';
import { createSafeError, ErrorMessages } from '$lib/server/modules/api/errorHandling';

/**
 * GET /api/bland/calls
 * List all calls with optional filtering
 */
export const GET: RequestHandler = async (event) => {
	// Apply permissive rate limiting for call listing
	await enforceRateLimit(event, RateLimitConfigs.permissive);

	try {
		const { url } = event;

		// Parse and validate limit parameter
		let limit: number | undefined = undefined;
		const limitParam = url.searchParams.get('limit');
		if (limitParam) {
			const parsedLimit = parseInt(limitParam, 10);
			if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 1000) {
				throw error(400, 'Limit must be a number between 1 and 1000');
			}
			limit = parsedLimit;
		}

		// Parse and validate offset parameter
		let offset: number | undefined = undefined;
		const offsetParam = url.searchParams.get('offset');
		if (offsetParam) {
			const parsedOffset = parseInt(offsetParam, 10);
			if (isNaN(parsedOffset) || parsedOffset < 0) {
				throw error(400, 'Offset must be a non-negative number');
			}
			offset = parsedOffset;
		}

		const status = url.searchParams.get('status') || undefined;

		const result = await listCalls({ limit, offset, status });

		// Add cache headers for list responses (cache for 30 seconds)
		return json(result, {
			headers: {
				'Cache-Control': 'public, max-age=30, s-maxage=30',
				'Vary': 'Accept-Encoding'
			}
		});
	} catch (err) {
		createSafeError(500, err, 'list_calls', ErrorMessages.CALL_RETRIEVAL_FAILED);
	}
};

/**
 * POST /api/bland/calls
 * Create a new AI phone call
 */
export const POST: RequestHandler = async (event) => {
	// Apply strict rate limiting for expensive call operations
	await enforceRateLimit(event, RateLimitConfigs.critical);

	try {
		const { request } = event;
		const data = await request.json();
		const { phone_number, task, ...otherParams } = data;

		// Validate phone number
		if (!phone_number) {
			throw error(400, 'Phone number is required');
		}

		// Phone number validation - basic international format
		const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
		if (!phoneRegex.test(phone_number.toString().trim())) {
			throw error(
				400,
				'Invalid phone number format. Please use international format (e.g., +1-555-123-4567)'
			);
		}

		// Validate task
		if (!task) {
			throw error(400, 'Task is required');
		}

		// Task validation - ensure reasonable length and content
		const taskStr = task.toString().trim();
		if (taskStr.length < 10) {
			throw error(400, 'Task description must be at least 10 characters long');
		}

		if (taskStr.length > 5000) {
			throw error(400, 'Task description must be less than 5000 characters');
		}

		// Sanitize task input - remove potentially dangerous HTML/script tags
		const sanitizedTask = taskStr
			.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
			.replace(/<[^>]*>/g, '')
			.trim();

		// Validate max_duration if provided
		if (otherParams.max_duration !== undefined) {
			const maxDuration = Number(otherParams.max_duration);
			if (isNaN(maxDuration) || maxDuration < 1 || maxDuration > 30) {
				throw error(400, 'Max duration must be between 1 and 30 minutes');
			}
		}

		// Validate temperature if provided
		if (otherParams.temperature !== undefined) {
			const temp = Number(otherParams.temperature);
			if (isNaN(temp) || temp < 0 || temp > 2) {
				throw error(400, 'Temperature must be between 0 and 2');
			}
		}

		// Use sendCall directly to support all parameters
		const result = await blandAI.sendCall({
			phone_number: phone_number.toString().trim(),
			task: sanitizedTask,
			...otherParams
		});

		return json(result);
	} catch (err) {
		createSafeError(500, err, 'create_call', ErrorMessages.CALL_CREATION_FAILED);
	}
};
