<!--
  Tabs Component
  
  A reusable tabs component for organizing content into sections.
  Supports different variants and orientations.
-->

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Tab {
		id: string;
		label: string;
		disabled?: boolean;
		count?: number;
		icon?: Snippet;
	}

	interface Props {
		tabs: Tab[];
		activeTab: string;
		variant?: 'line' | 'pills' | 'enclosed';
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		onTabChange?: (tabId: string) => void;
		children?: Snippet<[string]>; // Pass active tab ID to children
	}

	let {
		tabs,
		activeTab = $bindable(''),
		variant = 'line',
		size = 'md',
		class: className = '',
		onTabChange,
		children
	}: Props = $props();

	// Size classes
	const sizeClasses = {
		sm: 'text-sm px-3 py-1.5',
		md: 'text-sm px-4 py-2',
		lg: 'text-base px-6 py-3'
	};

	// Variant-specific classes
	const variantClasses = {
		line: {
			container: 'border-b border-slate-200',
			tab: 'border-b-2 border-transparent hover:border-slate-300 hover:text-slate-700 whitespace-nowrap',
			active: 'border-emerald-500 text-emerald-600',
			inactive: 'text-slate-500'
		},
		pills: {
			container: 'bg-slate-100 p-1 rounded-lg',
			tab: 'rounded-md transition-colors duration-200 whitespace-nowrap',
			active: 'bg-white text-slate-900 shadow-sm',
			inactive: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
		},
		enclosed: {
			container: 'border-b border-slate-200',
			tab: 'border border-transparent rounded-t-lg hover:border-slate-300 whitespace-nowrap',
			active: 'border-slate-300 border-b-white bg-white text-slate-900 -mb-px',
			inactive: 'text-slate-500 hover:text-slate-700'
		}
	};

	function handleTabClick(tabId: string, disabled?: boolean) {
		if (disabled) return;

		activeTab = tabId;
		if (onTabChange) {
			onTabChange(tabId);
		}
	}

	function getTabClasses(tab: Tab, isActive: boolean) {
		const baseClasses = sizeClasses[size];
		const variantClass = variantClasses[variant];
		const stateClasses = isActive ? variantClass.active : variantClass.inactive;
		const disabledClasses = tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

		return `${baseClasses} ${variantClass.tab} ${stateClasses} ${disabledClasses}`.trim();
	}
</script>

<div class={className}>
	<!-- Tab Navigation -->
	<div class="flex {variantClasses[variant].container}">
		{#each tabs as tab (tab.id)}
			{@const isActive = activeTab === tab.id}
			<button
				type="button"
				class={getTabClasses(tab, isActive)}
				disabled={tab.disabled}
				onclick={() => handleTabClick(tab.id, tab.disabled)}
				aria-selected={isActive}
				role="tab"
			>
				<div class="flex items-center space-x-2">
					{#if tab.icon}
						<span class="flex-shrink-0">
							{@render tab.icon()}
						</span>
					{/if}

					<span>{tab.label}</span>

					{#if tab.count !== undefined}
						<span class="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
							{tab.count}
						</span>
					{/if}
				</div>
			</button>
		{/each}
	</div>

	<!-- Tab Content -->
	{#if children}
		<div role="tabpanel" class="mt-4">
			{@render children(activeTab)}
		</div>
	{/if}
</div>
