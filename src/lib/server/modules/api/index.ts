export * from './handlers';
export * from './rateLimit';
import type { RequestEvent } from '@sveltejs/kit';

export type { RequestEvent };

/**
 * Add CORS headers to the response
 * Supports cross-origin requests for embedded widgets and API access
 */
export function addCorsHeaders(response: Response, requestOrigin: string | null): Response {
	const newHeaders = new Headers(response.headers);

	// Use the provided origin or default to a safe wildcard (*)
	// Note: Wildcards don't work with credentials: 'include'
	const origin = requestOrigin || '*';
	newHeaders.set('Access-Control-Allow-Origin', origin);

	// Only set credentials to true when not using wildcard origins
	if (origin !== '*') {
		newHeaders.set('Access-Control-Allow-Credentials', 'true');
	}

	// Support all HTTP methods used by the application
	newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
	newHeaders.set(
		'Access-Control-Allow-Headers',
		'Content-Type, Accept, Cache-Control, Pragma, X-Accept-Streaming, X-Requested-With, X-API-KEY, Authorization, X-Embed-Request'
	);

	// If this is a streaming response, ensure proper content type
	if (
		response.headers.get('Content-Type')?.includes('text/event-stream') ||
		response.headers.get('Content-Type')?.includes('application/x-ndjson')
	) {
		newHeaders.set('Content-Type', 'text/event-stream');
		newHeaders.set('Cache-Control', 'no-cache');
		newHeaders.set('Connection', 'keep-alive');
	}

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: newHeaders
	});
}

/**
 * Handle OPTIONS requests for CORS preflight
 * Required for complex CORS requests (non-simple requests)
 */
export const OPTIONS = async ({ request }: RequestEvent) => {
	// Get the origin from the request
	const origin = request.headers.get('Origin');

	// Use wildcard if no origin is provided
	const allowOrigin = origin || '*';

	const headers = new Headers({
		'Access-Control-Allow-Origin': allowOrigin,
		'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
		'Access-Control-Allow-Headers':
			'Content-Type, Accept, Cache-Control, Pragma, X-Accept-Streaming, X-Requested-With, X-API-KEY, Authorization, X-Embed-Request',
		'Access-Control-Max-Age': '86400' // 24 hours
	});

	// Only include credentials header for non-wildcard origins
	if (allowOrigin !== '*') {
		headers.set('Access-Control-Allow-Credentials', 'true');
	}

	return new Response(null, {
		status: 204,
		headers
	});
};
