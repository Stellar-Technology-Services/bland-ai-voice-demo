/**
 * Universal Hooks
 * 
 * These hooks run on both the client and server,
 * providing functionality that works in both environments.
 */

import type { Reroute } from '@sveltejs/kit';

/**
 * Reroute hook - modify the URL before determining which route to render
 * 
 * This hook runs before SvelteKit determines which route to render,
 * allowing you to modify the URL path. Useful for URL rewrites,
 * redirects, locale handling, etc.
 */
export const reroute: Reroute = ({ url }) => {
	// Example: Handle locale-based routing
	// const locale = url.pathname.match(/^\/([a-z]{2})\//)?.[1];
	// if (locale && ['en', 'es', 'fr', 'de'].includes(locale)) {
	//   return url.pathname.slice(3) || '/';
	// }

	// Example: Legacy URL redirects
	// if (url.pathname.startsWith('/legacy/')) {
	//   return url.pathname.replace('/legacy/', '/');
	// }

	// Example: API versioning
	// if (url.pathname.startsWith('/api/v1/')) {
	//   return url.pathname.replace('/api/v1/', '/api/');
	// }

	// Example: Mobile subdomain handling
	// if (url.hostname === 'm.yoursite.com') {
	//   return '/mobile' + url.pathname;
	// }

	// Return the original path if no rerouting is needed
	return url.pathname;
};

/**
 * Transport hook - pass custom types across the server/client boundary
 * 
 * This hook allows you to define custom serialization for complex types
 * that need to be passed from server to client (e.g., Dates, BigInts, etc.)
 * 
 * Note: This is an experimental feature and may change in future versions
 */
// export const transport = {
//   // Example: Custom Date serialization
//   Date: {
//     serialize: (date: Date) => date.toISOString(),
//     deserialize: (str: string) => new Date(str)
//   },
//   
//   // Example: Custom BigInt serialization
//   BigInt: {
//     serialize: (bigint: bigint) => bigint.toString(),
//     deserialize: (str: string) => BigInt(str)
//   }
// }; 