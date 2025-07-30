<!--
  Root Layout Component
  
  Provides the main application structure for the Eovio AI pizza ordering demo.
  Simple layout with main content area for the demo pages.
-->

<script lang="ts">
	import '../app.css';

	let { children }: { children: any } = $props();
</script>

<div class="flex h-screen bg-gray-50">
	<!-- Main Content Area -->
	<div class="flex flex-1 flex-col">
		{@render children()}
	</div>
</div>
