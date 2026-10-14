<script lang="ts">
	import { base } from '$app/paths';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Background engineering grid overlay -->
<div class="site-dot-grid fixed inset-0 pointer-events-none z-[-1] opacity-80">
</div>

<div class="min-h-screen flex flex-col font-sans text-primary">
	<header class="max-w-screen-xl w-full mx-auto px-6 py-8 border-b border-border flex justify-between items-center">
		<div class="font-mono text-sm tracking-widest font-bold uppercase">
			<a href="{base}/" class="hover:text-accent transition-colors">Urbain <span class="text-accent">/</span> Portfolio</a>
		</div>
		<nav class="font-mono text-xs text-secondary flex gap-8">
			<a href="{base}/" class="hover:text-accent transition-colors">HOME</a>
			<a href="{base}/projects" class="hover:text-accent transition-colors">PROJECTS</a>
			<a href="{base}/timeline" class="hover:text-accent transition-colors">TIMELINE</a>
		</nav>
	</header>

	<main class="max-w-screen-xl mx-auto px-6 py-12 relative pb-24 flex-1">
		{@render children()}
	</main>

	<footer class="max-w-screen-xl mx-auto px-6 py-6 border-t border-border flex flex-col sm:flex-row justify-between gap-4 font-mono text-xs text-secondary items-center w-full">
		<p>
			© {new Date().getFullYear()} URBAIN <span class="text-accent">/</span> PORTFOLIO
		</p>
		<nav aria-label="Footer navigation" class="flex gap-6">
			<a href="{base}/" class="hover:text-accent transition-colors">HOME</a>
			<a href="{base}/projects" class="hover:text-accent transition-colors">PROJECTS</a>
			<a href="{base}/timeline" class="hover:text-accent transition-colors">TIMELINE</a>
		</nav>
		<nav aria-label="Social links" class="flex items-center gap-4 ">
			<a
				href="https://linkedin.com/in/urbain-lantres"
				target="_blank"
				rel="noreferrer"
				aria-label="LinkedIn"
				title="LinkedIn"
				class="hover:text-accent transition-colors"
			>
				<svg aria-hidden="true" viewBox="0 0 18 18" class="size-4 fill-current">
					<path d="M4 3.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM2.7 8h2.6v8H2.7V8Zm4.8 0H10v1.1c.4-.7 1.3-1.3 2.6-1.3 2.2 0 2.8 1.4 2.8 3.3V16h-2.6v-4.2c0-1-.02-2.2-1.4-2.2s-1.6 1.1-1.6 2.1V16H7.5V8Z" />
				</svg>
			</a>
			<a
				href="https://github.com/urbskali"
				target="_blank"
				rel="noreferrer"
				aria-label="GitHub"
				title="GitHub"
				class="hover:text-accent transition-colors"
			>
				<svg aria-hidden="true" viewBox="0 0 24 24" class="size-4 fill-current">
					<path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.11.08 1.7 1.14 1.7 1.14.99 1.7 2.6 1.21 3.23.93.1-.72.39-1.21.71-1.49-2.47-.28-5.07-1.24-5.07-5.52 0-1.22.44-2.22 1.15-3-.12-.29-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.54.23 2.67.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.23-5.09 5.51.4.35.76 1.03.76 2.08v3.09c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
				</svg>
			</a>
		</nav>
	</footer>
</div>
