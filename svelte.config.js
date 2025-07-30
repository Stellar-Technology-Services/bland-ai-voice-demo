import adapter from '@sveltejs/adapter-vercel';
import { sveltePreprocess } from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: sveltePreprocess(),

	kit: {
		adapter: adapter({
			runtime: 'nodejs22.x',
			maxDuration: 300,
			external: [
				'path',
				'os',
				'crypto',
				'fs',
				'stream',
				'zlib',
				'timers',
				'node:path',
				'node:os',
				'node:crypto',
				'node:child_process',
				'node:stream',
				'url',
				'http',
				'https',
				'child_process'
			]
		}),
		csrf: {
			checkOrigin: process.env.NODE_ENV !== 'development'
		},
		inlineStyleThreshold: 10000,
		serviceWorker: {
			register: false
		},
		alias: {
			$services: './src/lib/server/services',
			$modules: './src/lib/server/modules',
			$components: './src/lib/client/components',
			$client: './src/lib/client',
			$server: './src/lib/server',
			$shared: './src/lib/shared',
			'@/*': './src/lib/*'
		}
	}
};

export default config;
