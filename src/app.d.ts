// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		/**
		 * Custom error properties available in $page.error
		 * These properties are returned from handleError hooks
		 */
		interface Error {
			message: string;
			// Add custom error properties here
			// code?: string;
			// timestamp?: string;
		}

		/**
		 * Custom data available in event.locals throughout the request lifecycle
		 * This is set in hooks.server.ts and available in load functions and routes
		 */
		interface Locals {
			// Add custom locals properties here
			// user?: {
			//   id: string;
			//   email: string;
			//   name: string;
			//   isAdmin: boolean;
			//   token?: string;
			// };
			// session?: {
			//   id: string;
			//   expiresAt: Date;
			// };
		}

		/**
		 * Custom data available in $page.data
		 * This is the return type of your load functions
		 */
		interface PageData {
			// Add common page data properties here
			// user?: App.Locals['user'];
		}

		/**
		 * Custom client-side page state
		 * This persists across client-side navigations
		 */
		interface PageState {
			// Add page state properties here
			// scrollPosition?: { x: number; y: number };
		}

		/**
		 * Platform-specific data (e.g., for deployment platforms)
		 * Useful for Cloudflare Workers, Vercel Edge Functions, etc.
		 */
		interface Platform {
			// Add platform-specific properties here
			// env?: {
			//   DATABASE_URL: string;
			//   SECRET_KEY: string;
			// };
		}
	}
}

export {};
