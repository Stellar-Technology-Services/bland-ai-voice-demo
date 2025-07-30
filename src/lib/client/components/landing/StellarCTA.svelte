<!--
  Stellar CTA Component
  
  A reusable call-to-action component for promoting Stellar AI services.
  Displays when demo is complete or when explicitly shown.
-->

<script lang="ts">
	import Button from '$lib/client/components/ui/Button.svelte';

	// Component props
	let {
		title = 'Demo Complete',
		description = 'Ready to build your own AI phone agent?',
		buttonText = 'Get Started at Stellar AI',
		href = 'https://www.getstellar.ai',
		class: className = ''
	} = $props();

	// Handle Stellar AI navigation
	function handleStellarClick() {
		window.open(href, '_blank', 'noopener,noreferrer');
	}
</script>

<!-- Stellar CTA Card -->
<div class="flex justify-center {className}">
	<div class="w-full max-w-md rounded-xl bg-white p-4 text-center shadow-sm sm:p-6">
		<h3 class="mb-2 text-base font-semibold text-slate-900 sm:mb-3 sm:text-lg">{title}</h3>
		<p class="mb-3 text-sm text-slate-600 sm:mb-4">{description}</p>
		<Button
			onclick={handleStellarClick}
			variant="primary"
			size="md"
			class="w-full px-4 py-2 font-medium sm:w-auto sm:px-6 sm:py-3"
		>
			{buttonText}
		</Button>
	</div>
</div> 