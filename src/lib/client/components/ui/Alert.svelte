<!--
  Alert Component
  
  A reusable alert component for displaying messages, warnings, errors, and success states.
  Supports different variants, dismissible state, and custom actions.
-->

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'info' | 'success' | 'warning' | 'error';
		title?: string;
		description?: string;
		dismissible?: boolean;
		class?: string;
		onDismiss?: () => void;
		children?: Snippet;
		actions?: Snippet;
	}

	let {
		variant = 'info',
		title = '',
		description = '',
		dismissible = false,
		class: className = '',
		onDismiss,
		children,
		actions
	}: Props = $props();

	let isVisible = $state(true);

	// Variant-specific classes and icons
	const variantConfig = {
		info: {
			container: 'bg-blue-50 border-blue-200 text-blue-800',
			icon: 'text-blue-400',
			iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
		},
		success: {
			container: 'bg-green-50 border-green-200 text-green-800',
			icon: 'text-green-400',
			iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
		},
		warning: {
			container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
			icon: 'text-yellow-400',
			iconPath:
				'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z'
		},
		error: {
			container: 'bg-red-50 border-red-200 text-red-800',
			icon: 'text-red-400',
			iconPath: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
		}
	};

	const config = $derived(variantConfig[variant]);

	function handleDismiss() {
		isVisible = false;
		if (onDismiss) {
			onDismiss();
		}
	}
</script>

{#if isVisible}
	<div class="rounded-lg border p-4 {config.container} {className}">
		<div class="flex">
			<!-- Icon -->
			<div class="flex-shrink-0">
				<svg
					class="h-5 w-5 {config.icon}"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d={config.iconPath} />
				</svg>
			</div>

			<!-- Content -->
			<div class="ml-3 flex-1">
				{#if title}
					<h3 class="mb-1 text-sm font-medium">
						{title}
					</h3>
				{/if}

				{#if description}
					<div class="text-sm">
						{description}
					</div>
				{/if}

				{#if children}
					<div class="text-sm">
						{@render children()}
					</div>
				{/if}

				{#if actions}
					<div class="mt-3">
						{@render actions()}
					</div>
				{/if}
			</div>

			<!-- Dismiss button -->
			{#if dismissible}
				<div class="ml-auto pl-3">
					<div class="-mx-1.5 -my-1.5">
						<button
							type="button"
							class="inline-flex rounded-md p-1.5 {config.icon} hover:bg-black/5 focus:ring-2 focus:ring-current focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none"
							onclick={handleDismiss}
							aria-label="Dismiss"
						>
							<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
								<path
									d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
								/>
							</svg>
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
