/**
 * Serverless-Compatible Rate Limiting (Minimal Viable Solution)
 *
 * Rate limiting implementation designed for Vercel's serverless environment.
 * Uses in-memory storage with automatic cleanup and improved client identification.
 * 
 * LIMITATIONS (acceptable for MVP):
 * - Per-instance limiting (resets on cold starts)
 * - Not distributed across regions/instances
 * - Memory-based (not persistent)
 * 
 * PROTECTIONS PROVIDED:
 * - Prevents rapid requests within same instance
 * - Handles 2.5s polling without blocking
 * - Stricter limits on expensive operations (OpenAI)
 * - Graceful degradation on failures
 * 
 * For production scale, consider: Upstash Redis, Vercel KV, or Vercel Rate Limiting API
 */

import { error, type RequestEvent } from '@sveltejs/kit';

export interface RateLimitInfo {
	success: boolean;
	limit: number;
	remaining: number;
	reset: Date;
	retryAfter?: number;
}

interface RateLimitEntry {
	count: number;
	windowStart: number;
	requests: number[];
}

// Per-instance storage (will reset on cold starts - provides basic protection)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Track last cleanup to avoid excessive cleanup operations
let lastCleanup = 0;
const CLEANUP_INTERVAL = 300000; // 5 minutes
const MAX_ENTRIES = 10000; // Memory safety limit

/**
 * Clean up expired entries (throttled to avoid performance impact)
 */
function cleanupExpiredEntries(): void {
	const now = Date.now();
	
	// Force cleanup if approaching memory limit, otherwise use interval
	const forceCleanup = rateLimitStore.size > MAX_ENTRIES;
	
	if (!forceCleanup && now - lastCleanup < CLEANUP_INTERVAL) {
		return;
	}
	
	lastCleanup = now;
	const expiredKeys: string[] = [];

	for (const [key, entry] of rateLimitStore.entries()) {
		// Remove entries older than 1 hour to prevent memory growth
		if (now - entry.windowStart > 3600000) {
			expiredKeys.push(key);
		}
	}

	expiredKeys.forEach((key) => rateLimitStore.delete(key));
	
	// Log cleanup for monitoring in development
	if (expiredKeys.length > 0) {
		console.log(`Rate limit cleanup: removed ${expiredKeys.length} expired entries (${rateLimitStore.size} remaining)`);
	}
	
	// Warn if memory usage is still high after cleanup
	if (rateLimitStore.size > MAX_ENTRIES * 0.8) {
		console.warn(`Rate limit store approaching capacity: ${rateLimitStore.size}/${MAX_ENTRIES} entries`);
	}
}

/**
 * Apply rate limiting to a request using sliding window algorithm
 */
export async function applyRateLimit(
	request: RequestEvent,
	options: {
		limit?: number;
		windowMs?: number;
		skipFailedRequests?: boolean;
		skipSuccessfulRequests?: boolean;
	} = {}
): Promise<RateLimitInfo> {
	const {
		limit = 100,
		windowMs = 60000, // 1 minute default
		skipFailedRequests = false,
		skipSuccessfulRequests = false
	} = options;

	try {
		// Clean up expired entries first to prevent memory growth
		cleanupExpiredEntries();

		const { url, getClientAddress, request: req } = request;
		
		// Improved client identification for serverless/proxy environments
		const clientAddress = getClientAddress();
		const forwardedFor = req.headers.get('x-forwarded-for');
		const realIp = req.headers.get('x-real-ip');
		
		// Use the first available identifier, fallback to anonymous
		const identifier = clientAddress || 
						   forwardedFor?.split(',')[0]?.trim() || 
						   realIp || 
						   'anonymous';
		
		const key = `${identifier}:${url.pathname}`;

		const now = Date.now();
		const windowStart = now - windowMs;

		// Get existing entry or create new one
		let entry = rateLimitStore.get(key);

		if (!entry) {
			// Create new entry
			entry = {
				count: 0,
				windowStart: now,
				requests: []
			};
		}

		// Remove requests outside the current window
		entry.requests = entry.requests.filter((timestamp) => timestamp > windowStart);
		entry.count = entry.requests.length;

		// Check if request should be limited
		const isLimited = entry.count >= limit;

		if (!isLimited) {
			// Add current request to the window
			entry.requests.push(now);
			entry.count = entry.requests.length;
			rateLimitStore.set(key, entry);
		}

		const remaining = Math.max(0, limit - entry.count);
		const oldestRequest = entry.requests[0];
		const resetTime = oldestRequest ? oldestRequest + windowMs : now + windowMs;
		const resetDate = new Date(resetTime);
		const retryAfter =
			isLimited && oldestRequest ? Math.ceil((oldestRequest + windowMs - now) / 1000) : undefined;

		return {
			success: !isLimited,
			limit,
			remaining,
			reset: resetDate,
			retryAfter
		};
	} catch (err) {
		console.error('Rate limiting error:', err);
		
		// Emergency cleanup if rate limiting is failing due to memory issues
		if (rateLimitStore.size > MAX_ENTRIES) {
			console.warn('Emergency rate limit cleanup due to error');
			rateLimitStore.clear();
			lastCleanup = Date.now();
		}
		
		// Fail open - allow request if rate limiting fails
		return {
			success: true,
			limit,
			remaining: limit - 1,
			reset: new Date(Date.now() + windowMs)
		};
	}
}

/**
 * Rate limiting configurations for different endpoint types
 */
export const RateLimitConfigs = {
	// Default rate limit for API endpoints
	default: {
		limit: 100,
		windowMs: 60000 // 1 minute
	},

	// Very permissive for frequent polling (every 2.5 seconds = 24/minute + buffer)
	polling: {
		limit: 50,
		windowMs: 60000 // 1 minute - allows 2.5 second polling with buffer
	},

	// Permissive for general read operations
	permissive: {
		limit: 200,
		windowMs: 60000 // 1 minute
	},

	// Standard rate limit for write operations
	standard: {
		limit: 30,
		windowMs: 60000 // 1 minute
	},

	// Strict rate limit for expensive OpenAI operations only
	strict: {
		limit: 10,
		windowMs: 60000 // 1 minute - for OpenAI analyze endpoint
	},

	// Very strict for critical operations (call creation)
	critical: {
		limit: 5,
		windowMs: 300000 // 5 minutes
	}
};

/**
 * Middleware to apply rate limiting and throw error if exceeded
 */
export async function enforceRateLimit(
	request: RequestEvent,
	config: typeof RateLimitConfigs.default
): Promise<void> {
	const result = await applyRateLimit(request, config);

	if (!result.success) {
		// Create headers for rate limiting info
		const headers = new Headers({
			'X-RateLimit-Limit': result.limit.toString(),
			'X-RateLimit-Remaining': result.remaining.toString(),
			'X-RateLimit-Reset': result.reset.toISOString(),
			'Content-Type': 'application/json'
		});

		if (result.retryAfter) {
			headers.set('Retry-After', result.retryAfter.toString());
		}

		// Throw a Response with rate limiting headers
		throw new Response(
			JSON.stringify({
				error: 'Too many requests. Please slow down.',
				limit: result.limit,
				remaining: result.remaining,
				reset: result.reset.toISOString(),
				retryAfter: result.retryAfter
			}),
			{
				status: 429,
				headers
			}
		);
	}
}
