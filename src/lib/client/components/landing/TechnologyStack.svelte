<!--
  Enhanced Technology Stack Component
  
  Displays the technologies powering the AI phone call demo with improved visual design.
  Uses clear descriptions and enhanced layout for better user understanding.
-->

<script lang="ts">
	// Enhanced component props
	let {
		title = 'Built with Industry-Leading Technology',
		subtitle = 'Our AI phone call platform combines the best tools to deliver human-like conversations'
	} = $props();

	// Enhanced technology stack data with more detailed descriptions
	interface Technology {
		emoji: string;
		name: string;
		description: string;
		details: string;
		span?: string;
		href?: string; // Added company link
	}

	const technologies: Technology[] = [
		{
			emoji: 'bland-logo',
			name: 'Bland AI',
			description: 'Advanced voice AI for natural phone conversations',
			details: 'Industry-leading voice synthesis and conversation handling',
			href: 'https://www.bland.ai/'
		},
		{
			emoji: 'openai-logo',
			name: 'OpenAI GPT-4.1-nano',
			description: 'Intelligent analysis and data extraction',
			details: 'State-of-the-art language model for human-like responses',
			href: 'https://openai.com/'
		},
		{
			emoji: 'svelte-logo',
			name: 'SvelteKit',
			description: 'Modern web framework for seamless experiences',
			details: 'Fast, responsive, and developer-friendly frontend',
			href: 'https://kit.svelte.dev/'
		}
	];
</script>

<!-- Snippet: Enhanced Technology Item -->
{#snippet technologyItem(tech: Technology)}
	<div class="group relative {tech.span || ''}">
		{#if tech.href}
			<!-- Clickable card with hover effects -->
			<a
				href={tech.href}
				target="_blank"
				rel="noopener noreferrer"
				class="relative block h-full cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6"
			>
				<!-- Technology icon and name -->
				<div class="flex flex-col items-center text-center">
					<div
						class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-blue-50 text-2xl transition-transform group-hover:scale-110 sm:mb-4 sm:h-16 sm:w-16 sm:text-3xl"
					>
						{#if tech.emoji === 'svelte-logo'}
							<!-- Svelte Logo SVG -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="38"
								viewBox="0 0 107 128"
								class="transition-transform group-hover:scale-110 sm:h-12 sm:w-10"
							>
								<path
									d="M94.157 22.819c-10.4-14.885-30.94-19.297-45.792-9.835L22.282 29.608A29.92 29.92 0 0 0 8.764 49.65a31.5 31.5 0 0 0 3.108 20.231 30 30 0 0 0-4.477 11.183 31.9 31.9 0 0 0 5.448 24.116c10.402 14.887 30.942 19.297 45.791 9.835l26.083-16.624A29.92 29.92 0 0 0 98.235 78.35a31.53 31.53 0 0 0-3.105-20.232 30 30 0 0 0 4.474-11.182 31.88 31.88 0 0 0-5.447-24.116"
									style="fill:#ff3e00"
								/>
								<path
									d="M45.817 106.582a20.72 20.72 0 0 1-22.237-8.243 19.17 19.17 0 0 1-3.277-14.503 18 18 0 0 1 .624-2.435l.49-1.498 1.337.981a33.6 33.6 0 0 0 10.203 5.098l.97.294-.09.968a5.85 5.85 0 0 0 1.052 3.878 6.24 6.24 0 0 0 6.695 2.485 5.8 5.8 0 0 0 1.603-.704L69.27 76.28a5.43 5.43 0 0 0 2.45-3.631 5.8 5.8 0 0 0-.987-4.371 6.24 6.24 0 0 0-6.698-2.487 5.7 5.7 0 0 0-1.6.704l-9.953 6.345a19 19 0 0 1-5.296 2.326 20.72 20.72 0 0 1-22.237-8.243 19.17 19.17 0 0 1-3.277-14.502 17.99 17.99 0 0 1 8.13-12.052l26.081-16.623a19 19 0 0 1 5.3-2.329 20.72 20.72 0 0 1 22.237 8.243 19.17 19.17 0 0 1 3.277 14.503 18 18 0 0 1-.624 2.435l-.49 1.498-1.337-.98a33.6 33.6 0 0 0-10.203-5.1l-.97-.294.09-.968a5.86 5.86 0 0 0-1.052-3.878 6.24 6.24 0 0 0-6.696-2.485 5.8 5.8 0 0 0-1.602.704L37.73 51.72a5.42 5.42 0 0 0-2.449 3.63 5.79 5.79 0 0 0 .986 4.372 6.24 6.24 0 0 0 6.698 2.486 5.8 5.8 0 0 0 1.602-.704l9.952-6.342a19 19 0 0 1 5.295-2.328 20.72 20.72 0 0 1 22.237 8.242 19.17 19.17 0 0 1 3.277 14.503 18 18 0 0 1-8.13 12.053l-26.081 16.622a19 19 0 0 1-5.3 2.328"
									style="fill:#fff"
								/>
							</svg>
						{:else if tech.emoji === 'bland-logo'}
							<!-- Bland AI Logo -->
							<img
								src="/bland.png"
								alt="Bland AI"
								class="h-8 w-8 transition-transform group-hover:scale-110 sm:h-10 sm:w-10"
							/>
						{:else if tech.emoji === 'openai-logo'}
							<!-- OpenAI Logo -->
							<img
								src="/openai.png"
								alt="OpenAI"
								class="h-8 w-8 transition-transform group-hover:scale-110 sm:h-10 sm:w-10"
							/>
						{:else}
							{tech.emoji}
						{/if}
					</div>

					<!-- Company name -->
					<h3
						class="mb-2 text-lg font-bold text-slate-900 transition-colors duration-200 group-hover:text-emerald-600 sm:text-xl"
					>
						{tech.name}
					</h3>

					<p class="mb-2 text-sm font-medium text-slate-600 sm:mb-3">{tech.description}</p>
					<p class="text-xs leading-relaxed text-slate-500">{tech.details}</p>
				</div>

				<!-- Subtle gradient overlay on hover -->
				<div
					class="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/0 to-blue-500/0 transition-all duration-300 group-hover:from-emerald-500/5 group-hover:to-blue-500/5"
				></div>
			</a>
		{:else}
			<!-- Non-clickable card -->
			<div
				class="relative h-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6"
			>
				<!-- Technology icon and name -->
				<div class="flex flex-col items-center text-center">
					<div
						class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-blue-50 text-2xl transition-transform group-hover:scale-110 sm:mb-4 sm:h-16 sm:w-16 sm:text-3xl"
					>
						{tech.emoji}
					</div>

					<h3 class="mb-2 text-lg font-bold text-slate-900 sm:text-xl">{tech.name}</h3>
					<p class="mb-2 text-sm font-medium text-slate-600 sm:mb-3">{tech.description}</p>
					<p class="text-xs leading-relaxed text-slate-500">{tech.details}</p>
				</div>

				<!-- Subtle gradient overlay on hover -->
				<div
					class="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/0 to-blue-500/0 transition-all duration-300 group-hover:from-emerald-500/5 group-hover:to-blue-500/5"
				></div>
			</div>
		{/if}
	</div>
{/snippet}

<!-- Snippet: Technology Grid -->
{#snippet technologyGrid()}
	<div class="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:gap-6 md:grid-cols-3 md:gap-8">
		{#each technologies as tech}
			{@render technologyItem(tech)}
		{/each}
	</div>
{/snippet}

<!-- Enhanced Technology Stack Section -->
<div class="mx-auto max-w-6xl px-4 text-center sm:px-6">
	<!-- Section header -->
	<div class="mb-4">
		<h2 class="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">{title}</h2>
		<p class="mx-auto mt-3 max-w-3xl text-base text-slate-600 sm:mt-4 sm:text-lg">{subtitle}</p>
	</div>

	<!-- Technology grid -->
	{@render technologyGrid()}
</div>
