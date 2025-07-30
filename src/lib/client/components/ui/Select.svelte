<!--
  Select Component
  
  A reusable select component that follows the HCP event management design system.
  Supports validation states, labels, and options.
-->

<script lang="ts">
	interface Option {
		value: string | number;
		label: string;
		disabled?: boolean;
	}

	interface Props {
		value?: string | number;
		options: Option[];
		placeholder?: string;
		label?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string;
		help?: string;
		class?: string;
		id?: string;
		name?: string;
		onchange?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		options,
		placeholder = 'Select an option',
		label,
		required = false,
		disabled = false,
		error,
		help,
		class: className = '',
		id,
		name,
		onchange
	}: Props = $props();

	// Generate unique ID if not provided
	const selectId = $derived(id || `select-${Math.random().toString(36).substr(2, 9)}`);

	// Base select classes
	const baseClasses =
		'block w-full rounded-lg border shadow-sm focus:ring-2 focus:ring-offset-0 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

	// State classes
	const stateClasses = $derived(
		error
			? 'border-red-300 focus:border-red-500 focus:ring-red-500 text-red-900'
			: 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500'
	);

	// Size classes
	const sizeClasses = 'px-3 py-2 text-sm';

	// Combine all classes
	const allClasses = $derived(`${baseClasses} ${stateClasses} ${sizeClasses} ${className}`);

	function handleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const newValue = target.value;
		value = newValue;
		if (onchange) {
			onchange(newValue);
		}
	}
</script>

<div class="space-y-1">
	{#if label}
		<label for={selectId} class="block text-sm font-medium text-slate-700">
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	<select
		id={selectId}
		{name}
		{required}
		{disabled}
		class={allClasses}
		bind:value
		onchange={handleChange}
	>
		{#if placeholder}
			<option value="" disabled>
				{placeholder}
			</option>
		{/if}

		{#each options as option}
			<option value={option.value} disabled={option.disabled}>
				{option.label}
			</option>
		{/each}
	</select>

	{#if error}
		<p class="text-xs text-red-600">{error}</p>
	{:else if help}
		<p class="text-xs text-slate-500">{help}</p>
	{/if}
</div>
