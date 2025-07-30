<!--
  Demo Preview Component
  
  Showcases the main demo features with visual cards and call-to-action.
  Uses Svelte 5 snippets for flexible feature rendering.
-->

<script lang="ts">
	import Card from '../ui/Card.svelte';
	import Button from '../ui/Button.svelte';

	// Component props
	let { demoHref = '/demo' } = $props();

	// Type definitions
	type IconColor = 'emerald' | 'blue' | 'purple';

	interface Feature {
		icon: string;
		iconColor: IconColor;
		title: string;
		description: string;
	}

	// Demo features data
	const features: Feature[] = [
		{
			icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
			iconColor: 'emerald',
			title: '📞 Real Calls',
			description:
				'Make actual phone calls to real numbers with AI handling the entire conversation'
		},
		{
			icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
			iconColor: 'blue',
			title: '💬 Live Transcript',
			description:
				'Watch the conversation unfold in real-time with live speech-to-text transcription'
		},
		{
			icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
			iconColor: 'purple',
			title: '🤖 AI Analysis',
			description:
				'Intelligent post-call analysis extracts structured data and insights from conversations'
		}
	];

	// Icon color mapping for snippets
	const iconColorClasses: Record<IconColor, string> = {
		emerald: 'bg-emerald-100 text-emerald-600',
		blue: 'bg-blue-100 text-blue-600',
		purple: 'bg-purple-100 text-purple-600'
	};

	// Handle navigation
	function handleDemoClick() {
		window.location.href = demoHref;
	}
</script>

<!-- Snippet: Feature Icon -->
{#snippet featureIcon(icon: string, iconColor: IconColor)}
	<div
		class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg {iconColorClasses[
			iconColor
		]}"
	>
		<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={icon}></path>
		</svg>
	</div>
{/snippet}

<!-- Snippet: Feature Card Content -->
{#snippet featureCard(feature: Feature)}
	<div class="text-center">
		{@render featureIcon(feature.icon, feature.iconColor)}
		<h3 class="mb-2 text-lg font-semibold text-slate-900">{feature.title}</h3>
		<p class="text-sm text-slate-600">
			{feature.description}
		</p>
	</div>
{/snippet}

<!-- Snippet: Demo Header -->
{#snippet demoHeader()}
	<div class="bg-gradient-to-r from-emerald-50 to-blue-50 px-4 py-6 sm:px-6 sm:py-8">
		<div class="text-center">
			<h2 class="text-xl font-bold text-slate-900 sm:text-2xl">Live AI Phone Call Demo</h2>
			<p class="mt-2 text-sm text-slate-600 sm:text-base">
				Watch AI make real phone calls with natural conversation flow
			</p>
		</div>
	</div>
{/snippet}

<!-- Snippet: Demo CTA -->
{#snippet demoCTA()}
	<div class="mt-6 text-center sm:mt-8">
		<Button onclick={handleDemoClick} variant="primary" class="w-full px-6 py-3 sm:w-auto">🚀 Start Demo</Button>
	</div>
{/snippet}

<!-- Demo Preview -->
<div class="mx-auto mt-12 max-w-6xl px-4 sm:mt-16">
	<Card class="overflow-hidden">
		{@render demoHeader()}
		<div class="p-4 sm:p-6">
			<div class="grid gap-4 sm:gap-6 md:grid-cols-3">
				{#each features as feature}
					{@render featureCard(feature)}
				{/each}
			</div>

			{@render demoCTA()}
		</div>
	</Card>
</div>
