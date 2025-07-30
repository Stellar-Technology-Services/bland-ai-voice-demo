<!--
  Root Error Page
  
  This component renders when an error occurs anywhere in the application
  that isn't handled by a more specific +error.svelte page.
-->

<script lang="ts">
	import { page } from '$app/state';
	import ErrorDisplay from '$lib/client/components/error/ErrorDisplay.svelte';

	// Get error details from the page store
	const error = $derived(page.error);
	const status = $derived(page.status);
</script>

<svelte:head>
	<title>Error {status} | AI Phone Call Demo</title>
	<meta name="description" content="An error occurred while loading the page." />
</svelte:head>

<ErrorDisplay {status} message={error?.message} {error} />
