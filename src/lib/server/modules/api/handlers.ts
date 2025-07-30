import { type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { applyRateLimit } from './rateLimit';
// CORS functionality temporarily disabled

export const GetHandler = (
	func: (event: RequestEvent) => Promise<any>,
	rateLimiter: boolean = true,
	enableCors: boolean = false,
	customResponse: any = null
): RequestHandler => {
	return async (event) => {
		if (rateLimiter) await applyRateLimit(event);

		try {
			const result = await func(event);

			if (customResponse === null) {
				const response = { success: true, data: result };
				return json(response);
			}

			return customResponse;
		} catch (error: any) {
			console.error('Error in GetHandler:', error);

			const errorResponse = {
				success: false,
				error: error.message || 'Internal server error'
			};

			return json(errorResponse, { status: 500 });
		}
	};
};

export const PostHandler = (
	func: (event: RequestEvent) => Promise<any>,
	rateLimiter: boolean = true,
	enableCors: boolean = false,
	customResponse: any = null
): RequestHandler => {
	return async (event) => {
		if (rateLimiter) await applyRateLimit(event);

		try {
			const result = await func(event);

			if (customResponse === null) {
				const response = { success: true, data: result };
				return json(response);
			}

			return customResponse;
		} catch (error: any) {
			console.error('Error in PostHandler:', error);

			const errorResponse = {
				success: false,
				error: error.message || 'Internal server error'
			};

			return json(errorResponse, { status: 500 });
		}
	};
};

export const PutHandler = (
	func: (event: RequestEvent) => Promise<any>,
	rateLimiter: boolean = true,
	enableCors: boolean = false,
	customResponse: any = null
): RequestHandler => {
	return async (event) => {
		if (rateLimiter) await applyRateLimit(event);

		try {
			const result = await func(event);

			if (customResponse === null) {
				const response = { success: true, data: result };
				return json(response);
			}

			return customResponse;
		} catch (error: any) {
			console.error('Error in PutHandler:', error);

			const errorResponse = {
				success: false,
				error: error.message || 'Internal server error'
			};

			return json(errorResponse, { status: 500 });
		}
	};
};

export const DeleteHandler = (
	func: (event: RequestEvent) => Promise<any>,
	rateLimiter: boolean = true,
	enableCors: boolean = false,
	customResponse: any = null
): RequestHandler => {
	return async (event) => {
		if (rateLimiter) await applyRateLimit(event);

		try {
			const result = await func(event);

			if (customResponse === null) {
				const response = { success: true, data: result };
				return json(response);
			}

			return customResponse;
		} catch (error: any) {
			console.error('Error in DeleteHandler:', error);

			const errorResponse = {
				success: false,
				error: error.message || 'Internal server error'
			};

			return json(errorResponse, { status: 500 });
		}
	};
};
