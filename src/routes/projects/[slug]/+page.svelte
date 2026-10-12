<script lang="ts">
	import { base } from '$app/paths';
	import { marked } from 'marked';
	import { experiences } from '$lib/data/experiences';
	import { projects } from '$lib/data/projects';
	import { formatProjectDateRange, formatProjectDuration } from '$lib/utils/projectDates';
	import ModelViewer from '$lib/components/3d/ModelViewer.svelte';
	let { data } = $props();
	let project = $derived(data.project);
	let descriptionHtml = $derived(marked.parse(project.description, { gfm: true, breaks: true, async: false }));
	let has3DContent = $derived(Boolean(project.model_3d) || (project.models_3d?.length ?? 0) > 0 || (project.images?.length ?? 0) > 0);
	let duration = $derived(project.end_date === undefined ? null : formatProjectDuration(project.start_date, project.end_date ?? new Date()));
	let linkedExperiences = $derived((project.experience_slugs ?? []).flatMap((slug) => {
		const experience = experiences.find((item) => item.slug === slug);
		const linkedProject = projects.find((item) => item.slug === slug);
		return experience && linkedProject ? [{ ...experience, project: linkedProject }] : [];
	}));

</script>
<svelte:head>
	<title>{project.name} | Urbain</title>
</svelte:head>

<div class="mx-auto max-w-[1600px] px-6 pb-24 pt-8 lg:px-10">
	<a href="{base}/projects" class="mb-8 block w-fit font-mono text-xs uppercase tracking-widest text-secondary transition-colors hover:text-accent">
		&lt;- Return to Registry
	</a>

	<div class="grid grid-cols-1 items-start gap-x-10 lg:grid-cols-[minmax(180px,220px)_minmax(0,1fr)] lg:grid-rows-[auto_auto_1fr]">
		<header class="mb-10 border-b border-border pb-6 col-span-2 order-1">
		<h1 class="text-3xl font-bold uppercase leading-tight tracking-widest text-primary sm:text-4xl lg:text-5xl">
			{project.name}
		</h1>
		{#if project.links.length > 0}
				<section class="font-mono">
					<div class="flex flex-wrap gap-2">
						{#each project.links as link}
							{@const icon = link.type === 'github' ? '[<//>]' : link.type === 'linkedin' ? '[in]' : link.type === 'paper' ? '[doc]' : link.type === 'website' ? '[www]' : '[->]'}
							<a href={link.url} target="_blank" rel="noopener noreferrer"
								class="flex items-center gap-2 border border-border bg-surface px-3 py-2 text-xs transition-colors hover:border-accent hover:text-accent group">
								<span class="shrink-0 text-accent/70 group-hover:text-accent">{icon}</span>
								<span>{link.label}</span>
							</a>
						{/each}
					</div>
				</section>
			{/if}
	</header>


		<aside class="order-2 font-mono text-sm lg:sticky lg:top-8 lg:order-1">
			<div class="space-y-8">
				<div class="border-l border-border pl-4">
					<div class="mb-2 text-xs uppercase text-secondary">Domains</div>
					<div class="flex flex-wrap gap-2">
						{#each project.domains as domain}
							<span class="border border-border bg-surface px-2 py-1 text-[10px] uppercase tracking-widest">{domain}</span>
						{/each}
					</div>
				</div>
				<div class="border-l border-border pl-4">
					<div class="mb-1 text-xs text-secondary">Date</div>
					<div class="font-bold">{formatProjectDateRange(project)}</div>
					{#if duration}
						<div class="mt-1 text-xs text-secondary">Duration: {duration}</div>
					{/if}
				</div>
				<div class="border-l border-border pl-4">
					<div class="mb-1 text-xs text-secondary">Status</div>
					<div class="font-bold text-accent">{project.end_date === null || project.end_date === undefined ? 'In progress' : project.end_date ? 'Archived' : 'Not specified'}</div>
				</div>
				<div class="border-l border-border pl-4">
					<div class="mb-1 text-xs text-secondary">Tech Stack</div>
					<ul class="flex flex-col gap-1 text-xs text-secondary">
						{#each project.skills_used as skill}
							<li>- {skill}</li>
						{/each}
					</ul>
				</div>
				{#if linkedExperiences.length > 0}
					<div class="border-l border-border pl-4">
						<div class="mb-2 text-xs text-secondary">Related Experience</div>
						<div class="flex flex-col gap-2">
							{#each linkedExperiences as experience}
								<a href="{base}/projects/{experience.project.slug}" class="text-xs transition-colors hover:text-accent">
									{experience.role}<span class="block text-secondary">{experience.category}</span>
								</a>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</aside>

		<main class="order-3 min-w-0 lg:order-2">
			<section class="markdown-content">
				<h2 class="mb-8 border-b border-border pb-4 text-2xl font-bold uppercase tracking-tight">Project Overview</h2>
				<div class="text-lg leading-relaxed text-secondary">
					{@html descriptionHtml}
				</div>
			</section>
		</main>
		{#if has3DContent}
			<aside class="order-1 lg:order-0 lg:col-span-2">
				<div class="">
					<ModelViewer project={project} />
				</div>
			</aside>
		{/if}
	</div>
</div>

<style>
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