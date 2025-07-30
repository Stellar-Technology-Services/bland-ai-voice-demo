<!--
  Textarea Component
  
  A reusable textarea component with consistent styling and accessibility features.
  Supports different sizes, states, and validation.
-->

<script lang="ts">
	interface Props {
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		required?: boolean;
		readonly?: boolean;
		error?: string;
		label?: string;
		description?: string;
		rows?: number;
		maxlength?: number;
		resize?: 'none' | 'vertical' | 'horizontal' | 'both';
		class?: string;
		id?: string;
		name?: string;
		onchange?: (value: string) => void;
		oninput?: (value: string) => void;
		onfocus?: () => void;
		onblur?: () => void;
	}

	let {
		value = $bindable(''),
		placeholder = '',
		disabled = false,
		required = false,
		readonly = false,
		error = '',
		label = '',
		description = '',
		rows = 4,
		maxlength,
		resize = 'vertical',
		class: className = '',
		id,
		name,
		onchange,
		oninput,
		onfocus,
		onblur
	}: Props = $props();

	// Generate unique ID if not provided
	const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

	// Base classes
	const baseClasses = `
		block w-full rounded-lg border shadow-sm
		placeholder:text-slate-400 sm:text-sm
		transition-colors duration-200
		focus:outline-none focus:ring-2 focus:ring-offset-0
	`;

	// State-based classes
	const stateClasses = $derived(() => {
		if (error) {
			return 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500';
		}
		if (disabled) {
			return 'border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed';
		}
		return 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500';
	});

	// Resize classes
	const resizeClasses = {
		none: 'resize-none',
		vertical: 'resize-y',
		horizontal: 'resize-x',
		both: 'resize'
	};

	const allClasses = $derived(
		`
		${baseClasses}
		${stateClasses()}
		${resizeClasses[resize]}
		${className}
	`
			.trim()
			.replace(/\s+/g, ' ')
	);

	function handleInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		value = target.value;
		if (oninput) oninput(value);
	}

	function handleChange(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		value = target.value;
		if (onchange) onchange(value);
	}
</script>

<div>
	{#if label}
		<label for={textareaId} class="mb-1 block text-sm font-medium text-slate-700">
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	{#if description}
		<p class="mb-2 text-xs text-slate-500">{description}</p>
	{/if}

	<textarea
		{id}
		{name}
		{placeholder}
		{disabled}
		{required}
		{readonly}
		{rows}
		{maxlength}
		{value}
		class={allClasses}
		aria-invalid={error ? 'true' : 'false'}
		aria-describedby={error ? `${textareaId}-error` : undefined}
		oninput={handleInput}
		onchange={handleChange}
		onfocus={() => onfocus?.()}
		onblur={() => onblur?.()}
	></textarea>

	{#if error}
		<p id="{textareaId}-error" class="mt-1 text-xs text-red-600">
			{error}
		</p>
	{/if}
</div>
