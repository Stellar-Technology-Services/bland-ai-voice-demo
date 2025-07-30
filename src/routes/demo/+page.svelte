<!--
  AI Phone Call Demo Page
  
  Interactive demo showcasing AI agents making real phone calls with live conversation display.
-->

<script lang="ts">
	import Container from '$lib/client/components/ui/Container.svelte';
	import Button from '$lib/client/components/ui/Button.svelte';
	import DemoHeader from '$lib/client/components/demo/DemoHeader.svelte';
	import CallConfiguration from '$lib/client/components/demo/CallConfiguration.svelte';
	import CallProgress from '$lib/client/components/demo/CallProgress.svelte';
	import LiveTranscript from '$lib/client/components/demo/LiveTranscript.svelte';
	import CallAnalysis from '$lib/client/components/demo/CallAnalysis.svelte';
	import StellarCTA from '$lib/client/components/landing/StellarCTA.svelte';
	import { createDemoRune } from '$lib/client/runes';

	// Initialize the demo state management rune
	const demo = createDemoRune();
</script>

<svelte:head>
	<title>AI Phone Call Demo | Watch AI Agents in Action</title>
	<meta
		name="description"
		content="Experience AI-powered phone calls with real-time conversation, live transcription, and intelligent analysis. Watch AI agents handle complex phone interactions."
	/>
</svelte:head>

<!-- Demo page with improved spacing and visual hierarchy -->
<div class="min-h-screen bg-slate-50">
	<!-- Demo Header Section -->
	<section>
		<DemoHeader />
	</section>

	<!-- Main Demo Content -->
	<Container class="py-8 sm:py-12 lg:py-16">
		<div class="mx-auto max-w-7xl">
			<!-- Call Progress (Horizontal, Full Width) -->
			<section class="mb-8">
				<CallProgress {demo} />
			</section>

			<!-- Demo Configuration and Results -->
			<div class="grid grid-cols-1 gap-8 lg:gap-12 xl:grid-cols-2">
				<!-- Left Column: Configuration -->
				<div class="space-y-8">
					<!-- AI Agent Configuration -->
					<section>
						<CallConfiguration {demo} />
					</section>
				</div>

				<!-- Right Column: Live Conversation -->
				<section class="xl:sticky xl:top-8 xl:self-start">
					<LiveTranscript {demo} />
				</section>
			</div>

			<!-- AI Analysis Results (Full Width) -->
			{#if demo.orderDetails || demo.currentCall?.status === 'completed'}
				<section class="mt-16">
					<CallAnalysis {demo} />
				</section>
			{/if}

			<!-- Stellar CTA Section -->
			{#if !demo.isCallActive && (demo.currentCall || demo.errorMessage)}
				<section class="mt-16">
					<StellarCTA />
				</section>
			{/if}
		</div>
	</Container>
</div>
