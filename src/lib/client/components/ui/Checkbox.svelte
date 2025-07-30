<!--
  Checkbox Component
  
  A reusable checkbox component with consistent styling and accessibility.
  Supports different sizes, states, and indeterminate state.
-->

<script lang="ts">
	interface Props {
		checked?: boolean;
		indeterminate?: boolean;
		disabled?: boolean;
		required?: boolean;
		label?: string;
		description?: string;
		error?: string;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		id?: string;
		name?: string;
		value?: string;
		onchange?: (checked: boolean) => void;
	}

	let {
		checked = $bindable(false),
		indeterminate = false,
		disabled = false,
		required = false,
		label = '',
		description = '',
		error = '',
		size = 'md',
		class: className = '',
		id,
		name,
		value,
		onchange
	}: Props = $props();

	// Generate unique ID if not provided
	const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

	// Size classes
	const sizeClasses = {
		sm: 'h-4 w-4',
		md: 'h-5 w-5',
		lg: 'h-6 w-6'
	};

	// Base classes
	const baseClasses = `
		rounded border-slate-300 text-emerald-600
		focus:ring-emerald-500 focus:ring-offset-0 focus:ring-2
		transition-colors duration-200
	`;

	// State-based classes
	const stateClasses = $derived(() => {
		if (error) {
			return 'border-red-300 text-red-600 focus:ring-red-500';
		}
		if (disabled) {
			return 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed';
		}
		return 'border-slate-300 text-emerald-600 focus:ring-emerald-500';
	});

	const allClasses = $derived(
		`
		${baseClasses}
		${sizeClasses[size]}
		${stateClasses()}
		${className}
	`
			.trim()
			.replace(/\s+/g, ' ')
	);

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		checked = target.checked;
		if (onchange) onchange(checked);
	}

	// Handle indeterminate state
	let checkboxElement: HTMLInputElement;
	$effect(() => {
		if (checkboxElement) {
			checkboxElement.indeterminate = indeterminate;
		}
	});
</script>

<div class="flex items-start space-x-3">
	<div class="flex h-5 items-center">
		<input
			bind:this={checkboxElement}
			{id}
			{name}
			{value}
			{disabled}
			{required}
			{checked}
			type="checkbox"
			class={allClasses}
			aria-invalid={error ? 'true' : 'false'}
			aria-describedby={error
				? `${checkboxId}-error`
				: description
					? `${checkboxId}-description`
					: undefined}
			onchange={handleChange}
		/>
	</div>

	{#if label || description || error}
		<div class="flex-1">
			{#if label}
				<label for={checkboxId} class="block cursor-pointer text-sm font-medium text-slate-900">
					{label}
					{#if required}
						<span class="text-red-500">*</span>
					{/if}
				</label>
			{/if}

			{#if description}
				<p id="{checkboxId}-description" class="mt-1 text-xs text-slate-500">
					{description}
				</p>
			{/if}

			{#if error}
				<p id="{checkboxId}-error" class="mt-1 text-xs text-red-600">
					{error}
				</p>
			{/if}
		</div>
	{/if}
</div>
