<!--
  AI Phone Call Demo Page
  
  Interactive demo showcasing AI agents making real phone calls with live conversation display.
  Optimized for perfect symmetry, visual hierarchy, and responsive design.
-->

<script lang="ts">
	import Container from '$lib/client/components/ui/Container.svelte';
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

<!-- Demo page with perfect symmetry and modern design -->
<div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
	<!-- Enhanced Demo Header Section -->
	<section class="relative">
		<DemoHeader />
		<!-- Subtle gradient overlay for better visual flow -->
		<div
			class="absolute right-0 bottom-0 left-0 h-16 bg-gradient-to-b from-transparent to-slate-50/50"
		></div>
	</section>

	<!-- Main Demo Content with Perfect Symmetry -->
	<Container class="relative z-10 py-8 sm:py-12 lg:py-16">
		<div class="max-w-8xl mx-auto">
			<!-- Call Progress - Centered and Prominent -->
			<section class="mb-8 lg:mb-12">
				<div class="mx-auto max-w-6xl">
					<CallProgress {demo} />
				</div>
			</section>

			<!-- Symmetrical Two-Column Demo Layout -->
			<div class="grid grid-cols-1 gap-8 lg:gap-12 xl:grid-cols-2">
				<!-- Left Column: AI Agent Configuration -->
				<div class="relative">
					<!-- Visual anchor for symmetry -->
					<div class="sticky top-4 space-y-6">
						<section class="transition-all duration-300 hover:scale-[1.02]">
							<CallConfiguration {demo} />
						</section>
					</div>
				</div>

				<!-- Right Column: Live Conversation -->
				<div class="relative">
					<!-- Matching sticky behavior for visual balance -->
					<div class="sticky top-4 space-y-6">
						<section class="transition-all duration-300 hover:scale-[1.02]">
							<LiveTranscript {demo} />
						</section>
					</div>
				</div>
			</div>

			<!-- Full-Width Results Section -->
			{#if demo.orderDetails || demo.currentCall?.status === 'completed'}
				<section class="mt-16 lg:mt-20">
					<div class="mx-auto max-w-6xl">
						<div class="transition-all duration-500 hover:scale-[1.01]">
							<CallAnalysis {demo} />
						</div>
					</div>
				</section>
			{/if}

			<!-- Stellar CTA Section - Centered and Balanced -->
			{#if !demo.isCallActive && (demo.currentCall || demo.errorMessage)}
				<section class="mt-16 lg:mt-20">
					<div class="mx-auto max-w-4xl">
						<StellarCTA />
					</div>
				</section>
			{/if}
		</div>
	</Container>

	<!-- Background decorative elements for visual depth -->
	<div class="pointer-events-none fixed inset-0 overflow-hidden">
		<!-- Subtle geometric patterns -->
		<div
			class="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-100/30 to-purple-100/30 blur-3xl"
		></div>
		<div
			class="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-emerald-100/30 to-cyan-100/30 blur-3xl"
		></div>
		<div
			class="absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-orange-100/20 to-pink-100/20 blur-3xl"
		></div>
	</div>
</div>

<style>
	/* Enhanced responsive design and visual hierarchy */

	/* Smooth page transitions */
	:global(body) {
		scroll-behavior: smooth;
	}

	/* Custom container max-width for perfect symmetry */
	.max-w-8xl {
		max-width: 88rem;
	}

	/* High contrast mode support */
	@media (prefers-contrast: high) {
		.bg-gradient-to-br {
			background: white;
		}
	}

	/* Reduced motion preferences */
	@media (prefers-reduced-motion: reduce) {
		* {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
		}
	}
</style>
