<!--
  Input Component
  
  A reusable input component that follows the HCP event management design system.
  Supports various input types, validation states, and labels.
-->

<script lang="ts">
	interface Props {
		type?:
			| 'text'
			| 'email'
			| 'password'
			| 'number'
			| 'tel'
			| 'url'
			| 'date'
			| 'datetime-local'
			| 'time';
		value?: string | number;
		placeholder?: string;
		label?: string;
		required?: boolean;
		disabled?: boolean;
		readonly?: boolean;
		error?: string;
		help?: string;
		class?: string;
		id?: string;
		name?: string;
		onchange?: (value: string) => void;
		oninput?: (value: string) => void;
	}

	let {
		type = 'text',
		value = $bindable(''),
		placeholder,
		label,
		required = false,
		disabled = false,
		readonly = false,
		error,
		help,
		class: className = '',
		id,
		name,
		onchange,
		oninput
	}: Props = $props();

	// Generate unique ID if not provided
	const inputId = $derived(id || `input-${Math.random().toString(36).substr(2, 9)}`);

	// Base input classes
	const baseClasses =
		'block w-full rounded-lg border shadow-sm focus:ring-2 focus:ring-offset-0 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

	// State classes
	const stateClasses = $derived(
		error
			? 'border-red-300 focus:border-red-500 focus:ring-red-500 text-red-900 placeholder:text-red-400'
			: 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 placeholder:text-slate-400'
	);

	// Size classes
	const sizeClasses = 'px-3 py-2 text-sm';

	// Combine all classes
	const allClasses = $derived(`${baseClasses} ${stateClasses} ${sizeClasses} ${className}`);

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const newValue = target.value;
		value = newValue;
		if (oninput) {
			oninput(newValue);
		}
	}

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const newValue = target.value;
		if (onchange) {
			onchange(newValue);
		}
	}
</script>

<div class="space-y-1">
	{#if label}
		<label for={inputId} class="block text-sm font-medium text-slate-700">
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	<input
		{id}
		{name}
		{type}
		{placeholder}
		{required}
		{disabled}
		{readonly}
		class={allClasses}
		bind:value
		oninput={handleInput}
		onchange={handleChange}
	/>

	{#if error}
		<p class="text-xs text-red-600">{error}</p>
	{:else if help}
		<p class="text-xs text-slate-500">{help}</p>
	{/if}
</div>
