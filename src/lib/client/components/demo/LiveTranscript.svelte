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

<Card
	class="h-full border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
>
	<div class="p-6 sm:p-8">
		<!-- Enhanced Header with Icon -->
		<div class="mb-6 border-b border-slate-100 pb-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<Heading level={3} class="text-xl font-bold text-slate-900 sm:text-2xl"
						>Live Conversation</Heading
					>
				</div>
				{#if demo.isCallActive}
					<div
						class="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5"
					>
						<div
							class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500/70"
							style="animation-duration: 2s;"
						></div>
						<span class="text-xs font-medium text-emerald-700">Updates every 2.5s</span>
					</div>
				{/if}
			</div>
		</div>

		{#if demo.transcript.length > 0}
			<!-- Enhanced Transcript Content -->
			<div
				bind:this={transcriptContainer}
				class="max-h-96 space-y-4 overflow-y-auto rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-inner"
			>
				{#each demo.transcript as entry}
					<div class="group transform transition-all duration-200 hover:scale-[1.02]">
						<div
							class="flex space-x-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
						>
							<div class="flex-shrink-0">
								<div class="flex items-center gap-2">
									{#if entry.user === 'assistant' || entry.user === 'ai'}
										<div
											class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-md"
										>
											<span class="text-xs font-bold text-white">AI</span>
										</div>
									{:else}
										<div
											class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-500 to-slate-600 shadow-md"
										>
											<span class="text-xs font-bold text-white">👤</span>
										</div>
									{/if}
									<Badge
										variant={entry.user === 'assistant' || entry.user === 'ai' ? 'info' : 'default'}
									>
										{entry.user === 'assistant' || entry.user === 'ai' ? 'AI Agent' : 'Human'}
									</Badge>
								</div>
							</div>
							<div class="min-w-0 flex-1">
								<p class="text-sm leading-relaxed text-slate-900">{entry.text}</p>
								{#if entry.timestamp}
									<p class="mt-2 text-xs text-slate-500">
										{new Date(entry.timestamp).toLocaleTimeString()}
									</p>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else if demo.isCallActive}
			<!-- Enhanced Loading State -->
			<div
				class="flex items-center justify-center rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-12"
			>
				<div class="space-y-4 text-center">
					<div class="relative">
						<Spinner class="mx-auto h-8 w-8 text-emerald-600" />
						<div
							class="absolute inset-0 animate-ping rounded-full bg-emerald-400/10"
							style="animation-duration: 3s;"
						></div>
					</div>
					<div class="space-y-2">
						<p class="text-lg font-semibold text-slate-700">Waiting for conversation to start...</p>
						<p class="max-w-xs text-sm text-slate-500">
							The live transcript will appear here as the AI agent begins talking
						</p>
					</div>
					<!-- Subtle visual indicators -->
					<div class="flex items-center justify-center gap-2 pt-2">
						<div
							class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400/60 [animation-delay:0ms]"
							style="animation-duration: 2s;"
						></div>
						<div
							class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400/60 [animation-delay:400ms]"
							style="animation-duration: 2s;"
						></div>
						<div
							class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400/60 [animation-delay:800ms]"
							style="animation-duration: 2s;"
						></div>
					</div>
				</div>
			</div>
		{:else}
			<!-- Enhanced Empty State -->
			<div
				class="flex items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white p-12"
			>
				<div class="space-y-4 text-center">
					<div
						class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 shadow-lg"
					>
						<span class="text-2xl">💬</span>
					</div>
					<div class="space-y-2">
						<p class="text-lg font-semibold text-slate-700">No conversation yet</p>
						<p class="max-w-xs text-sm text-slate-500">
							Configure your AI agent and start a call to see the live conversation here
						</p>
					</div>
					<!-- Call to action hint -->
					<div class="pt-2">
						<p class="text-xs font-medium tracking-wide text-slate-400 uppercase">
							← Start a call to begin
						</p>
					</div>
				</div>
			</div>
		{/if}
	</div></Card
>

<style>
	/* Subtle pulse animations for live indicators */
	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	.animate-ping {
		animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
	}

	/* Reduced motion overrides */
	@media (prefers-reduced-motion: reduce) {
		* {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
		}
	}
</style>
