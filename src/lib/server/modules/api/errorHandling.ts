/**
 * Secure Error Handling Utilities
 * 
 * Provides utilities to handle errors securely without leaking sensitive information
 * in production while maintaining useful debugging information in development.
 */

import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';

/**
 * Sanitize error messages for client consumption
 */
export function sanitizeErrorMessage(err: unknown, fallbackMessage: string): string {
	if (dev) {
		// In development, return detailed error messages
		if (err instanceof Error) {
			return err.message;
		}
		return String(err);
	}
	
	// In production, return generic messages
	if (err instanceof Error) {
		// Only return specific error messages for known safe errors
		const safeErrors = [
			'Phone number is required',
			'Task is required', 
			'Invalid phone number format',
			'Task description must be',
			'Max duration must be',
			'Temperature must be',
			'Call ID is required',
			'Invalid action',
			'Cannot analyze incomplete call'
		];
		
		const isSafeError = safeErrors.some(safe => err.message.includes(safe));
		if (isSafeError) {
			return err.message;
		}
	}
	
	// Return generic message for all other errors
	return fallbackMessage;
}

/**
 * Log error securely (always log full details server-side)
 */
export function logError(context: string, err: unknown, additionalInfo?: Record<string, any>): void {
	console.error(`[${context}] Error:`, err);
	if (additionalInfo) {
		console.error(`[${context}] Additional info:`, additionalInfo);
	}
}

/**
 * Create a safe error response
 */
export function createSafeError(
	status: number,
	err: unknown,
	context: string,
	fallbackMessage: string,
	additionalInfo?: Record<string, any>
): never {
	// Always log the full error server-side
	logError(context, err, additionalInfo);
	
	// Return sanitized error to client
	const clientMessage = sanitizeErrorMessage(err, fallbackMessage);
	throw error(status, clientMessage);
}

/**
 * Wrap async operations with error handling
 */
export async function withErrorHandling<T>(
	operation: () => Promise<T>,
	context: string,
	fallbackMessage: string
): Promise<T> {
	try {
		return await operation();
	} catch (err) {
		createSafeError(500, err, context, fallbackMessage);
	}
}

/**
 * Common error messages for consistency
 */
export const ErrorMessages = {
	CALL_CREATION_FAILED: 'Failed to create call. Please check your input and try again.',
	CALL_RETRIEVAL_FAILED: 'Failed to retrieve call information. Please try again later.',
	CALL_STOP_FAILED: 'Failed to stop call. Please try again.',
	CALL_ANALYSIS_FAILED: 'Failed to analyze call. Please try again later.',
	TRANSCRIPT_RETRIEVAL_FAILED: 'Failed to retrieve call transcript. Please try again later.',
	RECORDING_RETRIEVAL_FAILED: 'Failed to retrieve call recording. Please try again later.',
	GENERIC_SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
	INVALID_REQUEST: 'Invalid request format. Please check your input.',
	RATE_LIMIT_EXCEEDED: 'Too many requests. Please slow down and try again later.'
} as const; 