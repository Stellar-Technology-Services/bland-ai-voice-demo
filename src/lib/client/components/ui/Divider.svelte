<!--
  Divider Component
  
  A reusable divider component for creating visual separation between content.
  Supports horizontal and vertical orientations, different styles, and optional labels.
-->

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		orientation?: 'horizontal' | 'vertical';
		variant?: 'solid' | 'dashed' | 'dotted';
		thickness?: 'thin' | 'medium' | 'thick';
		color?: 'slate' | 'gray' | 'emerald' | 'blue';
		spacing?: 'sm' | 'md' | 'lg';
		label?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		orientation = 'horizontal',
		variant = 'solid',
		thickness = 'thin',
		color = 'slate',
		spacing = 'md',
		label = '',
		class: className = '',
		children
	}: Props = $props();

	// Thickness classes
	const thicknessClasses = {
		horizontal: {
			thin: 'border-t',
			medium: 'border-t-2',
			thick: 'border-t-4'
		},
		vertical: {
			thin: 'border-l',
			medium: 'border-l-2',
			thick: 'border-l-4'
		}
	};

	// Color classes
	const colorClasses = {
		slate: 'border-slate-200',
		gray: 'border-gray-200',
		emerald: 'border-emerald-200',
		blue: 'border-blue-200'
	};

	// Variant classes
	const variantClasses = {
		solid: '',
		dashed: 'border-dashed',
		dotted: 'border-dotted'
	};

	// Spacing classes
	const spacingClasses = {
		horizontal: {
			sm: 'my-2',
			md: 'my-4',
			lg: 'my-8'
		},
		vertical: {
			sm: 'mx-2',
			md: 'mx-4',
			lg: 'mx-8'
		}
	};

	// Height/width for vertical dividers
	const dimensionClasses = orientation === 'vertical' ? 'h-full' : 'w-full';

	const dividerClasses = $derived(
		`
		${thicknessClasses[orientation][thickness]}
		${colorClasses[color]}
		${variantClasses[variant]}
		${spacingClasses[orientation][spacing]}
		${dimensionClasses}
		${className}
	`
			.trim()
			.replace(/\s+/g, ' ')
	);

	// Label container classes
	const labelContainerClasses =
		orientation === 'horizontal'
			? 'relative flex items-center'
			: 'relative flex flex-col items-center';

	const labelClasses =
		orientation === 'horizontal'
			? 'flex-shrink-0 bg-white px-4 text-sm text-slate-500'
			: 'flex-shrink-0 bg-white py-2 text-sm text-slate-500';

	const labelDividerClasses =
		orientation === 'horizontal'
			? 'flex-grow border-t border-slate-200'
			: 'flex-grow border-l border-slate-200';
</script>

{#if label || children}
	<div class="{labelContainerClasses} {spacingClasses[orientation][spacing]} {className}">
		{#if orientation === 'horizontal'}
			<div class={labelDividerClasses}></div>
			<div class={labelClasses}>
				{#if children}
					{@render children()}
				{:else}
					{label}
				{/if}
			</div>
			<div class={labelDividerClasses}></div>
		{:else}
			<div class={labelDividerClasses}></div>
			<div class={labelClasses}>
				{#if children}
					{@render children()}
				{:else}
					{label}
				{/if}
			</div>
			<div class={labelDividerClasses}></div>
		{/if}
	</div>
{:else}
	<div class={dividerClasses}></div>
{/if}
