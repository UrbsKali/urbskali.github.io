<script lang="ts">
	import { base } from '$app/paths';
	import { marked } from 'marked';
	import ModelViewer from '$lib/components/3d/ModelViewer.svelte';
	let { data } = $props();
	let project = $derived(data.project);
	let descriptionHtml = $derived(marked.parse(project.description, { gfm: true, breaks: true, async: false }));
	
	let scrollY = $state(0);
	let windowHeight = $state(1000);
	
	// Calculate animation progress (0 to 1) between scrollY = 0 and scrollY = windowHeight
	let scrollProgress = $derived(Math.min(scrollY / windowHeight, 1));
	
	// Derive styles based on scroll progress
	let modelX = $derived(scrollProgress * 30); // Moves right ~30vw
	let modelY = $derived(scrollProgress * -30); // Moves up ~30vh
	
	let uiOpacity = $derived(1 - (scrollProgress * 4)); 
	let has3DContent = $derived(Boolean(project.model_3d) || (project.models_3d?.length ?? 0) > 0 || (project.images?.length ?? 0) > 0);
</script>

<svelte:window bind:scrollY={scrollY} bind:innerHeight={windowHeight} />

<svelte:head>
	<title>{project.name} | Urbain</title>
</svelte:head>

<div class="relative min-h-[200vh]">
	<!-- Fixed Header Return Link -->
	<div class="fixed top-16 2xl:left-45 ">
		<a href="{base}/projects" class="font-mono text-xs text-secondary hover:text-accent transition-colors uppercase tracking-widest block"
		   style="opacity: {uiOpacity}">
			&lt;- Return to Registry
		</a>
	</div>

	<!-- Sticky Hero Section -->
	<div class="sticky top-0 h-[80vh] w-full flex overflow-hidden">
		<!-- Central 3D Viewer Container which moves on scroll -->
		<div class="render-container w-full h-full flex items-center justify-center absolute inset-0 z-10 pointer-events-none"
			 style="transform: translate3d({modelX}vw, {modelY}vh, 0); transform-origin: center;">
			{#if has3DContent}
				<div class="w-full h-full pointer-events-auto" id="model-wrapper">
					<ModelViewer project={project} />
				</div>
			{/if}
		</div>

		<!-- UI Overlay -->
		<div class="absolute inset-0 z-20 pointer-events-none p-8 flex flex-col justify-between" id="ui-overlay" style="opacity: {Math.max(uiOpacity, 0)}">

			<!-- Top Row -->
			<div class="flex justify-center  mb-4">
				<h1 class="text-4xl lg:text-5xl font-bold uppercase tracking-widest text-primary leading-tight text-center">
					{project.name}
				</h1>
			</div>

			<!-- Middle Layer (Left / Right panels) -->
			<div class="flex justify-between items-start flex-1">
				<!-- Left Sidebar: Metadata -->
				<div class="font-mono text-sm space-y-8 pointer-events-auto max-w-50">
					<div class="border-l border-border pl-4">
						<div class="text-secondary text-xs uppercase mb-2">Domains</div>
						<div class="flex flex-wrap gap-2">
							{#each project.domains as domain}
								<span class="text-[10px] tracking-widest uppercase px-2 py-1 border border-border bg-surface">{domain}</span>
							{/each}
						</div>
					</div>
					<div class="border-l border-border pl-4">
						<div class="text-secondary text-xs uppercase mb-1">Year</div>
						<div class="font-bold">{project.year}</div>
					</div>
					<div class="border-l border-border pl-4">
						<div class="text-secondary text-xs uppercase mb-1">Status</div>
						<div class="font-bold text-accent">Archived</div>
					</div>
					<div class="border-l border-border pl-4">
						<div class="text-secondary text-xs uppercase mb-1">Tech Stack</div>
						<ul class="flex flex-col gap-1 text-xs text-secondary">
							{#each project.skills_used as skill}
								<li>- {skill}</li>
							{/each}
						</ul>
					</div>
				</div>

			</div>
			
			<div class="text-center font-mono text-xs text-secondary uppercase tracking-widest pb-4 animate-pulse z-50">
				Scroll for Overview \/
			</div>
		</div>
	</div>

	<!-- Scrollable Content Layer -->
	<div class="relative z-20 max-w-4xl mx-auto px-8 pb-32 pt-24 bg-background/80 backdrop-blur-sm border border-border mt-[50vh]" id="content-container">
		<div class="flex gap-12 items-start">
			<!-- Description -->
			<div class="flex-1 max-w-none markdown-content">
				<h2 class="text-2xl font-bold uppercase tracking-tight mb-8 border-b border-border pb-4">Project Overview</h2>
				<div class="text-secondary leading-relaxed text-lg">
					{@html descriptionHtml}
				</div>
			</div>

			<!-- External Links -->
			{#if project.links.length > 0}
				<div class="shrink-0 w-48 font-mono self-start lg:sticky lg:top-24">
					<h2 class="text-xs text-secondary uppercase tracking-widest mb-4 border-b border-border pb-2">External Resources</h2>
					<div class="flex flex-col gap-2">
						{#each project.links as link}
							{@const icon = link.type === 'github' ? '[<//>]' : link.type === 'linkedin' ? '[in]' : link.type === 'paper' ? '[doc]' : link.type === 'website' ? '[www]' : '[->]'}
							<a href={link.url} target="_blank" rel="noopener noreferrer"
								class="flex items-center gap-2 text-xs border border-border bg-surface px-3 py-2 hover:border-accent hover:text-accent transition-colors group">
								<span class="text-accent/70 group-hover:text-accent shrink-0">{icon}</span>
								<span class="truncate">{link.label}</span>
							</a>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	/* Model renders on top, we explicitly handle pointer events in markup */
	.render-container {
		will-change: transform;
	}

	/* Keep runtime markdown aligned with the site's technical dashboard language */
	.markdown-content :global(h1),
	.markdown-content :global(h2),
	.markdown-content :global(h3),
	.markdown-content :global(h4) {
		color: var(--color-primary);
		font-weight: 700;
		letter-spacing: 0.03em;
		text-transform: uppercase;
		line-height: 1.2;
		margin-top: 1.75rem;
		margin-bottom: 0.75rem;
	}

	.markdown-content :global(h1) {
		font-size: clamp(1.8rem, 3vw, 2.4rem);
	}

	.markdown-content :global(h2) {
		font-size: clamp(1.35rem, 2.2vw, 1.85rem);
	}

	.markdown-content :global(h3),
	.markdown-content :global(h4) {
		font-size: clamp(1.05rem, 1.5vw, 1.25rem);
	}

	.markdown-content :global(p),
	.markdown-content :global(ul),
	.markdown-content :global(ol),
	.markdown-content :global(blockquote) {
		color: var(--color-secondary);
		line-height: 1.75;
		margin-top: 0.9rem;
		margin-bottom: 0.9rem;
	}

	.markdown-content :global(ul),
	.markdown-content :global(ol) {
		margin-top: 1rem;
		margin-bottom: 1rem;
	}

	.markdown-content :global(ul) {
		list-style: none;
		padding-left: 0;
	}

	.markdown-content :global(ul > li) {
		position: relative;
		padding-left: 1.15rem;
	}

	.markdown-content :global(ul > li::before) {
		content: '▸';
		position: absolute;
		left: 0;
		top: 0.08rem;
		font-family: var(--font-mono);
		font-size: 0.9em;
		color: var(--color-accent);
	}

	.markdown-content :global(ul ul) {
		margin-top: 0.45rem;
		margin-bottom: 0.25rem;
	}

	.markdown-content :global(ul ul > li) {
		padding-left: 1rem;
	}

	.markdown-content :global(ul ul > li::before) {
		content: '•';
		font-size: 0.7em;
		top: 0.3rem;
		color: color-mix(in oklab, var(--color-accent) 70%, var(--color-secondary));
	}

	.markdown-content :global(ol) {
		list-style: none;
		counter-reset: markdown-counter;
		padding-left: 0;
	}

	.markdown-content :global(ol > li) {
		counter-increment: markdown-counter;
		position: relative;
		padding-left: 1.55rem;
	}

	.markdown-content :global(ol > li::before) {
		content: counter(markdown-counter) '.';
		position: absolute;
		left: 0;
		top: 0;
		font-family: var(--font-mono);
		font-size: 0.78em;
		font-weight: 700;
		letter-spacing: 0.05em;
		color: var(--color-accent);
	}

	.markdown-content :global(li > p) {
		margin-top: 0.25rem;
		margin-bottom: 0.25rem;
	}

	.markdown-content :global(li) {
		margin-top: 0.35rem;
		margin-bottom: 0.35rem;
	}

	.markdown-content :global(a) {
		color: var(--color-accent);
		text-decoration: none;
		border-bottom: 1px solid color-mix(in oklab, var(--color-accent) 45%, transparent);
		transition: border-color 140ms ease, color 140ms ease;
	}

	.markdown-content :global(a:hover) {
		border-bottom-color: var(--color-accent);
	}

	.markdown-content :global(strong) {
		color: var(--color-primary);
		font-weight: 700;
	}

	.markdown-content :global(code) {
		font-family: var(--font-mono);
		font-size: 0.85em;
		color: var(--color-primary);
		background: color-mix(in oklab, var(--color-surface) 70%, var(--color-border));
		border: 1px solid var(--color-border);
		padding: 0.12rem 0.35rem;
	}

	.markdown-content :global(pre) {
		overflow-x: auto;
		padding: 0.95rem;
		margin-top: 1.1rem;
		margin-bottom: 1.1rem;
		border: 1px solid var(--color-border);
		background: var(--color-surface);
	}

	.markdown-content :global(pre code) {
		background: transparent;
		border: 0;
		padding: 0;
		font-size: 0.8rem;
		line-height: 1.6;
	}

	.markdown-content :global(blockquote) {
		margin-left: 0;
		padding-left: 0.9rem;
		border-left: 1px solid var(--color-border);
		font-style: italic;
	}

	.markdown-content :global(input[type='checkbox']) {
		appearance: none;
		width: 0.78rem;
		height: 0.78rem;
		margin-right: 0.5rem;
		transform: translateY(1px);
		border: 1px solid var(--color-border);
		background: var(--color-surface);
		display: inline-grid;
		place-content: center;
	}

	.markdown-content :global(input[type='checkbox']::before) {
		content: '';
		width: 0.45rem;
		height: 0.45rem;
		transform: scale(0);
		transition: transform 120ms ease;
		background: var(--color-accent);
	}

	.markdown-content :global(input[type='checkbox']:checked::before) {
		transform: scale(1);
	}

	.markdown-content :global(hr) {
		border: 0;
		border-top: 1px solid var(--color-border);
		margin-top: 1.4rem;
		margin-bottom: 1.4rem;
	}
</style>