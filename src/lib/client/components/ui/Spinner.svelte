<!--
  Spinner Component
  
  A reusable loading spinner component with different sizes and colors.
  Can be used inline or as an overlay for loading states.
-->

<script lang="ts">
	interface Props {
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		color?: 'current' | 'slate' | 'emerald' | 'blue' | 'white';
		label?: string;
		overlay?: boolean;
		class?: string;
	}

	let {
		size = 'md',
		color = 'current',
		label = 'Loading...',
		overlay = false,
		class: className = ''
	}: Props = $props();

	// Size classes
	const sizeClasses = {
		xs: 'h-3 w-3',
		sm: 'h-4 w-4',
		md: 'h-6 w-6',
		lg: 'h-8 w-8',
		xl: 'h-12 w-12'
	};

	// Color classes
	const colorClasses = {
		current: 'text-current',
		slate: 'text-slate-600',
		emerald: 'text-emerald-600',
		blue: 'text-blue-600',
		white: 'text-white'
	};

	const spinnerClasses = $derived(
		`
		animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}
	`.trim()
	);

	const overlayClasses =
		'fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50';
	const inlineClasses = 'flex items-center justify-center';
</script>

{#if overlay}
	<div class={overlayClasses}>
		<div class="flex flex-col items-center space-y-3">
			<svg
				class={spinnerClasses}
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
			{#if label}
				<span class="text-sm text-slate-600">{label}</span>
			{/if}
		</div>
	</div>
{:else}
	<div class={inlineClasses}>
		<svg
			class={spinnerClasses}
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
			></circle>
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
		{#if label}
			<span class="ml-2 text-sm text-slate-600">{label}</span>
		{/if}
	</div>
{/if}

<!-- Screen reader only text -->
<span class="sr-only">{label}</span>
