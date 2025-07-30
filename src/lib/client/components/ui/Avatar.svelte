<!--
  Avatar Component
  
  A reusable avatar component for displaying user images or initials.
  Supports different sizes and fallback states.
-->

<script lang="ts">
	interface Props {
		src?: string;
		alt?: string;
		initials?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		variant?: 'circular' | 'rounded' | 'square';
		class?: string;
	}

	let {
		src,
		alt = '',
		initials = '',
		size = 'md',
		variant = 'circular',
		class: className = ''
	}: Props = $props();

	let imageError = $state(false);

	// Size classes
	const sizeClasses = {
		xs: 'w-6 h-6 text-xs',
		sm: 'w-8 h-8 text-sm',
		md: 'w-10 h-10 text-sm',
		lg: 'w-12 h-12 text-base',
		xl: 'w-16 h-16 text-lg'
	};

	// Variant classes
	const variantClasses = {
		circular: 'rounded-full',
		rounded: 'rounded-lg',
		square: 'rounded-none'
	};

	// Base classes
	const baseClasses =
		'inline-flex items-center justify-center font-medium bg-emerald-600 text-white overflow-hidden';

	// Combine all classes
	const allClasses = $derived(
		`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`
	);

	function handleImageError() {
		imageError = true;
	}

	// Extract initials from alt text if not provided
	const displayInitials = $derived(() => {
		if (initials) return initials;
		if (alt) {
			return alt
				.split(' ')
				.map((word) => word.charAt(0).toUpperCase())
				.slice(0, 2)
				.join('');
		}
		return '?';
	});
</script>

<div class={allClasses}>
	{#if src && !imageError}
		<img {src} {alt} class="h-full w-full object-cover" onerror={handleImageError} />
	{:else}
		<span class="select-none">
			{displayInitials()}
		</span>
	{/if}
</div>
