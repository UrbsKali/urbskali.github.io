<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Background engineering grid overlay -->
<div class="fixed inset-0 pointer-events-none z-[-1] opacity-70" 
     style="background-image: radial-gradient(#E5E7EB 1px, transparent 1px); background-size: 24px 24px;">
</div>

<div class="min-h-screen font-sans text-primary">
	<header class="max-w-screen-xl mx-auto px-6 py-8 border-b border-border flex justify-between items-center">
		<div class="font-mono text-sm tracking-widest font-bold uppercase">
			<a href="/" class="hover:text-accent transition-colors">Urbain <span class="text-accent">/</span> Portfolio</a>
		</div>
		<nav class="font-mono text-xs text-secondary flex gap-8">
			<a href="/" class="hover:text-accent transition-colors">HOME</a>
			<a href="/projects" class="hover:text-accent transition-colors">PROJECTS</a>
		</nav>
	</header>

	<main class="max-w-screen-xl mx-auto px-6 py-12 relative pb-24">
		{@render children()}
	</main>
</div>
