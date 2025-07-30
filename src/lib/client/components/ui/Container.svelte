<!--
  Container Component
  
  A reusable container component for consistent layout and spacing.
  Provides responsive padding and max-width constraints.
-->

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
		padding?: 'none' | 'sm' | 'md' | 'lg';
		center?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		size = 'lg',
		padding = 'md',
		center = true,
		class: className = '',
		children
	}: Props = $props();

	// Size classes for max-width
	const sizeClasses = {
		sm: 'max-w-2xl',
		md: 'max-w-4xl',
		lg: 'max-w-6xl',
		xl: 'max-w-7xl',
		full: 'max-w-full'
	};

	// Padding classes
	const paddingClasses = {
		none: '',
		sm: 'px-4 py-4 sm:px-6',
		md: 'px-4 py-6 sm:px-6 lg:px-8',
		lg: 'px-4 py-8 sm:px-6 lg:px-8 lg:py-12'
	};

	const allClasses = $derived(
		`
		${sizeClasses[size]}
		${paddingClasses[padding]}
		${center ? 'mx-auto' : ''}
		${className}
	`
			.trim()
			.replace(/\s+/g, ' ')
	);
</script>

<div class={allClasses}>
	{@render children?.()}
</div>
