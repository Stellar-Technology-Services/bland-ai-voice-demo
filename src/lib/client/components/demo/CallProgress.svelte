<!--
  Call Progress Component
  
  Modern, accessible progress visualization with semantic colors and smooth transitions.
  Optimized for mobile-first design and follows WCAG accessibility guidelines.
-->

<script lang="ts">
	import { fly, fade, scale } from 'svelte/transition';
	import { quintOut, cubicOut } from 'svelte/easing';
	import Card from '$lib/client/components/ui/Card.svelte';
	import Heading from '$lib/client/components/ui/Heading.svelte';
	import type { DemoRune } from '$lib/client/runes';

	// Component props
	let { demo }: { demo: DemoRune } = $props();

	// Respect reduced motion preference
	let prefersReducedMotion = $state(false);

	// Check for reduced motion preference
	$effect(() => {
		if (typeof window !== 'undefined') {
			const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
			prefersReducedMotion = mediaQuery.matches;

			const handler = (e: MediaQueryListEvent) => (prefersReducedMotion = e.matches);
			mediaQuery.addEventListener('change', handler);

			return () => mediaQuery.removeEventListener('change', handler);
		}
	});

	// Progress steps with semantic colors and icons
	const progressSteps = [
		{
			id: 'initiated',
			label: 'Initiated',
			shortLabel: 'Start',
			icon: '●',
			colorScheme: 'neutral'
		},
		{
			id: 'queued',
			label: 'Queued',
			shortLabel: 'Queue',
			icon: '○',
			colorScheme: 'warning'
		},
		{
			id: 'ringing',
			label: 'Dialing',
			shortLabel: 'Dial',
			icon: '◐',
			colorScheme: 'info'
		},
		{
			id: 'in-progress',
			label: 'Conversation',
			shortLabel: 'Talk',
			icon: '◉',
			colorScheme: 'active'
		},
		{
			id: 'completed',
			label: 'Complete',
			shortLabel: 'Done',
			icon: '✓',
			colorScheme: 'success'
		}
	];

	// Derived state for progress calculations
	const stepOrder = ['initiated', 'queued', 'ringing', 'in-progress', 'completed'];

	const currentStepIndex = $derived(() => stepOrder.indexOf(demo.callStatus));
	const progressPercentage = $derived(() => ((currentStepIndex() + 1) / stepOrder.length) * 100);
	const currentStep = $derived(
		() => progressSteps.find((step) => step.id === demo.callStatus) || progressSteps[0]
	);

	// Helper functions
	function isStepActive(stepId: string): boolean {
		const stepIndex = stepOrder.indexOf(stepId);
		return stepIndex <= currentStepIndex() || stepId === 'initiated';
	}

	function isCurrentStep(stepId: string): boolean {
		return demo.callStatus === stepId;
	}

	// Color scheme type definition
	type ColorScheme = 'neutral' | 'warning' | 'info' | 'active' | 'success';

	// Get semantic color classes based on step
	function getStepColors(step: (typeof progressSteps)[0], isActive: boolean, isCurrent: boolean) {
		const baseColors: Record<
			ColorScheme,
			{
				bg: string;
				border: string;
				text: string;
				label: string;
				badge: string;
				badgeText: string;
				dot: string;
				ring: string;
				progress: string;
				connection: string;
			}
		> = {
			neutral: {
				bg: isActive ? 'bg-slate-500' : 'bg-white',
				border: isActive ? 'border-slate-500' : 'border-slate-300',
				text: isActive ? 'text-white' : 'text-slate-400',
				label: isActive ? 'text-slate-700' : 'text-slate-500',
				badge: 'bg-slate-50 border-slate-200',
				badgeText: 'text-slate-700',
				dot: 'bg-slate-500',
				ring: 'ring-slate-500/25',
				progress: 'from-slate-400 to-slate-500',
				connection: 'bg-slate-300'
			},
			warning: {
				bg: isActive ? 'bg-orange-500' : 'bg-white',
				border: isActive ? 'border-orange-500' : 'border-slate-300',
				text: isActive ? 'text-white' : 'text-slate-400',
				label: isActive ? 'text-orange-700' : 'text-slate-500',
				badge: 'bg-orange-50 border-orange-200',
				badgeText: 'text-orange-700',
				dot: 'bg-orange-500',
				ring: 'ring-orange-500/25',
				progress: 'from-orange-400 to-orange-500',
				connection: 'bg-orange-300'
			},
			info: {
				bg: isActive ? 'bg-blue-500' : 'bg-white',
				border: isActive ? 'border-blue-500' : 'border-slate-300',
				text: isActive ? 'text-white' : 'text-slate-400',
				label: isActive ? 'text-blue-700' : 'text-slate-500',
				badge: 'bg-blue-50 border-blue-200',
				badgeText: 'text-blue-700',
				dot: 'bg-blue-500',
				ring: 'ring-blue-500/25',
				progress: 'from-blue-400 to-blue-500',
				connection: 'bg-blue-300'
			},
			active: {
				bg: isActive ? 'bg-cyan-500' : 'bg-white',
				border: isActive ? 'border-cyan-500' : 'border-slate-300',
				text: isActive ? 'text-white' : 'text-slate-400',
				label: isActive ? 'text-cyan-700' : 'text-slate-500',
				badge: 'bg-cyan-50 border-cyan-200',
				badgeText: 'text-cyan-700',
				dot: 'bg-cyan-500',
				ring: 'ring-cyan-500/25',
				progress: 'from-cyan-400 to-cyan-500',
				connection: 'bg-cyan-300'
			},
			success: {
				bg: isActive ? 'bg-green-500' : 'bg-white',
				border: isActive ? 'border-green-500' : 'border-slate-300',
				text: isActive ? 'text-white' : 'text-slate-400',
				label: isActive ? 'text-green-700' : 'text-slate-500',
				badge: 'bg-green-50 border-green-200',
				badgeText: 'text-green-700',
				dot: 'bg-green-500',
				ring: 'ring-green-500/25',
				progress: 'from-green-400 to-green-500',
				connection: 'bg-green-300'
			}
		};

		return baseColors[step.colorScheme as ColorScheme];
	}

	// Get progress bar color based on current status
	function getProgressBarColor() {
		const currentStepData = progressSteps.find((step) => step.id === demo.callStatus);
		if (!currentStepData) return 'from-slate-400 to-slate-500';

		const colors = getStepColors(currentStepData, true, true);
		return colors.progress;
	}

	// Get status text color
	function getStatusTextColor() {
		const currentStepData = progressSteps.find((step) => step.id === demo.callStatus);
		if (!currentStepData) return 'text-slate-600';

		const colors = getStepColors(currentStepData, true, true);
		return colors.badgeText;
	}
</script>

<!-- Enhanced progress card with modern design -->
<Card
	class="h-full border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
>
	<div class="p-6 sm:p-8">
		<!-- Enhanced Header with consistent styling -->
		<div class="mb-6 border-b border-slate-100 pb-4">
			<div class="mb-2 flex items-center gap-3">
				<Heading level={3} class="text-xl font-bold text-slate-900 sm:text-2xl">
					Call Progress
				</Heading>
			</div>
			<p class="text-sm leading-relaxed text-slate-600">
				Real-time progress tracking for your AI phone call with visual status indicators.
			</p>
		</div>

		<!-- Dynamic Status Section -->
		<div class="mb-6 sm:mb-8">
			<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div>
					{#key demo.callStatus}
						<div in:fly={{ duration: prefersReducedMotion ? 150 : 300, y: 10, easing: quintOut }}>
							{#if demo.isCallActive}
								<p
									class="text-sm font-medium transition-colors duration-300 {getStatusTextColor()}"
								>
									{demo.callStatus === 'in-progress'
										? '🔴 Live AI conversation in progress'
										: 'AI call in progress...'}
								</p>
							{:else if demo.callStatus === 'completed'}
								<p class="flex items-center gap-1 text-sm font-medium text-green-600">
									<span class="text-green-500">✅</span>
									Call completed successfully
								</p>
							{:else}
								<p class="flex items-center gap-1 text-sm text-slate-600">
									<span class="text-slate-400">⭕</span>
									Ready to start AI phone call demo
								</p>
							{/if}
						</div>
					{/key}
				</div>

				<!-- Enhanced Status Badge -->
				{#if demo.isCallActive || demo.currentCall}
					{#key demo.callStatus}
						<div
							in:scale={{
								duration: prefersReducedMotion ? 150 : 400,
								start: 0.8,
								easing: quintOut
							}}
						>
							{#each [progressSteps.find((s) => s.id === demo.callStatus) || progressSteps[0]] as stepData}
								{@const colors = getStepColors(stepData, true, true)}

								<div
									class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all duration-300 sm:px-4 sm:py-2 {colors.badge}"
								>
									{#if demo.callStatus === 'in-progress'}
										<!-- Subtle live indicator -->
										<div class="relative">
											<div class="h-2 w-2 rounded-full {colors.dot}"></div>
											<div
												class="absolute inset-0 h-2 w-2 rounded-full {colors.dot} animate-ping opacity-30"
												style="animation-duration: 2s;"
											></div>
										</div>
										<span
											class="text-xs font-bold tracking-wider uppercase sm:text-sm {colors.badgeText}"
										>
											Live
										</span>
									{:else}
										<div class="h-2 w-2 rounded-full {colors.dot}"></div>
										<span class="text-xs font-medium capitalize sm:text-sm {colors.badgeText}">
											{demo.callStatus}
										</span>
									{/if}
								</div>
							{/each}
						</div>
					{/key}
				{/if}
			</div>
		</div>

		<!-- Enhanced Progress Visualization -->
		<div class="relative space-y-6 sm:space-y-8">
			<!-- Progress Track -->
			<div class="h-1.5 overflow-hidden rounded-full bg-slate-200 shadow-inner sm:h-2">
				<!-- Animated Progress Fill -->
				<div
					class="h-full rounded-full bg-gradient-to-r shadow-sm transition-all duration-1000 ease-out {getProgressBarColor()}"
					style="width: {progressPercentage()}%"
				>
					<!-- Progress shimmer effect -->
					<div
						class="h-full w-full animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent bg-[length:200%_100%] duration-2000"
					></div>
				</div>
			</div>

			<!-- Progress Steps -->
			<div class="mt-6 grid grid-cols-5 gap-2 sm:mt-8 sm:gap-4">
				{#each progressSteps as step, index}
					{@const isActive = isStepActive(step.id)}
					{@const isCurrent = isCurrentStep(step.id)}
					{@const colors = getStepColors(step, isActive, isCurrent)}

					<div class="group relative flex flex-col items-center">
						<!-- Step Circle -->
						{#key demo.callStatus}
							<div
								class="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-500 ease-out sm:h-10 sm:w-10
								{colors.bg} {colors.border} {colors.text}
								{isCurrent ? `scale-110 ring-4 ${colors.ring} shadow-lg` : 'hover:scale-105'}
								{isActive ? 'shadow-md' : ''}"
								in:scale={{
									duration: prefersReducedMotion ? 150 : 600,
									delay: index * 80,
									start: 0.7,
									easing: cubicOut
								}}
							>
								{#if isActive}
									{#if isCurrent}
										<!-- Current step - pulsing indicator -->
										<div class="animate-pulse text-sm font-bold sm:text-base">
											{step.icon}
										</div>
									{:else}
										<!-- Completed step - checkmark -->
										<svg class="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd"
											/>
										</svg>
									{/if}
								{:else}
									<!-- Inactive step - small dot -->
									<div class="h-1.5 w-1.5 rounded-full bg-current opacity-60 sm:h-2 sm:w-2"></div>
								{/if}
							</div>
						{/key}

						<!-- Step Label -->
						<div class="mt-2 flex min-h-[2rem] items-center justify-center text-center sm:mt-3">
							<span
								class="text-xs font-medium transition-colors duration-300 sm:text-sm {colors.label} text-center leading-tight"
							>
								<span class="block sm:hidden">{step.shortLabel}</span>
								<span class="hidden sm:block">{step.label}</span>
							</span>
						</div>

						<!-- Connection Line -->
						{#if index < progressSteps.length - 1}
							<div
								class="absolute top-4 left-1/2 -z-10 h-0.5 w-full bg-slate-200 transition-colors duration-500 sm:top-5
								{isActive ? colors.connection : 'bg-slate-200'}"
							></div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
</Card>

<style>
	/* Enhanced animation for progress shimmer */
	@keyframes shimmer {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	/* Subtle pulse animations */
	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	.animate-ping {
		animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
	}

	/* Reduced motion overrides */
	@media (prefers-reduced-motion: reduce) {
		* {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
		}
	}

	/* Ensure proper touch targets on mobile */
	@media (max-width: 640px) {
		.group {
			min-height: 44px;
			min-width: 44px;
		}
	}
</style>
