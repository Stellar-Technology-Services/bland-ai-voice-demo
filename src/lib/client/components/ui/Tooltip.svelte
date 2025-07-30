<!--
  Tooltip Component
  
  Reusable tooltip component that displays informational text on hover/focus.
  Follows design system patterns with proper positioning and accessibility.
-->

<script lang="ts">
	// Component props
	let {
		content = '',
		position = 'top',
		disabled = false,
		class: className = '',
		children
	}: {
		content: string;
		position?: 'top' | 'bottom' | 'left' | 'right';
		disabled?: boolean;
		class?: string;
		children: any;
	} = $props();

	// State management
	let showTooltip = $state(false);
	let tooltipElement = $state<HTMLElement>();
	let triggerElement = $state<HTMLElement>();

	// Position classes based on tooltip position
	const positionClasses = {
		top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
		bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
		left: 'right-full top-1/2 -translate-y-1/2 mr-2',
		right: 'left-full top-1/2 -translate-y-1/2 ml-2'
	};

	// Arrow classes based on tooltip position
	const arrowClasses = {
		top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-slate-900',
		bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-slate-900',
		left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-slate-900',
		right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-slate-900'
	};

	// Event handlers
	function handleMouseEnter() {
		if (!disabled) {
			showTooltip = true;
		}
	}

	function handleMouseLeave() {
		showTooltip = false;
	}

	function handleFocus() {
		if (!disabled) {
			showTooltip = true;
		}
	}

	function handleBlur() {
		showTooltip = false;
	}
</script>

<!-- Tooltip Container -->
<div 
	class="relative inline-block {className}"
	bind:this={triggerElement}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onfocus={handleFocus}
	onblur={handleBlur}
	role="group"
	aria-describedby={showTooltip ? 'tooltip-content' : undefined}
>
	<!-- Trigger Element -->
	{@render children()}
	
	<!-- Tooltip -->
	{#if showTooltip && content && !disabled}
		<div
			bind:this={tooltipElement}
			id="tooltip-content"
			class="absolute z-50 px-3 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg shadow-lg whitespace-nowrap pointer-events-none {positionClasses[position]}"
			role="tooltip"
			aria-hidden="false"
		>
			{content}
			<!-- Arrow -->
			<div 
				class="absolute w-0 h-0 border-4 {arrowClasses[position]}"
			></div>
		</div>
	{/if}
</div> 