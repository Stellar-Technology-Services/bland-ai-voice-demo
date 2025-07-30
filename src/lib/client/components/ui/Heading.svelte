<!--
  Heading Component
  
  A reusable heading component that provides consistent typography hierarchy.
  Supports different levels, weights, and semantic HTML elements.
-->

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		level?: 1 | 2 | 3 | 4 | 5 | 6;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
		weight?: 'normal' | 'medium' | 'semibold' | 'bold';
		color?: 'slate' | 'emerald' | 'blue' | 'red' | 'yellow';
		as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span';
		class?: string;
		children?: Snippet;
	}

	let {
		level = 1,
		size,
		weight = 'semibold',
		color = 'slate',
		as,
		class: className = '',
		children
	}: Props = $props();

	// Default sizes based on level if size not specified
	const defaultSizes = {
		1: '3xl',
		2: '2xl',
		3: 'xl',
		4: 'lg',
		5: 'md',
		6: 'sm'
	} as const;

	// Determine element tag - use 'as' prop or default to h{level}
	const element = as || `h${level}`;

	// Determine size - use size prop or default based on level
	const actualSize = size || defaultSizes[level];

	// Size classes
	const sizeClasses = {
		xs: 'text-xs',
		sm: 'text-sm',
		md: 'text-base',
		lg: 'text-lg',
		xl: 'text-xl',
		'2xl': 'text-2xl',
		'3xl': 'text-3xl',
		'4xl': 'text-4xl'
	};

	// Weight classes
	const weightClasses = {
		normal: 'font-normal',
		medium: 'font-medium',
		semibold: 'font-semibold',
		bold: 'font-bold'
	};

	// Color classes
	const colorClasses = {
		slate: 'text-slate-900',
		emerald: 'text-emerald-600',
		blue: 'text-blue-600',
		red: 'text-red-600',
		yellow: 'text-yellow-600'
	};

	// Additional styling based on level for improved hierarchy
	const levelClasses = {
		1: 'tracking-tight',
		2: 'tracking-tight',
		3: '',
		4: '',
		5: '',
		6: 'uppercase tracking-wide'
	};

	const allClasses = $derived(
		`
		${sizeClasses[actualSize]}
		${weightClasses[weight]}
		${colorClasses[color]}
		${levelClasses[level]}
		${className}
	`
			.trim()
			.replace(/\s+/g, ' ')
	);
</script>

<svelte:element this={element} class={allClasses}>
	{@render children?.()}
</svelte:element>
