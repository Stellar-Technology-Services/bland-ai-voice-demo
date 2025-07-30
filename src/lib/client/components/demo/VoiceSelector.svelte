<!--
  Voice Selector Component
  
  Dropdown for selecting the AI agent's voice from available high-quality voice options.
-->

<script lang="ts">
	import Tooltip from '../ui/Tooltip.svelte';

	// Component props
	let {
		value = $bindable(''),
		disabled = false,
		label = 'AI Agent Voice',
		helpText = 'Choose the voice personality for your AI agent'
	} = $props();

	// Available voice options from Bland AI
	const voiceOptions = [
		{ value: '', label: 'Default Voice' },
		{ value: 'alexa', label: 'Alexa - Young & Perky' },
		{ value: 'june', label: 'June - American Female' },
		{ value: 'paige', label: 'Paige - Calm & Soft-Spoken' },
		{ value: 'allie', label: 'Allie - Neutral American' },
		{ value: 'alena', label: 'Alena - Upbeat & Engaged' },
		{ value: 'pryce', label: 'Pryce - Professional Male' },
		{ value: 'bonnie', label: 'Bonnie - Australian Female' },
		{ value: 'brady', label: 'Brady - Gentle American Male' },
		{ value: 'keelan', label: 'Keelan - British Professional' },
		{ value: 'maeve', label: 'Maeve - Versatile Voice' }
	];
</script>

<!-- Voice Selection -->
<div>
	<label for="voice" class="mb-2 block flex items-center gap-1 text-sm font-medium text-slate-700">
		{label}
		<Tooltip
			content="Select the AI agent's voice personality. Each voice has different characteristics and quality ratings. Higher star ratings indicate better voice quality and naturalness."
			position="top"
		>
			{#snippet children()}
				<svg
					class="h-3 w-3 cursor-help text-slate-400 hover:text-slate-600"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
						clip-rule="evenodd"
					/>
				</svg>
			{/snippet}
		</Tooltip>
	</label>
	<select
		id="voice"
		bind:value
		class="w-full rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
		{disabled}
	>
		{#each voiceOptions as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
	{#if helpText}
		<p class="mt-1 text-xs text-slate-500">{helpText}</p>
	{/if}
</div>
