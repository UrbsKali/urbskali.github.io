<script lang="ts">
	import type { Project } from '$lib/types';
	export let project: Project;
</script>

<a href={`/projects/${project.slug}`} class="block group relative bg-surface border border-border p-6 hover:border-accent transition-colors duration-300">
	<!-- Technical Crosshairs -->
	<div class="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary opacity-20 group-hover:opacity-100 group-hover:border-accent transition-opacity"></div>
	<div class="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary opacity-20 group-hover:opacity-100 group-hover:border-accent transition-opacity"></div>
	<div class="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary opacity-20 group-hover:opacity-100 group-hover:border-accent transition-opacity"></div>
	<div class="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary opacity-20 group-hover:opacity-100 group-hover:border-accent transition-opacity"></div>
	
	<div class="flex justify-between items-start mb-8">
		<span class="font-mono text-xs text-secondary tracking-widest uppercase">ID: {project.id}</span>
		<span class="font-mono text-[10px] text-accent bg-accent/10 px-2 py-1 uppercase">{project.domain}</span>
	</div>
	
	<h3 class="text-xl font-bold mb-2 tracking-tight group-hover:text-accent transition-colors">{project.name}</h3>
	<p class="text-secondary text-sm mb-6 line-clamp-2">{project.description}</p>
	
	<div class="flex flex-wrap gap-2">
		{#each project.skills_used.slice(0, 3) as skill}
			<span class="font-mono text-[10px] text-primary border border-border px-2 py-0.5 uppercase">
				{skill}
			</span>
		{/each}
	</div>
</a>
