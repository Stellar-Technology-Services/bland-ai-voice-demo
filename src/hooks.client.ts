/**
 * Client Hooks
 * 
 * These hooks run in the browser and handle client-side errors
 * and other client-specific functionality.
 */

import type { HandleClientError } from '@sveltejs/kit';
import { dev } from '$app/environment';

/**
 * HandleError hook - called when an error occurs during client-side navigation
 * 
 * This is called when an error is thrown during client-side rendering
 * or navigation. Use this for client-side error logging, reporting, etc.
 */
export const handleError: HandleClientError = ({ error, event, status, message }) => {
	// Log the error in development
	if (dev) {
		console.error('Client error:', error);
		console.error('Event URL:', event.url.pathname);
		console.error('Status:', status);
		console.error('Message:', message);
	}

	// In production, you might want to send to an error reporting service
	// if (!dev && typeof window !== 'undefined') {
	//   // Send to error reporting service (e.g., Sentry, LogRocket, etc.)
	//   window.reportError?.({
	//     error: error instanceof Error ? error.message : String(error),
	//     url: event.url.pathname,
	//     status,
	//     message,
	//     userAgent: navigator.userAgent,
	//     timestamp: new Date().toISOString(),
	//     stack: error instanceof Error ? error.stack : undefined
	//   });
	// }

	// Show user-friendly error messages
	// You could also trigger a toast notification here
	// if (typeof window !== 'undefined') {
	//   import('$lib/client/runes/toaster.svelte.js').then(({ toaster }) => {
	//     toaster.error(dev ? message : 'Something went wrong. Please try again.');
	//   });
	// }

	// Return a user-friendly error message
	// Don't leak sensitive information in production
	return {
		message: dev ? message : 'Something went wrong',
		// You can add additional properties that will be available in $page.error
		// timestamp: new Date().toISOString(),
	};
}; 