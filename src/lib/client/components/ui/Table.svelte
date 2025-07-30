<!-- Helper components that can be exported -->
<script module lang="ts">
	export interface TableHeaderProps {
		class?: string;
		children?: Snippet;
	}

	export interface TableRowProps {
		class?: string;
		children?: Snippet;
	}

	export interface TableCellProps {
		as?: 'td' | 'th';
		class?: string;
		children?: Snippet;
	}
</script>

<!--
  Table Component
  
  A reusable table component for displaying structured data.
  Supports different sizes, striped rows, and responsive design.
-->

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		size?: 'sm' | 'md' | 'lg';
		striped?: boolean;
		hover?: boolean;
		bordered?: boolean;
		responsive?: boolean;
		class?: string;
		caption?: string;
		children?: Snippet;
		header?: Snippet;
		body?: Snippet;
		footer?: Snippet;
	}

	let {
		size = 'md',
		striped = false,
		hover = false,
		bordered = false,
		responsive = true,
		class: className = '',
		caption = '',
		children,
		header,
		body,
		footer
	}: Props = $props();

	// Size classes
	const sizeClasses = {
		sm: 'text-xs',
		md: 'text-sm',
		lg: 'text-base'
	};

	// Base table classes
	const baseClasses = 'min-w-full divide-y divide-slate-200';

	// Additional table classes
	const additionalClasses = $derived(() => {
		let classes = [];
		if (bordered) classes.push('border border-slate-200');
		return classes.join(' ');
	});

	// Header classes
	const headerClasses = 'bg-slate-50';

	// Body row classes
	const getRowClasses = (isEven: boolean) => {
		let classes = [];
		if (striped && isEven) classes.push('bg-slate-50');
		if (hover) classes.push('hover:bg-slate-50');
		return classes.join(' ');
	};

	// Cell padding based on size
	const getCellPadding = () => {
		switch (size) {
			case 'sm':
				return 'px-3 py-2';
			case 'md':
				return 'px-4 py-3';
			case 'lg':
				return 'px-6 py-4';
			default:
				return 'px-4 py-3';
		}
	};

	const tableClasses = $derived(
		`
		${baseClasses} 
		${sizeClasses[size]} 
		${additionalClasses()} 
		${className}
	`.trim()
	);

	const wrapperClasses = responsive
		? 'overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg'
		: 'shadow ring-1 ring-black ring-opacity-5 rounded-lg';
</script>

<div class={wrapperClasses}>
	<table class={tableClasses}>
		{#if caption}
			<caption class="sr-only">{caption}</caption>
		{/if}

		{#if header}
			<thead class={headerClasses}>
				{@render header()}
			</thead>
		{/if}

		{#if body}
			<tbody class="divide-y divide-slate-200 bg-white">
				{@render body()}
			</tbody>
		{/if}

		{#if footer}
			<tfoot class="bg-slate-50">
				{@render footer()}
			</tfoot>
		{/if}

		{#if children}
			{@render children()}
		{/if}
	</table>
</div>
