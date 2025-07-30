<!--
  Feature Card Component
  
  Displays individual features with icon, title, and description.
  Used in the demo preview section to highlight key capabilities.
-->

<script lang="ts">
	// Component props
	let { 
		icon,
		iconColor = 'emerald',
		title,
		description
	}: {
		icon: string; // SVG path string
		iconColor?: 'emerald' | 'blue' | 'purple';
		title: string;
		description: string;
	} = $props();

	// Icon color classes
	const iconColorClasses = {
		emerald: 'bg-emerald-100 text-emerald-600',
		blue: 'bg-blue-100 text-blue-600',
		purple: 'bg-purple-100 text-purple-600'
	};
</script>

<!-- Feature Card -->
<div class="text-center">
	<div class="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg {iconColorClasses[iconColor]} sm:mb-4 sm:h-12 sm:w-12">
		<svg
			class="h-5 w-5 sm:h-6 sm:w-6"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d={icon}
			></path>
		</svg>
	</div>
	<h3 class="mb-2 text-base font-semibold text-slate-900 sm:text-lg">{title}</h3>
	<p class="text-sm text-slate-600">
		{description}
	</p>
</div> 