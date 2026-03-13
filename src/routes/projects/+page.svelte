<script lang="ts">
	import { projects } from '$lib/data/projects';
	import type { ProjectDomain } from '$lib/types';
	import ProjectCard from '$lib/components/project/ProjectCard.svelte';
	
	// Create grouped domains safely
	// We want to loop over all domains explicitly:
	const domains: ProjectDomain[] = ['Software', 'Electronics', 'Mechanical', 'Management'];
</script>

<svelte:head>
	<title>Project Database | Urbain</title>
</svelte:head>

<div class="mb-16 pb-8 border-b border-border flex justify-between items-end gap-4 flex-wrap">
	<div>
		<h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-4 uppercase text-primary">Project Database</h1>
		<p class="font-mono text-secondary text-sm">Indexed {projects.length} projects across {domains.length} domains</p>
	</div>
</div>

{#each domains as domain}
	{@const domainProjects = projects.filter(p => p.domain === domain).sort((a, b) => b.year - a.year)}
	
	{#if domainProjects.length > 0}
		<section class="mb-24 relative">
			<div class="absolute -left-3 top-0 bottom-0 w-px bg-border hidden md:block"></div>
			
			<div class="sticky top-0 bg-background/90 backdrop-blur-md pt-4 pb-6 z-10 font-mono tracking-widest text-primary flex items-center gap-4 border-b border-border/50">
				<div class="w-3 h-3 bg-accent hidden md:block absolute -left-[17.5px]"></div>
				<h2 class="text-xl uppercase font-bold">{domain}</h2>
				<span class="text-secondary text-xs">{domainProjects.length} Entries</span>
			</div>
			
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
				{#each domainProjects as project}
					<ProjectCard {project} />
				{/each}
			</div>
		</section>
	{/if}
{/each}
