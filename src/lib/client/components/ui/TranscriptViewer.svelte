<!--
  TranscriptViewer Component
  
  Displays call transcripts with proper formatting, speaker identification,
  and automatic scrolling for real-time updates.
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import Badge from './Badge.svelte';

	// Props
	let { transcript = [], autoScroll = true, maxHeight = '400px', class: className = '' } = $props();

	// Local state
	let transcriptContainer = $state<HTMLElement>();
	let shouldAutoScroll = $state(autoScroll);

	// Auto-scroll to bottom when new messages arrive
	$effect(() => {
		if (shouldAutoScroll && transcriptContainer && transcript.length > 0) {
			setTimeout(() => {
				if (transcriptContainer) {
					transcriptContainer.scrollTop = transcriptContainer.scrollHeight;
				}
			}, 100);
		}
	});

	// Check if user has scrolled up (disable auto-scroll)
	function handleScroll() {
		if (!transcriptContainer) return;

		const { scrollTop, scrollHeight, clientHeight } = transcriptContainer;
		const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
		shouldAutoScroll = isAtBottom;
	}

	// Format timestamp for display
	function formatTimestamp(timestamp: string): string {
		try {
			const date = new Date(timestamp);
			return date.toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit'
			});
		} catch {
			return timestamp;
		}
	}

	// Get speaker display info
	function getSpeakerInfo(user: string) {
		if (user === 'assistant' || user === 'ai' || user === 'bot') {
			return {
				label: '🤖 AI Agent',
				variant: 'info' as const,
				class: 'bg-blue-50 border-blue-200'
			};
		} else if (user === 'human' || user === 'user' || user === 'customer') {
			return {
				label: '👤 Human',
				variant: 'default' as const,
				class: 'bg-slate-50 border-slate-200'
			};
		} else {
			return {
				label: `🗣️ ${user}`,
				variant: 'outline' as const,
				class: 'bg-gray-50 border-gray-200'
			};
		}
	}
</script>

<div class="transcript-viewer {className}">
	{#if transcript.length === 0}
		<div
			class="flex items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center"
			style="height: {maxHeight};"
		>
			<div>
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
				<p class="font-medium text-slate-600">No transcript available</p>
				<p class="mt-1 text-sm text-slate-500">Transcript will appear here when the call starts</p>
			</div>
		</div>
	{:else}
		<div class="overflow-hidden rounded-lg border border-slate-200 bg-white">
			<!-- Header -->
			<div class="border-b border-slate-200 bg-slate-50 px-4 py-3">
				<div class="flex items-center justify-between">
					<h3 class="font-medium text-slate-900">Live Transcript</h3>
					<div class="flex items-center space-x-2">
						<span class="text-sm text-slate-500">{transcript.length} messages</span>
						{#if !shouldAutoScroll}
							<Badge variant="warning" class="text-xs">Scroll paused</Badge>
						{/if}
					</div>
				</div>
			</div>

			<!-- Transcript Content -->
			<div
				bind:this={transcriptContainer}
				onscroll={handleScroll}
				class="transcript-content overflow-y-auto px-4 py-2"
				style="max-height: {maxHeight};"
			>
				<div class="space-y-4">
					{#each transcript as entry, index}
						{@const speakerInfo = getSpeakerInfo(entry.user)}
						<div class="transcript-entry {speakerInfo.class} rounded-lg border p-3">
							<div class="flex items-start space-x-3">
								<div class="mt-1 flex-shrink-0">
									<Badge variant={speakerInfo.variant} class="text-xs">
										{speakerInfo.label}
									</Badge>
								</div>
								<div class="min-w-0 flex-1">
									<p class="text-sm leading-relaxed text-slate-900">
										{entry.text}
									</p>
									{#if entry.timestamp}
										<p class="mt-2 text-xs text-slate-500">
											{formatTimestamp(entry.timestamp)}
										</p>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>

				<!-- Auto-scroll indicator -->
				{#if shouldAutoScroll && transcript.length > 0}
					<div class="flex justify-center py-2">
						<div class="flex items-center space-x-2 text-xs text-slate-500">
							<div class="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
							<span>Live updating</span>
						</div>
					</div>
				{/if}
			</div>

			<!-- Actions -->
			{#if transcript.length > 0}
				<div class="border-t border-slate-200 bg-slate-50 px-4 py-3">
					<div class="flex items-center justify-between">
						<button
							onclick={() => (shouldAutoScroll = true)}
							disabled={shouldAutoScroll}
							class="text-sm text-slate-600 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
						>
							📍 Scroll to latest
						</button>

						<button
							onclick={() => {
								const text = transcript.map((entry) => `${entry.user}: ${entry.text}`).join('\n');
								navigator.clipboard?.writeText(text);
							}}
							class="text-sm text-slate-600 hover:text-slate-900"
						>
							📋 Copy transcript
						</button>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.transcript-viewer {
		transition: all 200ms;
	}

	.transcript-content {
		scrollbar-width: thin;
		scrollbar-color: #cbd5e1 #f1f5f9;
	}

	.transcript-content::-webkit-scrollbar {
		width: 6px;
	}

	.transcript-content::-webkit-scrollbar-track {
		background: #f1f5f9;
		border-radius: 3px;
	}

	.transcript-content::-webkit-scrollbar-thumb {
		background: #cbd5e1;
		border-radius: 3px;
	}

	.transcript-content::-webkit-scrollbar-thumb:hover {
		background: #94a3b8;
	}

	.transcript-entry {
		transition: color 150ms;
	}

	.transcript-entry:hover {
		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	}
</style>
