<!--
  Call Analysis Component
  
  Displays intelligent post-call analysis results with structured data extraction.
-->

<script lang="ts">
	import Card from '$lib/client/components/ui/Card.svelte';
	import Heading from '$lib/client/components/ui/Heading.svelte';
	import type { DemoRune } from '$lib/client/runes';

	// Component props
	let { demo }: { demo: DemoRune } = $props();
</script>

{#if demo.orderDetails}
	<Card class="mt-8 p-6">
		<Heading level={3} class="mb-4">AI Analysis Results</Heading>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- Order Summary -->
			<div>
				<h4 class="mb-2 font-medium text-slate-900">Order Summary</h4>
				<div class="space-y-1 text-sm">
					{#if demo.orderDetails['Was the pizza order successful?']}
						<p>
							<span class="font-medium">Order Status:</span>
							{demo.orderDetails['Was the pizza order successful?']}
						</p>
					{/if}
					{#if demo.orderDetails['What specific pizzas were ordered?']}
						<p>
							<span class="font-medium">Items Ordered:</span>
							{demo.orderDetails['What specific pizzas were ordered?']}
						</p>
					{/if}
					{#if demo.orderDetails['Were all 5 pizzas confirmed (2 pepperoni, 1 margherita, 1 meat lovers, 1 vegetarian)?']}
						<p>
							<span class="font-medium">All Items Confirmed:</span>
							{demo.orderDetails[
								'Were all 5 pizzas confirmed (2 pepperoni, 1 margherita, 1 meat lovers, 1 vegetarian)?'
							]}
						</p>
					{/if}
					{#if demo.orderDetails['What is the total cost?']}
						<p>
							<span class="font-medium">Total Cost:</span>
							{demo.orderDetails['What is the total cost?']}
						</p>
					{/if}
				</div>
			</div>

			<!-- Order Details -->
			<div>
				<h4 class="mb-2 font-medium text-slate-900">Order Details</h4>
				<div class="space-y-1 text-sm">
					{#if demo.orderDetails['What is the estimated pickup time?']}
						<p>
							<span class="font-medium">Pickup Time:</span>
							{demo.orderDetails['What is the estimated pickup time?']}
						</p>
					{/if}
					{#if demo.orderDetails['What is the restaurant address?']}
						<p>
							<span class="font-medium">Restaurant Address:</span>
							{demo.orderDetails['What is the restaurant address?']}
						</p>
					{/if}
					{#if demo.orderDetails['Is there an order confirmation number?']}
						<p>
							<span class="font-medium">Confirmation Number:</span>
							{demo.orderDetails['Is there an order confirmation number?']}
						</p>
					{/if}
					{#if demo.orderDetails['Were there any substitutions or modifications?']}
						<p>
							<span class="font-medium">Special Instructions:</span>
							{demo.orderDetails['Were there any substitutions or modifications?']}
						</p>
					{/if}
				</div>
			</div>
		</div>
	</Card>
{/if}
