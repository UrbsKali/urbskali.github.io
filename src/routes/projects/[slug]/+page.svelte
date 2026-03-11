<script lang="ts">
	import ModelViewer from '$lib/components/3d/ModelViewer.svelte';

	let { data } = $props();
	let { project } = data;
</script>

<svelte:head>
	<title>{project.name} | Urbain Systems</title>
</svelte:head>

<div class="max-w-4xl mx-auto">
	<a href="/projects" class="font-mono text-xs text-secondary hover:text-accent transition-colors uppercase tracking-widest block mb-12">
		&lt;- Return to Registry
	</a>

	<!-- Header Specs -->
	<div class="border border-border bg-surface p-8 relative mb-12">
		<div class="absolute top-0 right-0 p-4 border-b border-l border-border bg-background font-mono text-xs text-secondary uppercase">
			FILE: {project.id}
		</div>

		<h1 class="text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-8 mt-4 text-primary leading-tight">
			{project.name}
		</h1>

		<div class="grid grid-cols-2 md:grid-cols-4 gap-8 font-mono text-sm border-t border-border pt-8">
			<div>
				<div class="text-secondary text-xs uppercase mb-1">Domain</div>
				<div class="font-bold">{project.domain}</div>
			</div>
			<div>
				<div class="text-secondary text-xs uppercase mb-1">Year</div>
				<div class="font-bold">{project.year}</div>
			</div>
			<div>
				<div class="text-secondary text-xs uppercase mb-1">Status</div>
				<div class="font-bold text-accent">Archived</div>
			</div>
			<div>
				<div class="text-secondary text-xs uppercase mb-1">Tech Stack</div>
				<ul class="flex flex-col gap-1">
					{#each project.skills_used as skill}
						<li>- {skill}</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>

	<!-- System Overview -->
	<div class="grid grid-cols-1 md:grid-cols-12 gap-12">
		<div class="md:col-span-8">
			<!-- 3D Interactive Viewer injected here if model_3d exists -->
			{#if project.model_3d}
				<ModelViewer project={project} />
			{/if}

			<div class="prose max-w-none prose-slate prose-headings:uppercase prose-headings:font-bold prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline">
				<h2 class="text-2xl font-bold uppercase tracking-tight mb-4 border-b border-border pb-2">System Overview</h2>
				<p class="text-secondary leading-relaxed whitespace-pre-wrap">{project.description}</p>
			</div>
		</div>

		<div class="md:col-span-4 border-l border-border pl-8">
			<h2 class="text-sm font-mono font-bold uppercase tracking-widest mb-6 text-primary">External Resources</h2>
			{#if project.links.length > 0}
				<div class="flex flex-col gap-4">
					{#each project.links as link}
						<a href={link.url} target="_blank" rel="noopener noreferrer" class="font-mono text-sm border border-border bg-surface px-4 py-3 hover:border-accent hover:text-accent transition-colors flex justify-between items-center group">
							<span>{link.label}</span>
							<span class="text-xs group-hover:translate-x-1 transition-transform">-></span>
						</a>
					{/each}
				</div>
			{:else}
				<div class="font-mono text-xs text-secondary italic">No external telemetry available.</div>
			{/if}
		</div>
	</div>
</div>