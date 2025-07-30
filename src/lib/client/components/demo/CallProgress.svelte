<!--
  Call Progress Component
  
  Horizontal progress bar showing call status timeline and current demo scenario information.
  Optimized for better UX with clear visual progress indication.
-->

<script lang="ts">
	import Card from '$lib/client/components/ui/Card.svelte';
	import Heading from '$lib/client/components/ui/Heading.svelte';
	import type { DemoRune } from '$lib/client/runes';

	// Component props
	let { demo }: { demo: DemoRune } = $props();

	// Progress steps with improved labels for horizontal layout
	const progressSteps = [
		{ id: 'initiated', label: 'Initiated', shortLabel: 'Start' },
		{ id: 'queued', label: 'Queued', shortLabel: 'Queue' },
		{ id: 'ringing', label: 'Dialing', shortLabel: 'Dial' },
		{ id: 'in-progress', label: 'Conversation', shortLabel: 'Talk' },
		{ id: 'completed', label: 'Complete', shortLabel: 'Done' }
	];

	// Function to check if step is active
	function isStepActive(stepId: string): boolean {
		const currentStep = demo.callStatus;
		const stepOrder = ['initiated', 'queued', 'ringing', 'in-progress', 'completed'];
		const currentIndex = stepOrder.indexOf(currentStep);
		const stepIndex = stepOrder.indexOf(stepId);

		if (stepId === 'initiated') return true; // Always show initiated as complete
		return stepIndex <= currentIndex;
	}

	// Function to check if step is current
	function isCurrentStep(stepId: string): boolean {
		return demo.callStatus === stepId;
	}

	// Calculate progress percentage for the progress bar
	function getProgressPercentage(): number {
		const stepOrder = ['initiated', 'queued', 'ringing', 'in-progress', 'completed'];
		const currentIndex = stepOrder.indexOf(demo.callStatus);
		return ((currentIndex + 1) / stepOrder.length) * 100;
	}
</script>

<!-- Horizontal progress card optimized for better UX -->
<Card class="p-6">
	<div class="space-y-6">
		<!-- Header with call status -->
		<div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<Heading level={3} class="text-lg">Call Progress</Heading>
				{#if demo.isCallActive}
					<p class="text-sm text-slate-600">Live AI conversation in progress</p>
				{:else if demo.currentCall?.status === 'completed'}
					<p class="text-sm font-medium text-emerald-600">Call completed successfully</p>
				{:else}
					<p class="text-sm text-slate-600">Ready to start AI phone call demo</p>
				{/if}
			</div>

			<!-- Current status badge -->
			{#if demo.isCallActive || demo.currentCall}
				<div class="flex items-center gap-2">
					{#if isCurrentStep('in-progress')}
						<div class="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1">
							<div class="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
							<span class="text-sm font-medium text-emerald-700">Live</span>
						</div>
					{:else}
						<div class="rounded-full bg-slate-100 px-3 py-1">
							<span class="text-sm font-medium text-slate-700 capitalize">{demo.callStatus}</span>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Horizontal Progress Timeline -->
		<div class="relative">
			<!-- Progress Track -->
			<div class="absolute top-4 right-8 left-8 h-0.5 bg-slate-200"></div>

			<!-- Progress Fill -->
			<div
				class="absolute top-4 left-8 h-0.5 bg-emerald-500 transition-all duration-500 ease-out"
				style="width: calc({getProgressPercentage()}% - 4rem); max-width: calc(100% - 4rem);"
			></div>

			<!-- Steps Container -->
			<div class="flex justify-between">
				{#each progressSteps as step, index}
					<div class="relative flex flex-col items-center">
						<!-- Step Circle -->
						<div
							class="flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white transition-all duration-300 {isStepActive(
								step.id
							)
								? 'border-emerald-500 text-emerald-600'
								: 'border-slate-300 text-slate-400'} {isCurrentStep(step.id)
								? 'scale-110 ring-4 ring-emerald-200'
								: ''} z-10"
						>
							{#if isStepActive(step.id)}
								<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									/>
								</svg>
							{:else}
								<div class="h-2 w-2 rounded-full bg-current"></div>
							{/if}
						</div>

						<!-- Step Label -->
						<div class="mt-3 text-center">
							<!-- Desktop Label -->
							<span
								class="hidden text-sm font-medium sm:block {isStepActive(step.id)
									? 'text-slate-900'
									: 'text-slate-500'}"
							>
								{step.label}
							</span>
							<!-- Mobile Label -->
							<span
								class="block text-xs font-medium sm:hidden {isStepActive(step.id)
									? 'text-slate-900'
									: 'text-slate-500'}"
							>
								{step.shortLabel}
							</span>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Demo Scenario Info (Compact) -->
		{#if demo.isCallActive}
			<div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
				<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div class="flex-1">
						<h4 class="text-sm font-semibold text-blue-900">Demo Scenario</h4>
						<p class="text-sm font-medium text-blue-800">AI Pizza Order for 12 People</p>
					</div>

					<div class="flex-shrink-0">
						<details class="group">
							<summary class="cursor-pointer list-none text-xs text-blue-700 hover:text-blue-800">
								<span class="flex items-center gap-1">
									View Details
									<svg
										class="h-3 w-3 transition-transform group-open:rotate-180"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</span>
							</summary>
							<div class="mt-2 rounded bg-blue-100 p-3">
								<ul class="space-y-1 text-xs text-blue-800">
									<li>• 2x Large Pepperoni Pizzas</li>
									<li>• 1x Large Margherita (fresh mozzarella, basil)</li>
									<li>• 1x Large Meat Lovers/Supreme</li>
									<li>• 1x Large Vegetarian Pizza</li>
								</ul>
								<p class="mt-2 text-xs text-blue-700">
									Demonstrates intelligent conversation handling and data extraction
								</p>
								{#if demo.customTask.length > 300}
									<details class="mt-2">
										<summary class="cursor-pointer text-xs text-blue-700 hover:text-blue-800">
											View full AI instructions
										</summary>
										<div class="mt-2 rounded bg-blue-200 p-2">
											<pre class="text-xs whitespace-pre-wrap text-blue-800">{demo.customTask}</pre>
										</div>
									</details>
								{/if}
							</div>
						</details>
					</div>
				</div>
			</div>
		{/if}
	</div>
</Card>
