<script lang="ts">
	import { base } from '$app/paths';
	import type { Project } from '$lib/types';
	export let project: Project;
	export let featured = false;

	$: secondaryDomains = project.domains.slice(1);
	$: needsImageBackdrop = /\.(png|webp|svg)(\?.*)?$/i.test(project.images[0] ?? '');
</script>

<a href="{base}/projects/{project.slug}" class="block group relative bg-surface border border-border overflow-hidden hover:border-accent transition-colors duration-300 {featured ? 'md:grid md:grid-cols-12 md:items-stretch' : ''}" class:featured>
	<!-- Technical Crosshairs -->
	<div class="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary opacity-20 group-hover:opacity-100 group-hover:border-accent transition-opacity z-10"></div>
	<div class="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary opacity-20 group-hover:opacity-100 group-hover:border-accent transition-opacity z-10"></div>
	<div class="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary opacity-20 group-hover:opacity-100 group-hover:border-accent transition-opacity z-10"></div>
	<div class="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary opacity-20 group-hover:opacity-100 group-hover:border-accent transition-opacity z-10"></div>
	
	<!-- Image Display -->
	{#if project.images.length > 0}
		<div class="relative w-full h-48 {featured ? 'md:col-span-8 md:h-auto md:min-h-104 md:border-r md:border-b-0 border-border' : ''} overflow-hidden border-b border-border {needsImageBackdrop ? 'bg-linear-to-br from-primary/5 via-surface to-accent/10' : 'bg-surface'}">
			<img 
				src={project.images[0]} 
				alt={project.name}
				class="w-full h-full {featured ? 'object-cover md:object-cover' : 'group-hover:scale-105'} object-center object-cover transition-transform duration-300"
				loading="lazy"
			/>
			{#if needsImageBackdrop}
				<div class="absolute inset-0 bg-linear-to-t from-surface/20 via-transparent to-transparent"></div>
			{/if}
		</div>
	{:else}
		<div class="relative w-full h-48 {featured ? 'md:col-span-8 md:h-auto md:min-h-104 md:border-r md:border-b-0 border-border' : ''} overflow-hidden bg-linear-to-br from-primary/5 via-surface to-accent/10 border-b border-border">
			<div class="absolute inset-0 opacity-40" style="background-image: linear-gradient(to right, rgba(15, 23, 42, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.08) 1px, transparent 1px); background-size: 24px 24px;"></div>
			<div class="absolute inset-0 flex items-center justify-center">
				<div class="text-center">
					<p class="font-mono text-[10px] tracking-[0.3em] text-secondary uppercase">No Visual Asset</p>
					<p class="mt-2 text-sm text-primary/80 uppercase tracking-widest">{project.id}</p>
				</div>
			</div>
			<div class="absolute top-4 left-4 font-mono text-[10px] text-secondary/80 uppercase tracking-widest">Preview Pending</div>
			<div class="absolute bottom-4 right-4 w-10 h-10 border border-primary/20 rounded-full"></div>
		</div>
	{/if}
	
	<div class="p-6 {featured ? 'md:p-8 md:col-span-4 flex flex-col justify-center' : ''}">
		<div class="flex justify-between items-start mb-8">
			<span class="font-mono text-xs text-secondary tracking-widest uppercase">ID: {project.id}</span>
			<div class="flex flex-wrap justify-end gap-1.5 max-w-[60%]">
				{#each project.domains as domain, index}
					<span
						class="font-mono text-[10px] px-2 py-1 uppercase border tracking-wider {index === 0 ? 'text-accent bg-accent/10 border-accent/50' : 'text-secondary bg-surface border-border'}"
					>
						{domain}
					</span>
				{/each}
			</div>
		</div>
		
		<h3 class="text-xl {featured ? 'md:text-3xl' : ''} font-bold mb-2 tracking-tight group-hover:text-accent transition-colors">{project.name}</h3>
		{#if project.domains.length > 1 && secondaryDomains.length > 0}
			<p class="font-mono text-[10px] text-secondary uppercase tracking-[0.18em] mb-3">
				Also listed in: {secondaryDomains.join(' / ')}
			</p>
		{/if}
		<p class="text-secondary text-sm {featured ? 'md:text-base' : ''} mb-6 {featured ? 'line-clamp-3' : 'line-clamp-2'}">{project.description}</p>
		
		<div class="flex flex-wrap gap-2">
			{#each project.skills_used.slice(0, featured ? 5 : 3) as skill}
				<span class="font-mono text-[10px] text-primary border border-border px-2 py-0.5 uppercase">
					{skill}
				</span>
			{/each}
		</div>
	</div>
</a>

<style>
	.featured {
		grid-column: span 1;
	}

	@media (min-width: 768px) {
		.featured {
			grid-column: span 2;
		}
	}

	@media (min-width: 1024px) {
		.featured {
			grid-column: span 3;
		}
	}
</style>
