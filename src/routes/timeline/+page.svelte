<script lang="ts">
	import { onMount } from 'svelte';
	import { timelineEntries, type TimelineCategory } from '$lib/data/timeline';

	const dotStep = 24;
	const axisWidth = 64;
	const categoryColors: Record<TimelineCategory, string> = {
		Employment: '#176d73',
		Leadership: '#d94b31',
		Education: '#95601c',
		Volunteering: '#59677c'
	};
	const categories = Object.entries(categoryColors) as [TimelineCategory, string][];
	const now = new Date();
	const currentMonth = now.getUTCFullYear() * 12 + now.getUTCMonth();
	const toMonthIndex = (month: string) => {
		const [year, monthNumber] = month.split('-').map(Number);
		return year * 12 + monthNumber - 1;
	};
	const sortedEntries = timelineEntries
		.map((entry) => ({
			...entry,
			entryStart: toMonthIndex(entry.start),
			entryEnd: entry.end ? toMonthIndex(entry.end) : currentMonth
		}))
		.sort((first, second) => first.entryStart - second.entryStart);
	const lanePeriods: Array<Array<{ start: number; end: number }>> = [];
	const startMonth = Math.min(...sortedEntries.map((entry) => entry.entryStart));
	const endMonth = Math.max(
		currentMonth,
		...sortedEntries.map((entry) => entry.entryEnd)
	);
	const packedEntries = sortedEntries.map((entry) => {
		let lane = lanePeriods.findIndex((periods) =>
			periods.every((period) => period.end < entry.entryStart || entry.entryEnd < period.start)
		);
		if (lane === -1) lane = lanePeriods.length;
		lanePeriods[lane] ??= [];
		lanePeriods[lane].push({ start: entry.entryStart, end: entry.entryEnd });
		return { ...entry, lane };
	});
	const laneOrder = lanePeriods
		.map((periods, originalLane) => ({
			originalLane,
			longestDuration: Math.max(...periods.map(({ start, end }) => end - start + 1))
		}))
		.sort((first, second) => second.longestDuration - first.longestDuration);
	const lanePositions = new Map(laneOrder.map(({ originalLane }, index) => [originalLane, index]));
	const entries = packedEntries.map((entry) => ({ ...entry, lane: lanePositions.get(entry.lane) ?? entry.lane }));
	const laneCount = lanePeriods.length;
	const chartWidth = axisWidth + laneCount * dotStep;
	const chartHeight = (endMonth - startMonth + 1) * dotStep;
	const mobileEntries = [...entries].reverse();
	const years = Array.from(
		{ length: Math.floor(endMonth / 12) - Math.floor(startMonth / 12) + 1 },
		(_, index) => Math.floor(startMonth / 12) + index
	);
	let selectedIndex = $state(entries.length - 1);
	let selectedEntry = $derived(entries[selectedIndex]);
	let timelineLayout: HTMLDivElement;
	let timelineCanvas: HTMLDivElement;
	let timelineDetail: HTMLElement;
	let motionEnabled = $state(false);
	let connector = $state({
		left: 0,
		top: 0,
		width: 0,
		color: categoryColors[entries[entries.length - 1].category]
	});

	function getEntryMidpoint(entry: (typeof entries)[number]) {
		return (
			(endMonth - entry.entryEnd) * dotStep +
			((entry.entryEnd - entry.entryStart + 1) * dotStep) / 2
		);
	}

	function updateSelectionFromScroll() {
		const canvasTop = timelineCanvas.getBoundingClientRect().top + window.scrollY;
		const focusY = Math.max(
			0,
			Math.min(chartHeight, window.scrollY + window.innerHeight / 2 - canvasTop)
		);
		let closestIndex = 0;
		let closestDistance = Number.POSITIVE_INFINITY;

		entries.forEach((entry, index) => {
			const midpoint = getEntryMidpoint(entry);
			const distance = Math.abs(midpoint - focusY);
			if (distance < closestDistance) {
				closestIndex = index;
				closestDistance = distance;
			}
		});

		selectedIndex = closestIndex;
		const activeEntry = entries[closestIndex];
		const layoutRect = timelineLayout.getBoundingClientRect();
		const canvasRect = timelineCanvas.getBoundingClientRect();
		const detailRect = timelineDetail.getBoundingClientRect();
		const laneCenter = canvasRect.left - layoutRect.left + axisWidth + activeEntry.lane * dotStep + dotStep / 2;
		const barCenter =
			canvasRect.top -
			layoutRect.top +
			(endMonth - activeEntry.entryEnd) * dotStep +
			((activeEntry.entryEnd - activeEntry.entryStart + 1) * dotStep) / 2;
		const detailLeft = detailRect.left - layoutRect.left;
		connector = {
			left: laneCenter,
			top: barCenter,
			width: Math.max(0, detailLeft - laneCenter),
			color: categoryColors[activeEntry.category]
		};
	}

	function focusEntry(index: number) {
		const entry = entries[index];
		const canvasTop = timelineCanvas.getBoundingClientRect().top + window.scrollY;
		const top = canvasTop + getEntryMidpoint(entry) - window.innerHeight / 2;
		const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

		window.scrollTo({ top: Math.max(0, top), behavior });
	}

	onMount(() => {
		updateSelectionFromScroll();
		const motionFrame = window.requestAnimationFrame(() => (motionEnabled = true));
		window.addEventListener('scroll', updateSelectionFromScroll, { passive: true });
		window.addEventListener('resize', updateSelectionFromScroll);
		return () => {
			window.cancelAnimationFrame(motionFrame);
			window.removeEventListener('scroll', updateSelectionFromScroll);
			window.removeEventListener('resize', updateSelectionFromScroll);
		};
	});

	function formatMonth(monthIndex: number) {
		return new Intl.DateTimeFormat('en', {
			month: 'short',
			year: 'numeric',
			timeZone: 'UTC'
		}).format(new Date(Date.UTC(Math.floor(monthIndex / 12), monthIndex % 12, 1)));
	}

	function formatRange(entry: (typeof entries)[number]) {
		const endLabel = entry.status === 'present' ? 'Present' : formatMonth(toMonthIndex(entry.end ?? ''));
		const expected = entry.status === 'expected' ? ' (expected)' : '';
		return `${formatMonth(entry.entryStart)} - ${endLabel}${expected}`;
	}
</script>

<svelte:head>
	<title>Timeline | Urbain</title>
	<meta
		name="description"
		content="A timeline of Urbain's education, work, and leadership experience."
	/>
</svelte:head>

<section class="pb-6">
	<div class="mb-3 font-mono text-xs uppercase text-secondary">Experience / 2019—2027</div>
	<h1 class="text-3xl font-bold uppercase leading-tight text-primary sm:text-4xl">Timeline</h1>
	<p class="mt-3 max-w-2xl text-sm leading-relaxed text-secondary">
		Trace work, study, and leadership across overlapping periods.
	</p>
</section>

<div class="timeline-layout hidden grid-cols-1 gap-8 border-t border-border pt-6 lg:grid lg:grid-cols-[minmax(18rem,22rem)_minmax(0,1fr)] lg:gap-12" class:motion-enabled={motionEnabled} bind:this={timelineLayout}>
	<section class="order-2 lg:order-1" aria-label="Experience timeline">
		<div class="mb-3 flex items-baseline justify-between font-mono text-[10px] uppercase text-secondary">
			<span>{laneCount} concurrent tracks</span>
			<span>Latest at top</span>
		</div>
		<div class="timeline-chart" aria-label="Experience timeline chart">
			<div class="timeline-canvas" bind:this={timelineCanvas} style={`width: ${chartWidth}px; height: ${chartHeight}px`}>
				{#each years as year}
					{@const yearMonth = year * 12}
					<div
						class="timeline-year"
						style={`top: ${Math.min(chartHeight - 1, Math.max(0, (endMonth - yearMonth) * dotStep))}px; width: ${chartWidth}px`}
					>
						<span>{year}</span>
					</div>
				{/each}

				{#if currentMonth >= startMonth && currentMonth <= endMonth}
					<div
						class="timeline-now"
						style={`top: ${(endMonth - currentMonth) * dotStep + dotStep / 2}px; left: ${axisWidth}px; width: ${laneCount * dotStep}px`}
						aria-hidden="true"
					></div>
				{/if}

				{#each entries as entry, index}
					{@const top = (endMonth - entry.entryEnd) * dotStep}
					{@const height = (entry.entryEnd - entry.entryStart + 1) * dotStep}
					<button
						type="button"
						class="timeline-entry"
						class:selected={selectedIndex === index}
						style={`--entry-color: ${categoryColors[entry.category]}; left: ${axisWidth + entry.lane * dotStep}px; top: ${top}px; height: ${height}px`}
						aria-label={`${entry.title} at ${entry.organization}, ${formatRange(entry)}`}
						aria-pressed={selectedIndex === index}
						title={`${entry.title} - ${entry.organization}`}
						onclick={() => focusEntry(index)}
					>
						<span class="timeline-stem"></span>
						<span class="timeline-start-dot"></span>
						<span class="timeline-end-dot"></span>
					</button>
					<span class="sr-only">{formatRange(entry)}</span>
				{/each}
			</div>
		</div>
		<ul class="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase text-secondary" aria-label="Experience categories">
			{#each categories as [category, color]}
				<li style={`--entry-color: ${color}`}><span class="legend-dot"></span>{category}</li>
			{/each}
		</ul>
	</section>

	<article
		class="timeline-detail order-1 self-start bg-background py-3 lg:order-2 lg:bg-transparent lg:py-0"
		style={`--entry-color: ${categoryColors[selectedEntry.category]}; --deck-y: ${connector.top}px`}
		bind:this={timelineDetail}
		aria-live="polite"
	>
		<div class="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase">
			<span class="text-accent">{selectedEntry.category}</span>
			<span class="text-secondary">{formatRange(selectedEntry)}</span>
			<span class="timeline-track-label">Track {String(selectedEntry.lane + 1).padStart(2, '0')} / {String(laneCount).padStart(2, '0')}</span>
		</div>
		<h2 class="text-2xl font-bold uppercase leading-tight text-primary sm:text-3xl">{selectedEntry.title}</h2>
		<div class="mt-2 text-base text-secondary">{selectedEntry.organization}</div>
		{#if selectedEntry.location}
			<div class="mt-1 font-mono text-xs text-secondary">{selectedEntry.location}</div>
		{/if}
		<div class="my-7 h-px bg-border"></div>
		<p class="max-w-2xl text-base leading-relaxed text-secondary">{selectedEntry.description}</p>
		{#if selectedEntry.highlights?.length}
			<ul class="mt-6 flex flex-wrap gap-2">
				{#each selectedEntry.highlights as highlight}
					<li class="border border-border px-3 py-2 font-mono text-xs text-primary">{highlight}</li>
				{/each}
			</ul>
		{/if}
		<div class="mt-10 font-mono text-[10px] uppercase text-secondary">
			Entry {String(selectedIndex + 1).padStart(2, '0')} / {String(entries.length).padStart(2, '0')}
		</div>
	</article>
	{#if connector.width > 0}
		<div
			class="timeline-connector hidden lg:block"
			style={`--entry-color: ${connector.color}; left: ${connector.left}px; top: ${connector.top}px; width: ${connector.width}px`}
			aria-hidden="true"
		></div>
	{/if}
</div>

<section class="mobile-timeline lg:hidden" aria-label="Experience timeline">
	<div class="mobile-timeline-heading">
		<span>{mobileEntries.length} periods</span>
		<span>Latest first / 2019—2027</span>
	</div>
	{#each mobileEntries as entry}
		{@const startParts = formatMonth(entry.entryStart).split(' ')}
		{@const endParts = entry.status === 'present' ? ['Now'] : formatMonth(entry.entryEnd).split(' ')}
		<article class="mobile-entry" style={`--entry-color: ${categoryColors[entry.category]}`} aria-label={`${entry.title} at ${entry.organization}, ${formatRange(entry)}`}>
			<div class="mobile-date" aria-hidden="true">
				<span class="mobile-date-month">{startParts[0]}</span>
				<strong>{startParts[1]}</strong>
				<span class="mobile-date-arrow">↓</span>
				<span class="mobile-date-end">{endParts.join(' ')}</span>
				{#if entry.status === 'expected'}
					<span class="mobile-date-status">Expected</span>
				{/if}
			</div>
			<div class="mobile-entry-content">
				<div class="mobile-entry-meta">
					<span>{entry.category}</span>
					<span>Track {String(entry.lane + 1).padStart(2, '0')}</span>
				</div>
				<h2>{entry.title}</h2>
				<div class="mobile-entry-organization">{entry.organization}</div>
				{#if entry.location}
					<div class="mobile-entry-location">{entry.location}</div>
				{/if}
				<p>{entry.description}</p>
				{#if entry.highlights?.length}
					<ul>
						{#each entry.highlights as highlight}
							<li>{highlight}</li>
						{/each}
					</ul>
				{/if}
			</div>
		</article>
	{/each}
</section>

<style>
	.timeline-layout {
		position: relative;
		--timeline-dot-step: 24px;
	}

	.timeline-chart {
		width: 100%;
	}

	.timeline-canvas {
		position: relative;
	}

	.timeline-detail {
		top: 50vh;
		transform: translateY(-50%);
		padding-left: 1rem;
		border-left: 2px solid var(--entry-color);
	}

	.timeline-layout.motion-enabled .timeline-detail {
		transition: top 220ms cubic-bezier(0.2, 0.7, 0.2, 1);
	}

	.timeline-track-label {
		color: var(--entry-color);
	}

	.timeline-connector {
		position: absolute;
		z-index: 5;
		height: 0;
		border-top: 1px dashed var(--entry-color);
		pointer-events: none;
	}

	.timeline-layout.motion-enabled .timeline-connector {
		transition:
			top 220ms cubic-bezier(0.2, 0.7, 0.2, 1),
			left 220ms ease,
			width 220ms ease;
	}

	@media (min-width: 1024px) {
		.timeline-detail {
			position: absolute;
			top: var(--deck-y);
			right: 0;
			left: calc(22rem + 3rem);
			transform: translateY(-50%);
		}
	}

	.timeline-connector::before,
	.timeline-connector::after {
		position: absolute;
		top: -4px;
		width: 7px;
		height: 7px;
		border: 1px solid var(--entry-color);
		border-radius: 50%;
		background: var(--color-background);
		content: '';
	}

	.timeline-connector::before {
		left: -4px;
	}

	.timeline-connector::after {
		right: -4px;
	}

	@media (prefers-reduced-motion: reduce) {
		.timeline-layout.motion-enabled .timeline-detail,
		.timeline-layout.motion-enabled .timeline-connector {
			transition: none;
		}
	}

	.timeline-year {
		position: absolute;
		left: 0;
		z-index: 1;
		height: 1px;
		border-top: 1px solid var(--color-border);
		pointer-events: none;
	}

	.timeline-year span {
		position: absolute;
		top: -0.65rem;
		left: 0.5rem;
		padding: 0 0.25rem;
		background: transparent;
		font-family: var(--font-mono);
		font-size: 0.625rem;
		color: var(--color-secondary);
	}

	.mobile-timeline {
		border-top: 1px solid var(--color-border);
		padding-top: 1rem;
	}

	.mobile-timeline-heading,
	.mobile-entry-meta {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.625rem;
		text-transform: uppercase;
	}

	.mobile-timeline-heading {
		margin-bottom: 0.75rem;
		color: var(--color-secondary);
	}

	.mobile-entry {
		position: relative;
		display: grid;
		grid-template-columns: 4rem minmax(0, 1fr);
		column-gap: 1rem;
		padding: 1.25rem 0 1.75rem;
	}

	.mobile-entry::before {
		position: absolute;
		left: 4.4rem;
		top: 1.45rem;
		bottom: -0.25rem;
		width: 1px;
		background: color-mix(in srgb, var(--entry-color) 46%, transparent);
		content: '';
	}

	.mobile-entry::after {
		position: absolute;
		left: calc(4.4rem - 4px);
		top: 1.2rem;
		width: 9px;
		height: 9px;
		border: 2px solid var(--entry-color);
		border-radius: 50%;
		background: var(--color-background);
		content: '';
	}

	.mobile-entry:last-child::before {
		bottom: 1.75rem;
	}

	.mobile-date {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		padding-top: 0.125rem;
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		line-height: 1.2;
		text-align: right;
	}

	.mobile-date-month {
		color: var(--entry-color);
		text-transform: uppercase;
	}

	.mobile-date strong {
		margin-top: 0.15rem;
		color: var(--color-primary);
	}

	.mobile-date-arrow {
		margin: 0.25rem 0;
		color: var(--color-secondary);
	}

	.mobile-date-end {
		color: var(--color-secondary);
	}

	.mobile-date-status {
		margin-top: 0.25rem;
		font-size: 0.5rem;
		color: var(--color-accent);
		text-transform: uppercase;
	}

	.mobile-entry-content {
		min-width: 0;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--color-border);
	}

	.mobile-entry-meta {
		margin-bottom: 0.6rem;
		color: var(--entry-color);
	}

	.mobile-entry-content h2 {
		font-size: 1.125rem;
		font-weight: 700;
		line-height: 1.25;
		text-transform: uppercase;
	}

	.mobile-entry-organization {
		margin-top: 0.35rem;
		font-size: 0.875rem;
		color: var(--color-secondary);
	}

	.mobile-entry-location {
		margin-top: 0.2rem;
		font-family: var(--font-mono);
		font-size: 0.625rem;
		color: var(--color-secondary);
	}

	.mobile-entry-content p {
		margin-top: 0.75rem;
		font-size: 0.8125rem;
		line-height: 1.6;
		color: var(--color-secondary);
	}

	.mobile-entry-content ul {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
		margin-top: 0.75rem;
	}

	.mobile-entry-content li {
		border: 1px solid var(--color-border);
		padding: 0.25rem 0.4rem;
		font-family: var(--font-mono);
		font-size: 0.5625rem;
		color: var(--color-primary);
	}

	.timeline-now {
		position: absolute;
		z-index: 1;
		border-top: 1px dashed var(--color-accent);
		pointer-events: none;
	}

	.timeline-entry {
		position: absolute;
		z-index: 2;
		width: var(--timeline-dot-step);
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--entry-color);
		cursor: pointer;
	}

	.timeline-stem {
		position: absolute;
		top: 0.375rem;
		bottom: 0.375rem;
		left: calc(50% - 1px);
		width: 2px;
		background: currentColor;
		transition: background-color 160ms ease, width 160ms ease;
	}

	.timeline-start-dot,
	.timeline-end-dot {
		position: absolute;
		left: 50%;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: currentColor;
		transform: translateX(-50%);
		transition: background-color 160ms ease, transform 160ms ease;
	}

	.timeline-start-dot {
		bottom: 0;
	}

	.timeline-end-dot {
		top: 0;
		width: 5px;
		height: 5px;
	}

	.timeline-entry:hover .timeline-stem,
	.timeline-entry:focus-visible .timeline-stem,
	.timeline-entry.selected .timeline-stem {
		width: 3px;
	}

	.timeline-entry:hover .timeline-start-dot,
	.timeline-entry:focus-visible .timeline-start-dot,
	.timeline-entry.selected .timeline-start-dot,
	.timeline-entry:hover .timeline-end-dot,
	.timeline-entry:focus-visible .timeline-end-dot,
	.timeline-entry.selected .timeline-end-dot {
		transform: translateX(-50%) scale(1.2);
	}

	.timeline-entry:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: -2px;
	}

	.legend-dot {
		display: inline-block;
		width: 6px;
		height: 6px;
		margin-right: 0.5rem;
		border-radius: 50%;
		background: var(--entry-color);
		vertical-align: 1px;
	}
	@media (prefers-reduced-motion: reduce) {
		.timeline-stem,
		.timeline-start-dot,
		.timeline-end-dot {
			transition: none;
		}
	}
</style>