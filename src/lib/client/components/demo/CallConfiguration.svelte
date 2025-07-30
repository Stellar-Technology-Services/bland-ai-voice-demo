<!--
  Call Configuration Component
  
  Configure phone number, AI instructions, voice, and advanced settings for the demo.
-->

<script lang="ts">
	import Button from '$lib/client/components/ui/Button.svelte';
	import Input from '$lib/client/components/ui/Input.svelte';
	import Textarea from '$lib/client/components/ui/Textarea.svelte';
	import Card from '$lib/client/components/ui/Card.svelte';
	import Spinner from '$lib/client/components/ui/Spinner.svelte';
	import Badge from '$lib/client/components/ui/Badge.svelte';
	import VoiceSelector from './VoiceSelector.svelte';
	import AdvancedSettings from './AdvancedSettings.svelte';
	import type { DemoRune } from '$lib/client/runes';

	// Component props
	let { demo }: { demo: DemoRune } = $props();
</script>

<Card>
	<div class="p-6">
		<h2 class="mb-6 text-xl font-semibold text-slate-900">AI Agent Configuration</h2>
		<p class="mb-6 text-sm text-slate-600">
			Set up your AI agent to make a phone call. This demo shows AI ordering pizza, but you can
			adapt this technology for any conversation type.
		</p>

		{#if !demo.isCallActive}
			<div class="space-y-6">
				<!-- Phone Number Input -->
				<div>
					<label for="phone" class="mb-2 block text-sm font-medium text-slate-700">
						Your Phone Number
					</label>
					<Input
						id="phone"
						type="tel"
						bind:value={demo.phoneNumber}
						placeholder="+1 (555) 123-4567"
						class="w-full"
						disabled={demo.isLoading}
					/>
					<p class="mt-1 text-xs text-slate-500">
						Enter your phone number to receive the AI demo call
					</p>
				</div>

				<!-- AI Instructions -->
				<div>
					<label for="task" class="mb-2 block text-sm font-medium text-slate-700">
						AI Instructions
					</label>
					<Textarea
						id="task"
						bind:value={demo.customTask}
						placeholder="Enter detailed instructions for what the AI should do during the call..."
						rows={8}
						class="w-full"
						disabled={demo.isLoading}
					/>
					<p class="mt-1 text-xs text-slate-500">
						Detailed instructions that tell the AI agent exactly how to conduct the phone call
					</p>
				</div>

				<!-- Voice Selection -->
				<VoiceSelector bind:value={demo.advancedSettings.voice} disabled={demo.isLoading} />

				<!-- Advanced Settings -->
				<AdvancedSettings
					bind:settings={demo.advancedSettings}
					bind:expanded={demo.showAdvancedSettings}
					disabled={demo.isLoading}
				/>

				<!-- Start Call Button -->
				<Button
					onclick={demo.startCall}
					disabled={!demo.canStartCall || demo.isLoading}
					class="w-full"
					variant="primary"
				>
					{#if demo.isLoading}
						<Spinner class="mr-2 h-4 w-4" />
						Starting Call...
					{:else}
						Start AI Phone Call
					{/if}
				</Button>
			</div>
		{:else}
			<!-- Active Call Status -->
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<div>
						<p class="font-medium text-slate-900">Call Active</p>
						<p class="text-sm text-slate-600">{demo.phoneNumber}</p>
					</div>
					<Badge variant={demo.statusColor()}>{demo.callStatus}</Badge>
				</div>

				{#if demo.currentCall?.call_id}
					<p class="font-mono text-xs text-slate-500">Call ID: {demo.currentCall.call_id}</p>
				{/if}

				<Button onclick={demo.stopCall} variant="danger" class="w-full">End Call</Button>
			</div>
		{/if}

		<!-- Error Message -->
		{#if demo.errorMessage}
			<div class="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
				<p class="text-sm text-red-800">{demo.errorMessage}</p>
			</div>
		{/if}
	</div>
</Card>
