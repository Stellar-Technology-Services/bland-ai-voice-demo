<!--
  Card Component
  
  A reusable card component that follows the HCP event management design system.
  Supports different variants and interactive states.
-->

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'default' | 'interactive' | 'elevated';
		padding?: 'sm' | 'md' | 'lg' | 'none';
		class?: string;
		onclick?: () => void;
		children?: Snippet;
		header?: Snippet;
		footer?: Snippet;
	}

	let {
		variant = 'default',
		padding = 'md',
		class: className = '',
		onclick,
		children,
		header,
		footer
	}: Props = $props();

	// Base card classes
	const baseClasses = 'bg-white rounded-xl border border-slate-200 overflow-hidden';

	// Variant classes
	const variantClasses = {
		default: 'shadow-sm',
		interactive: 'shadow-sm hover:shadow-md cursor-pointer transition-shadow duration-200',
		elevated: 'shadow-md'
	};

	// Padding classes
	const paddingClasses = {
		none: '',
		sm: 'p-4',
		md: 'p-6',
		lg: 'p-8'
	};

	// Combine all classes
	const allClasses = $derived(`${baseClasses} ${variantClasses[variant]} ${className}`);

	const contentClasses = $derived(paddingClasses[padding]);
</script>

<svelte:element
	this={onclick ? 'button' : 'div'}
	class={allClasses}
	onclick={() => onclick?.()}
	type={onclick ? 'button' : undefined}
	role={onclick ? 'button' : undefined}
>
	{#if header}
		<div class="border-b border-slate-200 px-6 py-4">
			{@render header()}
		</div>
	{/if}

	<div class={contentClasses}>
		{@render children?.()}
	</div>

	{#if footer}
		<div class="border-t border-slate-200 bg-slate-50 px-6 py-4">
			{@render footer()}
		</div>
	{/if}
</svelte:element>
