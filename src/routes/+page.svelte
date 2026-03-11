<script lang="ts">
	import { projects } from '$lib/data/projects';
	import ProjectCard from '$lib/components/project/ProjectCard.svelte';
	import ProjectSelector3D from '$lib/components/3d/ProjectSelector3D.svelte';
	
	const featuredProjects = projects.slice(0, 3);
</script>

<svelte:head>
	<title>Urbain | Engineering Portfolio</title>
</svelte:head>

<div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-12 pb-32">
	<section class="lg:col-span-7">
		<div class="font-mono text-sm text-secondary tracking-widest uppercase mb-12 flex items-center gap-4">
			Current Status: employable
			<span class="w-12 h-px bg-border block"></span>
		</div>

		<h1 class="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-primary uppercase">
			Engineering code, <br class="hidden md:block"/>
			<span class="text-accent">Creativity and robots.</span>
		</h1>

		<p class="text-lg md:text-xl text-secondary max-w-xl leading-relaxed mb-16">
			Hey, I'm Urbain, a Creative Technologist in the making ! I also am the President of DaVinciBot, the robotic club of ESILV engineering school. I have a passion for coding, robotics and creativity, and I love to combine these three passions in my projects. 
		</p>

		<div class="flex gap-6 font-mono text-sm">
			<a href="/projects" class="bg-primary text-surface px-6 py-4 hover:bg-accent transition-colors uppercase tracking-wider border border-primary">
				Explore Projects
				<span class="ml-2 opacity-100">-&gt;</span>
			</a>
		</div>
	</section>

	<!-- 3D Interactive Selector Area -->
	<section class="lg:col-span-5 hidden md:block">
		<ProjectSelector3D />
	</section>
</div>

<!-- Sector Overview -->
<section class="border-t border-border pt-24">
	<div class="flex justify-between items-end mb-12">
		<h2 class="text-2xl font-bold uppercase tracking-tight">Recent Projects</h2>
		<a href="/projects" class="font-mono text-xs text-secondary hover:text-accent transition-colors uppercase tracking-widest">View All Projects -></a>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each featuredProjects as project}
			<ProjectCard {project} />
		{/each}
	</div>
</section>
