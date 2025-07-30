<!--
  Advanced Settings Component
  
  Collapsible panel with advanced Bland AI call configuration options.
  Uses Svelte 5 snippets for consistent form field patterns with informational tooltips.
-->

<script lang="ts">
	import Tooltip from '../ui/Tooltip.svelte';

	// Component props
	let {
		settings = $bindable({}),
		disabled = false,
		expanded = $bindable(false)
	}: {
		settings: any;
		disabled?: boolean;
		expanded?: boolean;
	} = $props();
</script>

<!-- Snippet: Text Input Field with Tooltip -->
{#snippet textInput(id: string, label: string, tooltip: string, placeholder = '', type = 'text')}
	<div>
		<label for={id} class="mb-1 block text-xs font-medium text-slate-600 flex items-center gap-1">
			{label}
			<Tooltip content={tooltip} position="top">
				{#snippet children()}
					<svg class="h-3 w-3 text-slate-400 hover:text-slate-600 cursor-help" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
					</svg>
				{/snippet}
			</Tooltip>
		</label>
		<input
			{id}
			{type}
			bind:value={settings[id]}
			{placeholder}
			class="w-full rounded border-slate-300 text-sm"
			{disabled}
		/>
	</div>
{/snippet}

<!-- Snippet: Number Input Field with Tooltip -->
{#snippet numberInput(id: string, label: string, tooltip: string, min = 0, max = 100, step = 1)}
	<div>
		<label for={id} class="mb-1 block text-xs font-medium text-slate-600 flex items-center gap-1">
			{label}
			<Tooltip content={tooltip} position="top">
				{#snippet children()}
					<svg class="h-3 w-3 text-slate-400 hover:text-slate-600 cursor-help" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
					</svg>
				{/snippet}
			</Tooltip>
		</label>
		<input
			{id}
			type="number"
			bind:value={settings[id]}
			{min}
			{max}
			{step}
			class="w-full rounded border-slate-300 text-sm"
			{disabled}
		/>
	</div>
{/snippet}

<!-- Snippet: Select Dropdown with Tooltip -->
{#snippet selectInput(id: string, label: string, tooltip: string, options: Array<{ value: string; label: string }>)}
	<div>
		<label for={id} class="mb-1 block text-xs font-medium text-slate-600 flex items-center gap-1">
			{label}
			<Tooltip content={tooltip} position="top">
				{#snippet children()}
					<svg class="h-3 w-3 text-slate-400 hover:text-slate-600 cursor-help" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
					</svg>
				{/snippet}
			</Tooltip>
		</label>
		<select
			{id}
			bind:value={settings[id]}
			class="w-full rounded border-slate-300 text-sm"
			{disabled}
		>
			{#each options as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</div>
{/snippet}

<!-- Snippet: Checkbox Input with Tooltip -->
{#snippet checkboxInput(id: string, label: string, tooltip: string)}
	<label class="flex items-center space-x-2">
		<input
			type="checkbox"
			bind:checked={settings[id]}
			class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
			{disabled}
		/>
		<span class="text-sm text-slate-600 flex items-center gap-1">
			{label}
			<Tooltip content={tooltip} position="top">
				{#snippet children()}
					<svg class="h-3 w-3 text-slate-400 hover:text-slate-600 cursor-help" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
					</svg>
				{/snippet}
			</Tooltip>
		</span>
	</label>
{/snippet}

<!-- Advanced Settings Collapsible -->
<div class="border-t border-slate-200 pt-4">
	<button
		type="button"
		onclick={() => (expanded = !expanded)}
		class="flex w-full items-center justify-between text-sm font-medium text-slate-700 hover:text-slate-900"
		{disabled}
	>
		<span>Advanced Settings</span>
		<svg
			class="h-4 w-4 transform transition-transform {expanded ? 'rotate-180' : ''}"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"
			></path>
		</svg>
	</button>

	{#if expanded}
		<div class="mt-4 space-y-4">
			<!-- Model & Language -->
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				{@render selectInput('model', 'AI Model', 'Choose the AI model for processing. Enhanced offers better understanding, Turbo is faster, Base is standard.', [
					{ value: '', label: 'Default' },
					{ value: 'enhanced', label: 'Enhanced' },
					{ value: 'turbo', label: 'Turbo' },
					{ value: 'base', label: 'Base' }
				])}

				{@render selectInput('language', 'Language', 'Select the primary language for the AI conversation and speech recognition.', [
					{ value: 'eng', label: 'English' },
					{ value: 'esp', label: 'Spanish' },
					{ value: 'fra', label: 'French' },
					{ value: 'deu', label: 'German' },
					{ value: 'ita', label: 'Italian' }
				])}
			</div>

			<!-- Behavior Settings -->
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				{@render numberInput('temperature', 'Temperature', 'Controls AI creativity. Lower values (0-0.5) are more focused, higher values (0.5-2) are more creative.', 0, 2, 0.1)}
				{@render numberInput('interruption_threshold', 'Interruption Threshold', 'Milliseconds of silence before AI speaks. Lower values make AI more responsive but may interrupt user.', 0, 1000, 1)}
				{@render numberInput('max_duration', 'Max Duration (min)', 'Maximum call length in minutes. Call will automatically end after this duration.', 1, 60, 1)}
			</div>

			<!-- Call Configuration -->
			<div class="grid grid-cols-1 gap-4">
				{@render textInput('timezone', 'Timezone', 'Timezone for scheduling and time-aware responses. Use standard timezone identifiers.', 'America/New_York')}
			</div>

			<!-- Audio Settings -->
			<div class="space-y-3">
				<h4 class="text-sm font-medium text-slate-700">Audio Settings</h4>
				<div class="flex flex-wrap gap-4">
					{@render checkboxInput('wait_for_greeting', 'Wait for greeting', 'AI will wait for the recipient to say hello before starting the conversation.')}
					{@render checkboxInput('noise_cancellation', 'Noise cancellation', 'Enable advanced noise reduction for clearer audio quality during the call.')}
					{@render checkboxInput('record', 'Record call', 'Save audio recording of the call. Check local regulations for recording consent requirements.')}
					{@render checkboxInput('block_interruptions', 'Block interruptions', 'Prevent the AI from being interrupted while speaking. May feel less natural.')}
				</div>
			</div>

			<!-- Advanced Features -->
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				{@render textInput('first_sentence', 'First Sentence', 'The opening line the AI will use to start the conversation. Keep it natural and engaging.', 'Hello, how are you today?')}
				{@render textInput('webhook', 'Webhook URL', 'HTTP endpoint to receive real-time call events and transcripts. Must be a valid HTTPS URL.', 'https://example.com/webhook', 'url')}
			</div>

			<!-- Keywords -->
			<div>
				{@render textInput('keywords', 'Keywords', 'Comma-separated keywords to listen for during the call. Useful for tracking specific topics or responses.', 'pizza, order, delivery')}
			</div>
		</div>
	{/if}
</div>
