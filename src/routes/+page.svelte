<!-- AI Phone Call Demo Landing Page -->
<!-- Showcases Bland AI + OpenAI integration for intelligent phone calling -->

<script>
	import Container from '$lib/client/components/ui/Container.svelte';
	import HeroSection from '$lib/client/components/landing/HeroSection.svelte';
	import TechnologyStack from '$lib/client/components/landing/TechnologyStack.svelte';
	import CallToAction from '$lib/client/components/landing/CallToAction.svelte';
</script>

<svelte:head>
	<title>AI Phone Call Demo | Intelligent Voice Conversations</title>
	<meta
		name="description"
		content="Experience AI-powered phone calls with real-time conversation, live transcription, and intelligent analysis using Bland AI and OpenAI."
	/>
</svelte:head>

<!-- Main homepage container with improved spacing -->
<Container class="py-8 sm:py-12 lg:py-16">
	<!-- Hero Section with enhanced spacing -->
	<section class="mb-16 sm:mb-20 lg:mb-24">
		<HeroSection />
	</section>

	<!-- Technology Stack with improved spacing -->
	<section class="mb-16 sm:mb-20 lg:mb-24">
		<TechnologyStack />
	</section>

	<!-- Final Call to Action -->
	<section>
		<CallToAction />
	</section>
</Container>
