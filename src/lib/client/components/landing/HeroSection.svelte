<!--
  Hero Section Component
  
  Enhanced main landing page hero with compelling title, clear value proposition, and prominent call-to-action.
  Follows Nielsen Norman Group guidelines for homepage usability and visual hierarchy.
-->

<script lang="ts">
	import Button from '../ui/Button.svelte';

	// Component props with enhanced messaging
	let {
		title = '🤖 AI Phone Call Demo',
		subtitle = 'The Future of Automated Conversations',
		description = 'Experience the power of AI-driven phone calls that sound completely human. Watch our AI make real phone calls, engage in natural dialogue, and extract structured information from voice interactions with remarkable accuracy.',
		primaryButtonText = '🍕 Try Live Demo',
		secondaryButtonText = 'View on GitHub',
		primaryButtonHref = '/demo',
		githubHref = 'https://github.com/Stellar-Technology-Services/bland-ai-voice-demo'
	} = $props();

	// Handle navigation
	function handlePrimaryClick() {
		window.location.href = primaryButtonHref;
	}
</script>

<!-- Enhanced Hero Section with gradient background -->
<div class="relative overflow-hidden">
	<!-- Gradient background -->
	<div
		class="absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 opacity-60"
	></div>

	<!-- Content container -->
	<div class="relative text-center">
		<div class="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
			<!-- Enhanced title with better typography -->
			<div class="space-y-4 sm:space-y-6">
				<h1 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl">
					{title}
				</h1>

				<!-- Subtitle for better hierarchy -->
				<p class="text-lg font-semibold text-emerald-600 sm:text-xl md:text-2xl">
					{subtitle}
				</p>

				<!-- Enhanced description with better spacing -->
				<p class="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 md:text-xl">
					{description}
				</p>
			</div>

			<!-- Enhanced button section with better spacing and visual hierarchy -->
			<div class="mt-8 sm:mt-10 md:mt-12">
				<div class="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 md:gap-6">
					<!-- Primary CTA with enhanced styling -->
					<Button
						onclick={handlePrimaryClick}
						size="lg"
						class="w-full transform px-6 py-3 text-base font-semibold shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
					>
						{primaryButtonText}
					</Button>

					<!-- Secondary CTA with improved styling -->
					<a
						href={githubHref}
						target="_blank"
						rel="noopener noreferrer"
						class="group inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:text-emerald-600 sm:text-base"
					>
						<svg
							class="h-4 w-4 transition-transform group-hover:scale-110 sm:h-5 sm:w-5"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
							/>
						</svg>
						{secondaryButtonText}
						<span class="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
