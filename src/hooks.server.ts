/**
 * Server Hooks
 *
 * These hooks run on the server and handle request processing,
 * error handling, and fetch modifications during SSR.
 */

import type { Handle, HandleServerError, HandleFetch } from '@sveltejs/kit';
import { dev } from '$app/environment';

/**
 * Handle hook - runs on every server request
 *
 * This function runs every time the SvelteKit server receives a request
 * and determines the response. Use this to modify response headers,
 * add authentication, logging, etc.
 */
export const handle: Handle = async ({ event, resolve }) => {
	// Add custom data to locals that will be available in load functions and routes
	// event.locals.user = await getUserFromSession(event.cookies.get('session'));

	// You can modify the request here
	// if (event.url.pathname.startsWith('/api/admin')) {
	//   if (!event.locals.user?.isAdmin) {
	//     return new Response('Unauthorized', { status: 401 });
	//   }
	// }

	// Resolve the request
	const response = await resolve(event, {
		// You can modify how the route is resolved
		// transformPageChunk: ({ html }) => html.replace('%app-name%', 'My App'),
		// filterSerializedResponseHeaders: (name) => name.startsWith('x-'),
	});

	// Add comprehensive security headers
	const securityHeaders = {
		'X-Frame-Options': 'DENY',
		'X-Content-Type-Options': 'nosniff',
		'Referrer-Policy': 'strict-origin-when-cross-origin',
		'X-XSS-Protection': '1; mode=block',
		'Permissions-Policy': [
			'microphone=()',
			'camera=()',
			'geolocation=()',
			'payment=()',
			'usb=()',
			'magnetometer=()',
			'gyroscope=()',
			'accelerometer=()'
		].join(', '),
		'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
		'Cross-Origin-Embedder-Policy': 'require-corp',
		'Cross-Origin-Opener-Policy': 'same-origin',
		'Cross-Origin-Resource-Policy': 'same-origin'
	};

	// Apply security headers (only if not already set)
	Object.entries(securityHeaders).forEach(([name, value]) => {
		if (!response.headers.has(name)) {
			response.headers.set(name, value);
		}
	});

	// Enhanced Content Security Policy
	if (!response.headers.has('Content-Security-Policy')) {
		const csp = [
			"default-src 'self'",
			"script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Needed for Svelte/Vite
			"style-src 'self' 'unsafe-inline'", // Needed for Tailwind CSS
			"img-src 'self' data: https: blob:",
			"font-src 'self' data:",
			"connect-src 'self' https://api.bland.ai https://api.openai.com wss://api.bland.ai",
			"media-src 'self' blob:",
			"object-src 'none'",
			"frame-ancestors 'none'",
			"base-uri 'self'",
			"form-action 'self'",
			"upgrade-insecure-requests"
		].join('; ');
		response.headers.set('Content-Security-Policy', csp);
	}

	return response;
};

/**
 * HandleError hook - called when an error occurs during request handling
 *
 * This is called when an error is thrown during server-side rendering.
 * Use this for error logging, reporting, etc.
 */
export const handleError: HandleServerError = ({ error, event, status, message }) => {
	// Log the error
	if (dev) {
		console.error('Server error:', error);
		console.error('Event URL:', event.url.pathname);
		console.error('Status:', status);
		console.error('Message:', message);
	}

	// In production, you might want to send to an error reporting service
	// if (!dev) {
	//   sendToErrorReporting({
	//     error,
	//     url: event.url.pathname,
	//     status,
	//     message,
	//     userAgent: event.request.headers.get('user-agent'),
	//     timestamp: new Date().toISOString()
	//   });
	// }

	// Return a user-friendly error message
	// Don't leak sensitive information in production
	return {
		message: dev ? message : 'Something went wrong'
		// You can add additional properties that will be available in $page.error
		// code: error?.code,
	};
};

/**
 * HandleFetch hook - intercepts fetch requests during SSR
 *
 * This allows you to modify fetch requests made during server-side rendering,
 * such as adding authentication headers, changing URLs, etc.
 */
export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	// Modify requests to your API
	if (request.url.startsWith('https://api.yourapp.com/')) {
		// Add authentication headers for internal API calls
		// const token = event.locals.user?.token;
		// if (token) {
		//   request.headers.set('Authorization', `Bearer ${token}`);
		// }
		// You could also rewrite the URL for development
		// if (dev) {
		//   const url = new URL(request.url);
		//   url.hostname = 'localhost';
		//   url.port = '3001';
		//   request = new Request(url, request);
		// }
	}

	// Call the original fetch
	const response = await fetch(request);

	// You can modify the response here if needed
	return response;
};
