<!--
  Demo Header Component
  
  Simple header for the AI phone call demo page.
-->

<script lang="ts">
	// Component props
	let {
		title = 'AI Phone Call Demo',
		subtitle = 'Watch AI Agents Make Real Phone Calls',
		description = 'Experience AI-powered conversations. Configure your AI agent and watch as it handles phone interactions with human-like intelligence.'
	} = $props();
</script>

<!-- Simple Demo Header -->
<div class="border-b border-slate-200 bg-white">
	<div class="mx-auto max-w-4xl px-4 py-8 text-center sm:px-6 lg:px-8">
		<h1 class="text-3xl font-bold text-slate-900 sm:text-4xl">
			{title}
		</h1>

		<p class="mt-4 text-lg font-medium text-emerald-600">
			{subtitle}
		</p>

		<p class="mx-auto mt-4 max-w-2xl text-slate-600">
			{description}
		</p>
	</div>
</div>
