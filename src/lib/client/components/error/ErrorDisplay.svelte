<!--
  Error Display Component
  
  Displays error pages with appropriate messaging based on status code.
  Uses Svelte 5 snippets for flexible action button rendering.
-->

<script lang="ts">
	import { dev } from '$app/environment';
	import { goto } from '$app/navigation';
	import Container from '../ui/Container.svelte';
	import Heading from '../ui/Heading.svelte';
	import Button from '../ui/Button.svelte';
	import Alert from '../ui/Alert.svelte';

	// Component props
	let {
		status = 500,
		message = 'An unexpected error occurred',
		error = null
	}: {
		status?: number;
		message?: string;
		error?: any;
	} = $props();

	// Type definitions for error mapping
	interface ErrorInfo {
		title: string;
		description: string;
	}

	// Error information mapping
	const errorInfoMap: Record<number, ErrorInfo> = {
		404: {
			title: 'Page Not Found',
			description: "The page you're looking for doesn't exist or has been moved."
		},
		403: {
			title: 'Access Forbidden',
			description: "You don't have permission to access this resource."
		},
		401: {
			title: 'Unauthorized',
			description: 'Please sign in to access this page.'
		},
		500: {
			title: 'Internal Server Error',
			description: 'An unexpected error occurred on our servers.'
		},
		503: {
			title: 'Service Unavailable',
			description: 'The service is temporarily unavailable. Please try again later.'
		}
	};

	// Get error information with fallback
	const errorInfo = errorInfoMap[status] || {
		title: 'Something Went Wrong',
		description: 'An unexpected error occurred. Please try again.'
	};

	// Navigation handlers
	function goHome() {
		goto('/');
	}

	function goBack() {
		history.back();
	}

	function tryAgain() {
		location.reload();
	}
</script>

<!-- Snippet: Action Button -->
{#snippet actionButton(
	label: string,
	action: () => void,
	variant: 'primary' | 'secondary' | 'outline' | 'danger' = 'primary'
)}
	<Button onclick={action} {variant} class="px-6 py-3">
		{label}
	</Button>
{/snippet}

<!-- Snippet: Error Status Display -->
{#snippet errorStatus()}
	<div class="mb-8">
		<div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
			<span class="text-3xl font-bold text-red-600">{status}</span>
		</div>
		<Heading level={1} class="mb-4 text-3xl font-bold text-slate-900">
			{errorInfo.title}
		</Heading>
		<p class="text-lg text-slate-600">
			{errorInfo.description}
		</p>
	</div>
{/snippet}

<!-- Snippet: Error Message Alert -->
{#snippet errorMessage()}
	{#if message && message !== errorInfo.description}
		<Alert variant="error" class="mb-8">
			{message}
		</Alert>
	{/if}
{/snippet}

<!-- Snippet: Development Details -->
{#snippet developmentDetails()}
	{#if dev && error}
		<div class="mb-8 rounded-lg bg-slate-100 p-4">
			<h3 class="mb-2 text-sm font-semibold text-slate-900">Development Error Details:</h3>
			<pre class="overflow-auto text-left text-xs text-slate-700">{JSON.stringify(
					error,
					null,
					2
				)}</pre>
		</div>
	{/if}
{/snippet}

<!-- Snippet: Action Buttons -->
{#snippet actionButtons()}
	<div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
		{@render actionButton('🏠 Go Home', goHome, 'primary')}

		{#if status !== 404}
			{@render actionButton('🔄 Try Again', tryAgain, 'secondary')}
		{/if}

		{@render actionButton('← Go Back', goBack, 'outline')}
	</div>
{/snippet}

<!-- Snippet: Help Section -->
{#snippet helpSection()}
	<div class="mt-12 text-center">
		<p class="text-sm text-slate-500">
			Need help? Check our
			<a href="/demo" class="text-emerald-600 underline hover:text-emerald-700"> demo page </a>
			or contact support.
		</p>
	</div>
{/snippet}

<Container class="flex min-h-screen items-center justify-center py-12">
	<div class="mx-auto max-w-2xl text-center">
		<!-- Error Status -->
		{@render errorStatus()}

		<!-- Error Message -->
		{@render errorMessage()}

		<!-- Development Error Details -->
		{@render developmentDetails()}

		<!-- Action Buttons -->
		{@render actionButtons()}

		<!-- Additional Help -->
		{@render helpSection()}
	</div>
</Container>
