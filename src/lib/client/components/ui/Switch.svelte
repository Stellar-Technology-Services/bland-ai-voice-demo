<!--
  Switch Component
  
  A reusable toggle switch component for boolean form controls.
  Supports different sizes, states, and smooth animations.
-->

<script lang="ts">
	interface Props {
		checked?: boolean;
		disabled?: boolean;
		size?: 'sm' | 'md' | 'lg';
		color?: 'emerald' | 'blue' | 'purple' | 'red';
		label?: string;
		description?: string;
		id?: string;
		name?: string;
		class?: string;
		onchange?: (checked: boolean) => void;
	}

	let {
		checked = $bindable(false),
		disabled = false,
		size = 'md',
		color = 'emerald',
		label = '',
		description = '',
		id,
		name,
		class: className = '',
		onchange
	}: Props = $props();

	// Generate unique ID if not provided
	const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

	// Size configurations
	const sizeConfig = {
		sm: {
			track: 'h-4 w-7',
			thumb: 'h-3 w-3',
			translate: checked ? 'translate-x-3' : 'translate-x-0.5'
		},
		md: {
			track: 'h-6 w-11',
			thumb: 'h-5 w-5',
			translate: checked ? 'translate-x-5' : 'translate-x-0.5'
		},
		lg: {
			track: 'h-7 w-14',
			thumb: 'h-6 w-6',
			translate: checked ? 'translate-x-7' : 'translate-x-0.5'
		}
	};

	// Color configurations
	const colorConfig = {
		emerald: {
			active: 'bg-emerald-600',
			inactive: 'bg-slate-200',
			focus: 'focus:ring-emerald-500'
		},
		blue: {
			active: 'bg-blue-600',
			inactive: 'bg-slate-200',
			focus: 'focus:ring-blue-500'
		},
		purple: {
			active: 'bg-purple-600',
			inactive: 'bg-slate-200',
			focus: 'focus:ring-purple-500'
		},
		red: {
			active: 'bg-red-600',
			inactive: 'bg-slate-200',
			focus: 'focus:ring-red-500'
		}
	};

	const config = $derived(sizeConfig[size]);
	const colors = $derived(colorConfig[color]);

	// Track classes
	const trackClasses = $derived(
		`
		${config.track}
		${checked ? colors.active : colors.inactive}
		${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
		relative inline-flex flex-shrink-0 rounded-full border-2 border-transparent
		transition-colors duration-200 ease-in-out
		focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.focus}
	`
			.trim()
			.replace(/\s+/g, ' ')
	);

	// Thumb classes
	const thumbClasses = $derived(
		`
		${config.thumb}
		${config.translate}
		pointer-events-none inline-block rounded-full bg-white shadow-lg
		transform ring-0 transition duration-200 ease-in-out
	`
			.trim()
			.replace(/\s+/g, ' ')
	);

	function handleClick() {
		if (disabled) return;
		checked = !checked;
		if (onchange) onchange(checked);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (disabled) return;
		if (event.key === ' ' || event.key === 'Enter') {
			event.preventDefault();
			handleClick();
		}
	}
</script>

<div class="flex items-center {className}">
	<!-- Hidden checkbox for form submission -->
	<input
		{id}
		{name}
		{checked}
		{disabled}
		type="checkbox"
		class="sr-only"
		aria-describedby={description ? `${switchId}-description` : undefined}
	/>

	<!-- Switch toggle -->
	<button
		type="button"
		class={trackClasses}
		role="switch"
		aria-checked={checked}
		aria-labelledby={label ? `${switchId}-label` : undefined}
		aria-describedby={description ? `${switchId}-description` : undefined}
		{disabled}
		onclick={handleClick}
		onkeydown={handleKeyDown}
	>
		<span class={thumbClasses}></span>
	</button>

	<!-- Label and description -->
	{#if label || description}
		<div class="ml-3">
			{#if label}
				<span id="{switchId}-label" class="text-sm font-medium text-slate-900">
					{label}
				</span>
			{/if}
			{#if description}
				<span id="{switchId}-description" class="text-xs text-slate-500 {label ? 'block' : ''}">
					{description}
				</span>
			{/if}
		</div>
	{/if}
</div>
