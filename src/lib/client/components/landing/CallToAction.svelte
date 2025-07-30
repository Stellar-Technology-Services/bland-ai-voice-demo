<!--
  Stellar AI Call to Action Component
  
  CTA section directing users to Stellar AI's AI & Data Expert Solutions.
-->

<script lang="ts">
	import Button from '$lib/client/components/ui/Button.svelte';

	// Stellar AI component props
	let {
		title = 'Ready to Transform Your Business with AI?',
		description = 'Partner with Stellar to build full-stack generative AI-driven business applications. From AI workshops and assessments to enterprise AI solutions, we help you unlock the power of artificial intelligence for sustainable success.',
		buttonText = 'Speak with an AI Expert'
	} = $props();

	// Handle navigation to Stellar AI
	function handleGetStarted() {
		window.open('https://www.getstellar.ai', '_blank', 'noopener,noreferrer');
	}
</script>

<!-- Stellar AI Call to Action -->
<div class="relative mx-auto mt-12 max-w-4xl px-4 sm:mt-16">
	<div
		class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-blue-600 px-6 py-12 sm:px-8 sm:py-16 lg:px-16"
	>
		<!-- Background pattern -->
		<div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>

		<!-- Content -->
		<div class="relative text-center text-white">
			<!-- Stellar Logo and Title -->
			<div class="mb-4 flex flex-col items-center justify-center gap-3 sm:mb-6 sm:flex-row sm:gap-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="40"
					height="40"
					viewBox="0 0 256 256"
					class="flex-shrink-0 sm:h-12 sm:w-12"
				>
					<path
						d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0zm28.5 156.5c-22.2 22.2-28.5 70.6-28.5 70.6s-6.3-48.4-28.5-70.6C77.3 134.3 28.1 128 28.1 128s49.2-6.3 71.4-28.5C121.7 77.3 128 28.9 128 28.9s6.3 48.4 28.5 70.6c22.2 22.2 71.4 28.5 71.4 28.5s-49.2 6.3-71.4 28.5z"
						fill="white"
					/>
				</svg>
				<h2 class="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl xl:text-5xl">
					{title}
				</h2>
			</div>

			<!-- Description -->
			<p class="mx-auto mt-4 max-w-2xl text-base leading-7 text-emerald-100 sm:mt-6 sm:text-lg sm:leading-8 md:text-xl">
				{description}
			</p>

			<!-- Stellar AI value propositions -->
			<div class="mt-6 flex flex-col items-center justify-center gap-4 text-sm text-emerald-100 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-6">
				<div class="flex items-center gap-2">
					<svg class="h-4 w-4 text-emerald-300 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						/>
					</svg>
					<span>AI Workshops & Assessments</span>
				</div>
				<div class="flex items-center gap-2">
					<svg class="h-4 w-4 text-emerald-300 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						/>
					</svg>
					<span>Enterprise AI Solutions</span>
				</div>
				<div class="flex items-center gap-2">
					<svg class="h-4 w-4 text-emerald-300 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						/>
					</svg>
					<span>Trusted AI Partner</span>
				</div>
			</div>

			<!-- CTA button using Button component -->
			<div class="mt-8 flex justify-center sm:mt-10">
				<Button
					onclick={handleGetStarted}
					variant="secondary"
					size="lg"
					class="w-full transform gap-3 bg-white px-6 py-3 text-base font-semibold text-emerald-600 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-50 hover:shadow-xl sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 256 256"
						class="flex-shrink-0 sm:h-6 sm:w-6"
					>
						<path
							d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0zm28.5 156.5c-22.2 22.2-28.5 70.6-28.5 70.6s-6.3-48.4-28.5-70.6C77.3 134.3 28.1 128 28.1 128s49.2-6.3 71.4-28.5C121.7 77.3 128 28.9 128 28.9s6.3 48.4 28.5 70.6c22.2 22.2 71.4 28.5 71.4 28.5s-49.2 6.3-71.4 28.5z"
							fill="#059669"
						/>
					</svg>
					{buttonText}
				</Button>
			</div>
		</div>
	</div>
</div>
