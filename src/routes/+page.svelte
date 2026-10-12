<script lang="ts">
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { projects } from '$lib/data/projects';
	import { experiences } from '$lib/data/experiences';
	import ExperienceDotGrid from '$lib/components/ExperienceDotGrid.svelte';
	import ProjectCard from '$lib/components/project/ProjectCard.svelte';

	const featuredExperiences = experiences.map((experience) => {
		const project = projects.find(({ slug }) => slug === experience.slug);
		if (!project) throw new Error(`Missing homepage experience: ${experience.slug}`);
		return { ...experience, project };
	});

	let activeExperienceIndex = $state(0);
	let activeExperience = $derived(featuredExperiences[activeExperienceIndex]);
	let prefersReducedMotion = $state(false);

	function showExperience(index: number) {
		activeExperienceIndex = (index + featuredExperiences.length) % featuredExperiences.length;
	}

	onMount(() => {
		prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) return;

		const interval = window.setInterval(() => {
			showExperience(activeExperienceIndex + 1);
		}, 5200);

		return () => window.clearInterval(interval);
	});

	const featuredProject = projects[0];
	const otherFeaturedProjects = projects.slice(1, 4);
</script>

<svelte:head>
	<title>Urbain | Portfolio</title>
</svelte:head>

<div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-12 pb-28 lg:pt-20 lg:pb-36">
	<section class="lg:col-span-7" aria-label="Introduction">
		<div class="font-mono text-xs md:text-sm text-secondary tracking-widest uppercase mb-8 flex items-center gap-4">
			Creative technologist // Paris, France
		</div>

		<h1 class="text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.04] tracking-tight mb-8 text-primary uppercase">
			<span class="block">Hello, I'm Urbain.</span>
			<span class="relative block min-h-[3.2em] overflow-hidden text-4xl text-accent sm:text-5xl md:text-6xl xl:text-7xl" aria-live="off">
				{#key activeExperience.slug}
					<span class="absolute inset-x-0 top-0 block" in:fly={{ y: prefersReducedMotion ? 0 : 36, duration: prefersReducedMotion ? 0 : 450 }}>
						{activeExperience.role}
					</span>
				{/key}
			</span>
		</h1>

		<p class="text-base md:text-lg text-secondary max-w-xl leading-relaxed mb-9">
			From building robotics systems to leading 130+ members and coordinating a 1,000-student module, I bring ideas to life across code, hardware, and teams.
		</p>

		<div class="flex flex-wrap items-center gap-x-6 gap-y-4 font-mono text-xs md:text-sm">
			<a href="{base}/projects/{activeExperience.project.slug}" class="inline-flex items-center bg-primary text-surface px-5 py-4 hover:bg-accent transition-colors uppercase tracking-wider border border-primary">
				Explore this experience
				<span class="ml-3" aria-hidden="true">-&gt;</span>
			</a>
			<div class="flex items-center gap-2" aria-label="Choose an experience">
					{#each featuredExperiences as experience, index}
					<button
						type="button"
						class="h-10 min-w-10 border px-3 transition-colors {index === activeExperienceIndex ? 'border-accent text-accent' : 'border-border text-secondary hover:border-primary hover:text-primary'}"
						aria-label="Show {experience.project.name} experience"
						aria-pressed={index === activeExperienceIndex}
						onclick={() => showExperience(index)}
					>
						0{index + 1}
					</button>
				{/each}
			</div>
		</div>
	</section>

	<section class="lg:col-span-5" aria-label="Selected experience visual">
		<div class="relative min-h-75 lg:min-h-90">
			<ExperienceDotGrid activeIcon={activeExperience.icon} />
		</div>
	</section>
</div>

<!-- Recent Projects -->
<section class="border-t border-border pt-24">
	<div class="flex justify-between items-end mb-12">
		<h2 class="text-2xl font-bold uppercase tracking-tight">Recent Projects</h2>
		<a href="{base}/projects" class="font-mono text-xs text-secondary hover:text-accent transition-colors uppercase tracking-widest">View All Projects -></a>
	</div>

	<div class="grid grid-cols-1 gap-6 mb-12">

		<div class="grid grid-cols-1 gap-6">
			<ProjectCard project={featuredProject} featured={true} />
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each otherFeaturedProjects as project}
			<ProjectCard {project} />
			{/each}
		</div>
	</div>
</section>
