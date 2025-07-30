<!--
  Live Transcript Component
  
  Displays the real-time conversation between the AI agent and human with auto-scrolling.
-->

<script lang="ts">
	import Card from '$lib/client/components/ui/Card.svelte';
	import Heading from '$lib/client/components/ui/Heading.svelte';
	import Badge from '$lib/client/components/ui/Badge.svelte';
	import Spinner from '$lib/client/components/ui/Spinner.svelte';
	import type { DemoRune } from '$lib/client/runes';

	// Component props
	let { demo }: { demo: DemoRune } = $props();

	// Transcript container reference
	let transcriptContainer = $state<HTMLElement>();

	// Set the container reference in the demo rune for auto-scrolling
	$effect(() => {
		if (transcriptContainer) {
			demo.setTranscriptContainer(transcriptContainer);
		}
	});
</script>

<Card class="mt-8 p-6">
	<div class="mb-4 flex items-center justify-between">
		<Heading level={3}>Live Conversation</Heading>
		{#if demo.isCallActive}
			<div class="flex items-center space-x-2 text-sm text-slate-500">
				<div class="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
				<span>Updates every 2.5s</span>
			</div>
		{/if}
	</div>

	{#if demo.transcript.length > 0}
		<!-- Transcript Content -->
		<div
			bind:this={transcriptContainer}
			class="max-h-96 space-y-3 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4"
		>
			{#each demo.transcript as entry}
				<div class="flex space-x-3 rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
					<div class="flex-shrink-0">
						<Badge variant={entry.user === 'assistant' || entry.user === 'ai' ? 'info' : 'default'}>
							{entry.user === 'assistant' || entry.user === 'ai' ? 'AI Agent' : 'Human'}
						</Badge>
					</div>
					<div class="min-w-0 flex-1">
						<p class="text-sm leading-relaxed text-slate-900">{entry.text}</p>
						{#if entry.timestamp}
							<p class="mt-1 text-xs text-slate-500">
								{new Date(entry.timestamp).toLocaleTimeString()}
							</p>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{:else if demo.isCallActive}
		<!-- Loading State -->
		<div
			class="flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-8"
		>
			<div class="text-center">
				<Spinner class="mx-auto mb-3 h-8 w-8 text-emerald-600" />
				<p class="font-medium text-slate-600">Waiting for conversation to start...</p>
				<p class="mt-1 text-sm text-slate-500">
					The transcript will appear here as the AI agent talks
				</p>
			</div>
		</div>
	{:else}
		<!-- Empty State -->
		<div
			class="flex items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8"
		>
			<div class="text-center">
				<svg
					class="mx-auto mb-4 h-12 w-12 text-slate-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
					></path>
				</svg>
				<p class="font-medium text-slate-600">No conversation yet</p>
				<p class="mt-1 text-sm text-slate-500">Start a call to see the live conversation here</p>
			</div>
		</div>
	{/if}
</Card>
