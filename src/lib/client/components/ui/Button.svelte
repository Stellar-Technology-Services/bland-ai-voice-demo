<!--
  Button Component
  
  A reusable button component that follows the HCP event management design system.
  Supports different variants, sizes, and states.
-->

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'danger' | 'outline';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		loading?: boolean;
		type?: 'button' | 'submit' | 'reset';
		class?: string;
		onclick?: () => void;
		children?: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		loading = false,
		type = 'button',
		class: className = '',
		onclick,
		children
	}: Props = $props();

	// Base button classes
	const baseClasses =
		'font-medium cursor-pointer rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2';

	// Variant classes
	const variantClasses = {
		primary: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500',
		secondary:
			'bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 focus:ring-emerald-500',
		danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
		outline:
			'bg-transparent hover:bg-slate-50 text-slate-900 border border-slate-300 focus:ring-emerald-500'
	};

	// Size classes
	const sizeClasses = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base'
	};

	// Combine all classes
	const allClasses = $derived(
		`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
	);
</script>

<button
	{type}
	{disabled}
	class={allClasses}
	onclick={() => {
		if (!disabled && !loading && onclick) {
			onclick();
		}
	}}
>
	{#if loading}
		<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24">
			<circle
				class="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				stroke-width="4"
				fill="none"
			></circle>
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
		<span>Loading...</span>
	{:else}
		{@render children?.()}
	{/if}
</button>
