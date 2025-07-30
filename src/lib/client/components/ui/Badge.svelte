<!--
  Badge Component
  
  A reusable badge component for status indicators, labels, and tags.
  Supports different variants and sizes.
-->

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		children?: Snippet;
	}

	let { variant = 'default', size = 'md', class: className = '', children }: Props = $props();

	// Base badge classes
	const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full';

	// Variant classes
	const variantClasses = {
		default: 'bg-slate-100 text-slate-800',
		primary: 'bg-emerald-100 text-emerald-800',
		success: 'bg-green-100 text-green-800',
		warning: 'bg-yellow-100 text-yellow-800',
		danger: 'bg-red-100 text-red-800',
		info: 'bg-blue-100 text-blue-800',
		outline: 'bg-transparent border border-slate-300 text-slate-700'
	};

	// Size classes
	const sizeClasses = {
		sm: 'px-2 py-0.5 text-xs',
		md: 'px-2.5 py-1 text-xs',
		lg: 'px-3 py-1.5 text-sm'
	};

	// Combine all classes
	const allClasses = $derived(
		`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
	);
</script>

<span class={allClasses}>
	{@render children?.()}
</span>
