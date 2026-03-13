<script lang="ts">
	import { base } from '$app/paths';
	import ModelViewer from '$lib/components/3d/ModelViewer.svelte';
	let { data } = $props();
	let project = $derived(data.project);
	
	let scrollY = $state(0);
	let windowHeight = $state(1000);
	
	// Calculate animation progress (0 to 1) between scrollY = 0 and scrollY = windowHeight
	let scrollProgress = $derived(Math.min(scrollY / windowHeight, 1));
	
	// Derive styles based on scroll progress
	let modelScale = $derived(1 - (scrollProgress * 0.7)); // Shrinks from 1 to 0.3
	let modelX = $derived(scrollProgress * 30); // Moves right ~30vw
	let modelY = $derived(scrollProgress * -30); // Moves up ~30vh
	
	let uiOpacity = $derived(1 - (scrollProgress * 2)); // Fades out twice as fast
	let has3DContent = $derived(Boolean(project.model_3d) || (project.models_3d?.length ?? 0) > 0 || (project.images?.length ?? 0) > 0);
</script>

<svelte:window bind:scrollY={scrollY} bind:innerHeight={windowHeight} />

<svelte:head>
	<title>{project.name} | Urbain Systems</title>
</svelte:head>

<div class="relative min-h-[200vh]">
	<!-- Fixed Header Return Link -->
	<div class="fixed top-16 left-8 z-50">
		<a href="{base}/projects" class="font-mono text-xs text-secondary hover:text-accent transition-colors uppercase tracking-widest block"
		   style="opacity: {uiOpacity}">
			&lt;- Return to Registry
		</a>
	</div>

	<!-- Sticky Hero Section -->
	<div class="sticky top-0 h-screen w-full flex overflow-hidden">
		<!-- Central 3D Viewer Container which scales and moves on scroll -->
		<div class="render-container w-full h-full flex items-center justify-center absolute inset-0 z-10 pointer-events-none"
			 style="transform: scale({modelScale}) translate3d({modelX}vw, {modelY}vh, 0); transform-origin: center;">
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
			<div class="flex justify-between items-center flex-1">
				<!-- Left Sidebar: Metadata -->
				<div class="font-mono text-sm space-y-8 pointer-events-auto max-w-[200px]">
					<div class="border-l border-border pl-4">
						<div class="text-secondary text-xs uppercase mb-1">Domain</div>
						<div class="font-bold">{project.domain}</div>
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

				<!-- Right Sidebar: Links / Extras -->
				<div class="font-mono text-sm pointer-events-auto text-right max-w-[250px] space-y-6 flex flex-col items-end">
					<div class="border border-border bg-surface p-2 px-4 text-xs text-secondary uppercase tracking-widest mb-4">
						FILE: {project.id}
					</div>

					<div class="w-full text-right border-r border-border pr-4">
						<h2 class="text-xs text-secondary uppercase mb-4">External Resources</h2>
						{#if project.links.length > 0}
							<div class="flex flex-col gap-3 items-end">
								{#each project.links as link}
									<a href={link.url} target="_blank" rel="noopener noreferrer" class="font-mono text-xs border border-border bg-surface px-3 py-2 hover:border-accent hover:text-accent transition-colors flex items-center justify-end group w-full max-w-[200px]">
										<span class="mr-2">{link.label}</span>
										<span class="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">-&gt;</span>
									</a>
								{/each}
							</div>
						{:else}
							<div class="italic text-xs text-secondary">No telemetry.</div>
						{/if}
					</div>
				</div>
			</div>
			
			<div class="text-center font-mono text-xs text-secondary uppercase tracking-widest pb-4 animate-pulse">
				Scroll for Overview \/
			</div>
		</div>
	</div>

	<!-- Scrollable Content Layer -->
	<div class="relative z-20 max-w-2xl mx-auto px-8 pb-32 pt-24 bg-background/90 backdrop-blur-sm border-t border-border mt-[50vh]" id="content-container">
		<div class="prose max-w-none prose-slate prose-invert prose-headings:uppercase prose-headings:font-bold prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline">
			<h2 class="text-2xl font-bold uppercase tracking-tight mb-8 border-b border-border pb-4">System Overview</h2>
			<p class="text-secondary leading-relaxed whitespace-pre-wrap text-lg">{project.description}</p>
		</div>
	</div>
</div>

<style>
	/* Model renders on top, we explicitly handle pointer events in markup */
	.render-container {
		will-change: transform;
	}
</style>